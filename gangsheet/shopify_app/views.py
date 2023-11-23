import binascii
import json
import logging
import os
import shopify

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import login
from django.urls import reverse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework.decorators import api_view
from django.contrib.auth import logout

from .models import UserStore
from shopify.utils import shop_url
from shopify_webhook.decorators import webhook

logging.basicConfig(
    filename=settings.BASE_DIR / 'logs.log',
    filemode='a',
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

def home(request):
    title = "Coming Soon"   
    return render(request, 'coming-soon.html', {'title':title})

# Authenticate
def authenticate(request):    
    try:
        shop = get_sanitized_shop_param(request)
        scopes, redirect_uri, state = build_auth_params(request)
        store_state_param(request, state)
        permission_url = _new_session(shop).create_permission_url(
            scopes, redirect_uri, state
        )
        return redirect(permission_url)
    except ValueError as exception:
        messages.error(request, str(exception))
        return redirect(reverse("sign_in"))
    except Exception as e:
        messages.error(str(e))
        return redirect(reverse("sign_in"))

# Callback 
def callback(request):
    params = request.GET.dict()
    shop = params.get("shop")
    try:
        validate_params(request, params)
        access_token = exchange_code_for_access_token(request, shop)        
        after_authenticate_jobs(shop, access_token)  
        store_shop_information(request, access_token, shop)
    except ValueError as exception:
        messages.error(request, str(exception))
        return redirect(reverse("sign_in"))
    
    redirect_uri = build_callback_redirect_uri(request, params)
    return redirect(redirect_uri)

def get_sanitized_shop_param(request):
    sanitized_shop_domain = shop_url.sanitize_shop_domain(
        request.GET.get("shop", request.POST.get("shop"))
    )
    if not sanitized_shop_domain:
        raise ValueError("Shop must match 'example.myshopify.com'")
    return sanitized_shop_domain


def build_auth_params(request):
    scopes = get_configured_scopes()
    redirect_uri = build_redirect_uri()
    state = build_state_param()

    return scopes, redirect_uri, state


def get_configured_scopes():
    return settings.SHOPIFY_APP_API_SCOPES.split(",")


def build_redirect_uri():
    app_url = settings.HOST_NAME
    callback_path = reverse("shopify_app_callback")
    return "{app_url}{callback_path}".format(
        app_url=app_url, callback_path=callback_path
    )


def build_state_param():
    return binascii.b2a_hex(os.urandom(15)).decode("utf-8")


def store_state_param(request, state):
    request.session["shopify_oauth_state_param"] = state


def _new_session(shop_url):
    shopify_api_version = settings.SHOPIFY_APP_API_VERSION
    shopify_api_key = settings.SHOPIFY_APP_API_KEY
    shopify_api_secret = settings.SHOPIFY_APP_API_SECRET

    shopify.Session.setup(api_key=shopify_api_key, secret=shopify_api_secret)
    return shopify.Session(shop_url, shopify_api_version)

# Callback helper methods
def validate_params(request, params):
    validate_state_param(request, params.get("state"))
    if not shopify.Session.validate_params(params):  # Validates HMAC
        raise ValueError("Invalid callback parameters")


def validate_state_param(request, state):
    if request.session.get("shopify_oauth_state_param") != state:
        raise ValueError("Anti-forgery state parameter does not match")

    request.session.pop("shopify_oauth_state_param", None)


def exchange_code_for_access_token(request, shop):
    session = _new_session(shop)
    access_token = session.request_token(request.GET)

    return access_token


def store_shop_information(request, access_token, shop):
    if request.user.is_authenticated:
        current_store = UserStore.objects.get_user_store(request.user)
        if current_store is None or current_store.shop_domain == shop:
            shop_info = get_shop_info(shop, access_token)
            try:
                store = UserStore.objects.get(shop_domain = shop)
            except UserStore.DoesNotExist:  
                store = UserStore()            
            except UserStore.MultipleObjectsReturned:  
                store = UserStore.objects.filter(shop_domain = shop).first()
                
            store.name = shop_info.name
            store.shop_domain = shop
            store.access_token = access_token
            store.primary_locale = shop_info.primary_locale
            store.status = 'active'
            store.user_id = request.user.id
            store.save()      
            try:
                del request.session['shop_domain']
                del request.session['access_token']
            except KeyError:
                pass   
        else:
            logout(request)
            request.session['shop_domain'] = shop
            request.session['access_token'] = access_token
            return redirect('sign_in')     
    else:
        logout(request)
        request.session['shop_domain'] = shop
        request.session['access_token'] = access_token
        return redirect('sign_in')
    

def build_callback_redirect_uri(request, params):
    user = UserStore.objects.get_store_user(params.get("shop"))
    if user is not None:
        login(request, user)
    base = request.session.get("return_to", reverse("my_plan"))
    return "{base}?shop={shop}".format(base=base, shop=params.get("shop"))

# callback after_authenticate_jobs helper methods
def after_authenticate_jobs(shop, access_token):
    create_uninstall_webhook(shop, access_token)
    # create_order_webhook(shop, access_token)
    # create_fulfillment_service(shop, access_token)


def create_uninstall_webhook(shop, access_token):
    with shopify_session(shop, access_token):
        webhook = shopify.Webhook()
        webhook.topic = "app/uninstalled"
        webhook.address = settings.HOST_NAME+reverse('app_uninstall_webhook')
        webhook.format = "json"
        webhook.save()


def shopify_session(shop, access_token=None):
    try:
        if access_token is None:
            access_token = UserStore.objects.get_store_token(shop)

        if access_token is not None:
            api_version = settings.SHOPIFY_APP_API_VERSION            
            return shopify.Session.temp(shop, api_version, access_token)
        else:
            logging.info("Access token is not valid of shop "+str(shop))
    except Exception as e:
        messages.error(str(e))
        return redirect(reverse("sign_in"))


def get_shopify_product(shop, product_id):
    with shopify_session(shop):
        product = shopify.Product.find(product_id)
        if product.errors:
            raise Exception(product.errors.full_messages())
        return product

def get_shop_info(shop, access_token):
    with shopify_session(shop, access_token):
        shop = shopify.Shop.current()
        if shop.errors:
            raise Exception(shop.errors.full_messages())
        return shop
 
@csrf_exempt
@api_view(["POST"])
@webhook
def app_uninstall_webhook(request):
    try:
        data = json.loads(request.body)  
        try:
            store = UserStore.objects.get(shop_domain = data['domain'])
            store.status = 'inactive'
            store.save()
            return Response({'success': "Successfully Hit"}, status=HTTP_200_OK)
        except UserStore.DoesNotExist:  
            return Response({'error': "Bad Request"}, status=HTTP_400_BAD_REQUEST)  
        except UserStore.MultipleObjectsReturned:  
            UserStore.objects.filter(shop_domain = data['domain']).update(status='inactive')
            return Response({'success': "Successfully Hit"}, status=HTTP_200_OK)
    except Exception as e:
        logging.info(e)
        return Response({'error': "Bad Request"}, status=HTTP_400_BAD_REQUEST)
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('shopify/', views.authenticate, name='shopify'),
    path('auth/shopify/callback', views.callback, name='shopify_app_callback'),
    path('shopify/webhook/app_uninstalled', views.app_uninstall_webhook, name='app_uninstall_webhook'),    
]
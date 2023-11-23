from django.db import models
from django.contrib.auth.models import User
from django.db.models import Q
import uuid

STATUS_CHOICES = (
    ("active", "Active"),
    ("inactive", "Inactive"),
)


class UserStoreManager(models.Manager):
    def get_store_token(self, shop):
        store = self.get_queryset().filter( Q(shop_domain = shop), Q(status = 'active')).first()

        if store is None:
            return None
        return store.access_token

    def get_store_user(self, shop):
        try:
            store = UserStore.objects.get(shop_domain = shop)
        except UserStore.DoesNotExist:
            store = None

        if store is None:
            return None
        return store.user
    
    def get_user_store(self, user):
        try:
            store = UserStore.objects.get(user_id = user.id)
        except UserStore.DoesNotExist:
            store = None

        if store is None:
            return None
        return store


class UserStore(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    shop_domain = models.CharField(max_length=255)
    access_token = models.TextField()
    primary_locale = models.CharField(max_length=50)
    status = models.CharField(max_length=50,choices = STATUS_CHOICES, default = 'active')
    location_id = models.BigIntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True,auto_now=True)

    objects = UserStoreManager()

    def __str__(self):
        return "Store Name >" + "  " +  self.shop_domain
                
    class Meta:
        db_table = "user_store"
        constraints = [
            models.CheckConstraint(check=Q(status='active') | Q(status='inactive'), name='status_check')
        ]
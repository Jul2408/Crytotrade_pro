from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import FormLink, Submission, AppSettings, Notification
from .serializers import FormLinkSerializer, SubmissionSerializer, AppSettingsSerializer, UserSerializer, NotificationSerializer
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

class FormLinkViewSet(viewsets.ModelViewSet):
    queryset = FormLink.objects.all()
    serializer_class = FormLinkSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'link_id'

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all().order_by('-created_at')
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(user=self.request.user)
        return Submission.objects.none() # Anonymous users see nothing

    def create(self, request, *args, **kwargs):
        print(f"Incoming submission data: {request.data}")
        
        link_id = request.data.get('link_id')
        submission_user = None
        
        # Check for Link Validity (Limits & Expiry)
        if link_id:
            try:
                form_link = FormLink.objects.get(link_id=link_id)
                submission_user = form_link.user
                
                # Check Expiry
                if form_link.expiry_date and timezone.now() > form_link.expiry_date:
                    return Response(
                        {'error': 'Ce lien a expiré.'}, 
                        status=status.HTTP_403_FORBIDDEN
                    )

                # Check Submission Limit
                if form_link.submissions_limit > 0:
                    current_count = Submission.objects.filter(link_id=link_id).count()
                    if current_count >= form_link.submissions_limit:
                        return Response(
                            {'error': 'Ce lien a atteint sa limite de participations.'}, 
                            status=status.HTTP_403_FORBIDDEN
                        )
                        
            except FormLink.DoesNotExist:
                print(f"Warning: FormLink {link_id} not found during submission.")
                # Optional: Fail if link doesn't exist? For now, we allow it but it won't be assigned to a user.

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Validation Errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        submission = serializer.save(user=submission_user)
        print(f"Submission saved: {submission.id} for user: {submission_user}")
        
        if submission_user:
            try:
                Notification.objects.create(
                    user=submission_user,
                    title="Nouvelle soumission !",
                    message=f"{submission.full_name} a envoyé ses informations via {submission.method}.",
                    type="success"
                )
                print("Notification created successfully")
            except Exception as e:
                print(f"Critical error creating notification: {e}")

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['delete'])
    def delete_old(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        six_months_ago = timezone.now() - timedelta(days=180)
        deleted_count, _ = Submission.objects.filter(user=request.user, created_at__lt=six_months_ago).delete()
        return Response({'message': f'{deleted_count} submissions deleted.'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def reset_all(self, request):
        if not request.user.is_authenticated:
             return Response(status=status.HTTP_401_UNAUTHORIZED)
        Submission.objects.filter(user=request.user).delete()
        return Response({'message': 'All your submissions have been reset.'}, status=status.HTTP_200_OK)

class AppSettingsViewSet(viewsets.ModelViewSet):
    queryset = AppSettings.objects.all()
    serializer_class = AppSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure setting exists for this user
        if AppSettings.objects.filter(user=self.request.user).count() == 0:
            AppSettings.objects.create(user=self.request.user)
        return AppSettings.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get', 'patch'])
    def singleton(self, request):
        setting, _ = AppSettings.objects.get_or_create(user=request.user)
        if request.method == 'PATCH':
            serializer = self.get_serializer(setting, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        
        serializer = self.get_serializer(setting)
        return Response(serializer.data)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user).update(is_read=True)
        return Response({'status': 'ok'})

class UserProfileViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'])
    def update_profile(self, request):
        user = request.user
        user.username = request.data.get('username', user.username)
        user.email = request.data.get('email', user.email)
        
        password = request.data.get('password')
        if password:
            user.set_password(password)
        
        user.save()
        return Response({'message': 'Profile updated successfully'})

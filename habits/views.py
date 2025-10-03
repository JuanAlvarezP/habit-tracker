from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.viewsets import ModelViewSet
from .models import Habit, HabitDailyLog
from .serializers import HabitSerializer, HabitDailyLogSerializer
# Create your views here.

class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Permite que un usuario solo vea sus propios hábitos
        return Habit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Asigna automáticamente el usuario logueado al crear un hábito
        serializer.save(user=self.request.user)


class DailyLogViewSet(viewsets.ModelViewSet):
    serializer_class = HabitDailyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Permite que un usuario solo vea sus propios registros de hábitos
        return HabitDailyLog.objects.filter(habit__user=self.request.user)

class UserRegistrationView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_409_CONFLICT)

        user = User.objects.create_user(username=username, password=password)
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username}, status=status.HTTP_201_CREATED)


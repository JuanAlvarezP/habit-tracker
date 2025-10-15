from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import action
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.viewsets import ModelViewSet
from django.utils import timezone
from datetime import date
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

    @action(detail=True, methods=['patch'])
    def toggle_complete(self, request, pk=None):
        """Marca/desmarca un hábito como completado para el día actual"""
        habit = self.get_object()
        today = date.today()
        
        # Obtener o crear el registro diario
        daily_log, created = HabitDailyLog.objects.get_or_create(
            habit=habit,
            date=today,
            defaults={'is_completed': False}
        )
        
        # Alternar el estado de completado
        daily_log.is_completed = not daily_log.is_completed
        daily_log.save()
        
        # Actualizar el serializer para incluir el nuevo estado
        serializer = self.get_serializer(habit)
        habit_data = serializer.data
        habit_data['is_completed'] = daily_log.is_completed
        
        return Response(habit_data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def complete(self, request, pk=None):
        """Marca un hábito como completado para el día actual"""
        habit = self.get_object()
        today = date.today()
        
        # Crear o actualizar el registro diario
        daily_log, created = HabitDailyLog.objects.get_or_create(
            habit=habit,
            date=today,
            defaults={'is_completed': True}
        )
        
        if not created:
            daily_log.is_completed = True
            daily_log.save()
        
        # Actualizar el serializer para incluir el estado de completado
        serializer = self.get_serializer(habit)
        habit_data = serializer.data
        habit_data['is_completed'] = True
        
        return Response(habit_data, status=status.HTTP_200_OK)


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


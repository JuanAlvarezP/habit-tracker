from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import action, api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.viewsets import ModelViewSet
from django.utils import timezone
from datetime import date
from django.db import connection
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


# ⚠️ ENDPOINT VULNERABLE INTENCIONAL PARA DEMO DE DAST
# Este endpoint es VULNERABLE a SQL Injection - NO USAR EN PRODUCCIÓN
@api_view(['GET'])
@permission_classes([AllowAny])  # Sin autenticación para facilitar el escaneo
def vulnerable_search(request):
    """
    Endpoint vulnerable a SQL injection para demostración de DAST.
    Parámetro: search (busca hábitos por nombre)
    Ejemplo: /api/vulnerable-search/?search=Ejercicio
    
    ⚠️ SOLO PARA DEMO - NUNCA USAR EN PRODUCCIÓN
    """
    search_term = request.GET.get('search', '')
    
    if not search_term:
        return Response({'error': 'Parámetro search requerido'}, status=400)
    
    # VULNERABILIDAD: Concatenación directa de entrada del usuario en SQL
    # Esto permite inyecciones SQL como: ?search=1' OR '1'='1
    query = f"SELECT id, name, description, frequency FROM habits_habit WHERE name LIKE '%{search_term}%'"
    
    with connection.cursor() as cursor:
        cursor.execute(query)  # ⚠️ SQL INJECTION aquí
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    
    return Response({
        'results': results,
        'count': len(results),
        'search_term': search_term
    })


# ⚠️ OTRO ENDPOINT VULNERABLE - Login sin protección
@api_view(['POST'])
@permission_classes([AllowAny])
def vulnerable_login(request):
    """
    Endpoint de login vulnerable a SQL injection.
    Envía: {"username": "admin", "password": "password"}
    
    ⚠️ SOLO PARA DEMO - NUNCA USAR EN PRODUCCIÓN
    """
    username = request.data.get('username', '')
    password = request.data.get('password', '')
    
    if not username or not password:
        return Response({'error': 'Username y password requeridos'}, status=400)
    
    # VULNERABILIDAD: Consulta SQL raw sin sanitización
    query = f"SELECT id, username FROM auth_user WHERE username='{username}' AND password='{password}'"
    
    with connection.cursor() as cursor:
        try:
            cursor.execute(query)  # ⚠️ SQL INJECTION aquí
            result = cursor.fetchone()
            
            if result:
                return Response({
                    'success': True,
                    'user_id': result[0],
                    'username': result[1]
                })
            else:
                return Response({'success': False, 'error': 'Credenciales inválidas'}, status=401)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


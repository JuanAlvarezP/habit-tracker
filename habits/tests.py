from django.test import TestCase
from django.contrib.auth.models import User
from .models import Habit, HabitDailyLog
from datetime import date, time


class HabitModelTest(TestCase):
    """Tests simples para el modelo Habit"""

    def setUp(self):
        """Configurar datos de prueba antes de cada test"""
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.habit = Habit.objects.create(
            user=self.user,
            name='Ejercicio matutino',
            description='Hacer 30 minutos de ejercicio',
            frequency='Diaria',
            reminder_time=time(7, 0)
        )

    def test_habit_creation(self):
        """Test 1: Verificar que un hábito se crea correctamente"""
        self.assertEqual(self.habit.name, 'Ejercicio matutino')
        self.assertEqual(self.habit.user.username, 'testuser')
        self.assertEqual(self.habit.frequency, 'Diaria')
        self.assertIsNotNone(self.habit.created_at)

    def test_habit_string_representation(self):
        """Test 2: Verificar la representación en string del hábito"""
        expected_str = f"{self.habit.name} for {self.user.username}"
        self.assertEqual(str(self.habit), expected_str)
        self.assertIn('testuser', str(self.habit))


class HabitDailyLogModelTest(TestCase):
    """Tests simples para el modelo HabitDailyLog"""

    def setUp(self):
        """Configurar datos de prueba antes de cada test"""
        self.user = User.objects.create_user(
            username='testuser2',
            password='testpass456'
        )
        self.habit = Habit.objects.create(
            user=self.user,
            name='Leer',
            description='Leer 30 páginas',
            frequency='Diaria'
        )
        self.log = HabitDailyLog.objects.create(
            habit=self.habit,
            date=date.today(),
            is_completed=False
        )

    def test_daily_log_creation(self):
        """Test 3: Verificar que un log diario se crea correctamente"""
        self.assertEqual(self.log.habit.name, 'Leer')
        self.assertEqual(self.log.date, date.today())
        self.assertFalse(self.log.is_completed)

    def test_daily_log_completion_toggle(self):
        """Test 4: Verificar que se puede cambiar el estado de completado"""
        self.assertFalse(self.log.is_completed)
        self.log.is_completed = True
        self.log.save()
        self.log.refresh_from_db()
        self.assertTrue(self.log.is_completed)

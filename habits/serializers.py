from rest_framework import serializers
from .models import Habit, HabitDailyLog
from datetime import date

class HabitSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    
    class Meta:
        model = Habit
        fields = ['id', 'user', 'name', 'description', 'created_at', 'frequency', 'reminder_time', 'is_completed']
        read_only_fields = ['user', 'is_completed']

        extra_kwargs = {
            'description': {'required': False},
            'reminder_time': {'required': False}
        }
    
    def get_is_completed(self, obj):
        """Verifica si el hábito está completado hoy"""
        today = date.today()
        try:
            daily_log = HabitDailyLog.objects.get(habit=obj, date=today)
            return daily_log.is_completed
        except HabitDailyLog.DoesNotExist:
            return False

class HabitDailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitDailyLog
        fields = ['id', 'habit', 'date', 'is_completed']
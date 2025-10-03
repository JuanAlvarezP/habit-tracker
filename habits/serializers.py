from rest_framework import serializers
from .models import Habit, HabitDailyLog

class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ['id', 'user', 'name', 'description', 'created_at', 'frequency', 'reminder_time']

class HabitDailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitDailyLog
        fields = ['id', 'habit', 'date', 'is_completed']
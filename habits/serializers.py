from rest_framework import serializers
from .models import Habit, HabitDailyLog

class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ['id', 'user', 'name', 'description', 'created_at', 'frequency', 'reminder_time']
        read_only_fields = ['user']

        extra_kwargs = {
            'description': {'required': False},
            'reminder_time': {'required': False}
        }

class HabitDailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitDailyLog
        fields = ['id', 'habit', 'date', 'is_completed']
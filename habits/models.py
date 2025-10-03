from django.db import models

# Create your models here.

class Habit(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    frequency = models.CharField(max_length=50)  # e.g., daily, weekly
    reminder_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} for {self.user.username}"

class HabitDailyLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE)
    date = models.DateField()
    is_completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('habit', 'date')

    def __str__(self):
        return f"{self.habit.name} on {self.date}: {'Completed' if self.completed else 'Not Completed'}"
from django.contrib.auth.models import AbstractUser
from django.db import models

from ozimiziki import settings


class User(AbstractUser):
    CHOICES = (
        ('customer', 'customer'),
        ('admin', 'admin'),
        ('government', 'government'),
    )

    # Добавляем поле role, которое будет выбирать значение из CHOICES
    role = models.CharField(max_length=20, choices=CHOICES, default='customer')

    def save(self, *args, **kwargs):
        # Устанавливаем роль по умолчанию, если не указано
        if not self.role:
            self.role = 'customer'  # Роль по умолчанию
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

class Room(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='photos/%Y/%m/%d/')
    floor = models.PositiveIntegerField()
    size = models.PositiveIntegerField()
    internet = models.BooleanField()
    furniture = models.BooleanField()
    air_conditioning = models.BooleanField()
    heating = models.BooleanField()
    computer_count = models.PositiveIntegerField()
    blackboard_simple = models.BooleanField()
    blackboard_touchscreen = models.BooleanField()
    description = models.TextField()
    price = models.PositiveIntegerField()
    busy = models.BooleanField()

    def __str__(self):
        return self.name


class Building(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    photo = models.ImageField(upload_to='photos/%Y/%m/%d/')
    region = models.CharField(max_length=255)
    district = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255)
    street = models.CharField(max_length=255)
    house = models.CharField(max_length=255)
    floor_count = models.PositiveIntegerField()
    room_count = models.PositiveIntegerField()
    area = models.PositiveIntegerField()
    rooms = models.ManyToManyField(Room)

    def __str__(self):
        return self.name

class Rent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    CHOICES = (
        ('ожидается ответ', 'ожидается ответ'),
        ('принят', 'принят'),
        ('отклонен', 'отклонен'),
    )
    status = models.CharField(max_length=255, choices=CHOICES, default='ожидается ответ')
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Rent of {self.room.name} by {self.user.username} from {self.start_date} to {self.end_date}"





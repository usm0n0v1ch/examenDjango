from django.contrib.auth import get_user_model
from rest_framework import serializers

from app.models import *
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role']  # Убедитесь, что role добавлен

    def create(self, validated_data):
        # Роль теперь передается с фронтенда, никаких дефолтных значений
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )
        user.role = validated_data['role']  # Устанавливаем роль из данных
        user.save()
        return user

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class BuildingSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True)
    class Meta:
        model = Building
        fields = '__all__'


class CreateBuildingSerializer(serializers.ModelSerializer):
    rooms = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all(), many=True)
    class Meta:
        model = Building
        fields = '__all__'


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'



class RentSerializer(serializers.ModelSerializer):
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all())
    class Meta:
        model = Rent
        fields = '__all__'

class CreateRentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rent
        fields = '__all__'


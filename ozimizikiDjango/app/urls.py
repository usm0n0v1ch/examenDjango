from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from app.views import *

router = DefaultRouter()
router.register('user', UserViewSet)
router.register('room', RoomViewSet)
router.register('building', BuildingViewSet)
router.register('rent', RentViewSet)



urlpatterns = router.urls + [
    path('register/', api_register, name='api_register'),
    path('login/', api_login, name='api_login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Для получения access и refresh токенов
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Для обновления access токена
    path('buildings/create/', BuildingCreateView.as_view(), name='building-create'),
    path('buildings/<int:pk>/update/', BuildingUpdateView.as_view(), name='building-update'),
    path('rents/create/', CreateRentView.as_view(), name='rent-create'),
]
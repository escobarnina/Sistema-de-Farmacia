from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from productos.views import ProductoViewSet, CategoriaViewSet
from clientes.views import ClienteViewSet
from ventas.views import VentaViewSet

router = DefaultRouter()
router.register(r"productos", ProductoViewSet)
router.register(r"categorias", CategoriaViewSet)
router.register(r"clientes", ClienteViewSet)
router.register(r"ventas", VentaViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]

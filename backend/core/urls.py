from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from productos.views import ProductoViewSet, CategoriaViewSet
from clientes.views import ClienteViewSet
from ventas.views import VentaViewSet
from proveedores.views import ProveedorViewSet
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt

router = DefaultRouter()
router.register(r"productos", ProductoViewSet)
router.register(r"categorias", CategoriaViewSet)
router.register(r"clientes", ClienteViewSet)
router.register(r"ventas", VentaViewSet)
router.register(r"proveedores", ProveedorViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True))),
]

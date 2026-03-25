from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Producto, Categoria
from .serializers import ProductoSerializer, CategoriaSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    @action(detail=False, methods=["get"])
    def stock_bajo(self, request):
        productos = Producto.objects.filter(activo=True)
        bajo = [p for p in productos if p.stock_bajo]
        serializer = self.get_serializer(bajo, many=True)
        return Response(serializer.data)

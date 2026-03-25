from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import transaction
from .models import Venta, DetalleVenta
from .serializers import VentaSerializer
from productos.models import Producto


class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all().order_by("-fecha")
    serializer_class = VentaSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        detalles_data = data.get("detalles", [])
        venta = Venta.objects.create(
            cliente_id=data.get("cliente"), observacion=data.get("observacion", "")
        )
        total = 0
        for detalle in detalles_data:
            producto = Producto.objects.get(id=detalle["producto"])
            subtotal = detalle["cantidad"] * detalle["precio_unitario"]
            DetalleVenta.objects.create(
                venta=venta,
                producto=producto,
                cantidad=detalle["cantidad"],
                precio_unitario=detalle["precio_unitario"],
                subtotal=subtotal,
            )
            producto.stock -= detalle["cantidad"]
            producto.save()
            total += subtotal
        venta.total = total
        venta.save()
        serializer = VentaSerializer(venta)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

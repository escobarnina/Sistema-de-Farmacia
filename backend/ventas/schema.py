import graphene
from graphene_django import DjangoObjectType
from .models import Venta, DetalleVenta


class DetalleVentaType(DjangoObjectType):
    class Meta:
        model = DetalleVenta
        fields = "__all__"


class VentaType(DjangoObjectType):
    class Meta:
        model = Venta
        fields = "__all__"


class Query(graphene.ObjectType):
    ventas = graphene.List(VentaType)
    venta = graphene.Field(VentaType, id=graphene.Int(required=True))
    ventas_del_mes = graphene.List(VentaType)

    def resolve_ventas(self, info):
        return Venta.objects.all().order_by("-fecha")

    def resolve_venta(self, info, id):
        return Venta.objects.get(pk=id)

    def resolve_ventas_del_mes(self, info):
        from django.utils import timezone

        ahora = timezone.now()
        return Venta.objects.filter(fecha__year=ahora.year, fecha__month=ahora.month)


class Mutation(graphene.ObjectType):
    pass

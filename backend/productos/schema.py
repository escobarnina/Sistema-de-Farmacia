import graphene
from graphene_django import DjangoObjectType
from .models import Producto, Categoria


class CategoriaType(DjangoObjectType):
    class Meta:
        model = Categoria
        fields = "__all__"


class ProductoType(DjangoObjectType):
    stock_bajo = graphene.Boolean()

    class Meta:
        model = Producto
        fields = "__all__"

    def resolve_stock_bajo(self, info):
        return self.stock <= self.stock_minimo


class Query(graphene.ObjectType):
    productos = graphene.List(ProductoType)
    producto = graphene.Field(ProductoType, id=graphene.Int(required=True))
    categorias = graphene.List(CategoriaType)
    productos_stock_bajo = graphene.List(ProductoType)

    def resolve_productos(self, info):
        return Producto.objects.all()

    def resolve_producto(self, info, id):
        return Producto.objects.get(pk=id)

    def resolve_categorias(self, info):
        return Categoria.objects.all()

    def resolve_productos_stock_bajo(self, info):
        return [p for p in Producto.objects.filter(activo=True) if p.stock_bajo]


class CrearProductoMutation(graphene.Mutation):
    class Arguments:
        nombre = graphene.String(required=True)
        precio_compra = graphene.Float(required=True)
        precio_venta = graphene.Float(required=True)
        stock = graphene.Int(required=True)
        stock_minimo = graphene.Int()
        categoria_id = graphene.Int()

    producto = graphene.Field(ProductoType)
    ok = graphene.Boolean()

    def mutate(
        self,
        info,
        nombre,
        precio_compra,
        precio_venta,
        stock,
        stock_minimo=5,
        categoria_id=None,
    ):
        producto = Producto.objects.create(
            nombre=nombre,
            precio_compra=precio_compra,
            precio_venta=precio_venta,
            stock=stock,
            stock_minimo=stock_minimo,
            categoria_id=categoria_id,
        )
        return CrearProductoMutation(producto=producto, ok=True)


class EliminarProductoMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        Producto.objects.filter(pk=id).delete()
        return EliminarProductoMutation(ok=True)


class Mutation(graphene.ObjectType):
    crear_producto = CrearProductoMutation.Field()
    eliminar_producto = EliminarProductoMutation.Field()

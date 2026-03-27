import graphene
from graphene_django import DjangoObjectType
from .models import Cliente


class ClienteType(DjangoObjectType):
    class Meta:
        model = Cliente
        fields = "__all__"


class Query(graphene.ObjectType):
    clientes = graphene.List(ClienteType)
    cliente = graphene.Field(ClienteType, id=graphene.Int(required=True))

    def resolve_clientes(self, info):
        return Cliente.objects.all()

    def resolve_cliente(self, info, id):
        return Cliente.objects.get(pk=id)


class CrearClienteMutation(graphene.Mutation):
    class Arguments:
        nombre = graphene.String(required=True)
        ci = graphene.String(required=True)
        telefono = graphene.String()
        direccion = graphene.String()

    cliente = graphene.Field(ClienteType)
    ok = graphene.Boolean()

    def mutate(self, info, nombre, ci, telefono="", direccion=""):
        cliente = Cliente.objects.create(
            nombre=nombre, ci=ci, telefono=telefono, direccion=direccion
        )
        return CrearClienteMutation(cliente=cliente, ok=True)


class Mutation(graphene.ObjectType):
    crear_cliente = CrearClienteMutation.Field()

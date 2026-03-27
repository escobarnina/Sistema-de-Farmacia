import graphene
import productos.schema
import clientes.schema
import ventas.schema


class Query(
    productos.schema.Query,
    clientes.schema.Query,
    ventas.schema.Query,
    graphene.ObjectType,
):
    pass


class Mutation(
    productos.schema.Mutation, clientes.schema.Mutation, graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)

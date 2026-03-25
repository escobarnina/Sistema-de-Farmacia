# Sistema de Farmacia

Sistema de gestión integral para farmacias con módulos de productos, clientes, ventas, proveedores y reportes. Desarrollado con **Django REST Framework** en el backend y **React** en el frontend.

---

## Tecnologías

| Capa          | Tecnología                                          |
|---------------|-----------------------------------------------------|
| Backend       | Python 3, Django 4, Django REST Framework, CORS     |
| Frontend      | React 19, React Router, Axios                       |
| Base de datos | PostgreSQL                                          |

---

## Estructura del proyecto

```
Sistema-de-Farmacia/
├── backend/
│   ├── core/           # Configuración Django (settings, urls)
│   ├── productos/      # Gestión de productos y categorías
│   ├── clientes/       # Gestión de clientes
│   ├── ventas/         # Registro de ventas y detalle de venta
│   ├── proveedores/    # Gestión de proveedores y distribuidores
│   ├── reportes/       # Módulo de reportes
│   └── manage.py
└── frontend/
    └── src/
        ├── components/ # Sidebar de navegación
        ├── pages/      # Dashboard, Productos, Clientes, Ventas, Proveedores, Reportes, Login
        ├── api.js      # Configuración de Axios
        └── App.js
```

---

## Módulos

### Login
- Autenticación de usuario para acceder al sistema.
- Credenciales por defecto: usuario `melina` / contraseña `melina123`.

### Dashboard
- Panel de control con estadísticas en tiempo real.
- Ingresos del día y del mes, ventas realizadas, productos activos y clientes.
- Alerta visual de productos con stock bajo.
- Tabla de ventas recientes.

### Productos
- CRUD completo de productos con nombre, descripción, categoría, precio de compra/venta y stock.
- Alerta de stock bajo cuando el stock cae por debajo del mínimo configurado.
- Filtro de búsqueda por nombre.

### Clientes
- Registro de clientes con CI, teléfono y dirección.
- Búsqueda y gestión completa.

### Ventas
- Creación de ventas con múltiples productos (detalle de venta).
- Cálculo automático de subtotal y total.
- Asociación opcional a un cliente.

### Proveedores
- CRUD de proveedores y distribuidores.
- Campos: nombre, persona de contacto, teléfono, email, dirección y estado (activo/inactivo).
- Búsqueda por nombre y badge de estado.

### Reportes
- Resumen de ingresos del mes, promedio por venta y productos con stock bajo.
- Venta más alta del mes.
- Gráfico de barras de ventas por día.
- Vista detallada de todas las ventas.
- Vista de inventario con estado de stock por producto.

---

## API REST

Base URL: `http://localhost:8000/api/`

| Endpoint          | Descripción              |
|-------------------|--------------------------|
| `/productos/`     | CRUD de productos        |
| `/categorias/`    | CRUD de categorías       |
| `/clientes/`      | CRUD de clientes         |
| `/ventas/`        | CRUD de ventas           |
| `/proveedores/`   | CRUD de proveedores      |

---

## Instalación y ejecución

### Requisitos previos

- Python 3.10+
- Node.js 18+
- PostgreSQL instalado y corriendo

### Backend

```bash
# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Instalar dependencias
pip install django djangorestframework django-cors-headers psycopg2-binary

# Configurar la base de datos PostgreSQL en backend/core/settings.py
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "sistema de farmacia",
        "USER": "postgres",
        "PASSWORD": "tu_contraseña",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

# Ejecutar migraciones
cd backend
python manage.py migrate

# Iniciar servidor
python manage.py runserver
```

El backend queda disponible en `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

El frontend queda disponible en `http://localhost:3000`.

---

## Credenciales de acceso

| Usuario | Contraseña  |
|---------|-------------|
| melina  | melina123   |

---

## Configuración CORS

En `backend/core/settings.py` el CORS está habilitado para todos los orígenes durante el desarrollo:

```python
CORS_ALLOW_ALL_ORIGINS = True
```

---

## Licencia

Proyecto académico — Arquitectura de Software.

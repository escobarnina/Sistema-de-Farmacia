# Sistema de Farmacia

Sistema de gestión para farmacias con módulos de productos, clientes, ventas y reportes. Desarrollado con **Django REST Framework** en el backend y **React** en el frontend.

---

## Tecnologías

| Capa      | Tecnología                                      |
|-----------|-------------------------------------------------|
| Backend   | Python 3, Django 4, Django REST Framework, CORS |
| Frontend  | React 19, React Router, Axios, Lucide React     |
| Base de datos | SQLite (desarrollo)                         |

---

## Estructura del proyecto

```
Sistema-de-Farmacia/
├── backend/
│   ├── core/           # Configuración Django (settings, urls)
│   ├── productos/      # Gestión de productos y categorías
│   ├── clientes/       # Gestión de clientes
│   ├── ventas/         # Registro de ventas y detalle de venta
│   ├── reportes/       # Módulo de reportes
│   └── manage.py
└── frontend/
    └── src/
        ├── components/ # Sidebar
        ├── pages/      # Dashboard, Productos, Clientes, Ventas
        ├── api.js      # Configuración de Axios
        └── App.js
```

---

## Módulos

### Productos
- CRUD de productos con nombre, descripción, categoría, precio de compra/venta y stock.
- Alerta de stock bajo cuando el stock cae por debajo del mínimo configurado.

### Clientes
- Registro de clientes con CI, teléfono y dirección.

### Ventas
- Creación de ventas con múltiples productos (detalle de venta).
- Cálculo automático de subtotal y total.
- Asociación opcional a un cliente.

### Reportes
- Módulo extensible para reportes de ventas e inventario.

---

## API REST

Base URL: `http://localhost:8000/api/`

| Endpoint          | Descripción             |
|-------------------|-------------------------|
| `/productos/`     | CRUD de productos       |
| `/categorias/`    | CRUD de categorías      |
| `/clientes/`      | CRUD de clientes        |
| `/ventas/`        | CRUD de ventas          |

---

## Instalación y ejecución

### Backend

```bash
# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Instalar dependencias
pip install django djangorestframework django-cors-headers

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

## Configuración CORS

En `backend/core/settings.py` el CORS está habilitado para `http://localhost:3000` durante el desarrollo:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

---

## Licencia

Proyecto académico - Arquitectura de Software.

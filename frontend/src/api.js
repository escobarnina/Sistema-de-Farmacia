import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

export const productosAPI = {
  listar: () => API.get('/productos/'),
  crear: (data) => API.post('/productos/', data),
  actualizar: (id, data) => API.put(`/productos/${id}/`, data),
  eliminar: (id) => API.delete(`/productos/${id}/`),
  stockBajo: () => API.get('/productos/stock_bajo/'),
};

export const categoriasAPI = {
  listar: () => API.get('/categorias/'),
  crear: (data) => API.post('/categorias/', data),
};

export const clientesAPI = {
  listar: () => API.get('/clientes/'),
  crear: (data) => API.post('/clientes/', data),
  actualizar: (id, data) => API.put(`/clientes/${id}/`, data),
  eliminar: (id) => API.delete(`/clientes/${id}/`),
};

export const ventasAPI = {
  listar: () => API.get('/ventas/'),
  crear: (data) => API.post('/ventas/', data),
};
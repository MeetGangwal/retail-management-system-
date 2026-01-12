import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Interceptor token for', config.url, ':', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const productAPI = {
  addProduct: (data) => api.post('/products', data),
  getRetailerProducts: () => api.get('/products/retailer/all'),
  getProduct: (id) => api.get(`/products/${id}`),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  searchProducts: (query, retailerId) =>
    api.get('/products/search', { params: { query, retailerId } }),
  getProductsByRetailer: (retailerId) =>
    api.get(`/products/by-retailer/${retailerId}`),
};

export const cartAPI = {
  addToCart: (data) => api.post('/cart/add', data),            // { productId, quantity }
  // server uses req.userId from token, so no retailerId param needed
  getCart: () => api.get('/cart'),
  // PUT /api/cart/update  body: { productId, quantity }
  updateCartItem: (data) => api.put('/cart/update', data),
  // DELETE /api/cart/remove  body: { productId }
  removeFromCart: (data) => api.delete('/cart/remove', { data }),
  // DELETE /api/cart/clear  body: {} (no retailerId)
  clearCart: () => api.delete('/cart/clear'),
};


export const orderAPI = {
  createOrder: (data) => api.post('/orders/create', data),
  processPayment: (data) => api.post('/orders/payment', data),
  getRetailerOrders: () => api.get('/orders/retailer'),
  getSalesByPeriod: (period) =>
    api.get('/orders/by-period', { params: { period } }),
  getOrder: (id) => api.get(`/orders/${id}`),
};

export const reportAPI = {
  getSalesAnalytics: () => api.get('/reports/analytics'),
};

export default api;

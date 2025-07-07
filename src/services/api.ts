import axios from 'axios';

// ✅ Create Axios instance with base URL from .env or fallback
const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || 'https://handmadehubdb-d8buffa5drcpdseg.japanwest-01.azurewebsites.net') + '/api',
  withCredentials: true, // Send cookies/auth headers if needed
});

// ✅ Add token to request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global 401 interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

//
// ✅ Auth
//
export const registerUser = (data: { name: string; email: string; password: string; role: string }) =>
  api.post('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const fetchAllUsers = () => api.get('/users');

//
// ✅ Products
//
export const fetchProducts = (searchQuery?: string) => {
  let url = '/products';
  if (searchQuery) {
    url += `?q=${encodeURIComponent(searchQuery)}`;
  }
  return api.get(url);
};

export const fetchProductById = (id: string) => api.get(`/products/${id}`);

export const createProduct = (formData: FormData) =>
  api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct = (productId: string, formData: FormData) =>
  api.put(`/products/${productId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProduct = (productId: string) => api.delete(`/products/${productId}`);

export const fetchRelatedProducts = (category: string, excludeId: string) =>
  api.get(`/products/search?category=${encodeURIComponent(category)}`).then(res =>
    res.data.filter((p: any) => p._id !== excludeId)
  );

export const fetchMyProducts = () => api.get('/products/my-products');

//
// ✅ Orders
//
export const submitOrder = (order: any) => api.post('/orders', order);

export const fetchMyOrders = () => api.get('/orders/my');
export const fetchOrderById = (orderId: string) => api.get(`/orders/${orderId}`);

export const fetchAllOrdersAdmin = () => api.get('/orders/all');
export const updateOrderStatusAdmin = (orderId: string, status: string) =>
  api.put(`/orders/${orderId}/status`, { status });

export const fetchArtisanOrders = () => api.get('/orders/my-orders');

export const updateOrderTracking = (
  orderId: string,
  data: {
    trackingNumber?: string;
    trackingStatus?: string;
    status?: string;
    carrier?: string;
    trackingUrl?: string;
    location?: string;
  }
) => api.put(`/orders/${orderId}/tracking`, data);

//
// ✅ Reviews
//
export const fetchReviewsByProduct = (productId: string) => api.get(`/reviews/product/${productId}`);

export const submitReview = (productId: string, review: { rating: number; comment: string }) =>
  api.post(`/reviews/${productId}`, review);

//
// ✅ Artisan Requests
//
export const fetchArtisanRequests = () => api.get('/artisan-requests');
export const getMyArtisanRequest = () => api.get('/artisan-requests/my-request');
export const submitArtisanRequest = (data: { brandName: string; bio: string; portfolioLink: string }) =>
  api.post('/artisan-requests', data);
export const updateArtisanRequest = (requestId: string, status: 'approved' | 'rejected') =>
  api.put(`/artisan-requests/${requestId}`, { status });

//
// ✅ Default export for advanced use (optional)
//
export default {
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
};

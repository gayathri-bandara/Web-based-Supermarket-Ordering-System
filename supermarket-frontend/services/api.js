import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

API.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Product Management
export const getProducts = () => API.get("/products");
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Category & Supplier Management
export const getCategories = () => API.get("/categories");
export const createCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export const getSuppliers = () => API.get("/suppliers");
export const createSupplier = (data) => API.post("/suppliers", data);
export const updateSupplier = (id, data) => API.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => API.delete(`/suppliers/${id}`);

// Order Management
export const getOrders = () => API.get("/orders");
export const getOrder = (id) => API.get(`/orders/${id}`);
export const createOrder = (data) => API.post("/orders", data);
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

// Payment & Invoice Management
export const getPayments = () => API.get("/payments");
export const createPayment = (data) => API.post("/payments", data);
export const updatePayment = (id, data) => API.put(`/payments/${id}`, data);
export const deletePayment = (id) => API.delete(`/payments/${id}`);

// Customer Review & Feedback
export const getReviews = (productId) =>
  API.get("/reviews", { params: productId ? { productId } : {} });
export const createReview = (data) => API.post("/reviews", data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Delivery & Driver Tracking
export const getDeliveries = (orderId) =>
  API.get("/delivery", { params: orderId ? { orderId } : {} });
export const createDelivery = (data) => API.post("/delivery", data);
export const updateDelivery = (id, data) => API.put(`/delivery/${id}`, data);
export const deleteDelivery = (id) => API.delete(`/delivery/${id}`);

export default API;

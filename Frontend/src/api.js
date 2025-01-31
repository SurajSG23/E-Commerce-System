import axios from "axios";

const API_URL = "https://e-commerce-system-nine.vercel.app"; // Replace with your backend URL

// USERS API

// Fetch all users
export const fetchUsers = () => {
  return axios.get(`${API_URL}/users`); // Matches GET /users in backend
};

// Fetch a single user by ID
export const fetchUserById = (id) => {
  return axios.get(`${API_URL}/user/${id}`); // Matches GET /user/:id in backend
};

// Create a new user
export const createUser = (userData) => {
  return axios.post(`${API_URL}/user`, userData); // Matches POST /user in backend
};

// CATEGORIES API

// Fetch all categories
export const fetchCategories = () => {
  return axios.get(`${API_URL}/categories`); // Matches GET /categories in backend
};

// Create a new category
export const createCategory = (categoryData) => {
  return axios.post(`${API_URL}/category`, categoryData); // Matches POST /category in backend
};

// PRODUCTS API

// Fetch all products
export const fetchProducts = () => {
  return axios.get(`${API_URL}/products`); // Matches GET /products in backend
};

// Fetch products by category
export const fetchProductsByCategory = (category) => {
  return axios.get(`${API_URL}/products/${category}`); // Matches GET /products/:category in backend
};

// Fetch a single product by ID
export const fetchProductById = (id) => {
  return axios.get(`${API_URL}/product/${id}`); // Matches GET /product/:id in backend
};

// Create a new product
export const createProduct = (productData) => {
  return axios.post(`${API_URL}/product`, productData); // Matches POST /product in backend
};

// ORDERS API

// Fetch all orders
export const fetchOrders = () => {
  return axios.get(`${API_URL}/orders`); // Matches GET /orders in backend
};

// Fetch a single order by ID
export const fetchOrderById = (id) => {
  return axios.get(`${API_URL}/order/${id}`); // Matches GET /order/:id in backend
};

// Create a new order
export const createOrder = (orderData) => {
  return axios.post(`${API_URL}/order`, orderData); // Matches POST /order in backend
};

// ORDER DETAILS API

// Fetch order details by order ID
export const fetchOrderDetailsByOrderId = (orderId) => {
  return axios.get(`${API_URL}/order/${orderId}/details`); // Matches GET /order/:orderId/details in backend
};

// Add a new order detail
export const createOrderDetail = (orderDetailData) => {
  return axios.post(`${API_URL}/order-detail`, orderDetailData); // Matches POST /order-detail in backend
};

// Delete all order details
export const deleteOrderDetails = () => {
  return axios.delete(`${API_URL}/order-detail`);
};

// Fetch all order details
export const fetchOrderDetails = () => {
  return axios.get(`${API_URL}/order-detail`); // Matches GET /order-details in backend
};

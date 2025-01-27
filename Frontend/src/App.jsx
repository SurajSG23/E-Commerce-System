import React, { useEffect, useState } from "react";
import { fetchUsers, fetchProducts, fetchOrders } from "./api";
import CreateUser from "./CreateUser";
import MainPage from "./MainPage";
import LoginUser from "./LoginUser";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetchUsers();
        setUsers(usersResponse.data);

        const productsResponse = await fetchProducts();
        setProducts(productsResponse.data);

        const ordersResponse = await fetchOrders();
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Refresh data after creating new entities
  const refreshUsers = async () => {
    try {
      const response = await fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-900 p-4">
        <h1 className="text-4xl font-bold text-center text-white bg-indigo-600 p-4 rounded-lg mb-6">
          E-commerce System
        </h1>
        <div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/main" element={<MainPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

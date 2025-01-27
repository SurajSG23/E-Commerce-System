import React, { useEffect, useState } from "react";
import { fetchUsers, fetchProductsByCategory, fetchOrders } from "./api"; // Import from API file
import CreateOrder from "./CreateOrder";
import { useLocation } from "react-router-dom";

const MainPage = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const location = useLocation();

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetchUsers();
        setUsers(usersResponse.data);

        const productsResponse = await fetchProductsByCategory(
          selectedCategory
        );
        console.log(productsResponse.data.data);
        setProducts(productsResponse.data.data);
        // console.log(products);

        const ordersResponse = await fetchOrders();
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCategory, location]);

  // Handle category change
  const handleCategoryChange = (e) => {
    console.log(e.target.value);
    setSelectedCategory(e.target.value);
  };

  // Refresh data functions
  const refreshUsers = async () => {
    try {
      const response = await fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  };

  const refreshOrders = async () => {
    try {
      const response = await fetchOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex gap-6 w-[70vw]">
        {/* Category Selection */}
        <div className="w-1/4">
          <label
            htmlFor="category"
            className="block text-gray-700 font-semibold mb-2"
          >
            Select Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="all">All</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>

        {/* Products List */}
        <div className="w-3/4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Products
          </h2>
          {Array.isArray(products) && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer">
              {products.map((product) => (
                <div
                  key={product.product_id}
                  className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-150 "
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {product.name || "Unnamed Product"}
                  </h3>
                  <p className="text-gray-600">
                    <strong>Product ID:</strong> {product.product_id}
                  </p>
                  <p className="text-gray-600">
                    <strong>Price:</strong> ₹ {product.price}
                  </p>
                  <p className="text-gray-600">
                    <strong>Stock:</strong> {product.stock || 0}
                  </p>
                  <p className="text-gray-600">
                    <strong>Category:</strong>{" "}
                    {product.category_id === 2 ? "Electronics" : "Clothing"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No products available for this category.
            </p>
          )}
        </div>
      </div>

      {/* Create Order Component */}
      <div className="absolute right-10">
        <CreateOrder refreshOrders={refreshOrders} />
      </div>
    </div>
  );
};

export default MainPage;

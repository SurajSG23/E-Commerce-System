import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  fetchProductsByCategory,
  fetchOrders,
  fetchCategories,
} from "./api"; // Import from API file
import CreateOrder from "./CreateOrder";
import { useLocation } from "react-router-dom";

const MainPage = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetchUsers();
        setUsers(usersResponse.data);
        const categoriesResponse = await fetchCategories();
        setCategories(categoriesResponse.data);
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
            className="block text-gray-700 font-semibold mb-2 text-center"
          >
            Select Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-[10vw] p-2 border border-gray-300 rounded-md flex text-center font-bold"
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option
                key={category.category_id}
                value={
                  category.name == "Electronics" ? "electronics" : "clothing"
                }
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Products List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex justify-center">
            Products
          </h2>
          {Array.isArray(products) && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.product_id}
                  className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-150  cursor-pointer"
                  style={{ boxShadow: "2px 2px 10px purple" }}
                >
                  <img
                    src={`${product.name}.jpg`}
                    alt="No image"
                    style={{ aspectRatio: "1/1" }}
                  />
                  <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                    {product.name || "Unnamed Product"}
                  </h3>
                  <p className="text-gray-600">
                    <strong>Product ID:</strong> {product.product_id}
                  </p>
                  <p className="text-gray-600">
                    <strong>Stock:</strong> {product.stock || 0}
                  </p>
                  <div className="flex gap-1">
                    <p className="text-gray-600 bg-green-400 text-center p-1 w-[125px] items-center justify-center flex mx-auto rounded-full">
                      ₹ {product.price}
                    </p>
                    <p className="text-gray-600 bg-amber-400 text-center p-1 w-[120px] items-center justify-center flex mx-auto rounded-full">
                      {product.category_id === 1 ? "Electronics" : "Clothing"}
                    </p>
                  </div>
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

import React, { useEffect, useState } from "react";
import {
  createOrderDetail,
  fetchOrderDetailsByOrderId,
  fetchOrderDetails,
  deleteOrderDetails,
} from "./api";

function CreateOrderDetail() {
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetchOrderDetails();
        setOrderDetails(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [detail, setDetail] = useState({
    product_id: "",
    quantity: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail({ ...detail, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    createOrderDetail(detail)
      .then(() => {
        setMessage("Order detail added successfully!");
        setDetail({ product_id: "", quantity: "", price: "" });

        return fetchOrderDetails();
      })
      .then((updatedDetails) => {
        setOrderDetails(updatedDetails.data);
      })
      .catch((error) => {
        // Handle the error thrown by the trigger (zero stock)
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setMessage(error.response.data.error); // This will show the "out of stock" error
        } else {
          setMessage("An error occurred while adding order detail.");
        }
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = () => {
    setLoading(true);
    deleteOrderDetails()
      .then(() => {
        setMessage("All order details removed successfully!");
        setOrderDetails([]); // Clear order details after deletion
      })
      .catch((error) => {
        setMessage("Error");
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto w-[24.5vw]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Add Product to Order
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product ID */}
        <div>
          <input
            type="number"
            name="product_id"
            value={detail.product_id}
            placeholder="Product ID"
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Quantity */}
        <div>
          <input
            type="number"
            name="quantity"
            value={detail.quantity}
            placeholder="Quantity"
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Price */}
        <div>
          <input
            type="number"
            name="price"
            value={detail.price}
            placeholder="Price"
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
        >
          {loading ? "Adding..." : "Add Order Detail"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}

      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center pt-10">
          Order Details
        </h2>
        <ul className="bg-white shadow-lg rounded-lg p-4 space-y-2">
          {orderDetails.length > 0 ? (
            orderDetails.map((detail) => (
              <li key={detail.id} className="border-b py-2">
                Product ID: {detail.product_id}, Quantity: {detail.quantity},
                Price: {detail.price}
              </li>
            ))
          ) : (
            <li className="text-gray-500">
              No details available for this order
            </li>
          )}
        </ul>
      </div>
      <button
        onClick={handleDelete}
        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 mt-4 cursor-pointer"
      >
        Delete All Order Details
      </button>
    </div>
  );
}

export default CreateOrderDetail;

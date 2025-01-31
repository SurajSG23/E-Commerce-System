import React, { useEffect, useState } from "react";
import { createUser, fetchUsers } from "./api";

function CreateUser({ refreshUsers }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetchUsers();
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  
  const [user, setUser] = useState({
    nickname: "",
    password: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    createUser(user)
      .then(() => {
        setMessage("User created successfully!");
        refreshUsers();
        setUser({
          nickname: "",
          password: "",
          email: "",
          phone: "",
          address: "",
        });
      })
      .catch((error) => {
        setMessage("Error creating user. Please try again.");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto w-[380px] relative left-[-30px]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sign up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nickname */}
        <div>
          <input
            type="text"
            name="nickname"
            value={user.nickname}
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            value={user.password}
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            value={user.email}
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Phone */}
        <div>
          <input
            type="text"
            name="phone"
            value={user.phone}
            placeholder="Phone"
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Address */}
        <div>
          <textarea
            name="address"
            value={user.address}
            placeholder="Address"
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
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>

      {/* Feedback Message */}
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center pt-10">
          All Users
        </h2>
        <ul className="bg-white shadow-lg rounded-lg p-4 space-y-2">
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.user_id} className="border-b py-2">
                {user.nickname || user.name}
              </li>
            ))
          ) : (
            <li className="text-gray-500">No users available</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default CreateUser;

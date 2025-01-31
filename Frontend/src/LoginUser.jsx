import React, { useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";

function LoginUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
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

    axios
      .post("https://e-commerce-system-nine.vercel.app/login", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        setMessage(`${response.data.message}, Please wait...`); 

        setTimeout(() => {
          navigate("/main");
        }, 3000);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setMessage("Invalid email or password.");
        } else {
          setMessage("An error occurred. Please try again.");
        }
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="bg-white h-[300px] shadow-md rounded-lg p-6 max-w-lg mx-auto w-[380px] relative left-[-30px]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Feedback Message */}
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}

export default LoginUser;

import React, { useEffect, useState } from "react";
import CreateUser from './CreateUser'
import LoginUser from './LoginUser'
import { fetchUsers, fetchProducts, fetchOrders } from "./api";

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLogin, setIsLogin] = useState(false); // State to toggle between login and signup

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
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 p-3">
            <div className="bg-white p-8 rounded-lg shadow-lg  sm:w-96">
                {/* Conditionally render CreateUser or LoginUser based on isLogin */}
                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 ml-1 cursor-pointer">
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </div>
                {isLogin ? (
                    <LoginUser />
                ) : (
                    <CreateUser refreshUsers={refreshUsers} />
                )}

            </div>
        </div>
    );
}

export default Dashboard;

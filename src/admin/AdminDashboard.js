import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

function AdminDashboard() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!token || !user || user.role !== "admin") {
      navigate("/admin");
      return;
    }

    fetchStats(token);
  }, [navigate]);

  const fetchStats = async (token) => {
    try {
      const res = await fetch(`${BASE_URL}dashboard-stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.status) {
        setStats(data.data);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/admin");
      }
    } catch (error) {
      console.log("Dashboard stats error:", error);
    }
  };

  return (
    <>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row g-3">
        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center">
            <h5>Users</h5>
            <h3>{stats.users}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center">
            <h5>Orders</h5>
            <h3>{stats.orders}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center">
            <h5>Products</h5>
            <h3>{stats.products}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center">
            <h5>Revenue</h5>
            <h3>₹{stats.revenue}</h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
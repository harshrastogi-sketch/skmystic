import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./admin.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost/CodeIgniter/dashboard-stats");
      const data = await res.json();

      if (data.status) {
        setStats(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex admin-wrapper">

      {/* ✅ SIDEBAR */}
      <div className="sidebar bg-dark text-white p-3">
        <h4 className="mb-4">Admin Panel</h4>

        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <button className="btn btn-outline-light w-100" onClick={() => navigate("/admin")}>
              Dashboard
            </button>
          </li>

          <li className="nav-item">
            <button className="btn btn-outline-light w-100" onClick={() => navigate("/admin/users")}>
              Users
            </button>
          </li>

          <li className="nav-item">
            <button className="btn btn-outline-light w-100" onClick={() => navigate("/admin/orders")}>
              Orders
            </button>
          </li>

          <li className="nav-item">
            <button className="btn btn-outline-light w-100" onClick={() => navigate("/admin/Products")}>
              Products
            </button>
          </li>
        </ul>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="content p-4 w-100">
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
      </div>
    </div>
  );
}

export default AdminDashboard;
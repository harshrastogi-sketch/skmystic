import React from "react";
import { useNavigate } from "react-router-dom";

function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin");
  };

  return (
    <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
      <h4 className="mb-0">Admin Panel</h4>

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate("/admin/dashboard")}
        >
          Dashboard
        </button>

        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => navigate("/")}
        >
          View Site
        </button>

        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminHeader;
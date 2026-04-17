import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import { FaChevronRight } from "react-icons/fa";

function AdminLayout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!token || !user || user.role !== "admin") {
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminHeader />

      <div className="d-flex flex-grow-1">
        <div
          className="sidebar bg-light border-end"
          style={{ width: "250px", minHeight: "100%" }}
        >
          <div className="p-3 border-bottom">
            <h5 className="mb-0">Admin Panel</h5>
          </div>

          <div className="list-group list-group-flush">
            <button className="list-group-item list-group-item-action" onClick={() => navigate("/admin/dashboard")}>
              Dashboard
            </button>

            <button className="list-group-item list-group-item-action" onClick={() => navigate("/admin/users")}>
              Users
            </button>

            <button className="list-group-item list-group-item-action" onClick={() => navigate("/admin/orders")}
            >
              Orders
            </button>

            <button className="list-group-item list-group-item-action" onClick={() => navigate("/admin/products")}>
              Products
            </button>

            <button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#bannerMenu" aria-expanded="false" aria-controls="bannerMenu">
              <span>Banner</span>
              <span>
                <FaChevronRight />
              </span>
            </button>

            <div className="collapse" id="bannerMenu">
              <button className="list-group-item list-group-item-action ps-4" onClick={() => navigate("/admin/banner")}>
                → Banner
              </button>

              <button className="list-group-item list-group-item-action ps-4" onClick={() => navigate("/admin/add-banner")}>
                → Add Banner
              </button>
            </div>

            <button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#blogMenu" aria-expanded="false" aria-controls="blogMenu">
              <span>Blog</span>
              <span>
                <FaChevronRight />
              </span>
            </button>

            <div className="collapse" id="blogMenu">
              <button className="list-group-item list-group-item-action ps-4" onClick={() => navigate("/admin/blog")}>
                → Blog
              </button>

              <button className="list-group-item list-group-item-action ps-4" onClick={() => navigate("/admin/add-blog")}>
                → Add Blog
              </button>
            </div>

            <button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#categoryMenu" aria-expanded="false" aria-controls="categoryMenu">
              <span>Category</span>
              <span>
                <FaChevronRight />
              </span>
            </button>

            <div className="collapse" id="categoryMenu">
              <button className="list-group-item list-group-item-action ps-4" onClick={() => navigate("/admin/category")}>
                → Category
              </button>

              <button className="list-group-item list-group-item-action ps-4" onClick={() => navigate("/admin/add-category")}>
                → Add Category
              </button>
            </div>

            <button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#brandMenu" aria-expanded="false" aria-controls="brandMenu">
              <span>Brand</span>
              <span>
                <FaChevronRight />
              </span>
            </button>

            <div className="collapse" id="brandMenu">
              <button className="list-group-item list-group-item-action ps-4" onClick={() => navigate("/admin/brand")}>
                → Brand
              </button>

              <button className="list-group-item list-group-item-action ps-4" onClick={() => navigate("/admin/add-brand")}>
                → Add Brand
              </button>
            </div>

          </div>
        </div>

        <div className="content p-4 w-100">{children}</div>
      </div>

      <AdminFooter />
    </div>
  );
}

export default AdminLayout;
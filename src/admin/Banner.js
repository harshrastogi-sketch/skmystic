import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function Banner() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [filterText, setFilterText] = useState("");

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!token || !user || user.role !== "admin") {
      navigate("/admin");
      return;
    }

    fetchBanners(token);
  }, [navigate]);

  const fetchBanners = async (token) => {
    try {
      const res = await fetch(`${BASE_URL}api/banner`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.status) {
        setBanners(data.data || []);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.log("Banner fetch error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch banners",
      });
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    return `${BASE_URL}${imagePath}`;
  };

  // ✅ TOGGLE STATUS (SWEETALERT)
  const handleToggleStatus = async (id, currentStatus) => {
    const isActive =
      String(currentStatus) === "1" || currentStatus === "Active";

    const result = await Swal.fire({
      title: isActive ? "Deactivate Banner?" : "Activate Banner?",
      text: "Are you sure you want to change status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const newStatus = isActive ? 0 : 1;

      Swal.fire({
        title: "Updating...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(
        `${BASE_URL}api/banner-status/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      Swal.close();

      if (data.status) {
        Swal.fire({
          icon: "success",
          title:
            newStatus === 1
              ? "Banner activated successfully"
              : "Banner deactivated successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchBanners(token);
      } else {
        Swal.fire({
          icon: "error",
          title: data.message || "Status update failed",
        });
      }
    } catch (error) {
      console.log("Status update error:", error);
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error updating banner status",
      });
    }
  };

  // ✅ DELETE (SWEETALERT)
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Banner?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(
        `${BASE_URL}api/delete-banner/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      Swal.close();

      if (data.status) {
        Swal.fire({
          icon: "success",
          title: "Banner deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchBanners(token);
      } else {
        Swal.fire({
          icon: "error",
          title: data.message || "Delete failed",
        });
      }
    } catch (error) {
      console.log("Delete error:", error);
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error deleting banner",
      });
    }
  };

  const columns = [
    {
      name: "#",
      cell: (row, index) => index + 1,
      width: "70px",
    },
    {
      name: "Banner",
      cell: (row) => (
        <img
          src={getImageUrl(row.image)}
          alt="banner"
          style={{
            width: "120px",
            height: "60px",
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
      ),
    },
    {
      name: "Title",
      selector: (row) => row.title || "-",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => {
        const isActive =
          String(row.status) === "1" || row.status === "Active";

        return (
          <button
            className={`btn btn-sm ${
              isActive ? "btn-success" : "btn-secondary"
            }`}
            onClick={() => handleToggleStatus(row.id, row.status)}
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/admin/edit-banner/${row.id}`)}
          >
            Edit
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
      width: "180px",
    },
  ];

  const filteredData = banners.filter((item) =>
    (item.title || "").toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="fw-bold mb-0">Banner</h1>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/add-banner")}
          >
            Add Banner
          </button>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-end mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{ maxWidth: "300px" }}
              />
            </div>

            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              striped
              responsive
              noDataComponent="No banners found"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
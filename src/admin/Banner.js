import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";

function Banner() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [filterText, setFilterText] = useState("");

  const BASE_URL = "https://harsh.skmysticastrologer.in/CodeIgniter/";

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
      const res = await fetch("https://harsh.skmysticastrologer.in/CodeIgniter/api/banner", {
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
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    return `${BASE_URL}${imagePath}`;
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const isCurrentlyActive =
      String(currentStatus) === "1" || currentStatus === "Active";

    const confirmChange = window.confirm(
      isCurrentlyActive
        ? "Are you sure you want to deactivate this banner?"
        : "Are you sure you want to activate this banner?"
    );

    if (!confirmChange) return;

    try {
      const token = localStorage.getItem("token");
      const newStatus = isCurrentlyActive ? 0 : 1;

      const res = await fetch(
        `https://harsh.skmysticastrologer.in/CodeIgniter/api/banner-status/${id}`,
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

      if (data.status) {
        alert(
          newStatus === 1
            ? "Banner activated successfully"
            : "Banner deactivated successfully"
        );
        fetchBanners(token);
      } else {
        alert(data.message || "Status update failed");
      }
    } catch (error) {
      console.log("Status update error:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://harsh.skmysticastrologer.in/CodeIgniter/api/delete-banner/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (data.status) {
        alert("Banner deleted successfully");
        fetchBanners(token);
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.log("Delete error:", error);
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
            type="button"
            className={`btn btn-sm ${
              isActive ? "btn-success" : "btn-secondary"
            }`}
            onClick={() => handleToggleStatus(row.id, row.status)}
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        );
      },
      sortable: false,
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

  const customStyles = {
    headCells: {
      style: {
        fontSize: "15px",
        fontWeight: "bold",
        backgroundColor: "#212529",
        color: "#fff",
      },
    },
    rows: {
      style: {
        minHeight: "72px",
      },
    },
  };

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
              customStyles={customStyles}
              noDataComponent="No banners found"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
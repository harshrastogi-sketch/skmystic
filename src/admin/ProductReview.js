import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function AdminAddProductReviews() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [form, setForm] = useState({
    user_name: "",
    post_date: "",
    description: "",
  });

  const fetchProduct = async () => {
    const res = await fetch(`${BASE_URL}products/view/${productId}`);
    const data = await res.json();

    if (data.status) {
      setProduct(data.data);
    }
  };

  const fetchReviews = async () => {
    const res = await fetch(`${BASE_URL}Product_reviews/index/${productId}`);
    const data = await res.json();

    if (data.status) {
      setReviews(data.data || []);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [productId]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("user_name", form.user_name);
    formData.append("post_date", form.post_date);
    formData.append("description", form.description);

    const res = await fetch(`${BASE_URL}Product_reviews/store`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.status) {
      Swal.fire("Success", "Review added successfully", "success");

      setForm({
        user_name: "",
        post_date: "",
        description: "",
      });

      fetchReviews();
    } else {
      Swal.fire("Error", data.message || "Review not added", "error");
    }
  };

  const deleteReview = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`${BASE_URL}Product_reviews/delete/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.status) {
      Swal.fire("Deleted", "Review deleted successfully", "success");
      fetchReviews();
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="mb-3">
        <h5>
          Home <span className="text-muted mx-2">|</span>{" "}
          {product?.name || "Product"}
        </h5>

        <div className="d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-uppercase">
            Product Reviews of {product?.name}
          </h6>

          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            BACK
          </button>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <table className="table table-bordered table-striped mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>Post Date</th>
                <th>Description</th>
                <th width="90">Action</th>
              </tr>
            </thead>

            <tbody>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <tr key={review.id}>
                    <td>{index + 1}</td>
                    <td>{review.user_name}</td>
                    <td>{review.post_date}</td>
                    <td>{review.description}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteReview(review.id)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card shadow-sm" style={{ maxWidth: "850px" }}>
        <div className="card-body">
          <h5 className="text-info mb-3">Add Product Reviews</h5>
          <hr />

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">User Name</label>
              <div className="col-sm-9">
                <input
                  type="text"
                  name="user_name"
                  className="form-control"
                  value={form.user_name}
                  onChange={handleChange}
                  placeholder="User Name"
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Review Date</label>
              <div className="col-sm-9">
                <input
                  type="date"
                  name="post_date"
                  className="form-control"
                  value={form.post_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Description</label>
              <div className="col-sm-9">
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="offset-sm-3 col-sm-9">
                <button className="btn btn-info px-5">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <p className="text-center mt-3">
        Copyright © 2023 SKMystic. All right reserved.
      </p>
    </div>
  );
}

export default AdminAddProductReviews;
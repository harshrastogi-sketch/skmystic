import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await apiRequest("http://localhost/CodeIgniter/products");
      console.log(res);
      setProducts(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(
        `http://localhost/CodeIgniter/products/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.status === 200) {
        alert("✅ Product deleted");

        // 🔥 Update UI without reload
        setProducts((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.log(err);
      alert("❌ Error deleting product");
    }
  };

  return (
    <div className="container mt-4">

      {/* 🔥 Header with button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Products</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/add-product")}
        >
          + Add Product
        </button>
      </div>

      {/* 🔥 Product Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td><img src={`http://localhost/CodeIgniter/uploads/${item.image1}`} alt="product" width="50" height="50" style={{ objectFit: "cover" }} /></td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₹{item.price}</td>
                  <td>{item.discount || 0}%</td>

                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() =>
                        navigate(`/admin/edit-product/${item.id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default Products;
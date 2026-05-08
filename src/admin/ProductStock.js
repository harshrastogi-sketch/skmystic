import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

function ProductStock() {
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [stockForm, setStockForm] = useState({
        type: "in",
        quantity: "",
        note: "",
    });

    const fetchStockProducts = async () => {
        try {
            const res = await fetch(`${BASE_URL}Product_stock/index`);
            const data = await res.json();

            if (data.status) {
                setProducts(data.data || []);
            }
        } catch (err) {
            console.log("Stock fetch error:", err);
        }
    };

    useEffect(() => {
        fetchStockProducts();
    }, []);

    const handleOpenModal = (product) => {
        setSelectedProduct(product);

        setStockForm({
            type: "in",
            quantity: "",
            note: "",
        });
    };

    const handleChange = (e) => {
        setStockForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleStockSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("product_id", selectedProduct.product_id);
            formData.append("quantity", stockForm.quantity);
            formData.append("note", stockForm.note);

            let apiUrl = "";

            if (stockForm.type === "in") {
                apiUrl = `${BASE_URL}Product_stock/add_stock`;
            }

            if (stockForm.type === "out") {
                apiUrl = `${BASE_URL}Product_stock/remove_stock`;
            }

            if (stockForm.type === "adjust") {
                apiUrl = `${BASE_URL}Product_stock/adjust_stock`;
            }

            const res = await fetch(apiUrl, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.status) {
                Swal.fire("Success", data.message, "success");

                setSelectedProduct(null);

                fetchStockProducts();
            } else {
                Swal.fire("Error", data.message, "error");
            }
        } catch (err) {
            console.log(err);

            Swal.fire("Error", "Stock update failed", "error");
        }
    };

    const getStatusBadge = (status) => {

        if (status === "in_stock") {
            return (
                <span className="badge rounded-pill bg-success px-3 py-2 d-inline-flex align-items-center gap-1">
                    <FaCheckCircle />
                    In Stock
                </span>
            );
        }

        if (status === "low_stock") {
            return (
                <span className="badge rounded-pill bg-warning text-dark px-3 py-2 d-inline-flex align-items-center gap-1">
                    <FaExclamationTriangle />
                    Low Stock
                </span>
            );
        }

        if (status === "out_of_stock") {
            return (
                <span className="badge rounded-pill bg-danger px-3 py-2 d-inline-flex align-items-center gap-1">
                    <FaTimesCircle />
                    Out of Stock
                </span>
            );
        }

    };

    return (
        <div className="container-fluid mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-1">Product Stock Inventory</h4>

                    <p className="text-muted mb-0">
                        Manage product stock, low stock and inventory movement
                    </p>
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </div>

            {/* STATS */}
            <div className="row mb-4">

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6>Total Products</h6>
                            <h3>{products.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6>Total Stock</h6>

                            <h3>
                                {products.reduce(
                                    (total, item) =>
                                        total + Number(item.current_stock || 0),
                                    0
                                )}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6>Low Stock</h6>

                            <h3>
                                {
                                    products.filter(
                                        (item) => item.stock_status === "low_stock"
                                    ).length
                                }
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6>Out of Stock</h6>

                            <h3>
                                {
                                    products.filter(
                                        (item) =>
                                            item.stock_status === "out_of_stock"
                                    ).length
                                }
                            </h3>
                        </div>
                    </div>
                </div>

            </div>

            {/* TABLE */}
            <div className="card shadow-sm">

                <div className="card-header bg-dark text-white">
                    Stock Inventory List
                </div>

                <div className="card-body">

                    <table className="table table-bordered table-striped">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Current Stock</th>
                                <th>Minimum Stock</th>
                                <th>Status</th>
                                <th width="220">Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {products.length > 0 ? (
                                products.map((item, index) => (
                                    <tr key={item.product_id}>

                                        <td>{index + 1}</td>

                                        <td>{item.name}</td>

                                        <td>{item.product_sku || "-"}</td>

                                        <td>{item.category_name}</td>

                                        <td>
                                            <strong>{item.current_stock}</strong>
                                        </td>

                                        <td>{item.minimum_stock}</td>

                                        <td>
                                            {getStatusBadge(item.stock_status)}
                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-primary btn-sm me-2"
                                                onClick={() => handleOpenModal(item)}
                                            >
                                                Manage Stock
                                            </button>

                                            <button
                                                className="btn btn-info btn-sm"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/product-stock-history/${item.product_id}`
                                                    )
                                                }
                                            >
                                                History
                                            </button>

                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No products found
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* MODAL */}
            {selectedProduct && (

                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <form onSubmit={handleStockSubmit}>

                                <div className="modal-header">

                                    <h5 className="modal-title">
                                        Manage Stock - {selectedProduct.name}
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setSelectedProduct(null)}
                                    ></button>

                                </div>

                                <div className="modal-body">

                                    <p>
                                        Current Stock:
                                        <strong className="ms-2">
                                            {selectedProduct.current_stock}
                                        </strong>
                                    </p>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Stock Type
                                        </label>

                                        <select
                                            name="type"
                                            className="form-control"
                                            value={stockForm.type}
                                            onChange={handleChange}
                                        >
                                            <option value="in">Stock In</option>
                                            <option value="out">Stock Out</option>
                                            <option value="adjust">Adjust Stock</option>
                                        </select>

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            {stockForm.type === "adjust"
                                                ? "New Stock Quantity"
                                                : "Quantity"}
                                        </label>

                                        <input
                                            type="number"
                                            name="quantity"
                                            className="form-control"
                                            value={stockForm.quantity}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Note
                                        </label>

                                        <textarea
                                            name="note"
                                            className="form-control"
                                            rows="3"
                                            value={stockForm.note}
                                            onChange={handleChange}
                                            placeholder="Example: Initial stock / Damaged item / Manual correction"
                                        ></textarea>

                                    </div>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setSelectedProduct(null)}
                                    >
                                        Cancel
                                    </button>

                                    <button className="btn btn-success">
                                        Save Stock
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default ProductStock;
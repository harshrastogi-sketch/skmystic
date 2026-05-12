import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ProductStockHistory() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${BASE_URL}Product_stock/history/${productId}`);
      const data = await res.json();

      if (data.status) {
        setHistory(data.data || []);
      }
    } catch (err) {
      console.log("History fetch error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [productId]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date(date.replace(" ", "T")));
  };

  const getTypeBadge = (type) => {
    if (type === "in") {
      return <span className="badge bg-success">Stock In</span>;
    }

    if (type === "out") {
      return <span className="badge bg-danger">Stock Out</span>;
    }

    return <span className="badge bg-warning text-dark">Adjust</span>;
  };

  // hide order entries from table
  const visibleHistory = history.filter(
    (item) => item.reference_type !== "order"
  );

  // calculate total including order entries as minus
  const grandTotal = history.reduce((total, item) => {
    const qty = Number(item.quantity || 0);

    if (item.stock_type === "in") {
      return total + qty;
    }

    if (item.stock_type === "out") {
      return total - qty;
    }

    if (item.stock_type === "adjust") {
      return total;
    }

    return total;
  }, 0);

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4>Stock History</h4>

          <p className="text-muted mb-0">Product: {history?.[0]?.product_name || "-"}</p>
        </div>

        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          Stock Movement History
        </div>

        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Previous Stock</th>
                <th>New Stock</th>
                <th>Note</th>
              </tr>
            </thead>

            <tbody>
              {visibleHistory.length > 0 ? (
                visibleHistory.map((item, index) => {
                  const qty =
                    item.stock_type === "out"
                      ? `-${item.quantity}`
                      : item.quantity;

                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>

                      <td>{formatDate(item.created_at)}</td>

                      <td>{item.product_name}</td>

                      <td>{item.product_sku || "-"}</td>

                      <td>{getTypeBadge(item.stock_type)}</td>

                      <td>
                        <strong
                          className={
                            item.stock_type === "out"
                              ? "text-danger"
                              : "text-success"
                          }
                        >
                          {qty}
                        </strong>
                      </td>

                      <td>{item.previous_stock}</td>

                      <td>
                        <strong>{item.new_stock}</strong>
                      </td>

                      <td>{item.note || "-"}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No stock history found
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr className="table-dark">
                <td colSpan="5" className="text-end">
                  Grand Total
                </td>

                <td>
                  <strong>{grandTotal}</strong>
                </td>

                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductStockHistory;
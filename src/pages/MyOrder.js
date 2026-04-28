import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const MyOrder = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || !userId) {
            navigate("/login");
            return;
        }

        fetch(`${BASE_URL}api/my-orders?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                //console.log("ORDERS API:", data);

                if (data.status) {
                    setOrders(data.orders);
                } else {
                    console.log("Error:", data.message);
                }
            })
            .catch((err) => console.log(err));

    }, [userId, navigate, BASE_URL]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // INVOICE FUNCTION
    const handleInvoice = (order) => {
        const doc = new jsPDF();
        let y = 15;

        doc.setFontSize(16);
        doc.setFont(undefined, "bold");
        doc.text("SK Mystic Astrologer", 20, y);

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text("www.skmysticastrologer.in", 20, y + 6);

        doc.setFont(undefined, "bold");
        doc.text("INVOICE", 150, y);

        doc.setFont(undefined, "normal");
        doc.text(`Invoice #: ${order.order_id}`, 150, y + 6);
        doc.text(`Date: ${order.created_at}`, 150, y + 12);

        y += 20;

        doc.setFont(undefined, "bold");
        doc.text("Bill To:", 20, y);

        doc.setFont(undefined, "normal");
        doc.text(order.name || "N/A", 20, y + 6);
        doc.text(order.email || "N/A", 20, y + 12);
        doc.text(order.mobile || "N/A", 20, y + 18);

        y += 30;

        doc.setFont(undefined, "bold");
        doc.text("#", 20, y);
        doc.text("Item", 30, y);
        doc.text("Price", 120, y, { align: "right" });
        doc.text("Qty", 150, y, { align: "right" });
        doc.text("Total", 190, y, { align: "right" });

        y += 2;
        doc.line(20, y, 190, y);
        y += 8;

        let items = [];
        try {
            items = order.cart_items || [];
            if (typeof items === "string") {
                items = JSON.parse(items);
            }
        } catch (e) {
            console.log("Parse error:", e);
        }

        doc.setFont(undefined, "normal");

        let grandTotal = 0;

        if (!items.length) {
            doc.text("No items found", 20, y);
            y += 10;
        } else {
            items.forEach((item, index) => {
                const price = Number(item.price || 0);
                const qty = Number(item.quantity || 0);
                const total = price * qty;

                grandTotal += total;

                doc.text(`${index + 1}`, 20, y);
                doc.text(item.name || "-", 30, y);

                doc.text(price.toFixed(2), 120, y, { align: "right" });
                doc.text(qty.toString(), 150, y, { align: "right" });
                doc.text(total.toFixed(2), 190, y, { align: "right" });

                y += 8;
            });
        }

        y += 5;
        doc.line(100, y, 190, y);
        y += 10;

        doc.setFont(undefined, "bold");

        doc.text("Subtotal:", 130, y);
        doc.text(grandTotal.toFixed(2), 190, y, { align: "right" });

        y += 8;

        doc.setFontSize(13);
        doc.text("Total:", 130, y);
        doc.text((grandTotal).toFixed(2), 190, y, { align: "right" });

        // 🧾 FOOTER NOTE
        y += 20;
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(
            "Thank you for your purchase!",
            20,
            y
        );

        // 💾 SAVE
        doc.save(`invoice_${order.order_id}.pdf`);
    };

    return (
        <div className="dashboard">
            <div className="main-container">

                {/* Sidebar */}
                <div className="sidebar">
                    <div className="sidebar-title">Dashboard</div>

                    <ul>
                        <li onClick={() => navigate("/dashboard")}>
                            My Profile
                        </li>

                        <li className="active">
                            My Order
                        </li>

                        <li onClick={handleLogout}>
                            Sign Out
                        </li>
                    </ul>
                </div>

                {/* Content */}
                <div className="content">
                    <div className="content-header">
                        MY ORDER HISTORY
                    </div>

                    <div style={{ padding: "20px" }}>
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Total Price</th>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Invoice</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order, index) => (
                                        <tr key={order.id}>
                                            <td>{index + 1}</td>

                                            <td>
                                                ₹ {Number(order.total_price || 0).toLocaleString("en-IN")}
                                            </td>

                                            <td>{order.order_id}</td>

                                            <td>{order.created_at}</td>

                                            <td >
                                                <button type="button" onClick={() => handleInvoice(order)} className="invoice-btn">
                                                    ⬇ Download
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No Orders Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyOrder;
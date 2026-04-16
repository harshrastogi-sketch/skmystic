import React, { useEffect, useState } from "react";
import "./Dashboard.css"; // ✅ reuse same CSS
import { useNavigate, useLocation } from "react-router-dom";

const MyOrder = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();


    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || !userId) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost/CodeIgniter/api/my-orders?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}` // 🔥 IMPORTANT
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("ORDERS:", data);

                if (data.status) {
                    setOrders(data.orders);
                } else {
                    console.log("Error:", data.message);
                }
            })
            .catch((err) => console.log(err));

    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="dashboard">

            {/* Top Banner */}
            {/* <div className="top-banner">
        <span>Home | Order History</span>
      </div> */}

            <div className="main-container">

                {/* Sidebar */}
                <div className="sidebar">
                    <div className="sidebar-title">Dashboard</div>

                    <ul>
                        <li onClick={() => navigate("/dashboard", { state: { userId } })}>
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
                                    <th>Order Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order, index) => (
                                        <tr key={order.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                ₹ {Number(order.total_price).toLocaleString("en-IN")}
                                            </td>
                                            <td>{order.order_id}</td>
                                            <td>{order.created_at}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No Orders Found</td>
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
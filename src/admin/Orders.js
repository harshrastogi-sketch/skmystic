import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/all-orders`);
      const data = await res.json();

      if (data.status === 200) {
        setOrders(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Orders</h2>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Date</th>
              <th>Items</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((item, index) => {
                const items = JSON.parse(item.cart_items || "[]");

                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.mobile}</td>
                    <td>{item.address}</td>
                    <td>{item.payment_method}</td>
                    <td>₹{item.total}</td>
                    <td>{item.created_at}</td>

                    {/* 🔥 Show Items */}
                    <td>
                      {items.map((p, i) => (
                        <div key={i}>
                          {p.name} (x{p.quantity})
                        </div>
                      ))}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No Orders Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
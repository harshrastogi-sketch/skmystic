import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";

function Orders() {
  const [orders, setOrders] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/all-orders`);
      const data = await res.json();

      if (data.status === 200) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const safeParseItems = (cartItems) => {
    try {
      if (!cartItems) return [];
      if (Array.isArray(cartItems)) return cartItems;
      return JSON.parse(cartItems);
    } catch (error) {
      console.log("Cart items parse error:", error);
      return [];
    }
  };

  const handleInvoice = (order) => {
    const doc = new jsPDF();
    let y = 15;

    const items = safeParseItems(order.cart_items);

    const invoiceNo = order.order_id || order.id;
    const orderDate = order.created_at || "-";

    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("SK Mystic Astrologer", 20, y);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("www.skmysticastrologer.in", 20, y + 6);

    doc.setFont(undefined, "bold");
    doc.text("INVOICE", 150, y);

    doc.setFont(undefined, "normal");
    doc.text(`Invoice #: ${invoiceNo}`, 150, y + 6);
    doc.text(`Date: ${orderDate}`, 150, y + 12);

    y += 25;

    doc.setFont(undefined, "bold");
    doc.text("Bill To:", 20, y);

    doc.setFont(undefined, "normal");
    doc.text(order.name || "N/A", 20, y + 6);
    doc.text(order.email || "N/A", 20, y + 12);
    doc.text(order.mobile || "N/A", 20, y + 18);

    const addressText = doc.splitTextToSize(order.address || "N/A", 90);
    doc.text(addressText, 20, y + 24);

    y += 45;

    doc.setFont(undefined, "bold");
    doc.text("#", 20, y);
    doc.text("Item", 30, y);
    doc.text("Price", 120, y, { align: "right" });
    doc.text("Qty", 150, y, { align: "right" });
    doc.text("Total", 190, y, { align: "right" });

    y += 2;
    doc.line(20, y, 190, y);
    y += 8;

    doc.setFont(undefined, "normal");

    let grandTotal = 0;

    if (!items.length) {
      doc.text("No items found", 20, y);
      y += 10;
    } else {
      items.forEach((item, index) => {
        const price = Number(item.price || item.product_price || 0);
        const qty = Number(item.quantity || item.qty || 0);
        const total = price * qty;

        grandTotal += total;

        const itemName = item.name || item.product_name || "-";
        const itemText = doc.splitTextToSize(itemName, 75);

        doc.text(`${index + 1}`, 20, y);
        doc.text(itemText, 30, y);
        doc.text(price.toFixed(2), 120, y, { align: "right" });
        doc.text(qty.toString(), 150, y, { align: "right" });
        doc.text(total.toFixed(2), 190, y, { align: "right" });

        y += itemText.length > 1 ? itemText.length * 6 : 8;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    }

    const finalTotal = Number(order.total || grandTotal || 0);

    y += 5;
    doc.line(100, y, 190, y);
    y += 10;

    doc.setFont(undefined, "bold");
    doc.text("Payment:", 130, y);
    doc.text(order.payment_method || "-", 190, y, { align: "right" });

    y += 8;

    doc.text("Subtotal:", 130, y);
    doc.text(grandTotal.toFixed(2), 190, y, { align: "right" });

    y += 8;

    doc.setFontSize(13);
    doc.text("Total:", 130, y);
    doc.text(finalTotal.toFixed(2), 190, y, { align: "right" });

    y += 20;

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Thank you for your purchase!", 20, y);

    doc.save(`invoice_${invoiceNo}.pdf`);
  };

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
              <th>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((item, index) => {
                const items = safeParseItems(item.cart_items);

                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.mobile}</td>
                    <td>{item.address}</td>
                    <td>{item.payment_method}</td>
                    <td>₹{Number(item.total || 0).toLocaleString("en-IN")}</td>
                    <td>{item.created_at}</td>

                    <td>
                      {items.length > 0 ? (
                        items.map((p, i) => (
                          <div key={i}>
                            {p.name || p.product_name} (x
                            {p.quantity || p.qty})
                          </div>
                        ))
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleInvoice(item)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
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
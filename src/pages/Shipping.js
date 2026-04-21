import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="container my-5">
      

      {/* Content */}
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">
          Shipping/Delivery Policy
        </h2>

        {/* Q1 */}
        <h6 className="fw-bold">
          1. How long will it take for an order to arrive?
        </h6>
        <p>
          The orders booked before 2 PM are dispatched on the same day and
          the orders booked after 2 PM or non-working days are dispatched on
          the next working day. The orders may be delivered within 3-7
          working days depending on the location of the delivery. The
          delivery will be done on the address the customer/buyer has
          mentioned while ordering.
        </p>

        {/* Q2 */}
        <h6 className="fw-bold mt-3">
          2. What are the Delivery Charges?
        </h6>
        <p>
          The delivery charges are included in the cost of the product.
        </p>

        {/* Q3 */}
        <h6 className="fw-bold mt-3">
          3. Do I have to pay any other taxes and/or fees?
        </h6>
        <p>
          All the products of SK Mystic are tax inclusive.
        </p>

        {/* Q4 */}
        <h6 className="fw-bold mt-3">
          4. Can I change my order?
        </h6>
        <p>
          We don’t accept the request for an exchange or refund.
        </p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
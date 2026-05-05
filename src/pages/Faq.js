import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${BASE_URL}faq_users`);
      const data = await res.json();

      if (data.status) {
        setFaqs(data.data);
      } else {
        setFaqs([]);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to load FAQs", "error");
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <div className="container my-5 faq-page">
      <style>
        {`
          .faq-description img {
            max-width: 100%;
            height: auto;
            display: block;
            border-radius: 8px;
            margin: 10px 0;
          }

          .faq-description figure {
            margin: 0;
            max-width: 100%;
          }

          .faq-description .image {
            max-width: 100%;
          }

          .faq-description p {
            margin-bottom: 8px;
          }
        `}
      </style>

      <h2 className="mb-4 text-center">Frequently Asked Questions</h2>

      {faqs.length > 0 ? (
        faqs.map((faq, index) => (
          <div key={faq.id} className="mb-3">
            <div
              className="d-flex align-items-start"
              style={{ backgroundColor: "orange", padding: "0.5rem" }}
            >
              <span
                className="me-2"
                style={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#ff9900",
                  padding: "0.3rem 0.5rem",
                  borderRadius: "4px",
                  flexShrink: 0,
                }}
              >
                Q.{index + 1}
              </span>

              <strong style={{ color: "white" }}>{faq.heading}</strong>
            </div>

            <div className="p-3 border" style={{ borderTop: "0" }}>
              <div
                className="faq-description"
                dangerouslySetInnerHTML={{
                  __html: faq.description || "",
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No FAQs available</p>
      )}
    </div>
  );
};

export default FAQ;
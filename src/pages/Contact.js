import React, { useState } from "react";
import { FaStreetView, FaPhone, FaEnvelope } from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.status) {
        setResponseMsg("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setResponseMsg("Failed to send message");
      }
    } catch (error) {
      setResponseMsg("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>



      {/* 🔥 Main Section */}
      <div className="container py-5">
        <h2 className="text-center mb-5 fw-bold">Contact us</h2>

        <div className="row">

          {/* LEFT SIDE FORM */}
          <div className="col-md-6">
            <h5 className="mb-3">Drop us message</h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Your name</label>
                <input type="text" name="name" className="form-control" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" name="email" className="form-control" placeholder="Enter your email address" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea name="message" className="form-control" rows="5" placeholder="Your message here..." value={formData.message} onChange={handleChange} required></textarea>
              </div>

              <button type="submit" className="btn btn-dark px-4" disabled={loading}>
                {loading ? "Submitting..." : "Submit →"}
              </button>

              {responseMsg && (
                <div className="alert alert-info mt-3">
                  {responseMsg}
                </div>
              )}
            </form>
          </div>

          {/* RIGHT SIDE INFO */}
          <div className="col-md-6">
            <h5 className="mb-3">Get in touch</h5>

            <div className="mb-3 d-flex">
              <FaStreetView className="me-3 mt-1 " size={20} />
              <div>
                <strong>Address</strong>
                <p className="mb-0">
                  109, 1st Floor Mercantile House K. G Marg,
                  Connaught Place, New Delhi - 110001
                </p>
              </div>
            </div>

            <div className="mb-3 d-flex">
              <FaPhone className="me-3 mt-1" size={20} />
              <div>
                <strong>Phone</strong>
                <p className="mb-0">+91-9654225511</p>
              </div>
            </div>

            <div className="mb-3 d-flex">
              <FaEnvelope className="me-3 mt-1" size={20} />
              <div>
                <strong>Email</strong>
                <p className="mb-0">info@skmystic.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
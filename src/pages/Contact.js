import React, { useState } from "react";
import { FaStreetView, FaPhone, FaEnvelope } from "react-icons/fa";

function Contact() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  // 🔥 Handle Input + Live Validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    let error = "";

    // Required validation
    if (!value.trim()) {
      error = "This field is required.";
    }

    // Email validation
    else if (
      name === "email" &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
    ) {
      error = "Please enter a valid email address.";
    }

    // Name validation
    else if (name === "name" && value.trim().length < 3) {
      error = "Name must be at least 3 characters.";
    }

    // Message validation
    else if (name === "message" && value.trim().length < 10) {
      error = "Message must be at least 10 characters.";
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // 🔒 Submit Validation
  const validate = () => {
    let newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Message
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // 🔥 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

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

        setFormData({
          name: "",
          email: "",
          message: "",
        });

        setErrors({});
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
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Your name</label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />

                {errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email address</label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>

              {/* Message */}
              <div className="mb-3">
                <label className="form-label">Message</label>

                <textarea
                  name="message"
                  className="form-control"
                  rows="5"
                  placeholder="Your message here..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>

                {errors.message && (
                  <small className="text-danger">{errors.message}</small>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-dark px-4"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit →"}
              </button>

              {/* Response Message */}
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

            {/* Address */}
            <div className="mb-3 d-flex">
              <FaStreetView className="me-3 mt-1" size={20} />

              <div>
                <strong>Address</strong>

                <p className="mb-0">
                  109, 1st Floor Mercantile House K. G Marg,
                  Connaught Place, New Delhi - 110001
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="mb-3 d-flex">
              <FaPhone className="me-3 mt-1" size={20} />

              <div>
                <strong>Phone</strong>

                <p className="mb-0">+91-9654225511</p>
              </div>
            </div>

            {/* Email */}
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
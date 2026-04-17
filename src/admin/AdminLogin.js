import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        let error = "";

        if (!value.trim()) {
            error = "This field is required.";
        } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
            error = "Please enter a valid email address.";
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "This field is required.";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!form.password.trim()) {
            newErrors.password = "This field is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const payload = {
                email: form.email,
                password: form.password,
            };


            const res = await fetch("https://harsh.skmysticastrologer.in/CodeIgniter/api/login-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data && data.status === true) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                const role = data?.user?.role;

                if (role === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    alert("Only admin can login here");
                }
            } else {
                alert("❌ " + (data.message || "Login failed"));
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow" style={{ width: "100%", maxWidth: "420px" }}>
                <div className="card-body p-4">
                    <h3 className="text-center mb-4">Admin Login</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                name="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter Email"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

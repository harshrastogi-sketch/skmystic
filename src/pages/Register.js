import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    // 🔥 Handle input + live validation
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

        let error = "";

        // Required validation
        if (!value) {
            error = "This field is required.";
        }

        // Email validation
        else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
            error = "Please enter a valid email address.";
        }

        setErrors({
            ...errors,
            [name]: error
        });
    };

    // 🔒 Submit validation (backup)
    const validate = () => {
        let newErrors = {};

        if (!form.name) newErrors.name = "This field is required.";
        if (!form.email) newErrors.email = "This field is required.";
        if (!form.password) newErrors.password = "This field is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            try {
                const res = await fetch("https://harsh.skmysticastrologer.in/CodeIgniter/api/insert-user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                });

                const data = await res.json();

                if (data.status) {
                    navigate("/dashboard", { state: { userId: data.user_id } });
                } else {
                    alert("❌ " + data.message);
                }

            } catch (error) {
                console.error(error);
                alert("Server error");
            }
        }
    };

    return (
        <div className="register-page">

            <div className="register-container">

                {/* Left Form */}
                <form className="register-box" onSubmit={handleSubmit}>
                    <h2>Create account</h2>
                    <p>Please register below account detail</p>

                    {/* Name */}
                    <label>Enter Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="First name"
                        value={form.name}
                        onChange={handleChange}
                    />
                    {errors.name && <span className="error">{errors.name}</span>}

                    {/* Email */}
                    <label>Enter Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span className="error">{errors.email}</span>}

                    {/* Password */}
                    <label>Enter Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    {errors.password && <span className="error">{errors.password}</span>}

                    <button type="submit" className="create-btn">
                        Create
                    </button>
                </form>

                {/* Right Side */}
                <div className="login-box">
                    <p>Already an account holder?</p>

                    <button onClick={() => navigate("/login")} className="login-btn">Log in</button>

                    <p className="terms">
                        * Terms & conditions. <br />
                        Your privacy and security are important to us. For more information on how we use your data read our <span>privacy policy</span>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;
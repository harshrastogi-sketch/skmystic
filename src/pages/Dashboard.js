import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";


function Dashboard() {


    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        house: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        address: ""
    });

    // ✅ Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;
    // ✅ Fetch user data
    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            const data = await apiRequest(
                "https://harsh.skmysticastrologer.in/CodeIgniter/api/users",
                {
                    method: "GET",
                }
            );

            // 🔥 if token expired → apiRequest already redirected
            if (!data) return;

            console.log("API RESPONSE:", data);

            if (data.status && data.data.length > 0) {
                const userData = data.data.find((u) => u.id === userId);

                if (!userData) return;

                setForm({
                    name: userData.name || "",
                    email: userData.email || "",
                    mobile: userData.mobile || "",
                    house: userData.house || "",
                    street: userData.street || "",
                    city: userData.city || "",
                    state: userData.state || "",
                    pincode: userData.pincode || "",
                    country: userData.country || "",
                    address: userData.address || "",
                });
            }
        };

        fetchUser();
    }, [userId]);

    // ✅ Handle input
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ✅ Submit (for update later)
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        alert("Profile Updated ✅");
    };

    const handleLogout = async () => {
        try {
            await fetch("https://harsh.skmysticastrologer.in/CodeIgniter/api/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
        } catch (error) {
            console.error("Logout error:", error);
        }

        // ✅ Always clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const handleorders = () => {
        navigate("/my-order", {
            state: { userId }
        });
    };

    return (
        <div className="dashboard">

            <div className="top-banner">
                <span>Home | User Dashboard</span>
            </div>

            <div className="main-container">

                <div className="sidebar">
                    <div className="sidebar-title">Dashboard</div>
                    <ul>
                        <li className="active">My Profile</li>
                        <li onClick={handleorders}>My Order</li>
                        <li onClick={handleLogout}>Sign Out</li>
                    </ul>
                </div>

                <div className="content">

                    <div className="content-header">
                        EDIT USER PROFILE
                    </div>

                    <form onSubmit={handleSubmit} className="form-section">

                        <div className="profile-left">
                            <div className="profile-img-box">
                                <img src="https://www.skmystic.com/assets/user/user.png" alt="profile" />
                            </div>
                            <input
                                type="file"
                                name="foto"
                                style={{ marginBottom: "20px", marginTop: "5px" }}
                            />

                            <input type="hidden" name="fotos" value="user.png" />
                        </div>

                        <div className="profile-right">

                            <div className="row">
                                <div>
                                    <label>User Name</label>
                                    <input name="name" value={form.name} onChange={handleChange} />
                                </div>

                                <div>
                                    <label>Email Id</label>
                                    <input name="email" value={form.email} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row">
                                <div>
                                    <label>Mobile</label>
                                    <input name="mobile" value={form.mobile} onChange={handleChange} />
                                </div>

                                <div>
                                    <label>House No</label>
                                    <input name="house" value={form.house} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row">
                                <div>
                                    <label>Street No</label>
                                    <input name="street" value={form.street} onChange={handleChange} />
                                </div>

                                <div>
                                    <label>City</label>
                                    <input name="city" value={form.city} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row">
                                <div>
                                    <label>State</label>
                                    <input name="state" value={form.state} onChange={handleChange} />
                                </div>

                                <div>
                                    <label>Pincode</label>
                                    <input name="pincode" value={form.pincode} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row">
                                <div>
                                    <label>Country</label>
                                    <input name="country" value={form.country} onChange={handleChange} />
                                </div>

                                <div>
                                    <label>Address</label>
                                    <textarea name="address" value={form.address} onChange={handleChange}></textarea>
                                </div>
                            </div>

                            <button className="submit-btn">SUBMIT</button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;
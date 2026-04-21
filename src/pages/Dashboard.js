import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
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

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // ✅ Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    // ===========================
    // ✅ FETCH USER DATA
    // ===========================
    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            const data = await apiRequest(
                "https://harsh.skmysticastrologer.in/CodeIgniter/api/users",
                { method: "GET" }
            );

            if (!data) return;

            if (data.status && data.data.length > 0) {
                const userData = data.data.find((u) => u.id === userId);
                if (!userData) return;

                setForm({
                    name: userData.name ?? storedUser.name ?? "",
                    email: userData.email ?? storedUser.email ?? "",
                    mobile: userData.mobile ?? storedUser.mobile ?? "",
                    house: userData.house ?? storedUser.house ?? "",
                    street: userData.street ?? storedUser.street ?? "",
                    city: userData.city ?? storedUser.city ?? "",
                    state: userData.state ?? storedUser.state ?? "",
                    pincode: userData.pincode ?? storedUser.pincode ?? "",
                    country: userData.country ?? storedUser.country ?? "",
                    address: userData.address ?? storedUser.address ?? "",
                });
            }
        };

        fetchUser();
    }, [userId]);

    // ===========================
    // ✅ HANDLE INPUT
    // ===========================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ===========================
    // ✅ HANDLE IMAGE
    // ===========================
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    // ===========================
    // ✅ SUBMIT PROFILE
    // ===========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();

            // append text fields
            Object.keys(form).forEach((key) => {
                formData.append(key, form[key]);
            });

            // append image
            if (image) {
                formData.append("profile_image", image);
            }

            const res = await fetch(
                "http://localhost/CodeIgniter/api/update-profile",
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + token
                    },
                    body: formData
                }
            );

            const data = await res.json();

            console.log("UPDATE RESPONSE:", data);

            if (data.status) {
                alert("Profile Updated ✅");

                const updatedUser = {
                    ...storedUser,
                    ...data.user
                };

                localStorage.setItem("user", JSON.stringify(updatedUser));

                // update preview with new image
                if (data.user?.profile_image) {
                    setPreview(
                        `http://localhost/CodeIgniter/uploads/users/${data.user.profile_image}`
                    );
                }

            } else {
                alert(data.message || "Update failed ❌");
            }

        } catch (error) {
            console.error("Update Error:", error);
            alert("Something went wrong ❌");
        }
    };

    // ===========================
    // ✅ LOGOUT
    // ===========================
    const handleLogout = async () => {
        try {
            await fetch(
                "https://harsh.skmysticastrologer.in/CodeIgniter/api/logout",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
        } catch (error) {
            console.error("Logout error:", error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const handleorders = () => {
        navigate("/my-order", { state: { userId } });
    };

    return (
        <div className="dashboard">

            <div className="top-banner">
                <span>Home | User Dashboard</span>
            </div>

            <div className="main-container">

                {/* Sidebar */}
                <div className="sidebar">
                    <div className="sidebar-title">Dashboard</div>
                    <ul>
                        <li className="active">My Profile</li>
                        <li onClick={handleorders}>My Order</li>
                        <li onClick={handleLogout}>Sign Out</li>
                    </ul>
                </div>

                {/* Content */}
                <div className="content">

                    <div className="content-header">
                        EDIT USER PROFILE
                    </div>

                    <form onSubmit={handleSubmit} className="form-section">

                        {/* LEFT */}
                        <div className="profile-left">
                            <div className="profile-img-box">
                                <img
                                    src={
                                        preview
                                            ? preview
                                            : storedUser?.profile_image
                                                ? `http://localhost/CodeIgniter/uploads/users/${storedUser.profile_image}`
                                                : "https://www.skmystic.com/assets/user/user.png"
                                    }
                                    alt="profile"
                                />
                            </div>

                            <input
                                type="file"
                                name="profile_image"
                                onChange={handleFileChange}
                                style={{ marginBottom: "20px", marginTop: "5px" }}
                            />
                        </div>

                        {/* RIGHT */}
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
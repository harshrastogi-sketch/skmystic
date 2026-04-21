import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function Dashboard() {
    const navigate = useNavigate();

    const BASE_URL = "https://harsh.skmysticastrologer.in/CodeIgniter/";

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

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    // ===========================
    // FETCH USER DATA
    // ===========================
    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            const data = await apiRequest(
                `${BASE_URL}api/userprofile`,
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            if (!data || !data.status) return;

            const userData = data.data;

            setForm({
                name: userData.name ?? "",
                email: userData.email ?? "",
                mobile: userData.mobile ?? "",
                house: userData.house ?? "",
                street: userData.street ?? "",
                city: userData.city ?? "",
                state: userData.state ?? "",
                pincode: userData.pincode ?? "",
                country: userData.country ?? "",
                address: userData.address ?? ""
            });

            if (userData.profile_image) {
                setPreview(`${BASE_URL}uploads/users/${userData.profile_image}`);
            }
        };

        fetchUser();
    }, [userId]);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setImage(file);

        // remove old preview if blob
        if (preview && preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }

        const newPreview = URL.createObjectURL(file);
        setPreview(newPreview);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();

            Object.keys(form).forEach((key) => {
                formData.append(key, form[key]);
            });

            if (image) {
                formData.append("profile_image", image);
            }

            const res = await fetch(`${BASE_URL}api/update-profile`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token
                },
                body: formData
            });

            const data = await res.json();

            if (data.status) {
                alert("Profile Updated ");

                const updatedUser = {
                    ...storedUser,
                    ...data.user
                };

                localStorage.setItem("user", JSON.stringify(updatedUser));


                if (data.user?.profile_image) {
                    setPreview(
                        `${BASE_URL}uploads/users/${data.user.profile_image}`
                    );
                }

                setImage(null); // reset file
            } else {
                alert(data.message || "Update failed ❌");
            }

        } catch (error) {
            console.error("Update Error:", error);
            alert("Something went wrong ❌");
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${BASE_URL}api/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
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
                                            : "https://www.skmystic.com/assets/user/user.png"
                                    }
                                    alt="profile"
                                />
                            </div>

                            <input
                                type="file"
                                name="profile_image"
                                onChange={handleFileChange}
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
                                    <label>Email</label>
                                    <input name="email" value={form.email} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row">
                                <div>
                                    <label>Mobile</label>
                                    <input name="mobile" value={form.mobile} onChange={handleChange} />
                                </div>

                                <div>
                                    <label>House</label>
                                    <input name="house" value={form.house} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row">
                                <div>
                                    <label>Street</label>
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
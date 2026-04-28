import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function AddBlog() {
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        content: "",
        date: "",
        status: "1",
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("title", formData.title);
        data.append("author", formData.author);
        data.append("description", formData.description);
        data.append("content", formData.content);
        data.append("date", formData.date);
        data.append("status", formData.status);

        if (image) {
            data.append("image", image);
        }

        try {
            setLoading(true);

            const res = await fetch(`${BASE_URL}blogs/store`, {
                method: "POST",
                body: data,
            });

            const result = await res.json();
            console.log("Add blog response:", result);

            if (result.status === true) {
                alert(result.message || "Blog added successfully");
                navigate("/admin/blog");
            } else {
                alert(result.message || "Failed to add blog");
            }
        } catch (error) {
            console.log("Add blog error:", error);
            alert("Error adding blog");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Add Blog</h2>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/blog")}
                >
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Author</label>
                    <input
                        type="text"
                        name="author"
                        className="form-control"
                        value={formData.author}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>

                    <CKEditor
                        editor={ClassicEditor}
                        data={formData.description || ""}
                        onChange={(event, editor) => {
                            const data = editor.getData();

                            setFormData((prev) => ({
                                ...prev,
                                description: data,
                            }));
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                        name="content"
                        className="form-control"
                        rows="6"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                        name="status"
                        className="form-control"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Add Blog"}
                </button>
            </form>
        </div>
    );
}

export default AddBlog;
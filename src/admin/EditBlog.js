import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AdminLayout from "./AdminLayout";

function EditBlog() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [altText, setAltText] = useState("");
    const [content, setContent] = useState("");
    const [blogImage, setBlogImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;

        if (!token || !user || user.role !== "admin") {
            navigate("/admin");
            return;
        }

        fetchBlog(token);
    }, [id, navigate]);

    const fetchBlog = async (token) => {
        try {
            const res = await fetch(`${BASE_URL}api/blogs/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (data.status && data.data) {
                const blog = data.data;

                setTitle(blog.title || "");
                setAuthor(blog.author || "");
                setShortDescription(blog.description || "");
                setContent(blog.content || "");

                if (blog.image) {
                    const imageUrl =
                        blog.image.startsWith("http://") || blog.image.startsWith("https://")
                            ? blog.image
                            : `${BASE_URL}${blog.image}`;
                    setPreview(imageUrl);
                }
            } else {
                alert(data.message || "Blog not found");
                navigate("/admin/blog");
            }
        } catch (error) {
            console.log("Fetch blog error:", error);
            alert("Failed to load blog");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setBlogImage(file || null);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Blog title is required");
            return;
        }

        if (!author.trim()) {
            alert("Author name is required");
            return;
        }

        if (!shortDescription.trim()) {
            alert("Short description is required");
            return;
        }

        if (!content.trim()) {
            alert("Blog content is required");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("title", title);
            formData.append("author", author);
            formData.append("description", shortDescription);
            formData.append("content", content);

            if (blogImage) {
                formData.append("image", blogImage);
            }

            const res = await fetch(`${BASE_URL}api/update-blog/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (data.status) {
                alert("Blog updated successfully");
                navigate("/admin/blog");
            } else {
                alert(data.message || "Update failed");
            }
        } catch (error) {
            console.log("Update blog error:", error);
            alert("Something went wrong while updating blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container py-4">
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-white">
                        <h3 className="mb-0 text-info fw-bold">Edit Blog</h3>
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3 row align-items-center">
                                <label className="col-sm-3 col-form-label">Blog Title</label>
                                <div className="col-sm-9">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter blog title"
                                    />
                                </div>
                            </div>

                            <div className="mb-3 row align-items-center">
                                <label className="col-sm-3 col-form-label">Blog Author Name</label>
                                <div className="col-sm-9">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="Enter author name"
                                    />
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-3 col-form-label">Blog Short Description</label>
                                <div className="col-sm-9">
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={shortDescription}
                                        onChange={(e) => setShortDescription(e.target.value)}
                                        placeholder="Enter short description"
                                    />
                                </div>
                            </div>

                            <div className="mb-3 row align-items-center">
                                <label className="col-sm-3 col-form-label">Blog Image</label>
                                <div className="col-sm-9">
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>

                            {preview && (
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">Preview</label>
                                    <div className="col-sm-9">
                                        <img
                                            src={preview}
                                            alt="Blog Preview"
                                            style={{
                                                width: "180px",
                                                height: "90px",
                                                objectFit: "contain",
                                                border: "1px solid #ddd",
                                                borderRadius: "4px",
                                                padding: "4px",
                                                background: "#fff",
                                            }}
                                        />
                                    </div>
                                </div>
                            )}


                            {/* Blog Description FULL WIDTH */}
                            <div className="mb-3 row">
                                <label className="col-sm-3 col-form-label">Blog Description</label>

                                <div className="col-sm-9">
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={content || ""}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setContent(data);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-9 offset-sm-3 d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-info text-white px-4"
                                        disabled={loading}
                                    >
                                        {loading ? "Updating..." : "Update"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary px-4"
                                        onClick={() => navigate("/admin/blog")}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditBlog;
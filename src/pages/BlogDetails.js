import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

const BlogDetails = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchBlog();
    fetchRecent();
  }, [slug]);

  const fetchBlog = async () => {
    const res = await fetch(`${BASE_URL}api/blog-details/${slug}`);
    const data = await res.json();

    if (data?.status) {
      setBlog(data.data);
    }
  };

  const fetchRecent = async () => {
    const res = await fetch(`${BASE_URL}blogs`);
    const data = await res.json();

    if (data?.status) {
      setRecentBlogs(data.data);
    } else {
      setRecentBlogs([]);
    }
  };

  const getImage = (img) => {
    if (!img) return "/no-image.png";
    return img.startsWith("http") ? img : BASE_URL + img;
  };

  if (!blog) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <>
      {/* ✅ Breadcrumb (LIKE YOUR DESIGN) */}
      <Breadcrumb title={blog?.title} />

      <div className="container my-5">
        <div className="row">

          {/* ✅ LEFT SIDEBAR */}
          <div className="col-xl-3 col-lg-4 col-md-12 mb-4">
            <h5 className="mb-4">Recent post</h5>

            {recentBlogs.map((item) => (
              <Link
                to={`/blog/${item.slug}`}
                key={item.id}
                className="d-flex mb-3 text-decoration-none text-dark"
              >
                <img
                  src={getImage(item.image)}
                  alt={item.title}
                  className="me-3 rounded"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                  }}
                />

                <div>
                  <small className="text-muted d-block">
                    {item.date}
                  </small>
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* ✅ RIGHT MAIN CONTENT */}
          <div className="col-xl-9 col-lg-8 col-md-12">

            {/* Blog Image */}
            <img
              src={getImage(blog.image)}
              alt={blog.title}
              className="img-fluid w-100 mb-4"
              style={{
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />

            {/* Title */}
            <h2 className="mb-2">{blog.title}</h2>

            {/* Meta */}
            <div className="text-muted mb-3">
              <small>{blog.date}</small> • <small>By Admin</small>
            </div>

            {/* Description */}
            <div
              style={{ lineHeight: "1.7", fontSize: "15px" }}
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />

          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
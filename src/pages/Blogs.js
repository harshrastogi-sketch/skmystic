import React, { useEffect, useState } from "react";
import "./Blogs.css";
import Breadcrumb from "../components/Breadcrumb";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  const BASE_URL = "https://harsh.skmysticastrologer.in/CodeIgniter/";

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetch(BASE_URL + "blogs");
        const result = await response.json();

        if (result.status) {
          setBlogs(result.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    getBlogs();
  }, []);

  // ✅ Safe image handler
  const getImage = (img) => {
    if (!img) return "/no-image.png";

    return img.startsWith("http")
      ? img
      : BASE_URL + img;
  };

  // ✅ Short text
  const shortText = (text, limit = 100) => {
    if (!text) return "";
    return text.length > limit
      ? text.substring(0, limit) + "..."
      : text;
  };

  return (
    <div className="blogs-page">


      <div className="blogs-wrapper">
        {blogs.map((blog, index) => (
          <div className="blog-card" key={blog.id}>

            <div className="blog-badge">{index + 1}</div>

            <div className="blog-image-wrap">
              <img
                src={getImage(blog.image)}
                alt={blog.title}
                className="blog-image"
                onError={(e) => (e.target.src = "/no-image.png")}
              />
            </div>

            <div className="blog-content">
              <h3 className="blog-title">{blog.title}</h3>

              <p className="blog-author">
                By <strong>{blog.author || "Admin"}</strong>
              </p>

              <p className="blog-description">
                {shortText(blog.description)}
              </p>

              {/* ✅ FIXED LINK */}
              <Link
                to={`/blog/${blog.slug || blog.id}`}
                className="blog-readmore"
              >
                Read more <span>→</span>
              </Link>

              <div className="blog-footer">
                <span>{blog.date}</span>
                <span>{blog.comments || "0 Comments"}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
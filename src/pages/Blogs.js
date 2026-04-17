import React, { useEffect, useState } from "react";
import "./Blogs.css";
import Breadcrumb from "../components/Breadcrumb";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetch("https://harsh.skmysticastrologer.in/CodeIgniter/blogs");
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

  return (
    <div className="blogs-page">
      <div className="blogs-wrapper">
        {blogs.map((blog,index) => (
          <div className="blog-card" key={blog.id}>
            <div className="blog-badge">{index + 1}</div>

            <div className="blog-image-wrap">
              <img src={`https://harsh.skmysticastrologer.in/CodeIgniter/${blog.image}`} alt={blog.title} className="blog-image" />
            </div>

            <div className="blog-content">
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-author">
                By <strong>{blog.author}</strong>
              </p>
              <p className="blog-description">{blog.description}</p>

              <a href="/" className="blog-readmore">
                Read more <span>→</span>
              </a>

              <div className="blog-footer">
                <span>{blog.date}</span>
                <span>{blog.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
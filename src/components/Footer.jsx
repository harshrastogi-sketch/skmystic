import React, { useEffect, useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";


const Footer = () => {

  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}categories`);
        const data = await res.json();

        const activeCategories = (data.data || []).filter(
          (item) => String(item.status) === "1"
        );

        setCategories(activeCategories);
      } catch (err) {
        console.log(err);
      }
    };

    getCategories();
  }, []);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email",
      });

      return;
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter valid email address",
      });

      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}newsletter-subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (data.status === true) {
        Swal.fire({
          icon: "success",
          title: "Thank You!",
          text: "You are subscribed successfully.",
        });

        setEmail("");
      } else {
        Swal.fire({
          icon: "info",
          title: "Already Subscribed",
          text: data.message || "This email already exists",
        });
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };
  const newsletterBg = "https://www.skmystic.com/assets/image/newsletter-image.webp";
  return (
    <>
      {/* Newsletter Section */}
      <section
        className="newsletter"
        style={{ backgroundImage: `url(${newsletterBg})` }}
      >
        <div className="newsletter-content">
          <h2>Newsletter</h2>
          <p>
            Subscribe our newsletter and <br />
            get 30% super discount
          </p>

          <div className="newsletter-input">
            <input type="email" placeholder="Enter Your Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={handleSubscribe} disabled={loading}>{loading ? "..." : "➤"}</button>
          </div>
        </div>
      </section>

      {/* Footer Main */}
      <footer className="footer">
        <div className="footer-container">

          {/* Column 1 */}
          <div className="footer-col">
            <h3 className="logo">SK MYSTIC</h3>
            <p>
              109, 1st Floor Mercantile House K. G Marg,
              Connaught Place, New Delhi- 110001.
            </p>
            <p>+91-9654225511</p>
            <p>info@skmystic.com</p>
          </div>

          {/* Column 2 */}
          <div className="footer-col">
            <h4>Astrology</h4>
            <ul>
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/collection?category=${cat.slug || cat.name}`} onClick={() => window.scrollTo(0, 0)} className="text-white text-decoration-none">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h4>Quick Link</h4>
            <ul>
              <li><Link to="/policies/privacy" onClick={() => window.scrollTo(0, 0)} className="text-white text-decoration-none">Privacy Policy</Link></li>
              <li><Link to="/policies/terms" onClick={() => window.scrollTo(0, 0)} className="text-white text-decoration-none">Terms & Conditions</Link></li>
              <li><Link to="/policies/shipping" onClick={() => window.scrollTo(0, 0)} className="text-white text-decoration-none">Shipping / Delivery Policy</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="footer-col">
            <h4>Helpful Link</h4>
            <ul>
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-white text-decoration-none" >About Us</Link></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="text-white text-decoration-none" >Contact Us</Link></li>
              <li><Link to="/faq" onClick={() => window.scrollTo(0, 0)} className="text-white text-decoration-none" >Faq's</Link></li>
              <li><Link to="/blogs" onClick={() => window.scrollTo(0, 0)} className="text-white text-decoration-none" >Blog</Link></li>
            </ul>
          </div>

          {/* Column 5 */}
          <div className="footer-col">
            <h4>Social Media</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><span>f</span></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><span>t</span></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><span>in</span></a>
            </div>
          </div>

        </div>

        <div className="copyright">
          Copyright 2026 SKMystic
        </div>
      </footer>
    </>
  );
};

export default Footer;
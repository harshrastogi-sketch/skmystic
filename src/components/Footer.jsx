import React, { useEffect, useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";


const Footer = () => {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(
          "https://harsh.skmysticastrologer.in/CodeIgniter/categories"
        );
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
            <input type="email" placeholder="Enter Your Email Address" />
            <button>➤</button>
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
              <li><Link to="/privacy-policy"  onClick={() => window.scrollTo(0, 0)} className="text-white text-decoration-none">Privacy Policy</Link></li>
              <li><Link to="/terms" onClick={() => window.scrollTo(0, 0)} className="text-white text-decoration-none">Terms & Conditions</Link></li>
              <li><Link to="/shipping" onClick={() => window.scrollTo(0, 0)} className="text-white text-decoration-none">Shipping / Delivery Policy</Link></li>
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
          Copyright 2023 SKMystic
        </div>
      </footer>
    </>
  );
};

export default Footer;
import React from "react";
import "./Footer.css";



const Footer = () => {
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
              <li>Gems and Rings</li>
              <li>Rudraksh</li>
              <li>Isht Dev</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h4>Quick Link</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Shipping / Delivery Policy</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="footer-col">
            <h4>Helpful Link</h4>
            <ul>
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Faq's</li>
              <li>Blog</li>
            </ul>
          </div>

          {/* Column 5 */}
          <div className="footer-col">
            <h4>Social Media</h4>
            <div className="social-icons">
              <span>f</span>
              <span>t</span>
              <span>in</span>
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
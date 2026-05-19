import banner from "../assets/banner-collection.webp";
import "./Breadcrumb.css";
import { Link } from "react-router-dom";

const Breadcrumb = ({ title }) => {
  return (
    <section
      className="breadcrumb"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="breadcrumb-overlay">
        <h2>
          <Link to="/" className="breadcrumb-link">
            Home
          </Link>

          <span> | </span>

          {title}
        </h2>
      </div>
    </section>
  );
};

export default Breadcrumb;
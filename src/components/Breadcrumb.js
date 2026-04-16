import banner from "../assets/banner-collection.webp";
import "./Breadcrumb.css";

const Breadcrumb = ({ title }) => {
  return (
    <section
      className="breadcrumb"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="breadcrumb-overlay">
        <h2>
          Home <span>|</span> {title}
        </h2>
      </div>
    </section>
  );
};

export default Breadcrumb;
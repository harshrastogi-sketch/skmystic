import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

const AboutUs = () => {
  const [aboutData, setAboutData] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchAboutUs = async () => {
    try {
      const res = await fetch(`${BASE_URL}about-us_users`);
      const data = await res.json();

      if (data.status) {
        setAboutData(data.data);
      } else {
        setAboutData([]);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to load About Us", "error");
    }
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

  return (
    <div className="container my-5 about-us-page">
      <style>
        {`
          .about-description img {
            max-width: 100%;
            height: auto;
            display: block;
            border-radius: 8px;
            margin: 10px 0;
          }

          .about-description figure {
            margin: 0;
            max-width: 100%;
          }

          .about-description .image {
            max-width: 100%;
          }

          .about-description p {
            margin-bottom: 10px;
          }
        `}
      </style>

      <h2 className="text-center mb-4">About Us</h2>

      <div className="card shadow-sm p-4">
        {aboutData.length > 0 ? (
          aboutData.map((item) => (
            <div key={item.id} className="mb-4">
              <h4 className="mb-3">{item.heading}</h4>

              <div
                className="about-description"
                dangerouslySetInnerHTML={{
                  __html: item.description || "",
                }}
              />
            </div>
          ))
        ) : (
          <p className="text-center mb-0">No About Us content available</p>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
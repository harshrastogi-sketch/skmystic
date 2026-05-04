import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const PolicyPage = () => {
  const { type } = useParams(); // privacy / terms / shipping
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [policy, setPolicy] = useState(null);

  const fetchPolicy = async () => {
    try {
      const res = await fetch(`${BASE_URL}policies/getByType/${type}`);
      const data = await res.json();

      setPolicy(data);
    } catch (err) {
      Swal.fire("Error", "Failed to load policy", "error");
    }
  };

  useEffect(() => {
    fetchPolicy();
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">

        {/* SAME UI AS YOUR DESIGN */}
        <h2 className="text-center mb-4">
          {policy?.heading || "Loading..."}
        </h2>

        {policy ? (
          <div
            dangerouslySetInnerHTML={{
              __html: policy.description,
            }}
          />
        ) : (
          <p>Loading...</p>
        )}

      </div>
    </div>
  );
};

export default PolicyPage;
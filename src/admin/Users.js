import React, { useEffect, useState } from "react";

function Users() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const IMAGE_BASE = `${BASE_URL}uploads/users/`;

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(BASE_URL + "api/allusers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);

      if (data.status) {
        setUsers(data.data);
      } else {
        alert( data.message);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Image URL builder (no fallback)
  const getImage = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return IMAGE_BASE + img;
  };

  return (
    <div className="container mt-4">
      <h2>Users</h2>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => {
                const imageUrl = getImage(user.profile_image);

                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>

                    {/* ✅ Only show image if exists */}
                    <td>
                      {imageUrl ? (
                        <img src={imageUrl} alt="profile" width="50" height="50" style={{ borderRadius: "50%", objectFit: "cover", border: "1px solid #ddd",}}/>
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>

                    <td>{user.name}</td>
                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`badge ${
                          user.role === "admin"
                            ? "bg-danger"
                            : "bg-primary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>{user.created_at}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No Users Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
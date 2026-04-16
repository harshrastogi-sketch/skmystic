import React from "react";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

function AdminLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminHeader />

      <div className="flex-grow-1">
        {children}
      </div>

      <AdminFooter />
    </div>
  );
}

export default AdminLayout;
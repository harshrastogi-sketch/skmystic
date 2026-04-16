import React from "react";

function AdminFooter() {
  return (
    <div className="bg-light text-center py-2 mt-auto border-top">
      <small>© {new Date().getFullYear()} Admin Panel</small>
    </div>
  );
}

export default AdminFooter;
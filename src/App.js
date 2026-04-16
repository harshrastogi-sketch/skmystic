import { useState } from "react";
import Header from "./components/Header";
import Breadcrumb from "./components/Breadcrumb";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home";
import Astrology from "./pages/Astrology";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import Collection from "./pages/Collection";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import MyOrder from "./pages/MyOrder";
import ViewCart from "./pages/ViewCart";



// admin
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import Products from "./admin/Products";
import EditProduct from "./admin/EditProduct";
import Orders from "./admin/Orders";
import Users from "./admin/Users";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isAdminRoute = location.pathname.startsWith("/admin"); // ✅ NEW

  const breadcrumbTitles = {
    "/astrology": "Astrology",
    "/blogs": "Blogs",
    "/contact": "Contact",
    "/register": "Register",
    "/login": "Login",
    "/dashboard": "User Dashboard",
    "/collection": "Collection",
    "/checkout": "Your checkout",
    "/my-order": "Order History",
    "/viewCart": "Your shopping cart",
  };

  const breadcrumbTitle = breadcrumbTitles[location.pathname];

  return (
    <>
      {/* ✅ Hide Header in Admin */}
      {!isAdminRoute && <Header setIsCartOpen={setIsCartOpen} />}

      {/* ✅ Hide Breadcrumb in Admin */}
      {!isAdminRoute && !isHomePage && breadcrumbTitle && (
        <Breadcrumb title={breadcrumbTitle} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/astrology" element={<Astrology />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-order" element={<MyOrder />} />
        <Route path="/viewCart" element={<ViewCart />} />

        {/* ✅ ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/add-product" element={<AdminLayout><AddProduct /></AdminLayout>} />
        <Route path="/admin/Products" element={<AdminLayout><Products /></AdminLayout>} />
        <Route path="/admin/edit-product/:id" element={<AdminLayout><EditProduct /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><Orders /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>}/>

      </Routes>

      {/* ✅ Hide Footer in Admin */}
      {!isAdminRoute && <Footer />}

      {/* ✅ Hide Cart in Admin */}
      {!isAdminRoute && (
        <CartDrawer
          isOpen={isCartOpen}
          setIsOpen={setIsCartOpen}
        />
      )}
    </>
  );
}

export default App;
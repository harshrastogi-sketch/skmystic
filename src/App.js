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
import Privacypolicy from "./pages/Privacypolicy";
import Terms from "./pages/Terms";
import Shipping from "./pages/Shipping";
import Faq from "./pages/Faq";
import BlogDetails from "./pages/BlogDetails";



// admin
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import AddProductImages from "./admin/AddProductImages";
import Products from "./admin/Products";
import EditProduct from "./admin/EditProduct";
import Orders from "./admin/Orders";
import Users from "./admin/Users";
import AdminLogin from "./admin/AdminLogin";
import Banner from "./admin/Banner";
import EditBanner from "./admin/EditBanner";
import AddBanner from "./admin/AddBanner";
import AdminBlog from "./admin/AdminBlog";
import EditBlog from "./admin/EditBlog";
import AddBlog from "./admin/AddBlog";
import AddCategory from "./admin/AddCategory";
import EditCategory from "./admin/EditCategory";
import Category from "./admin/Category";
import AddBrand from "./admin/AddBrand";
import EditBrand from "./admin/EditBrand";
import Brand from "./admin/Brand";
import AdminProductDetails from "./admin/AdminProductDetails";




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
    "/privacy-policy": "Privacy Policy",
    "/terms": "Terms & Conditions",
    "/shipping": "Shipping/Delivery Policy",
    "/about": "About Us",
    "/faq": "Faq",
  };

  const breadcrumbTitle = breadcrumbTitles[location.pathname];

  return (
    <>
      {/* ✅ Hide Header in Admin */}
      {!isAdminRoute && <Header setIsCartOpen={setIsCartOpen} />}

      {/* ✅ Hide Breadcrumb in Admin */}
      {!isAdminRoute && !isHomePage && breadcrumbTitle && location.pathname !== "/blog/:slug" && (
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
        <Route path="/privacy-policy" element={<Privacypolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />

        {/* ✅ ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/add-product" element={<AdminLayout><AddProduct /></AdminLayout>} />
        <Route path="/admin/add-product-images/:id" element={<AdminLayout><AddProductImages /></AdminLayout>} />
        <Route path="/admin/Products" element={<AdminLayout><Products /></AdminLayout>} />
        <Route path="/admin/edit-product/:id" element={<AdminLayout><EditProduct /></AdminLayout>} />
        <Route path="/admin/product-details/:id" element={<AdminLayout><AdminProductDetails /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><Orders /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>} />
        <Route path="/admin/banner" element={<AdminLayout><Banner /></AdminLayout>} />
        <Route path="/admin/edit-banner/:id" element={<AdminLayout><EditBanner /></AdminLayout>} />
        <Route path="/admin/add-banner" element={<AdminLayout><AddBanner /></AdminLayout>} />
        <Route path="/admin/add-blog" element={<AdminLayout><AddBlog /></AdminLayout>} />
        <Route path="/admin/blog" element={<AdminLayout><AdminBlog /></AdminLayout>} />
        <Route path="/admin/edit-blog/:id" element={<AdminLayout><EditBlog /></AdminLayout>} />
        <Route path="/admin/category" element={<AdminLayout><Category /></AdminLayout>} />
        <Route path="/admin/add-category" element={<AdminLayout><AddCategory /></AdminLayout>} />
        <Route path="/admin/edit-category/:id" element={<AdminLayout><EditCategory /></AdminLayout>} />
        <Route path="/admin/brand" element={<AdminLayout><Brand /></AdminLayout>} />
        <Route path="/admin/add-brand" element={<AdminLayout><AddBrand /></AdminLayout>} />
        <Route path="/admin/edit-brand/:id" element={<AdminLayout><EditBrand /></AdminLayout>} />


        <Route path="/admin" element={<AdminLogin />} />

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
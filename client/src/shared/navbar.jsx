// src/shared/navbar.jsx
import React, { useState } from "react";
import "./navbar.css";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Navbar({ user, navigate }) {
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <>
      <header className="dashboard-header">
        <div>
          <div className="dashboard-title">Retail Management Demo</div>
          <div className="dashboard-store">
            {user?.storeName || "My Store"}
          </div>
        </div>

        <nav className="dashboard-nav">
          <button
            className="dashboard-tab dashboard-tab-active"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button
            className="dashboard-tab"
            onClick={() => navigate("/products")}
          >
            Products
          </button>
          <button
            className="dashboard-tab"
            onClick={() => navigate("/cart")}
          >
            Cart
          </button>
          <button
            className="dashboard-tab"
            onClick={() => navigate("/sales-report")}
          >
            Sales Report
          </button>
          <button
            className="dashboard-tab"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Logout
          </button>
        </nav>
      </header>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout from your store?"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

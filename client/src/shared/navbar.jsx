// src/shared/navbar.jsx
import React, { useState } from "react";
import "./navbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Navbar({ user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const path = location.pathname;
  const isActive = (target) =>
    path === target || (target === "/dashboard" && path === "/");

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
            className={
              "dashboard-tab " +
              (isActive("/dashboard") ? "dashboard-tab-active" : "")
            }
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button
            className={
              "dashboard-tab " +
              (isActive("/products") ? "dashboard-tab-active" : "")
            }
            onClick={() => navigate("/products")}
          >
            Products
          </button>
          <button
            className={
              "dashboard-tab " +
              (isActive("/cart") ? "dashboard-tab-active" : "")
            }
            onClick={() => navigate("/cart")}
          >
            Cart
          </button>
          <button
            className={
              "dashboard-tab " +
              (isActive("/sales-report") ? "dashboard-tab-active" : "")
            }
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

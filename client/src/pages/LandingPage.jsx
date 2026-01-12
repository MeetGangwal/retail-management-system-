import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import Footer from "../components/Footer";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="lp-root">
      <header className="lp-header">
        <h1 className="lp-title">Retail Management System</h1>
        <p className="lp-subtitle">
          Complete solution for managing your retail business
        </p>
      </header>

<section className="lp-features">
  <div
    className="lp-card lp-card-clickable"
    onClick={() => navigate("/login")}
  >
    <div className="lp-icon">📊</div>
    <h3>Sales Analytics</h3>
    <p>Track your sales with detailed reports and charts.</p>
  </div>

  <div
    className="lp-card lp-card-clickable"
    onClick={() => navigate("/login")}
  >
    <div className="lp-icon">📦</div>
    <h3>Inventory Management</h3>
    <p>Manage products and stock levels efficiently.</p>
  </div>

  <div
    className="lp-card lp-card-clickable"
    onClick={() => navigate("/login")}
  >
    <div className="lp-icon">🛒</div>
    <h3>Point of Sale</h3>
    <p>Quick and easy checkout process for your customers.</p>
  </div>
</section>


      <section className="lp-actions">
        <button
          className="lp-btn lp-btn-primary"
          onClick={() => navigate('/login')}
        >
          Login as Retailer
        </button>
        <button
          className="lp-btn lp-btn-outline"
          onClick={() => navigate('/signup')}
        >
          Signup as Retailer
        </button>
      </section>
      <footer className="lp-footer">
        <p>© 2025 Retail Management System</p>
        <p>Retailer: retailer@demo.com / demo123</p>
      </footer>
    </div>
  );
}

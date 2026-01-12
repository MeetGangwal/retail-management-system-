import React, { useEffect, useState } from "react";
import { productAPI, orderAPI, reportAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import "./DashboardPage.css";
import Navbar from "../shared/navbar"; // ✅ correct import
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    totalProducts: 0,
    topProduct: "-",
  });
  const [recentOrders, setRecentOrders] = useState([]);

  // NEW: state for logout dialog
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const timeAgo = (dateString) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hours ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} days ago`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsRes = await reportAPI.getSalesAnalytics();
        const analytics = analyticsRes.data;

        const productsRes = await productAPI.getRetailerProducts();
        const products = productsRes.data;

        const ordersRes = await orderAPI.getRetailerOrders();
        const orders = ordersRes.data;

        const topProduct =
          analytics.productSales && analytics.productSales.length > 0
            ? analytics.productSales[0]._id
            : "-";

        setSummary({
          todayRevenue: analytics.today.totalRevenue,
          todayOrders: analytics.today.orderCount,
          totalProducts: products.length,
          topProduct,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-root">
        <p className="dashboard-empty">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-root">
      <header >
        <Navbar               // ✅ use component, not <header>
          user={user}
          navigate={navigate}
        />
      </header>

      {/* Main content */}
      <main className="dashboard-main">
        {/* Heading */}
        <div className="dashboard-heading">
          <div>
            <h1>Retailer Dashboard</h1>
            <p>Overview of your store&apos;s performance</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="dashboard-summary-grid">
          <SummaryCard
            title="Today's Revenue"
            value={formatCurrency(summary.todayRevenue)}
          />
          <SummaryCard
            title="Today's Orders"
            value={summary.todayOrders}
          />
          <SummaryCard
            title="Total Products"
            value={summary.totalProducts}
          />
          <SummaryCard title="Top Product" value={summary.topProduct} />
        </div>

        {/* Recent orders */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Recent Orders</h2>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 500 }}>{order.orderId}</td>
                    <td>{order.items?.length || 0}</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>{timeAgo(order.createdAt)}</td>
                    <td>
                      <span
                        className={`status-pill status-${order.status}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="dashboard-empty">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="summary-card">
    <div className="summary-card-title">{title}</div>
    <div className="summary-card-value">{value}</div>
  </div>
);

export default DashboardPage;

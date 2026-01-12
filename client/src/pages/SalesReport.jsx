import React, { useEffect, useState } from "react";
import { reportAPI, orderAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import "./SalesReport.css";
import Navbar from "../shared/navbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const periods = ["day", "week", "month", "year"];
const COLORS = ["#38bdf8", "#a855f7", "#f97316", "#22c55e", "#e11d48"];

const SalesReport = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activePeriod, setActivePeriod] = useState("day");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // NEW

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

  const loadData = async (period) => {
    try {
      setLoading(true);
      const analyticsRes = await reportAPI.getSalesAnalytics();
      setAnalytics(analyticsRes.data);

      const ordersRes = await orderAPI.getSalesByPeriod(period);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error("Failed to load sales report", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activePeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePeriod]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  if (loading || !analytics) {
    return (
      <div className="sales-root">
        <p className="sales-empty">Loading sales report...</p>
      </div>
    );
  }

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );
  const totalOrders = orders.length;
  const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;

  const productSales = analytics.productSales || [];
  const weeklyData = analytics.weekly || [];

  return (
    <div className="sales-root">
      <header >
        <Navbar
          user={user}
          navigate={navigate}
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />
      </header>

      {/* Logout confirmation dialog */}
      <ConfirmDialog
        open={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout from your store?"
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

      <main className="sales-main">
        {/* Heading and period filters */}
        <div className="sales-heading">
          <h1>Sales Report</h1>
          <div className="sales-period-toggle">
            {periods.map((p) => (
              <button
                key={p}
                className={
                  "sales-period-btn" +
                  (activePeriod === p ? " sales-period-btn-active" : "")
                }
                onClick={() => setActivePeriod(p)}
              >
                {p === "day"
                  ? "Day"
                  : p === "week"
                    ? "Week"
                    : p === "month"
                      ? "Month"
                      : "Year"}
              </button>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="sales-summary-grid">
          <SalesSummaryCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
          />
          <SalesSummaryCard
            title="Total Orders"
            value={totalOrders}
          />
          <SalesSummaryCard
            title="Average Order"
            value={formatCurrency(avgOrder)}
          />
        </div>

        {/* Charts row */}
        <div className="sales-charts-grid">
          {/* Revenue Trend line chart */}
          <section className="sales-panel">
            <h2 className="sales-panel-title">Revenue Trend</h2>
            <div style={{ width: "100%", height: 240 }}>
              {weeklyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="sales-empty">No trend data yet.</p>
              )}
            </div>
          </section>

          {/* Top products pie chart + list */}
          <section className="sales-panel">
            <h2 className="sales-panel-title">Top Products</h2>

            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 220, height: 220 }}>
                {productSales.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productSales}
                        dataKey="revenue"
                        nameKey="_id"
                        // innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {productSales.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={24} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="sales-empty">No product sales yet.</p>
                )}
              </div>

              <ul className="sales-top-products">
                {productSales.length === 0 && (
                  <li className="sales-empty">No product sales yet.</li>
                )}
                {productSales.map((p) => (
                  <li key={p._id} className="sales-top-item">
                    <div>
                      <div className="sales-top-name">{p._id}</div>
                      <div className="sales-top-sub">
                        {p.quantity} sold · {formatCurrency(p.revenue)}
                      </div>
                    </div>
                    <div className="sales-top-badge">
                      {Math.round(p.revenue)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Sales details table */}
        <section className="sales-panel sales-table-panel">
          <h2 className="sales-panel-title">Sales Details</h2>
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
                {orders.map((order) => (
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

                {orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="sales-empty">
                      No orders for this period.
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

const SalesSummaryCard = ({ title, value }) => (
  <div className="sales-summary-card">
    <div className="sales-summary-title">{title}</div>
    <div className="sales-summary-value">{value}</div>
  </div>
);

export default SalesReport;

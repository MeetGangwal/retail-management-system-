import React, { useEffect, useState } from "react";
import { cartAPI, orderAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import "./ProductsPage.css"; // reuse styles
import Navbar from "../shared/navbar";

const CartPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const loadCart = async () => {
    try {
      if (!user?._id) return;
      setCartLoading(true);
      // const res = await cartAPI.getCart(user._id);
      const res = await cartAPI.getCart();
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const syncUpdateCartItem = async (item, quantity) => {
    try {
      await cartAPI.updateCartItem({
        productId: item.productId?._id || item.productId,  // ensure id string
        quantity,
      });
      await loadCart();
    } catch (err) {
      console.error("Failed to update cart item", err);
    }
  };


  const syncRemoveFromCart = async (item) => {
    try {
      await cartAPI.removeFromCart({
        productId: item.productId?._id || item.productId,
      });
      await loadCart();
    } catch (err) {
      console.error("Failed to remove cart item", err);
    }
  };



  const syncClearCart = async () => {
    try {
      // await cartAPI.clearCart({ retailerId: user?._id });
      await cartAPI.clearCart();
      await loadCart();
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  const updateCartQuantity = (item, qty) => {
    const quantity = Math.max(1, Number(qty) || 1);
    syncUpdateCartItem(item, quantity);
  };


  const removeFromCart = (item) => {
    syncRemoveFromCart(item);
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  // const handleLogoutConfirm = () => {
  //   logout();
  //   setShowLogoutConfirm(false);
  //   navigate("/");
  // };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setShowOrderConfirm(false);
      return;
    }
    try {
      setOrderProcessing(true);
      const orderRes = await orderAPI.createOrder({});
      const createdOrder = orderRes.data.order;

      await orderAPI.processPayment({
        orderId: createdOrder._id,
        paymentStatus: "completed",
      });

      await loadCart();
      setShowOrderConfirm(false);
    } catch (err) {
      console.error("Failed to place order", err);
    } finally {
      setOrderProcessing(false);
    }
  };

  return (
    <div className="products-root">
      {/* Top bar */}
      <header >
        <Navbar
          user={user}
          navigate={navigate}
        />
      </header>

      {/* Logout confirmation */}
      {/* <ConfirmDialog
        open={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout from your store?"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
      /> */}

      {/* Order confirmation */}
      <ConfirmDialog
        open={showOrderConfirm}
        title="Place order"
        message={
          cartItems.length === 0
            ? "Your cart is empty."
            : `Confirm order for ${cartItems.length} item(s) totaling ${formatCurrency(
              cartTotal
            )}?`
        }
        onCancel={() => setShowOrderConfirm(false)}
        onConfirm={handlePlaceOrder}
        confirmDisabled={orderProcessing || cartItems.length === 0}
      />

      <main className="products-main">
        <div className="products-heading">
          <div>
            <h1>Shopping Cart</h1>
            <p>Review items before placing the order</p>
          </div>
        </div>

        {cartLoading ? (
          <p className="products-empty">Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <section className="products-panel cart-empty-panel">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p className="cart-empty-sub">
              Add some products to get started.
            </p>
            <button
              className="products-add-btn"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </button>
          </section>
        ) : (
          <section className="products-panel">
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th style={{ width: 120 }}>Qty</th>
                    <th>Total</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id || item.productId}>
                      <td>{item.productName || item.productId?.name || "Unnamed product"}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button
                            className="products-action-btn"
                            onClick={() =>
                              updateCartQuantity(item, (item.quantity || 1) - 1)
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateCartQuantity(item, e.target.value)}
                            style={{ width: "70px", textAlign: "center" }}
                          />
                          <button
                            className="products-action-btn"
                            onClick={() =>
                              updateCartQuantity(item, (item.quantity || 1) + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        {formatCurrency(
                          (item.price || 0) * (item.quantity || 0)
                        )}
                      </td>
                      <td>
                        <button
                          className="products-action-btn products-action-danger"
                          onClick={() => removeFromCart(item)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            <div className="products-form-actions" style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600 }}>
                Cart Total: {formatCurrency(cartTotal)}
              </div>
              <div>
                <button
                  className="btn-secondary"
                  onClick={syncClearCart}
                  disabled={orderProcessing}
                >
                  Clear Cart
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setShowOrderConfirm(true)}
                  disabled={orderProcessing || cartItems.length === 0}
                  style={{ marginLeft: 8 }}
                >
                  {orderProcessing ? "Placing..." : "Place Order"}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CartPage;

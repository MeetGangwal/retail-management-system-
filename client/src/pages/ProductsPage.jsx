


import React, { useEffect, useState } from "react";
import { productAPI, cartAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ProductsPage.css";
import Navbar from "../shared/navbar";
import Toast from "../shared/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  imageUrl: "",
};

const ProductsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getRetailerProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
      imageUrl: product.imageUrl || "",
    });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        quantity: Number(form.quantity),
        imageUrl: form.imageUrl,
      };

      if (editingId) {
        await productAPI.updateProduct(editingId, payload);
      } else {
        await productAPI.addProduct(payload);
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
      setToastMessage(editingId ? "Product updated" : "Product added");
    } catch (err) {
      console.error("Failed to save product", err);
      setToastMessage("Failed to save product");
    }
  };

  // ---------- DELETE PRODUCT ----------
  const askDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await productAPI.deleteProduct(productToDelete._id);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      await loadProducts();
      setToastMessage("Product deleted");
    } catch (err) {
      console.error("Failed to delete product", err);
      setToastMessage("Failed to delete product");
    }
  };


  // ---------- ADD TO CART ----------

  const addToCart = async (product) => {
    if (!user?._id) return;
    if (product.quantity === 0) return;

    try {
      await cartAPI.addToCart({
        productId: product._id,
        quantity: 1,
        retailerId: user._id,
      });

      setToastMessage(`Added "${product.name}" to cart`);
    } catch (err) {
      console.error("Failed to add to cart", err);
      setToastMessage("Failed to add to cart");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <div className="products-root">
        <p className="products-empty">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-root">
      <Navbar
        user={user}
        navigate={navigate}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete product"
        message={
          productToDelete
            ? `Delete "${productToDelete.name}" from your inventory?`
            : "Delete this product?"
        }
        onCancel={() => {
          setShowDeleteConfirm(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      <main className="products-main">
        {/* Heading + actions */}
        <div className="products-heading">
          <div>
            <h1>Browse Products</h1>
            <p>Manage and sell products from your store</p>
          </div>
          <div className="products-actions">
            <input
              className="products-search"
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              className="products-cart-icon-btn"
              onClick={() => navigate("/cart")}
              title="View cart"
            >
              🛒
            </button>

            <button className="products-add-btn" onClick={openAddForm}>
              + Add Product
            </button>
          </div>
        </div>

        {/* Add / Edit form */}
        {showForm && (
          <section className="products-panel products-form-panel">
            <h2 className="products-panel-title">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>
            <form className="products-form" onSubmit={handleFormSubmit}>
              <div className="products-form-row">
                <label>
                  Name
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                  />
                </label>
                <label>
                  Price (₹)
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                  />
                </label>
                <label>
                  Quantity
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    value={form.quantity}
                    onChange={handleFormChange}
                    required
                  />
                </label>
              </div>

              <label className="products-form-full">
                Description
                <textarea
                  name="description"
                  rows={2}
                  value={form.description}
                  onChange={handleFormChange}
                />
              </label>

              <label className="products-form-full">
                Image URL (optional)
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleFormChange}
                />
              </label>

              <div className="products-form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Product cards grid */}
        <section className="products-panel">
          <h2 className="products-panel-title">Inventory</h2>

          {filteredProducts.length === 0 ? (
            <p className="products-empty">No products found.</p>
          ) : (
            <div className="product-card-grid">
              {filteredProducts.map((p) => {
                const status =
                  p.quantity === 0
                    ? "out"
                    : p.quantity <= 5
                      ? "low"
                      : "in";

                return (
                  <div key={p._id} className="product-card">
                    <div className="product-card-header">
                      <h3 className="product-card-title">{p.name}</h3>
                      <span className={`product-tag status-${status}`}>
                        {status === "in"
                          ? "In stock"
                          : status === "low"
                            ? "Low stock"
                            : "Out of stock"}
                      </span>
                    </div>

                    <p className="product-card-desc">
                      {p.description || "No description provided."}
                    </p>

                    <div className="product-card-meta">
                      <span className="product-price">
                        {formatCurrency(p.price)}
                      </span>
                      <span className="product-stock">
                        In Stock: {p.quantity}
                      </span>
                    </div>

                    <div className="product-card-actions">
                      <button
                        className="products-action-btn"
                        onClick={() => openEditForm(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="products-action-btn products-action-danger"
                        onClick={() => askDeleteProduct(p)}
                      >
                        Delete
                      </button>
                      <button
                        className="product-add-btn"
                        onClick={() => addToCart(p)}
                        disabled={p.quantity === 0}
                      >
                        {p.quantity === 0 ? "Out of stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProductsPage;

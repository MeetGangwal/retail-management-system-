// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import './LoginPage.css';


// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       await login(email, password);
//       navigate('/products');
//     } catch (err) {
//       setError(err.message || '❌ Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="navbar">
//         <a href="/" className="navbar-brand">
//           🛒 RetailPOS
//         </a>
//         <div className="navbar-buttons">
//           <button
//             className="btn btn-login"
//             onClick={() => navigate('/')}
//             style={{ fontSize: '14px' }}
//           >
//             Back to Home
//           </button>
//         </div>
//       </nav>

//       {/* Login Form */}
//       <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
//         <div className="form-container">
//           <h2>Login to Your Store</h2>

//           {error && <div className="alert alert-error">{error}</div>}

//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label htmlFor="email">Email Address</label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="your@email.com"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="btn btn-submit"
//               disabled={loading}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>

//           <div className="form-footer">
//             Don't have an account?{' '}
//             <a href="/signup" onClick={() => navigate('/signup')}>
//               Sign up here
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../shared/Toast';
import './AuthPage.css';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);       // sets token + user
      setToast('Login successful');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      console.error(err);
      setToast('Login failed');
    }
  };
    return (
        <div className="auth-root">
            <Toast message={toast} onClose={() => setToast('')} />

            <div className="auth-card">
                <h2 className="auth-title">Login as Retailer</h2>
                <p className="auth-subtitle">Enter your credentials to continue</p>

                <form onSubmit={handleSubmit}>
                    <label className="auth-label">
                        Email
                        <input
                            className="auth-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label className="auth-label">
                        Password
                        <input
                            className="auth-input"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    <button type="submit" className="auth-btn auth-btn-primary">
                        Login
                    </button>
                </form>

                <button
                    className="auth-btn auth-btn-secondary"
                    onClick={() => navigate('/')}
                >
                    Back
                </button>
            </div>
        </div>
    );
}

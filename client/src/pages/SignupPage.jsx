// // SignupPage.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Toast from '../shared/Toast';
// import './AuthPage.css';

// export default function SignupPage({ onSignup }) {
//   const [form, setForm] = useState({
//     name: '',
//     storeName: '',
//     email: '',
//     password: '',
//   });
//   const [toast, setToast] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await onSignup(form);                  // your API call
//       setToast('Signup successful');
//       setTimeout(() => navigate('/login'), 800);
//     } catch (err) {
//       setToast('Signup failed');
//     }
//   };

//   return (
//     <div className="auth-root">
//       <Toast message={toast} onClose={() => setToast('')} />

//       <div className="auth-card">
//         <h2 className="auth-title">Create Retailer Account</h2>
//         <p className="auth-subtitle">Set up your store in a few seconds</p>

//         <form onSubmit={handleSubmit}>
//           <label className="auth-label">
//             Full Name
//             <input
//               className="auth-input"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//             />
//           </label>

//           <label className="auth-label">
//             Store Name
//             <input
//               className="auth-input"
//               name="storeName"
//               value={form.storeName}
//               onChange={handleChange}
//               required
//             />
//           </label>

//           <label className="auth-label">
//             Email
//             <input
//               className="auth-input"
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               required
//             />
//           </label>

//           <label className="auth-label">
//             Password
//             <input
//               className="auth-input"
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               required
//             />
//           </label>

//           <button type="submit" className="auth-btn auth-btn-primary">
//             Sign Up
//           </button>
//         </form>

//         <button
//           className="auth-btn auth-btn-secondary"
//           onClick={() => navigate('/')}
//         >
//           Back
//         </button>
//       </div>
//     </div>
//   );
// }
// SignupPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../shared/Toast';
import './AuthPage.css';

export default function SignupPage({ onSignup }) {
    const [form, setForm] = useState({
        name: '',
        storeName: '',
        email: '',
        password: '',
        phone: '',      // ✅ ADD THIS
        address: ''    // ✅ ADD THIS
    });
    const [toast, setToast] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSignup(form);
            setToast('Signup successful');
            setTimeout(() => navigate('/login'), 800);
        } catch (err) {
            console.error(err);
            setToast('Login failed');
        }
    };

    return (
        <div className="auth-root">
            <Toast message={toast} onClose={() => setToast('')} />
            <div className="auth-card">
                <h2 className="auth-title">Create Retailer Account</h2>
                <p className="auth-subtitle">Set up your store in a few seconds</p>

                <form onSubmit={handleSubmit}>
                    <label className="auth-label">
                        Full Name
                        <input
                            className="auth-input"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="auth-label">
                        Store Name
                        <input
                            className="auth-input"
                            name="storeName"
                            value={form.storeName}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="auth-label">
                        Phone Number
                        <input
                            className="auth-input"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="auth-label">
                        Address
                        <input
                            className="auth-input"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="auth-label">
                        Email
                        <input
                            className="auth-input"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="auth-label">
                        Password
                        <input
                            className="auth-input"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <button type="submit" className="auth-btn auth-btn-primary">
                        Sign Up
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

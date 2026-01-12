// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './routes/ProtectedRoute';
// import SalesReport from './pages/SalesReport';
// import LandingPage from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import HomePage from './pages/Homepage';
// import DashboardPage from './pages/DashboardPage';
// import ProductsPage from "./pages/ProductsPage";
// import CartPage from "./pages/CartPage";

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/signup" element={<SignupPage />} />
//           <Route path="/home" element={<HomePage />} />

//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <DashboardPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/sales-report"
//             element={
//               <ProtectedRoute>
//                 <SalesReport />
//               </ProtectedRoute>
//             }
//           />
//             <Route
//               path="/products"
//               element={
//                 <ProtectedRoute>
//                   <ProductsPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//   path="/cart"
//   element={
//     <ProtectedRoute>
//       <CartPage />
//     </ProtectedRoute>
//   }
// />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import SalesReport from "./pages/SalesReport";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/Homepage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";

function AppInner() {
  const { signup, login } = useAuth();

  const handleSignup = (formData) => signup(formData);  // uses AuthContext [file:32]
  const handleLogin = (email, password) => login(email, password);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignupPage onSignup={handleSignup} />} />
      <Route path="/home" element={<HomePage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales-report"
        element={
          <ProtectedRoute>
            <SalesReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { CartOverlay } from './components/CartOverlay';
import { ScrollToTop } from './components/ScrollToTop';
import { SplashScreen } from './components/SplashScreen';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Payment } from './pages/Payment';
import { Orders } from './pages/Orders';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <>
                        <Navbar />
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/category/:categoryId" element={<CategoryPage />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/payment" element={<Payment />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                        <CartOverlay />
                        <ScrollToTop />
                      </>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
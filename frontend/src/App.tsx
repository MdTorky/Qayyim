import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminRoute from './components/layout/AdminRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import FAQPage from './pages/FAQPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductListScreen from './pages/admin/ProductListScreen';
import ProductEditScreen from './pages/admin/ProductEditScreen';
import OrderListScreen from './pages/admin/OrderListScreen';
import UserListScreen from './pages/admin/UserListScreen';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <Toaster />
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="products" element={<ProductListPage />} />
                  <Route path="product/:id" element={<ProductPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="shipping" element={<ShippingPage />} />
                  <Route path="payment" element={<PaymentPage />} />
                  <Route path="placeorder" element={<PlaceOrderPage />} />
                  <Route path="order/:id" element={<OrderPage />} />
                  <Route path="faq" element={<FAQPage />} />

                  {/* Admin Routes */}
                  <Route path="admin" element={<AdminRoute />}>
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="products" element={<ProductListScreen />} />
                    <Route path="product/:id/edit" element={<ProductEditScreen />} />
                    <Route path="orders" element={<OrderListScreen />} />
                    <Route path="users" element={<UserListScreen />} />
                  </Route>
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

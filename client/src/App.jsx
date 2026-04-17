/**
 * App.jsx
 * Root component — sets up routing, layout, and global providers
 */
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

import { AuthProvider } from './context/AuthContext';
import Navbar   from './components/layout/Navbar';
import Footer   from './components/layout/Footer';
import Chatbot  from './components/common/Chatbot';

import Home           from './pages/Home';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Schemes        from './pages/Schemes';
import SchemeDetail   from './pages/SchemeDetail';
import Dashboard      from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import About          from './pages/About';
import Services       from './pages/Services';
import Contact        from './pages/Contact';

// Layout wrapper — hides nav/footer on auth pages
function Layout({ children, darkMode, toggleDark }) {
  const { pathname } = useLocation();
  const isAuthPage = ['/login', '/register'].includes(pathname);

  return (
    <>
      {!isAuthPage && <Navbar darkMode={darkMode} toggleDark={toggleDark} />}
      <main style={{ minHeight: isAuthPage ? '100vh' : 'calc(100vh - 68px)' }}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <Chatbot />}
    </>
  );
}

export default function App() {
  // Dark mode persisted in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('pb_dark') === 'true';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('pb_dark', darkMode);
  }, [darkMode]);

  const toggleDark = () => setDarkMode(v => !v);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout darkMode={darkMode} toggleDark={toggleDark}>
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/login"      element={<Login />} />
            <Route path="/register"   element={<Register />} />
            <Route path="/schemes"    element={<Schemes />} />
            <Route path="/schemes/:id" element={<SchemeDetail />} />
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/admin"      element={<AdminDashboard />} />
            <Route path="/about"      element={<About />} />
            <Route path="/services"   element={<Services />} />
            <Route path="/contact"    element={<Contact />} />
            {/* 404 fallback */}
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '160px 20px' }}>
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>📭</div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Page Not Found</h2>
                <a href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>← Back to Home</a>
              </div>
            } />
          </Routes>
        </Layout>

        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--white)',
              color: 'var(--gray-800)',
              border: '1px solid var(--gray-200)',
              boxShadow: 'var(--shadow-lg)',
              borderRadius: '12px',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: '500',
              fontSize: '0.9rem',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' }
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' }
            }
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

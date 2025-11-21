// ============================================================================
// App.jsx - Main Application Component with Authentication
// ============================================================================
import React, { useState } from 'react';
import { Activity, Settings, BarChart3, RefreshCw, User, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './AuthContext';
import { LoginModal, RegisterModal } from './AuthModals';
import PerformanceOptimizer from './PerformanceOptimizer';

// Landing Page Component (shown when not authenticated)
const LandingPage = ({ onShowLogin, onShowRegister }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Performance Optimization Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            End-to-end optimization for your applications
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onShowLogin}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition shadow-lg"
            >
              Login
            </button>
            <button
              onClick={onShowRegister}
              className="px-8 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-50 font-semibold transition shadow-lg border-2 border-blue-600"
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
            <p className="text-gray-600">
              Monitor your application performance in real-time with comprehensive metrics.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Auto Optimization</h3>
            <p className="text-gray-600">
              Automatically apply optimizations based on intelligent recommendations.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
            <p className="text-gray-600">
              Get deep insights into software, hardware, network, and infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Content (handles authentication UI)
const AppContent = () => {
  const { isAuthenticated, currentUser, loading, error, login, register, logout, setError } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    username: '',
    password: '',
    full_name: '',
    organization: '',
    role: 'user'
  });

  const handleLogin = async () => {
    const result = await login(loginData.username, loginData.password);
    if (result.success) {
      setShowLogin(false);
      setLoginData({ username: '', password: '' });
    }
  };

  const handleRegister = async () => {
    const result = await register(registerData);
    if (result.success) {
      setShowRegister(false);
      setRegisterData({
        email: '',
        username: '',
        password: '',
        full_name: '',
        organization: '',
        role: 'user'
      });
    }
  };

  // Show loading screen while checking authentication
  if (loading && !isAuthenticated && !showLogin && !showRegister) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onShowLogin={() => setShowLogin(true)}
          onShowRegister={() => setShowRegister(true)}
        />

        {showLogin && (
          <LoginModal
            onClose={() => {
              setShowLogin(false);
              setError('');
            }}
            onSwitchToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
              setError('');
            }}
            onSubmit={handleLogin}
            data={loginData}
            setData={setLoginData}
            loading={loading}
            error={error}
          />
        )}

        {showRegister && (
          <RegisterModal
            onClose={() => {
              setShowRegister(false);
              setError('');
            }}
            onSwitchToLogin={() => {
              setShowRegister(false);
              setShowLogin(true);
              setError('');
            }}
            onSubmit={handleRegister}
            data={registerData}
            setData={setRegisterData}
            loading={loading}
            error={error}
          />
        )}
      </>
    );
  }

  // Show authenticated view with header and PerformanceOptimizer
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user info and logout */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Performance Optimization Platform
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {currentUser?.full_name || currentUser?.username}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {currentUser?.username}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Optimizer Component */}
      <PerformanceOptimizer />
    </div>
  );
};

// Main App Component with Provider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
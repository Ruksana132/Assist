import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

function App() {
  const { user, loading, error, signIn, signUp, isAuthenticated } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  if (showAuth) {
    return (
      <AuthPage
        onSignIn={signIn}
        onSignUp={signUp}
        loading={loading}
        error={error}
      />
    );
  }

  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}

export default App;
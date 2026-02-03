
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/ScrollToTop';
import Dashboard from '@/pages/Dashboard';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from '@/components/ui/provider'
import { AuthProvider } from '@/hooks/AuthContext'
import ProtectedRoute from '@/routes/ProtectedRoute'
import GuestRoute from '@/routes/GuestRoute'
import Navbar from '@/components/Navbar'
import Login from '@/pages/authentication/Login'
import Register from '@/pages/authentication/Register'
import Onboarding from '@/pages/authentication/Onboarding'
import Dashboard from '@/pages/Dashboard'

const App: React.FC = () => {
  return (
    <Provider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  )
}

export default App

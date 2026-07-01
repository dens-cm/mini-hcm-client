/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/AuthContext'
import { Role } from '@/utils/constants'
import { Spinner, Flex } from '@chakra-ui/react'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { currentUser, userProfile, loading } = useAuth()

  if (loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  const location = useLocation()
  const pathname = location.pathname

  if (!userProfile && pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  if (userProfile && pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />
  }

  if (adminOnly && userProfile?.role !== Role.ADMIN) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute

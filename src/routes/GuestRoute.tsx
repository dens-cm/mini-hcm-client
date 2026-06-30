import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/AuthContext'
import { Spinner, Flex } from '@chakra-ui/react'

interface GuestRouteProps {
  children: React.ReactNode
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    )
  }

  if (currentUser) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default GuestRoute

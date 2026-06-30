import React, { useState } from 'react'
import { Box, Flex, Button, Heading, Text, Spacer, HStack } from '@chakra-ui/react'
import { useAuth } from '@/hooks/AuthContext'
import { authService } from '@/utils/services/AuthService'
import { useNavigate } from 'react-router-dom'
import { capitalizeWords } from '@/utils/stringUtils'
import { LogoutDialog } from '@/components/dialogs/LogoutDialog'
import { FaClock, FaUserCircle } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'

const Navbar: React.FC = () => {
  const { currentUser, userProfile } = useAuth()
  const navigate = useNavigate()

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    await authService.logout()
    setShowLogoutConfirm(false)
    navigate('/login')
  }

  if (!currentUser) return null

  return (
    <Box bg="white" px={6} py={4} color="gray.800" shadow="sm" borderBottom="1px solid" borderColor="gray.100">
      <Flex alignItems="center">
        <HStack cursor="pointer" onClick={() => navigate('/dashboard')} color="blue.600" _hover={{ color: "blue.500" }} transition="all 0.2s">
          <FaClock size={24} />
          <Heading size="lg" fontWeight="extrabold" letterSpacing="tight">
            Mini HCM
          </Heading>
        </HStack>
        <Spacer />
        <Flex alignItems="center" gap={6}>
          <HStack color="gray.600">
            <FaUserCircle size={20} />
            <Text fontWeight="medium">
              {capitalizeWords(userProfile?.name || '')} <Text as="span" color="blue.500" fontSize="sm" ml={1}>({userProfile?.role})</Text>
            </Text>
          </HStack>
          <HStack gap={4}>
            {/* Removed the redundant Admin Panel button as the Dashboard route handles it automatically */}
          </HStack>
          <Button size="sm" variant="surface" colorPalette="red" onClick={() => setShowLogoutConfirm(true)}>
            <FiLogOut /> Logout
          </Button>
        </Flex>
      </Flex>

      <LogoutDialog 
        open={showLogoutConfirm} 
        onOpenChange={(e) => setShowLogoutConfirm(e.open)} 
        onConfirm={handleLogout} 
      />
    </Box>
  )
}

export default Navbar

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Box, Button, Field, Flex, Heading, Input, Text, HStack } from '@chakra-ui/react'
import { toaster } from "@/components/ui/toaster"
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '@/utils/services/AuthService'
import { FaEnvelope, FaLock } from 'react-icons/fa'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.login(email, password)
      toaster.create({ title: 'Login successful', type: 'success', duration: 3000 })
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      toaster.create({ title: 'Login failed', description: 'Invalid email or password. Please try again.', type: 'error', duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex height="100vh" alignItems="center" justify="center" bgGradient="linear(to-br, gray.800, blue.900)">
      <Box p={10} maxWidth="400px" borderWidth={0} borderRadius="2xl" boxShadow="2xl" bg="white" w="100%">
        <Box textAlign="center" mb={8}>
          <Heading size="2xl" color="blue.700" fontWeight="extrabold" letterSpacing="tight">Mini HCM</Heading>
          <Text color="gray.500" mt={2}>Sign in to your workspace</Text>
        </Box>
        <form onSubmit={handleLogin}>
          <Field.Root mb={5} required>
            <HStack mb={1} color="gray.600">
              <FaEnvelope size={14} />
              <Field.Label m={0}>Email address</Field.Label>
            </HStack>
            <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} size="lg" borderRadius="md" focusRingColor="blue.500" />
          </Field.Root>
          <Field.Root mb={8} required>
            <HStack mb={1} color="gray.600">
              <FaLock size={14} />
              <Field.Label m={0}>Password</Field.Label>
            </HStack>
            <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} size="lg" borderRadius="md" focusRingColor="blue.500" />
          </Field.Root>
          <Button colorPalette="blue" width="full" type="submit" loading={loading} size="lg" borderRadius="md" fontWeight="bold">
            Sign In
          </Button>
        </form>
        <Text mt={6} textAlign="center" fontSize="sm" color="gray.600">
          Don't have an account? <Link to="/register" style={{ color: '#4f46e5', fontWeight: 'bold' }}>Register</Link>
        </Text>
      </Box>
    </Flex>
  )
}

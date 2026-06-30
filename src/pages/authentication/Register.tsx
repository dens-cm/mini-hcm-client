/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Box, Button, Flex, Heading, Input, Text, HStack, Field } from '@chakra-ui/react'
import { toaster } from "@/components/ui/toaster"
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '@/utils/services/AuthService'

import { useAuth } from '@/hooks/AuthContext'
import { Role } from '@/utils/constants'

export default function Register() {
  const { refreshProfile } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [timezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
  const [startShift, setStartShift] = useState('09:00')
  const [endShift, setEndShift] = useState('18:00')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.register(email, password, name, Role.EMPLOYEE, timezone, { start: startShift, end: endShift })
      await refreshProfile()
      toaster.create({ title: 'Registration successful', type: 'success', duration: 3000 })
      navigate('/dashboard')
    } catch (error: any) {
      toaster.create({ title: 'Registration failed', description: error.message, type: 'error', duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex height="100vh" alignItems="center" justify="center" bgGradient="linear(to-r, teal.400, blue.500)">
      <Box p={8} maxWidth="500px" borderWidth={1} borderRadius="lg" boxShadow="2xl" bg="white" w="100%">
        <Box textAlign="center" mb={6}>
          <Heading size="lg" color="teal.600">Join Mini HCM</Heading>
          <Text color="gray.500">Create your account</Text>
        </Box>
        <form onSubmit={handleRegister}>
          <Field.Root mb={4} required>
            <Field.Label>Full Name</Field.Label>
            <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} textTransform='capitalize' />
          </Field.Root>
          
          <Field.Root mb={4} required>
            <Field.Label>Email address</Field.Label>
            <Input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field.Root>
          
          <Field.Root mb={4} required>
            <Field.Label>Password</Field.Label>
            <Input type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field.Root>

          <HStack mb={4}>
            <Field.Root>
              <Field.Label>Timezone</Field.Label>
              <Input value={timezone} readOnly bg="gray.100" _disabled={{ color: 'gray.500' }} />
            </Field.Root>
          </HStack>

          <HStack mb={6}>
             <Field.Root id="startShift">
              <Field.Label>Shift Start</Field.Label>
              <Input type="time" value={startShift} onChange={(e) => setStartShift(e.target.value)} />
            </Field.Root>
             <Field.Root id="endShift">
              <Field.Label>Shift End</Field.Label>
              <Input type="time" value={endShift} onChange={(e) => setEndShift(e.target.value)} />
            </Field.Root>
          </HStack>

          <Button colorScheme="teal" width="full" type="submit" loading={loading} size="lg">
            Register
          </Button>
        </form>
        <Text mt={4} textAlign="center" fontSize="sm">
          Already have an account? <Link to="/login" style={{ color: '#319795', fontWeight: 'bold' }}>Login</Link>
        </Text>
      </Box>
    </Flex>
  )
}



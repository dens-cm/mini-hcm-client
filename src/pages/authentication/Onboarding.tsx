import React, { useState } from 'react'
import { Box, Flex, Heading, Text, Input, Button, HStack } from '@chakra-ui/react'
import { Field } from '@chakra-ui/react'
import { toaster } from '@/components/ui/toaster'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/utils/services/AuthService'
import { useAuth } from '@/hooks/AuthContext'

export default function Onboarding() {
  const { loading, refreshProfile } = useAuth()
  const [name, setName] = useState('')
  const [timezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
  const [startShift, setStartShift] = useState('09:00')
  const [endShift, setEndShift] = useState('18:00')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await authService.updateProfile(name, timezone, { start: startShift, end: endShift })
      await refreshProfile()
      toaster.create({ title: 'Profile completed', type: 'success', duration: 3000 })
      navigate('/dashboard')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error ?? 'Error')
      toaster.create({ title: 'Update failed', description: message, type: 'error', duration: 3000 })
      setSubmitting(false)
    }
  }

  if (loading) return null 

  return (
    <Flex height="100vh" alignItems="center" justify="center" bgGradient="linear(to-r, teal.400, blue.500)">
      <Box p={8} maxWidth="500px" borderWidth={1} borderRadius="lg" boxShadow="2xl" bg="white" w="100%">
        <Box textAlign="center" mb={6}>
          <Heading size="lg" color="teal.600">Complete Your Profile</Heading>
          <Text color="gray.500">We need a few more details to set up your account.</Text>
        </Box>
        <form onSubmit={handleOnboarding}>
          <Field.Root mb={4} required>
            <Field.Label>Full Name</Field.Label>
            <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </Field.Root>
          
          <Field.Root mb={4} required>
            <Field.Label>Timezone</Field.Label>
            <Input value={timezone} readOnly bg="gray.100" _disabled={{ color: 'gray.500' }} />
          </Field.Root>

          <HStack mb={4}>
            <Field.Root required>
              <Field.Label>Shift Start</Field.Label>
              <Input type="time" value={startShift} onChange={(e) => setStartShift(e.target.value)} />
            </Field.Root>
            <Field.Root required>
              <Field.Label>Shift End</Field.Label>
              <Input type="time" value={endShift} onChange={(e) => setEndShift(e.target.value)} />
            </Field.Root>
          </HStack>

          <Button type="submit" colorScheme="teal" width="100%" mt={4} loading={submitting}>
            Save Profile
          </Button>
        </form>
      </Box>
    </Flex>
  )
}

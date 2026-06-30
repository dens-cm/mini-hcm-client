import { Box, Flex, Spinner, Heading } from '@chakra-ui/react'
import { useAuth } from '@/hooks/AuthContext'
import AdminDashboard from '@/components/AdminDashboard'
import EmployeeDashboard from '@/components/EmployeeDashboard'
import { Role } from '@/utils/constants'
import { capitalizeWords } from '@/utils/stringUtils'

export default function Dashboard() {
    const { userProfile, loading } = useAuth()

    if (loading) {
        return <Flex h="100vh" align="center" justify="center"><Spinner size="xl" /></Flex>
    }

    return (
        <Box p={4} maxW="container.xl" mx="auto">
            <Flex direction="column" gap={6}>
            <Box>
                <Heading size="lg" mb={4}>Welcome, {capitalizeWords(userProfile?.name || '')}</Heading>
                {userProfile?.role === Role.ADMIN ? <AdminDashboard /> : <EmployeeDashboard />}
            </Box>
            </Flex>
        </Box>
    )
}

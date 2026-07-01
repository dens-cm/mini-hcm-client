import { Box, Flex, Spinner, Heading } from '@chakra-ui/react'
import { useAuth } from '@/hooks/AuthContext'
import AdminDashboard from '@/components/AdminDashboard'
import EmployeeDashboard from '@/components/EmployeeDashboard'
import { Role } from '@/utils/constants'
import { capitalizeWords } from '@/utils/stringUtils'

export default function Dashboard() {
    const { userProfile, loading } = useAuth()

    if (loading) {
        return <Flex h="100%" align="center" justify="center"><Spinner size="xl" /></Flex>
    }

    return (
        <Box w='100%' h='100%' overflow='auto'>
            <Flex direction="column" gap={6}>
            <Box px={6} py={3}>
                <Heading size="lg" mb={4}>Welcome, {capitalizeWords(userProfile?.name || '')}</Heading>
                {userProfile?.role === Role.ADMIN ? <AdminDashboard /> : <EmployeeDashboard />}
            </Box>
            </Flex>
        </Box>
    )
}

import { useEffect, useState } from 'react'
import { Box, Button, Flex, Heading, Text, Table, Badge, HStack, Spinner, EmptyState, SimpleGrid } from '@chakra-ui/react'
import { toaster } from "@/components/ui/toaster"
import { attendanceService } from '@/utils/services/AttendanceService'
import { formatDate, formatTime } from '@/utils/dateFormatter'
import { FaBriefcase, FaBolt, FaExclamationCircle, FaClock, FaSignInAlt, FaSignOutAlt, FaRegCalendarTimes, FaSync } from 'react-icons/fa'

interface DailySummary {
  id: string
  date: string
  regularHours: number
  overtimeHours: number
  nightDiffHours: number
  lateMinutes: number
  undertimeMinutes: number
  timeIn?: string
  timeOut?: string
}

export default function EmployeeDashboard() {
  const [summaries, setSummaries] = useState<DailySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [punching, setPunching] = useState(false)

  const fetchSummaries = async () => {
    try {
      setLoading(true)
      const data = await attendanceService.getMySummaries()
      setSummaries(data.data || [])
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error ?? 'Error')
      toaster.create({ title: 'Error fetching summaries', description: message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSummaries()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const handlePunch = async (type: 'in' | 'out') => {
    try {
      setPunching(true)
      await attendanceService.punch(type)
      toaster.create({ title: `Successfully Punched ${type === 'in' ? 'In' : 'Out'}`, type: 'success' })
      await fetchSummaries() 
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error ?? 'Error')
      toaster.create({ title: `Punch ${type} failed`, description: message, type: 'error' })
    } finally {
      setPunching(false)
    }
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={8} bg="white" p={8} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
        <Box>
          <Heading size="xl" color="gray.800" fontWeight="extrabold" letterSpacing="tight">Employee Portal</Heading>
          <Text color="gray.500" mt={1}>Manage your daily attendance</Text>
        </Box>
        <HStack gap={4}>
          <Button variant="outline" size="lg" onClick={fetchSummaries} loading={loading} borderRadius="full" px={6} boxShadow="sm">
            <FaSync /> Refresh
          </Button>
          <Button colorPalette="teal" size="lg" onClick={() => handlePunch('in')} loading={punching} borderRadius="full" px={8} boxShadow="md">
            <FaSignInAlt /> Punch In
          </Button>
          <Button colorPalette="orange" size="lg" onClick={() => handlePunch('out')} loading={punching} borderRadius="full" px={8} boxShadow="md">
            <FaSignOutAlt /> Punch Out
          </Button>
        </HStack>
      </Flex>

      {!loading && summaries.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
          <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" position="relative" overflow="hidden">
            <Box position="absolute" right="-4" top="-4" opacity={0.05}>
              <FaBriefcase size={100} />
            </Box>
            <HStack color="teal.500" mb={2}>
              <FaBriefcase />
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">Total Reg Hours</Text>
            </HStack>
            <Heading size="2xl" color="gray.800">
              {summaries.reduce((acc, curr) => acc + (curr.regularHours || 0), 0).toFixed(2)}
            </Heading>
          </Box>
          <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" position="relative" overflow="hidden">
            <Box position="absolute" right="-4" top="-4" opacity={0.05}>
              <FaBolt size={100} />
            </Box>
            <HStack color="purple.500" mb={2}>
              <FaBolt />
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">Total Overtime</Text>
            </HStack>
            <Heading size="2xl" color="gray.800">
              {summaries.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0).toFixed(2)}
            </Heading>
          </Box>
          <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" position="relative" overflow="hidden">
            <Box position="absolute" right="-4" top="-4" opacity={0.05}>
              <FaClock size={100} />
            </Box>
            <HStack color="red.500" mb={2}>
              <FaClock />
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">Total Late (Mins)</Text>
            </HStack>
            <Heading size="2xl" color="gray.800">
              {summaries.reduce((acc, curr) => acc + (curr.lateMinutes || 0), 0)}
            </Heading>
          </Box>
          <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" position="relative" overflow="hidden">
            <Box position="absolute" right="-4" top="-4" opacity={0.05}>
              <FaExclamationCircle size={100} />
            </Box>
            <HStack color="orange.500" mb={2}>
              <FaExclamationCircle />
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">Undertime (Mins)</Text>
            </HStack>
            <Heading size="2xl" color="gray.800">
              {summaries.reduce((acc, curr) => acc + (curr.undertimeMinutes || 0), 0)}
            </Heading>
          </Box>
        </SimpleGrid>
      )}

      <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
        <HStack mb={6}>
          <FaRegCalendarTimes color="gray" />
          <Heading size="md" color="gray.700">My Attendance History</Heading>
        </HStack>
        {loading ? (
          <Flex justify="center" p={10}><Spinner size="xl" color="blue.500" /></Flex>
        ) : summaries.length === 0 ? (
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Title>No Attendance Records</EmptyState.Title>
              <EmptyState.Description>You haven't punched in yet.</EmptyState.Description>
            </EmptyState.Content>
          </EmptyState.Root>
        ) : (
          <Table.Root size="sm" striped>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                <Table.ColumnHeader>Time In</Table.ColumnHeader>
                <Table.ColumnHeader>Time Out</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Regular (hrs)</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Overtime (hrs)</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Night Diff (hrs)</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Late (mins)</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Undertime (mins)</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {summaries.map(s => (
                <Table.Row key={s.id}>
                  <Table.Cell>{formatDate(s.date)}</Table.Cell>
                  <Table.Cell>{s.timeIn ? formatTime(s.timeIn) : 'N/A'}</Table.Cell>
                  <Table.Cell>{s.timeOut ? formatTime(s.timeOut) : 'N/A'}</Table.Cell>
                  <Table.Cell textAlign="right">{s.regularHours?.toFixed(2) || 0}</Table.Cell>
                  <Table.Cell textAlign="right">
                    {s.overtimeHours > 0 ? <Badge colorPalette="purple">{s.overtimeHours.toFixed(2)}</Badge> : 0}
                  </Table.Cell>
                  <Table.Cell textAlign="right">{s.nightDiffHours?.toFixed(2) || 0}</Table.Cell>
                  <Table.Cell textAlign="right">
                    {s.lateMinutes > 0 ? <Badge colorPalette="red">{s.lateMinutes}</Badge> : 0}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {s.undertimeMinutes > 0 ? <Badge colorPalette="orange">{s.undertimeMinutes}</Badge> : 0}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
    </Box>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import { Box, Flex, Heading, Text, Table, Badge, Spinner, EmptyState, Tabs, Button, IconButton, Input, SimpleGrid, HStack } from '@chakra-ui/react'
import { toaster } from "@/components/ui/toaster"
import { adminService } from '@/utils/services/AdminService'
import { formatDate, formatDateTime } from '@/utils/dateFormatter'
import { capitalizeWords } from '@/utils/stringUtils'
import { MdEdit, MdViewList, MdDateRange, MdHistory } from 'react-icons/md'
import { FaUsers, FaBriefcase, FaBolt, FaClock, FaSync } from 'react-icons/fa'
import { EditPunchDialog } from '@/components/dialogs/EditPunchDialog'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [punches, setPunches] = useState<any[]>([])
  const [summaries, setSummaries] = useState<any[]>([])
  const [weeklyReports, setWeeklyReports] = useState<any[]>([])
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    return d.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0])
  const [fetchingWeekly, setFetchingWeekly] = useState(false)

  const [editingPunch, setEditingPunch] = useState<any | null>(null)
  const [editTime, setEditTime] = useState('')
  const [saving, setSaving] = useState(false)
  const [usersMap, setUsersMap] = useState<Record<string, string>>({})

  const fetchSummaries = async () => {
    setLoading(true)
    try {
      const [punchesData, summariesData] = await Promise.all([
        adminService.getAllPunches(),
        adminService.getAllSummaries()
      ])
      setPunches(punchesData.data || [])
      setSummaries(summariesData.data || [])
    } catch (error: any) {
      toaster.create({ title: 'Error fetching data', description: error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchWeeklyData = useCallback(async () => {
    setFetchingWeekly(true)
    try {
      const res = await adminService.getWeeklyReports(startDate, endDate)
      setWeeklyReports(res.data || [])
    } catch (error: any) {
      toaster.create({ title: 'Error fetching weekly reports', description: error.message, type: 'error' })
    } finally {
      setFetchingWeekly(false)
    }
  }, [startDate, endDate])

  const fetchUsers = async () => {
    try {
      const res = await adminService.getAllUsers()
      const map: Record<string, string> = {}
      res.data?.forEach((u: any) => {
        map[u.uid] = u.name
      })
      setUsersMap(map)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSummaries()
      void fetchWeeklyData()
      void fetchUsers()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [fetchWeeklyData])

  const handleEditClick = (punch: any) => {
    setEditingPunch(punch)
    // Format timestamp for datetime-local input
    const d = new Date(punch.timestamp)
    const tzOffset = d.getTimezoneOffset() * 60000
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16)
    setEditTime(localISOTime)
  }

  const handleSaveEdit = async () => {
    if (!editingPunch) return
    setSaving(true)
    try {
      const updatedTimestamp = new Date(editTime).toISOString()
      await adminService.updatePunch(editingPunch.id, updatedTimestamp, editingPunch.type)
      toaster.create({ title: 'Punch updated', type: 'success' })
      setEditingPunch(null)
      fetchSummaries()
      fetchWeeklyData()
    } catch (error: any) {
      toaster.create({ title: 'Error updating punch', description: error.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={8} bg="white" p={8} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
        <Box>
          <Heading size="xl" color="gray.800" fontWeight="extrabold" letterSpacing="tight">Admin Portal</Heading>
          <Text color="gray.500" mt={1}>Manage employee attendance and view reports</Text>
        </Box>
        <Button onClick={() => { fetchSummaries(); fetchWeeklyData(); fetchUsers() }} loading={loading || fetchingWeekly} colorPalette="blue" borderRadius="full" px={6} boxShadow="md">
          <FaSync /> Refresh Data
        </Button>
      </Flex>

      {!fetchingWeekly && weeklyReports.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
          <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" position="relative" overflow="hidden">
            <Box position="absolute" right="-4" top="-4" opacity={0.05}><FaUsers size={100} /></Box>
            <HStack color="purple.500" mb={2}>
              <FaUsers />
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">Active Employees</Text>
            </HStack>
            <Heading size="2xl" color="gray.800">{weeklyReports.length}</Heading>
          </Box>
          <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" position="relative" overflow="hidden">
            <Box position="absolute" right="-4" top="-4" opacity={0.05}><FaBriefcase size={100} /></Box>
            <HStack color="teal.500" mb={2}>
              <FaBriefcase />
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">Total Reg Hours</Text>
            </HStack>
            <Heading size="2xl" color="gray.800">{weeklyReports.reduce((acc, curr) => acc + (curr.regularHours || 0), 0).toFixed(2)}</Heading>
          </Box>
          <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" position="relative" overflow="hidden">
            <Box position="absolute" right="-4" top="-4" opacity={0.05}><FaBolt size={100} /></Box>
            <HStack color="blue.500" mb={2}>
              <FaBolt />
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">Total Overtime</Text>
            </HStack>
            <Heading size="2xl" color="gray.800">{weeklyReports.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0).toFixed(2)}</Heading>
          </Box>
          <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" position="relative" overflow="hidden">
            <Box position="absolute" right="-4" top="-4" opacity={0.05}><FaClock size={100} /></Box>
            <HStack color="red.500" mb={2}>
              <FaClock />
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">Total Late Hours</Text>
            </HStack>
            <Heading size="2xl" color="gray.800">{weeklyReports.reduce((acc, curr) => acc + (curr.lateHours || 0), 0).toFixed(2)}</Heading>
          </Box>
        </SimpleGrid>
      )}

      <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
        <Tabs.Root defaultValue="reports">
          <Tabs.List>
            <Tabs.Trigger value="reports">
              <HStack><MdViewList /> <Text>Daily Reports</Text></HStack>
            </Tabs.Trigger>
            <Tabs.Trigger value="weekly">
              <HStack><MdDateRange /> <Text>Weekly Reports</Text></HStack>
            </Tabs.Trigger>
            <Tabs.Trigger value="punches">
              <HStack><MdHistory /> <Text>Employee Punches</Text></HStack>
            </Tabs.Trigger>
          </Tabs.List>
          
          <Tabs.Content value="reports" pt={4}>
            {loading ? (
              <Flex justify="center" p={10}><Spinner size="xl" /></Flex>
            ) : summaries.length === 0 ? (
               <EmptyState.Root><EmptyState.Content><EmptyState.Title>No Reports Found</EmptyState.Title></EmptyState.Content></EmptyState.Root>
            ) : (
              <Table.Root size="sm" striped>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Employee</Table.ColumnHeader>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
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
                      <Table.Cell>{capitalizeWords(usersMap[s.userId] || s.userId)}</Table.Cell>
                      <Table.Cell>{formatDate(s.date)}</Table.Cell>
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
          </Tabs.Content>

          <Tabs.Content value="weekly" pt={4}>
            <Flex gap={4} mb={4} align="flex-end">
              <Box>
                <Text fontSize="sm" mb={1} fontWeight="medium">Start Date</Text>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} size="sm" maxW="150px" />
              </Box>
              <Box>
                <Text fontSize="sm" mb={1} fontWeight="medium">End Date</Text>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} size="sm" maxW="150px" />
              </Box>
              <Button size="sm" onClick={fetchWeeklyData} loading={fetchingWeekly} colorPalette="teal">
                Fetch Range
              </Button>
            </Flex>

            {fetchingWeekly ? (
              <Flex justify="center" p={10}><Spinner size="xl" /></Flex>
            ) : weeklyReports.length === 0 ? (
               <EmptyState.Root><EmptyState.Content><EmptyState.Title>No Weekly Reports</EmptyState.Title></EmptyState.Content></EmptyState.Root>
            ) : (
              <Table.Root size="sm" striped>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Employee</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Days Worked</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Total Regular (hrs)</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Total Overtime (hrs)</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Total ND (hrs)</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Total Late (mins)</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Total Undertime (mins)</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {weeklyReports.map(s => (
                    <Table.Row key={s.userId}>
                      <Table.Cell>{capitalizeWords(usersMap[s.userId] || s.userId)}</Table.Cell>
                      <Table.Cell textAlign="right">{s.daysWorked}</Table.Cell>
                      <Table.Cell textAlign="right">{s.regularHours?.toFixed(2) || 0}</Table.Cell>
                      <Table.Cell textAlign="right">
                        {s.overtimeHours > 0 ? <Badge colorPalette="purple">{s.overtimeHours.toFixed(2)}</Badge> : 0}
                      </Table.Cell>
                      <Table.Cell textAlign="right">{s.nightDifferentialHours?.toFixed(2) || 0}</Table.Cell>
                      <Table.Cell textAlign="right">
                        {s.lateHours > 0 ? <Badge colorPalette="red">{s.lateHours.toFixed(2)}</Badge> : 0}
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        {s.undertimeHours > 0 ? <Badge colorPalette="orange">{s.undertimeHours.toFixed(2)}</Badge> : 0}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Tabs.Content>

          <Tabs.Content value="punches" pt={4}>
             {loading ? (
              <Flex justify="center" p={10}><Spinner size="xl" /></Flex>
            ) : punches.length === 0 ? (
               <EmptyState.Root><EmptyState.Content><EmptyState.Title>No Punches Found</EmptyState.Title></EmptyState.Content></EmptyState.Root>
            ) : (
              <Table.Root size="sm" striped>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Employee</Table.ColumnHeader>
                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                    <Table.ColumnHeader>Time</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {punches.map(p => (
                    <Table.Row key={p.id}>
                      <Table.Cell>{capitalizeWords(usersMap[p.userId] || p.userId)}</Table.Cell>
                      <Table.Cell>
                        <Badge colorPalette={p.type === 'in' ? 'teal' : 'orange'}>{p.type.toUpperCase()}</Badge>
                      </Table.Cell>
                      <Table.Cell>{formatDateTime(p.timestamp)}</Table.Cell>
                      <Table.Cell textAlign="right">
                        <IconButton aria-label="Edit Punch" size="xs" variant="ghost" onClick={() => handleEditClick(p)}>
                          <MdEdit />
                        </IconButton>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Tabs.Content>
        </Tabs.Root>
      </Box>

      <EditPunchDialog 
        punch={editingPunch}
        employeeName={editingPunch ? capitalizeWords(usersMap[editingPunch.userId] || editingPunch.userId) : ''}
        editTime={editTime}
        setEditTime={setEditTime}
        saving={saving}
        onSave={handleSaveEdit}
        onCancel={() => setEditingPunch(null)}
      />
    </Box>
  )
}

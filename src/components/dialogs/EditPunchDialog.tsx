import { Dialog, Button, HStack, Text, Box, Badge, Input, Stack } from '@chakra-ui/react'

interface PunchDetails {
  userId: string
  type: string
}

interface EditPunchDialogProps {
  punch: PunchDetails | null | undefined
  employeeName: string
  editTime: string
  setEditTime: (val: string) => void
  saving: boolean
  onSave: () => void
  onCancel: () => void
}

export const EditPunchDialog = ({ punch, employeeName, editTime, setEditTime, saving, onSave, onCancel }: EditPunchDialogProps) => {
  if (!punch) return null

  return (
    <Dialog.Root open={!!punch} onOpenChange={(e) => !e.open && onCancel()} role='alertdialog'>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Edit Punch</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack spaceY={4} mb={6}>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Employee Name</Text>
                <Text>{employeeName}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Punch Type</Text>
                <Badge colorPalette={punch.type === 'in' ? 'teal' : 'orange'}>{punch.type.toUpperCase()}</Badge>
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={1}>Timestamp</Text>
                <Input
                  type="datetime-local"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
              </Box>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <HStack justify="flex-end">
              <Button variant="outline" onClick={onCancel}>Cancel</Button>
              <Button colorPalette="purple" loading={saving} onClick={onSave}>Save Changes</Button>
            </HStack>
          </Dialog.Footer>
          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}


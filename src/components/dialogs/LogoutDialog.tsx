import { Dialog, Button, HStack, Text } from '@chakra-ui/react'

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (details: { open: boolean }) => void
  onConfirm: () => void
}

export const LogoutDialog = ({ open, onOpenChange, onConfirm }: LogoutDialogProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content color='black'>
          <Dialog.Header>
            <Dialog.Title>Confirm Logout</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text>Are you sure you want to log out of the system?</Text>
          </Dialog.Body>
          <Dialog.Footer>
            <HStack justify="flex-end">
              <Button variant="outline" onClick={() => onOpenChange({ open: false })}>Cancel</Button>
              <Button colorPalette="red" onClick={onConfirm}>Log out</Button>
            </HStack>
          </Dialog.Footer>
          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}


# Reusable Modal Components

This directory contains reusable modal components that can be used throughout the application.

## Components

### DeleteModal

A specialized modal for confirming delete actions with a destructive design.

#### Props

- `isOpen: boolean` - Controls the visibility of the modal
- `onClose: () => void` - Callback when the modal is closed
- `onConfirm: () => void` - Callback when delete is confirmed
- `title?: string` - Modal title (default: "Delete Item")
- `description?: string` - Modal description (default: "Are you sure you want to delete this item? This action cannot be undone.")
- `itemName?: string` - Name of the item being deleted (optional)
- `isLoading?: boolean` - Shows loading state (default: false)
- `variant?: "default" | "destructive"` - Button variant (default: "destructive")

#### Usage

```tsx
import { DeleteModal } from "@/components/shared/delete-modal"

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteItem(id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Delete</Button>
      
      <DeleteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        itemName="John Doe"
        isLoading={isLoading}
      />
    </>
  )
}
```

### ConfirmationModal

A generic confirmation modal that can be used for various confirmation actions.

#### Props

- `isOpen: boolean` - Controls the visibility of the modal
- `onClose: () => void` - Callback when the modal is closed
- `onConfirm: () => void` - Callback when action is confirmed
- `title: string` - Modal title
- `description?: string` - Modal description
- `confirmText?: string` - Confirm button text (default: "Confirm")
- `cancelText?: string` - Cancel button text (default: "Cancel")
- `variant?: "default" | "destructive" | "warning" | "info" | "success"` - Modal variant (default: "default")
- `isLoading?: boolean` - Shows loading state (default: false)
- `disabled?: boolean` - Disables the modal (default: false)

#### Variants

- `default` - Blue info icon and default button
- `destructive` - Red X icon and destructive button
- `warning` - Yellow warning icon and default button
- `info` - Blue info icon and default button
- `success` - Green check icon and default button

#### Usage

```tsx
import { ConfirmationModal } from "@/components/shared/confirmation-modal"

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await performAction()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Confirm Action</Button>
      
      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm Action"
        description="Are you sure you want to proceed with this action?"
        confirmText="Proceed"
        cancelText="Cancel"
        variant="warning"
        isLoading={isLoading}
      />
    </>
  )
}
```

## Examples

See `modal-examples.tsx` for complete usage examples of both components.

## Integration with Leave Requests

The `DeleteLeaveRequestDialog` component in `../leave-request/delete-leave-request-dialog.tsx` demonstrates how to create a specialized delete dialog using the reusable `DeleteModal` component.

## Features

- **Accessible**: Built on Radix UI primitives for full accessibility
- **Responsive**: Works on all screen sizes
- **Loading States**: Built-in loading indicators
- **Customizable**: Flexible props for different use cases
- **TypeScript**: Fully typed with TypeScript
- **Consistent Design**: Follows the application's design system 
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { DeleteModal, ConfirmationModal } from "./index"

export function ModalExamples() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log("Item deleted!")
    setIsLoading(false)
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log("Action confirmed!")
    setIsLoading(false)
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Modal Examples</h2>
      
      <div className="space-y-2">
        <h3 className="text-md font-medium">Delete Modal</h3>
        <Button onClick={() => setDeleteModalOpen(true)}>
          Open Delete Modal
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-md font-medium">Confirmation Modal</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setConfirmationModalOpen(true)}
          >
            Default Confirmation
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setConfirmationModalOpen(true)}
          >
            Warning Confirmation
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setConfirmationModalOpen(true)}
          >
            Success Confirmation
          </Button>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        itemName="Sample Item"
        isLoading={isLoading}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm Action"
        description="Are you sure you want to proceed with this action?"
        confirmText="Proceed"
        cancelText="Cancel"
        variant="default"
        isLoading={isLoading}
      />
    </div>
  )
} 
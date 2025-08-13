"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { DeleteModal } from "@/components/shared/delete-modal"
import { LeaveRequest } from "@timeoff/types"

interface DeleteLeaveRequestDialogProps {
    leaveRequest: LeaveRequest
    onDelete: (id: string) => Promise<void>
    disabled?: boolean
}

export function DeleteLeaveRequestDialog({
    leaveRequest,
    onDelete,
    disabled = false,
}: DeleteLeaveRequestDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            await onDelete(leaveRequest.id)
        } catch (error) {
            console.error("Failed to delete leave request:", error)
            // You might want to show a toast notification here
        } finally {
            setIsLoading(false)
        }
    }

    const formatDateRange = (startDate: Date, endDate: Date) => {
        const start = startDate
        const end = endDate
        return start === end ? start : `${start} - ${end}`
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
                disabled={disabled}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <DeleteModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleDelete}
                title="Delete Leave Request"
                description="Are you sure you want to delete this leave request? This action cannot be undone."
                itemName={`Leave request for ${formatDateRange(leaveRequest?.start_date, leaveRequest?.end_date)}`}
                isLoading={isLoading}
            />
        </>
    )
}
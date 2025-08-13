import { useState } from "react";
import { ConfirmationModal } from "../shared";
import { LeaveRequest } from "@timeoff/types";
import { CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ApproveLeaveRequestDialogProps {
    leaveRequest: LeaveRequest
    onApproveLeaveRequest: (id: string) => void
    isLoading?: boolean
}

export function ApproveLeaveRequestDialog({
    leaveRequest,
    onApproveLeaveRequest,
    isLoading = false,
}: ApproveLeaveRequestDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleConfirm = async () => {
        try {
            onApproveLeaveRequest(leaveRequest.id)
        } catch (error) {
            console.error("Failed to approve leave request:", error)
        }
    }
    return (
        <>

            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} disabled={leaveRequest.status === 'approved'}>
                <CheckCircle className={`h-4 w-4 ${leaveRequest.status === 'approved' ? 'text-green-500' : 'text-slate-500'}`} />
            </Button>
            <ConfirmationModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirm}
                title="Approve Leave Request"
                description="Are you sure you want to approve this leave request?"
                confirmText="Approve"
                cancelText="Cancel"
                variant="default"
                isLoading={isLoading}
            />
        </>
    )
}
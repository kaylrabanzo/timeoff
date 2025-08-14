import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { LeaveRequest } from "@timeoff/types";
import { XCircle, Clock, User, Calendar, FileText, AlertTriangle } from "lucide-react";
import { Badge } from "../ui/badge";
import { getLeaveTypeColor, getStatusColor } from "@/lib/utils";
import { format } from "date-fns";

interface EnhancedRejectDialogProps {
    leaveRequest: LeaveRequest
    onReject: (id: string, reason: string) => Promise<any>
    isLoading?: boolean
    trigger?: React.ReactNode
}

export function EnhancedRejectDialog({
    leaveRequest,
    onReject,
    isLoading = false,
    trigger
}: EnhancedRejectDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [reason, setReason] = useState("")

    const handleReject = async () => {
        if (!reason.trim()) {
            return
        }

        try {
            await onReject(leaveRequest.id, reason)
            setIsOpen(false)
            setReason("")
        } catch (error) {
            console.error("Failed to reject leave request:", error)
        }
    }

    const defaultTrigger = (
        <Button 
            variant="outline" 
            size="sm"
            disabled={leaveRequest.status !== 'pending'}
            className="text-red-600 hover:text-red-700"
        >
            <XCircle className="h-4 w-4" />
        </Button>
    )

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        Reject Leave Request
                    </DialogTitle>
                    <DialogDescription>
                        Please provide a reason for rejecting this request. This will be sent to the employee.
                    </DialogDescription>
                </DialogHeader>

                {/* Request Details */}
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">
                                {(leaveRequest as any).users?.first_name} {(leaveRequest as any).users?.last_name}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <Badge className={getLeaveTypeColor(leaveRequest.leave_type)}>
                                {leaveRequest.leave_type.replace('_', ' ')}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                                {format(new Date(leaveRequest.start_date), 'MMM d, yyyy')} - {format(new Date(leaveRequest.end_date), 'MMM d, yyyy')}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{leaveRequest.total_days} days</span>
                        </div>

                        {leaveRequest.reason && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Employee's Reason:</p>
                                <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                                    {leaveRequest.reason}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Rejection Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="reason" className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            Rejection Reason <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please explain why this request is being rejected..."
                            rows={4}
                            required
                        />
                        {!reason.trim() && (
                            <p className="text-sm text-red-500">A rejection reason is required.</p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setIsOpen(false)
                            setReason("")
                        }}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleReject}
                        disabled={isLoading || !reason.trim()}
                        variant="destructive"
                    >
                        {isLoading ? "Rejecting..." : "Reject Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

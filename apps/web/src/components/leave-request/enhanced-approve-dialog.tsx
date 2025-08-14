import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { LeaveRequest } from "@timeoff/types";
import { CheckCircle, Clock, User, Calendar, FileText } from "lucide-react";
import { Badge } from "../ui/badge";
import { getLeaveTypeColor, getStatusColor } from "@/lib/utils";
import { format } from "date-fns";

interface EnhancedApproveDialogProps {
    leaveRequest: LeaveRequest
    onApprove: (id: string, comments?: string) => Promise<any>
    isLoading?: boolean
    trigger?: React.ReactNode
}

export function EnhancedApproveDialog({
    leaveRequest,
    onApprove,
    isLoading = false,
    trigger
}: EnhancedApproveDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [comments, setComments] = useState("")

    const handleApprove = async () => {
        try {
            await onApprove(leaveRequest.id, comments || undefined)
            setIsOpen(false)
            setComments("")
        } catch (error) {
            console.error("Failed to approve leave request:", error)
        }
    }

    const defaultTrigger = (
        <Button 
            variant="outline" 
            size="sm"
            disabled={leaveRequest.status !== 'pending'}
            className="text-green-600 hover:text-green-700"
        >
            <CheckCircle className="h-4 w-4" />
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
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Approve Leave Request
                    </DialogTitle>
                    <DialogDescription>
                        Review the request details and add approval comments if needed.
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
                                <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                                <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                                    {leaveRequest.reason}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Comments */}
                    <div className="space-y-2">
                        <Label htmlFor="comments">Approval Comments (Optional)</Label>
                        <Textarea
                            id="comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Add any comments about this approval..."
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApprove}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isLoading ? "Approving..." : "Approve Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

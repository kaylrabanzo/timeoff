import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { LeaveRequest, RequestStatus, User } from "@timeoff/types"
import { getStatusColor } from "@/lib/utils"


export function ViewLeaveRequestDialog({
    trigger,
    request,
}: {
    trigger: React.ReactNode
    request: LeaveRequest & { user: User }
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
               {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src="" />
                            <AvatarFallback>
                                {request.user?.first_name.charAt(0)}{request.user?.last_name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        Leave Request Details
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">
                            {request.user?.first_name} {request.user?.last_name}
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Leave Type:</span>
                                <span className="capitalize">{request.leave_type.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Start Date:</span>
                                <span>{format(new Date(request.start_date), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">End Date:</span>
                                <span>{format(new Date(request.end_date), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Days:</span>
                                <span>{request.total_days}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <Badge className={getStatusColor(request.status as RequestStatus)}>
                                    {request.status}
                                </Badge>
                            </div>
                            {request.reason && (
                                <div>
                                    <span className="text-gray-600 block mb-1">Reason:</span>
                                    <p className="text-sm bg-gray-50 p-2 rounded">{request.reason}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
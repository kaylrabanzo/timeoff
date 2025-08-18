import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDatabaseService } from '@/providers/database-provider'
// import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { toast } from 'sonner'

interface UseLeaveRequestOperationsProps {
  userId: string
  onSuccess?: () => void
}

export function useLeaveRequestOperations({ userId, onSuccess }: UseLeaveRequestOperationsProps): {
  deleteLeaveRequest: ReturnType<typeof useMutation>['mutateAsync']
  cancelLeaveRequest: ReturnType<typeof useMutation>['mutateAsync']
  approveLeaveRequest: ReturnType<typeof useMutation>['mutateAsync']
  rejectLeaveRequest: ReturnType<typeof useMutation>['mutateAsync']
  bulkApprove: ReturnType<typeof useMutation>['mutateAsync']
  bulkReject: ReturnType<typeof useMutation>['mutateAsync']
  isDeletingLeaveRequest: boolean
  isCancellingLeaveRequest: boolean
  isApprovingLeaveRequest: boolean
  isRejectingLeaveRequest: boolean
  isBulkApproving: boolean
  isBulkRejecting: boolean
  rowSelection: Record<string, boolean>
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
} {
  const databaseService = useDatabaseService()
  const queryClient = useQueryClient()
  // const { toast } = useToast()
  const [rowSelection, setRowSelection] = useState({})

  // Delete leave request
  const { mutateAsync: deleteLeaveRequest, isPending: isDeletingLeaveRequest } = useMutation({
    mutationFn: (id: string) => databaseService.deleteLeaveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentRequests', userId] })
      queryClient.invalidateQueries({ queryKey: ['leaveBalance', userId] })
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] })
      queryClient.invalidateQueries({ queryKey: ['teamLeaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['allLeaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['personalLeaveRequests', userId] })
      
      onSuccess?.()
    },
    onError: (error) => {
      toast.error('Failed to delete leave request')
    }
  })

  // Cancel leave request
  const { mutateAsync: cancelLeaveRequest, isPending: isCancellingLeaveRequest } = useMutation({
    mutationFn: (id: string) => databaseService.cancelLeaveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentRequests', userId] })
      queryClient.invalidateQueries({ queryKey: ['personalLeaveRequests', userId] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error('Failed to cancel leave request')
    }
  })

  // Approve leave request
  const { mutateAsync: approveLeaveRequest, isPending: isApprovingLeaveRequest } = useMutation({
    mutationFn: ({ id, comments }: { id: string, comments?: string }) =>
      databaseService.approveLeaveRequest(id, userId, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentRequests', userId] })
      queryClient.invalidateQueries({ queryKey: ['teamLeaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['allLeaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['personalLeaveRequests', userId] })
      toast.success('Leave request approved successfully')
      onSuccess?.()
    },
    onError: (error) => {
      toast.error('Failed to approve leave request')
    }
  })

  // Reject leave request
  const { mutateAsync: rejectLeaveRequest, isPending: isRejectingLeaveRequest } = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) =>
      databaseService.rejectLeaveRequest(id, userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentRequests', userId] })
      queryClient.invalidateQueries({ queryKey: ['teamLeaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['allLeaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['personalLeaveRequests', userId] })
      toast.success('Leave request rejected')
      onSuccess?.()
    },
    onError: (error) => {
      toast.error('Failed to reject leave request')
    }
  })

  // Bulk approve
  const { mutateAsync: bulkApprove, isPending: isBulkApproving } = useMutation({
    mutationFn: (ids: string[]) =>
      databaseService.bulkUpdateLeaveRequests(ids, {
        status: 'approved',
        approver_id: userId,
        approved_at: new Date()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentRequests', userId] })
      queryClient.invalidateQueries({ queryKey: ['teamLeaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['allLeaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['personalLeaveRequests', userId] })
      toast.success('Selected requests approved successfully')
      setRowSelection({})
      onSuccess?.()
    },
    onError: (error) => {
      toast.error('Failed to approve selected requests')
    }
  })

  // Bulk reject
  const { mutateAsync: bulkReject, isPending: isBulkRejecting } = useMutation({
    mutationFn: (ids: string[]) =>
      databaseService.bulkUpdateLeaveRequests(ids, {
        status: 'rejected',
        approver_id: userId,
        rejected_at: new Date()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentRequests', userId] })
      queryClient.invalidateQueries({ queryKey: ['teamLeaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['allLeaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['personalLeaveRequests', userId] })
      toast.success('Selected requests rejected')
      setRowSelection({})
      onSuccess?.()
    },
    onError: (error) => {
      toast.error('Failed to reject selected requests')
    }
  })

  return {
    // Individual operations
    deleteLeaveRequest: deleteLeaveRequest as ReturnType<typeof useMutation>['mutateAsync'] ,
    cancelLeaveRequest: cancelLeaveRequest as ReturnType<typeof useMutation>['mutateAsync'],
    approveLeaveRequest: approveLeaveRequest as ReturnType<typeof useMutation>['mutateAsync'],
    rejectLeaveRequest: rejectLeaveRequest as ReturnType<typeof useMutation>['mutateAsync'],
    
    // Bulk operations
    bulkApprove: bulkApprove as ReturnType<typeof useMutation>['mutateAsync'],
    bulkReject: bulkReject as ReturnType<typeof useMutation>['mutateAsync'],
    
    // Loading states
    isDeletingLeaveRequest,
    isCancellingLeaveRequest,
    isApprovingLeaveRequest,
    isRejectingLeaveRequest,
    isBulkApproving,
    isBulkRejecting,
    
    // Row selection state
    rowSelection,
    setRowSelection
  }
}

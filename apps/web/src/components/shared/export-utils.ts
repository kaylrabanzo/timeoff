import { LeaveRequest } from '@timeoff/types'
import { format } from 'date-fns'

export interface ExportOptions {
  includeEmployeeNames?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
  filename?: string
}

// CSV Export
export const exportToCSV = (data: LeaveRequest[], options: ExportOptions = {}) => {
  const { includeEmployeeNames = true, filename = 'leave-requests' } = options

  const headers = [
    ...(includeEmployeeNames ? ['Employee Name'] : []),
    'Employee ID',
    'Leave Type',
    'Start Date',
    'End Date',
    'Total Days',
    'Status',
    'Reason',
    'Approved By',
    'Approved Date',
    'Rejection Reason',
    'Created Date'
  ]

  const csvContent = [
    headers.join(','),
    ...data.map(request => [
      ...(includeEmployeeNames ? [
        (request as any).users ? 
          `"${(request as any).users.first_name} ${(request as any).users.last_name}"` : 
          `"${request.user_id}"`
      ] : []),
      `"${request.user_id}"`,
      `"${request.leave_type.replace('_', ' ')}"`,
      `"${format(new Date(request.start_date), 'yyyy-MM-dd')}"`,
      `"${format(new Date(request.end_date), 'yyyy-MM-dd')}"`,
      `"${request.total_days}"`,
      `"${request.status}"`,
      `"${request.reason || ''}"`,
      `"${request.approver_id || ''}"`,
      `"${request.approved_at ? format(new Date(request.approved_at), 'yyyy-MM-dd') : ''}"`,
      `"${request.rejection_reason || ''}"`,
      `"${format(new Date(request.created_at), 'yyyy-MM-dd HH:mm')}"`
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

// Excel Export (using CSV format that Excel can read)
export const exportToExcel = (data: LeaveRequest[], options: ExportOptions = {}) => {
  const { includeEmployeeNames = true, filename = 'leave-requests' } = options

  const headers = [
    ...(includeEmployeeNames ? ['Employee Name'] : []),
    'Employee ID',
    'Leave Type',
    'Start Date',
    'End Date',
    'Total Days',
    'Status',
    'Reason',
    'Approved By',
    'Approved Date',
    'Rejection Reason',
    'Created Date'
  ]

  // Create tab-separated values for better Excel compatibility
  const tsvContent = [
    headers.join('\t'),
    ...data.map(request => [
      ...(includeEmployeeNames ? [
        (request as any).users ? 
          `${(request as any).users.first_name} ${(request as any).users.last_name}` : 
          request.user_id
      ] : []),
      request.user_id,
      request.leave_type.replace('_', ' '),
      format(new Date(request.start_date), 'yyyy-MM-dd'),
      format(new Date(request.end_date), 'yyyy-MM-dd'),
      request.total_days,
      request.status,
      request.reason || '',
      request.approver_id || '',
      request.approved_at ? format(new Date(request.approved_at), 'yyyy-MM-dd') : '',
      request.rejection_reason || '',
      format(new Date(request.created_at), 'yyyy-MM-dd HH:mm')
    ].join('\t'))
  ].join('\n')

  const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.xls`
  link.click()
  window.URL.revokeObjectURL(url)
}

// JSON Export
export const exportToJSON = (data: LeaveRequest[], options: ExportOptions = {}) => {
  const { filename = 'leave-requests' } = options

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.json`
  link.click()
  window.URL.revokeObjectURL(url)
}

// Simple PDF Report Generator (using HTML to PDF technique)
export const exportToPDF = (data: LeaveRequest[], options: ExportOptions = {}) => {
  const { includeEmployeeNames = true, filename = 'leave-requests' } = options

  // Create a printable HTML document
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Leave Requests Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        tr:nth-child(even) { background-color: #f8f9fa; }
        .status-pending { color: #856404; background-color: #fff3cd; }
        .status-approved { color: #155724; background-color: #d4edda; }
        .status-rejected { color: #721c24; background-color: #f8d7da; }
        .status-cancelled { color: #6c757d; background-color: #e2e3e5; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>Leave Requests Report</h1>
      <p>Generated on: ${format(new Date(), 'MMMM d, yyyy at h:mm a')}</p>
      <p>Total Records: ${data.length}</p>
      
      <table>
        <thead>
          <tr>
            ${includeEmployeeNames ? '<th>Employee</th>' : ''}
            <th>Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Days</th>
            <th>Status</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(request => `
            <tr>
              ${includeEmployeeNames ? `
                <td>${(request as any).users ? 
                  `${(request as any).users.first_name} ${(request as any).users.last_name}` : 
                  request.user_id
                }</td>
              ` : ''}
              <td>${request.leave_type.replace('_', ' ')}</td>
              <td>${format(new Date(request.start_date), 'MMM d, yyyy')}</td>
              <td>${format(new Date(request.end_date), 'MMM d, yyyy')}</td>
              <td>${request.total_days}</td>
              <td class="status-${request.status}">${request.status.toUpperCase()}</td>
              <td>${request.reason || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>This report was generated automatically by the Time-Off Management System.</p>
      </div>
    </body>
    </html>
  `

  // Open in new window and trigger print dialog
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    
    // Trigger print dialog after content loads
    printWindow.onload = () => {
      printWindow.print()
      // Note: In a real application, you might want to automatically close
      // the window after printing, but this can be intrusive to users
    }
  }
}

// Summary Statistics Export
export const exportSummaryReport = (data: LeaveRequest[], options: ExportOptions = {}) => {
  const { filename = 'leave-summary' } = options

  // Calculate statistics
  const stats = {
    total: data.length,
    pending: data.filter(r => r.status === 'pending').length,
    approved: data.filter(r => r.status === 'approved').length,
    rejected: data.filter(r => r.status === 'rejected').length,
    cancelled: data.filter(r => r.status === 'cancelled').length,
    totalDays: data.reduce((sum, r) => sum + r.total_days, 0),
    byType: data.reduce((acc, r) => {
      acc[r.leave_type] = (acc[r.leave_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const summaryContent = `Leave Requests Summary Report
Generated: ${format(new Date(), 'MMMM d, yyyy at h:mm a')}

OVERVIEW
========
Total Requests: ${stats.total}
Total Days Requested: ${stats.totalDays}

STATUS BREAKDOWN
================
Pending: ${stats.pending} (${((stats.pending / stats.total) * 100).toFixed(1)}%)
Approved: ${stats.approved} (${((stats.approved / stats.total) * 100).toFixed(1)}%)
Rejected: ${stats.rejected} (${((stats.rejected / stats.total) * 100).toFixed(1)}%)
Cancelled: ${stats.cancelled} (${((stats.cancelled / stats.total) * 100).toFixed(1)}%)

LEAVE TYPE BREAKDOWN
====================
${Object.entries(stats.byType)
  .map(([type, count]) => `${type.replace('_', ' ')}: ${count} (${((count / stats.total) * 100).toFixed(1)}%)`)
  .join('\n')}

---
Report generated by Time-Off Management System
`

  const blob = new Blob([summaryContent], { type: 'text/plain;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.txt`
  link.click()
  window.URL.revokeObjectURL(url)
}

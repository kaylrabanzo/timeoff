import { getLeaveTypeColor, getStatusColor } from "@/lib/utils";
import { Table, TableBody, TableHead, TableRow, TableHeader, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Edit, Eye, ArrowUpDown, Search, Check, CheckCircle, X, Download, Filter, MoreHorizontal, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { LeaveRequest, User, RequestStatus, LeaveType } from '@timeoff/types';
import { useSession } from "next-auth/react";
import { getLeaveTypeLabel } from "../shared/calendar/calendar-grid";
import { DeleteLeaveRequestDialog } from "./delete-leave-request-dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
    type SortingState,
    type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { EnhancedApproveDialog } from "./enhanced-approve-dialog";
import { EnhancedRejectDialog } from "./enhanced-reject-dialog";
import { ExportMenu } from "../shared/export-menu";
import { ViewLeaveRequestDialog } from "../dashboard/view-leave-request-dialog";
import { useLeaveRequestOperations } from "@/hooks/use-leave-request-operations";

interface DataTableProps {
    data: LeaveRequest[]
    showEmployeeColumn?: boolean
    showBulkActions?: boolean
    isManager?: boolean
}

export function DataTable({ data, showEmployeeColumn = true, showBulkActions = false, isManager = false }: DataTableProps) {
    const { data: session } = useSession()
    const user = session?.user as unknown as User

    // TanStack Table state
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("all")

    // Use the leave request operations hook
    const {
        deleteLeaveRequest,
        cancelLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        bulkApprove,
        bulkReject,
        isDeletingLeaveRequest,
        isCancellingLeaveRequest,
        isApprovingLeaveRequest,
        isRejectingLeaveRequest,
        isBulkApproving,
        isBulkRejecting,
        rowSelection,
        setRowSelection
    } = useLeaveRequestOperations({
        userId: user.id,
        onSuccess: () => {
            // Additional success handling if needed
        }
    })

    const handleDelete = async (id: string) => {
        try {
            await deleteLeaveRequest(id)
            toast.success('Leave request deleted successfully')
        } catch (error) {
            console.error(error)
            toast.error('Failed to delete leave request')
        }
    }

    // Filter data based on filters
    const filteredData = useMemo(() => {
        let filtered = data

        if (statusFilter !== "all") {
            filtered = filtered.filter(item => item.status === statusFilter)
        }

        if (leaveTypeFilter !== "all") {
            filtered = filtered.filter(item => item.leave_type === leaveTypeFilter)
        }

        return filtered
    }, [data, statusFilter, leaveTypeFilter])

    // Get selected row IDs
    const selectedRowIds = useMemo(() => {
        return Object.keys(rowSelection).filter(id => (rowSelection as any)[id])
    }, [rowSelection])

    // Bulk action handlers
    const handleBulkApprove = () => {
        if (selectedRowIds.length === 0) {
            toast.error('Please select requests to approve')
            return
        }
        bulkApprove(selectedRowIds)
    }

    const handleBulkReject = () => {
        if (selectedRowIds.length === 0) {
            toast.error('Please select requests to reject')
            return
        }
        bulkReject(selectedRowIds)
    }

    // Export functionality is now handled by ExportMenu component

    // Create column helper
    const columnHelper = createColumnHelper<LeaveRequest>()

    // Define columns
    const columns = useMemo(() => {
        const baseColumns = []

        // Add selection column for bulk operations
        if (showBulkActions && isManager) {
            baseColumns.push(
                columnHelper.display({
                    id: 'select',
                    header: ({ table }) => (
                        <Checkbox
                            checked={table.getIsAllPageRowsSelected()}
                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Select all"
                        />
                    ),
                    cell: ({ row }) => (
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label="Select row"
                        />
                    ),
                    enableSorting: false,
                    enableHiding: false,
                })
            )
        }

        // Employee column (conditionally shown)
        if (showEmployeeColumn) {
            baseColumns.push(
                columnHelper.accessor('user_id', {
                    id: 'employee',
                    header: ({ column }) => (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="h-auto p-0 font-medium"
                        >
                            Employee
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    ),
                    cell: ({ getValue, row }) => {
                        const request = row.original as any

                        console.log(request)
                        return (
                            <div className="font-medium">
                                {request.users ?
                                    `${request.users.first_name} ${request.users.last_name}` :
                                    (getValue() === user?.id ? 'You' : getValue())
                                }
                            </div>
                        )
                    },
                    filterFn: "includesString",
                })
            )
        }

        // Rest of the columns
        baseColumns.push(
            columnHelper.accessor('leave_type', {
                id: 'type',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-auto p-0 font-medium"
                    >
                        Type
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ getValue }) => (
                    <Badge className={getLeaveTypeColor(getValue())}>
                        {getLeaveTypeLabel(getValue())}
                    </Badge>
                ),
            }),
            columnHelper.accessor(
                (row) => ({ start: row.start_date, end: row.end_date }),
                {
                    id: 'dates',
                    header: ({ column }) => (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="h-auto p-0 font-medium"
                        >
                            Dates
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    ),
                    cell: ({ getValue }) => {
                        const { start, end } = getValue()
                        return `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`
                    },
                    sortingFn: (rowA, rowB) => {
                        const dateA = new Date(rowA.original.start_date).getTime()
                        const dateB = new Date(rowB.original.start_date).getTime()
                        return dateA - dateB
                    },
                }
            ),
            columnHelper.accessor('total_days', {
                id: 'days',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-auto p-0 font-medium"
                    >
                        Days
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ getValue }) => getValue(),
            }),
            columnHelper.accessor('status', {
                id: 'status',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-auto p-0 font-medium"
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ getValue }) => (
                    <Badge className={getStatusColor(getValue())}>
                        <span className="capitalize">{getValue()}</span>
                    </Badge>
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const request = row.original as unknown as LeaveRequest & { user: User, users: User }
                    const canApprove = isManager && request.status === 'pending'
                    const canEdit = request.user_id === user?.id && request.status === 'pending'
                    const canDelete = isManager

                    request.user = request.users

                    return (
                        <div className="flex gap-1">
                            {canApprove && (
                                <>
                                    <EnhancedApproveDialog
                                        leaveRequest={request}
                                        onApprove={async (id, comments) => {
                                            await approveLeaveRequest({ id, comments })
                                        }}
                                        isLoading={isApprovingLeaveRequest}
                                    />
                                    <EnhancedRejectDialog
                                        leaveRequest={request}
                                        onReject={async (id, reason) => {
                                            await rejectLeaveRequest({ id, reason })
                                        }}
                                        isLoading={isRejectingLeaveRequest}
                                    />
                                </>
                            )}


                            <ViewLeaveRequestDialog
                                trigger={
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                }
                                request={request as unknown as LeaveRequest & { user: User }}
                            />

                            {canEdit && (
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            )}

                            {canDelete && (
                                <DeleteLeaveRequestDialog
                                    leaveRequest={request}
                                    onDelete={handleDelete}
                                />
                            )}

                            {/* More actions dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {isManager && request.status === 'pending' && (
                                        <>
                                            <EnhancedApproveDialog
                                                leaveRequest={request}
                                                onApprove={async (id, comments) => {
                                                    await approveLeaveRequest({ id, comments })
                                                }}
                                                isLoading={isApprovingLeaveRequest}
                                                trigger={
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Approve
                                                    </DropdownMenuItem>
                                                }
                                            />
                                            <EnhancedRejectDialog
                                                leaveRequest={request}
                                                onReject={async (id, reason) => {
                                                    await rejectLeaveRequest({ id, reason })
                                                }}
                                                isLoading={isRejectingLeaveRequest}
                                                trigger={
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <X className="mr-2 h-4 w-4" />
                                                        Reject
                                                    </DropdownMenuItem>
                                                }
                                            />
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <ViewLeaveRequestDialog
                                            trigger={<div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </div>}
                                            request={request as unknown as LeaveRequest & { user: User }}
                                        />
                                    </DropdownMenuItem>
                                    {canDelete && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
            })
        )

        return baseColumns
    }, [user?.id, handleDelete, columnHelper, showBulkActions, isManager, showEmployeeColumn, approveLeaveRequest, rejectLeaveRequest, isApprovingLeaveRequest, isRejectingLeaveRequest])

    // Create table instance
    const table = useReactTable({
        data: filteredData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        enableRowSelection: showBulkActions && isManager,
        getRowId: (row) => row.id,
    })

    return (
        <div className="w-full">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search leave requests..."
                                value={globalFilter ?? ""}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="pl-8"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="vacation">Vacation</SelectItem>
                                <SelectItem value="sick">Sick</SelectItem>
                                <SelectItem value="personal">Personal</SelectItem>
                                <SelectItem value="maternity">Maternity</SelectItem>
                                <SelectItem value="paternity">Paternity</SelectItem>
                                <SelectItem value="bereavement">Bereavement</SelectItem>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <ExportMenu
                            data={filteredData}
                            filename="leave-requests"
                            includeEmployeeNames={showEmployeeColumn}
                        />
                    </div>
                </div>

                {/* Bulk Actions */}
                {showBulkActions && isManager && selectedRowIds.length > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">
                            {selectedRowIds.length} item(s) selected
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBulkApprove}
                            disabled={isBulkApproving}
                            className="text-green-600 hover:text-green-700"
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Approve Selected
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBulkReject}
                            disabled={isBulkRejecting}
                            className="text-red-600 hover:text-red-700"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Reject Selected
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRowSelection({})}
                        >
                            Clear Selection
                        </Button>
                    </div>
                )}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value))
                        }}
                        className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
                    >
                        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>{" "}
                    results
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        First
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                        <div className="text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        Last
                    </Button>
                </div>
            </div>

        </div>
    )
}
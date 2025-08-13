import { getLeaveTypeColor, getStatusColor } from "@/lib/utils";
import { Table, TableBody, TableHead, TableRow, TableHeader, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Edit, Eye, ArrowUpDown, Search, Check, CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { LeaveRequest, User } from '@timeoff/types';
import { useSession } from "next-auth/react";
import { getLeaveTypeLabel } from "../shared/calendar/calendar-grid";
import { DeleteLeaveRequestDialog } from "./delete-leave-request-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseService } from "@timeoff/database";
import { toast } from "sonner";
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
import { ConfirmationModal } from "../shared";
import { ApproveLeaveRequestDialog } from "./approve-leave-request-dialog";

export function DataTable({ data }: { data: LeaveRequest[] }) {
    const { data: session } = useSession()
    const user = session?.user as unknown as User
    const queryClient = useQueryClient()

    // TanStack Table state
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("");

    const { mutateAsync: deleteLeaveRequest, isPending: isDeletingLeaveRequest } = useMutation({
        mutationFn: (id: string) => databaseService.deleteLeaveRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recentRequests', user.id] })
        },
        onError: (error) => {
            toast.error('Failed to delete leave request')
        }
    })

    const { mutateAsync: cancelLeaveRequest, isPending: isCancellingLeaveRequest } = useMutation({
        mutationFn: (id: string) => databaseService.cancelLeaveRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recentRequests', user.id] })
        },
        onError: (error) => {
            toast.error('Failed to cancel leave request')
        }
    })

    // approve leave request
    const { mutateAsync: approveLeaveRequest, isPending: isApprovingLeaveRequest } = useMutation({
        mutationFn: (id: string) => databaseService.updateLeaveRequest(id, { status: 'approved' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recentRequests', user.id] })
        },
        onError: (error) => {
            toast.error('Failed to approve leave request')
        }
    })

    const handleDelete = async (id: string) => {
        try {
            // await cancelLeaveRequest(id)
            await deleteLeaveRequest(id)
            toast.success('Leave request deleted successfully')
        } catch (error) {
            console.error(error)
            toast.error('Failed to delete leave request')
        }
    }

    // Create column helper
    const columnHelper = createColumnHelper<LeaveRequest>()

    // Define columns
    const columns = useMemo(() => [
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
            cell: ({ getValue }) => (
                <div className="font-medium">
                    {getValue() === user?.id ? 'You' : getValue()}
                </div>
            ),
            filterFn: "includesString",
        }),
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
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <ApproveLeaveRequestDialog
                        leaveRequest={row.original}
                        onApproveLeaveRequest={(id) => approveLeaveRequest(id.toString())}
                        isLoading={isApprovingLeaveRequest}
                    />
                    <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <DeleteLeaveRequestDialog
                        leaveRequest={row.original}
                        onDelete={handleDelete}
                    />
                </div>
            ),
        }),
    ], [user?.id, handleDelete, columnHelper])

    // Create table instance
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    return (
        <div className="w-full">
            {/* Search and Filters */}
            <div className="flex items-center py-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search leave requests..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-8"
                    />
                </div>
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
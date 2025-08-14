import { useState } from "react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet, FileJson, Printer, BarChart3 } from "lucide-react"
import { LeaveRequest } from "@timeoff/types"
import { exportToCSV, exportToExcel, exportToJSON, exportToPDF, exportSummaryReport, ExportOptions } from "./export-utils"

interface ExportMenuProps {
  data: LeaveRequest[]
  filename?: string
  includeEmployeeNames?: boolean
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function ExportMenu({
  data,
  filename = "leave-requests",
  includeEmployeeNames = true,
  variant = "outline",
  size = "sm"
}: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportOptions: ExportOptions = {
    includeEmployeeNames,
    filename
  }

  const handleExport = async (exportFn: (data: LeaveRequest[], options: ExportOptions) => void) => {
    if (data.length === 0) {
      return
    }

    setIsExporting(true)
    try {
      exportFn(data, exportOptions)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  if (data.length === 0) {
    return (
      <Button variant={variant} size={size} disabled>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleExport(exportToCSV)}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
          <span className="ml-auto text-xs text-gray-500">{data.length} rows</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleExport(exportToExcel)}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
          <span className="ml-auto text-xs text-gray-500">{data.length} rows</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleExport(exportToJSON)}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
          <span className="ml-auto text-xs text-gray-500">{data.length} rows</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleExport(exportToPDF)}>
          <Printer className="mr-2 h-4 w-4" />
          Print Report
          <span className="ml-auto text-xs text-gray-500">PDF</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleExport(exportSummaryReport)}>
          <BarChart3 className="mr-2 h-4 w-4" />
          Summary Report
          <span className="ml-auto text-xs text-gray-500">TXT</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

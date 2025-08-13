export function CalendarLegend({ className, legendType = 'vertical', canViewTeamCalendar = false }: { className?: string, legendType?: 'horizontal' | 'vertical', canViewTeamCalendar?: boolean }) {
    return (
        <div className={`py-4 ${className}`}>
            <h4 className="font-medium mb-3">Legend</h4>
            <div className={`flex gap-2 ${legendType === 'horizontal' ? 'flex-row flex-wrap items-center ' : 'flex-col'}`}>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Vacation</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Sick</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span>Personal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500" />
                    <span>Maternity</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span>Paternity</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Unpaid</span>
                </div>
                {canViewTeamCalendar && (
                    <div className="text-xs text-gray-500 mt-2">
                        <p>Events show in calendar cells</p>
                        <p>Click to view details</p>
                    </div>
                )}
            </div>
        </div>
    )
}
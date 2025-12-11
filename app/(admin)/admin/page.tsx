
export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards Placeholders */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-sm text-gray-400">Total Users</div>
                    <div className="text-2xl font-bold">1,234</div>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-sm text-gray-400">Active Events</div>
                    <div className="text-2xl font-bold">3</div>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-sm text-gray-400">Registrations</div>
                    <div className="text-2xl font-bold">567</div>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-sm text-gray-400">Pending Approvals</div>
                    <div className="text-2xl font-bold text-yellow-500">12</div>
                </div>
            </div>

            {/* Charts will go here */}
            <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 h-96 flex items-center justify-center text-gray-500">
                Chart Area Placeholder
            </div>
        </div>
    )
}

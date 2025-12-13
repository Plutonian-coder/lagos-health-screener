import React, { useState } from 'react';
import {
    Users, Activity, Calendar, Stethoscope, Bell, Menu,
    Search, ChevronLeft, ChevronRight, LogOut, LayoutDashboard,
    Settings, UserPlus, FileText, AlertCircle, HeartPulse, Clock as ClockIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from './clock';

// Mock Data for Charts/Metrics
const METRICS = [
    { label: 'Total Patients Today', value: '142', change: '+12%', icon: Users, color: 'text-blue-500' },
    { label: 'Emergency Cases', value: '8', change: '-2', icon: AlertCircle, color: 'text-red-500' },
    { label: 'Doctors On Duty', value: '18', change: 'Full', icon: Stethoscope, color: 'text-green-500' },
    { label: 'Appointments', value: '64', change: '+8 pending', icon: Calendar, color: 'text-orange-500' },
];

const RECENT_ACTIVITY = [
    { id: 1, text: 'Dr. Bale checked in Patient #4920', time: '2m ago', type: 'check-in' },
    { id: 2, text: 'Emergency Alert: ICU Bed 04 requested', time: '15m ago', type: 'alert' },
    { id: 3, text: 'New Appointment: Cardiology - 2:00 PM', time: '1h ago', type: 'appt' },
];

export default function HospitalDashboard({
    hospitalName = "Lagos General",
    onLogout,
    doctors = [],
    onUpdateStatus
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Sidebar Menu Items
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'roster', label: 'Doctor Roster', icon: Stethoscope },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'reports', label: 'Medical Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden">

            {/* Sidebar */}
            <motion.aside
                animate={{ width: isSidebarCollapsed ? 80 : 280 }}
                className="h-full border-r border-zinc-800 bg-zinc-950 flex flex-col relative z-20"
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-zinc-800 gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                        <HeartPulse className="text-black" size={20} />
                    </div>
                    {!isSidebarCollapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-lg tracking-tight whitespace-nowrap"
                        >
                            Express<span className="text-green-500">Care</span>
                        </motion.span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                ${activeTab === item.id
                                    ? 'bg-green-500/10 text-green-500'
                                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            {!isSidebarCollapsed && (
                                <span className="font-medium">{item.label}</span>
                            )}
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-green-500 rounded-r-full" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* User / Logout */}
                <div className="p-4 border-t border-zinc-800">
                    <div className={`flex items-center gap-3 p-2 rounded-xl bg-zinc-900 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                            <span className="text-xs font-bold">HA</span>
                        </div>
                        {!isSidebarCollapsed && (
                            <div className="flex-1 overflow-hidden">
                                <div className="text-sm font-bold truncate">{hospitalName}</div>
                                <div className="text-xs text-zinc-500">Admin Access</div>
                            </div>
                        )}
                        {!isSidebarCollapsed && (
                            <button
                                onClick={onLogout}
                                className="text-zinc-500 hover:text-red-500 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="absolute -right-3 top-20 bg-zinc-800 border border-zinc-700 text-zinc-400 p-1 rounded-full hover:text-white hover:bg-zinc-700 transition-all z-30"
                >
                    {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full bg-black relative overflow-hidden">

                {/* Top Header */}
                <header className="h-16 border-b border-zinc-800 bg-black/50 backdrop-blur-md flex items-center justify-between px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </h2>
                        <span className="text-zinc-600 text-sm hidden md:inline-block">/ Dashboard</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Clock />

                        <div className="h-8 w-px bg-zinc-800 hidden md:block" />

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-green-500 transition-colors w-64"
                            />
                        </div>

                        <button className="relative text-zinc-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </button>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Top Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {METRICS.map((metric, i) => (
                                <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-zinc-900 group-hover:bg-zinc-800 transition-colors ${metric.color}`}>
                                            <metric.icon size={22} />
                                        </div>
                                        {metric.change.includes('+') ? (
                                            <span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">{metric.change}</span>
                                        ) : (
                                            <span className="text-zinc-500 text-xs bg-zinc-900 px-2 py-1 rounded-full">{metric.change}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-white mb-1">{metric.value}</h3>
                                        <p className="text-zinc-500 text-sm font-medium">{metric.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Dashboard Split */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column (2/3) */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Doctor Roster & Status */}
                                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
                                    <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Doctor Roster</h3>
                                            <p className="text-zinc-500 text-sm">Live availability updates</p>
                                        </div>
                                        <button className="text-sm text-green-500 font-bold hover:underline">View All Schedule</button>
                                    </div>

                                    <div className="divide-y divide-zinc-800">
                                        {doctors.length > 0 ? doctors.slice(0, 5).map((doc) => (
                                            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <img src={doc.image || 'https://via.placeholder.com/40'} alt={doc.name} className="w-10 h-10 rounded-full object-cover border border-zinc-700" />
                                                    <div>
                                                        <div className="font-bold text-white">{doc.name}</div>
                                                        <div className="text-xs text-zinc-500">{doc.specialty}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {/* Status Controls */}
                                                    <select
                                                        className="bg-black border border-zinc-800 text-xs text-white rounded px-2 py-1 focus:border-green-500 outline-none"
                                                        value={doc.statusOverride || ''}
                                                        onChange={(e) => onUpdateStatus && onUpdateStatus(doc.id, e.target.value || null)}
                                                    >
                                                        <option value="">Auto (Active)</option>
                                                        <option value="Offline">Set Offline</option>
                                                    </select>

                                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${doc.statusOverride === 'Offline'
                                                        ? 'bg-zinc-900 text-zinc-500 border-zinc-800'
                                                        : 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        }`}>
                                                        {doc.statusOverride === 'Offline' ? 'OFFLINE' : 'ONLINE'}
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-8 text-center text-zinc-500">No doctors registered yet.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Patient Queue Preview */}
                                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-white mb-6">Patient Queue (ER)</h3>
                                    <div className="grid gap-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800 w-full hover:border-zinc-700 transition-all cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                                                        #{390 + i}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">Emergency - Trauma</div>
                                                        <div className="text-xs text-zinc-500">Wait time: {10 * i} mins</div>
                                                    </div>
                                                </div>
                                                <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200">
                                                    Admit
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Right Column (1/3) */}
                            <div className="space-y-8">

                                {/* Analytics Card */}
                                <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                                    <h3 className="text-lg font-bold text-white mb-2 relative z-10">Hospital Efficiency</h3>
                                    <div className="text-4xl font-bold text-green-500 mb-1 relative z-10">94%</div>
                                    <p className="text-zinc-500 text-xs mb-6 relative z-10">Running optimal capacity</p>

                                    {/* Fake Chart Bars */}
                                    <div className="flex items-end gap-2 h-20 relative z-10">
                                        {[40, 60, 45, 70, 85, 94, 80].map((h, i) => (
                                            <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-green-500/20 rounded-t-sm hover:bg-green-500 transition-colors"></div>
                                        ))}
                                    </div>

                                    {/* Background Glow */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 blur-3xl rounded-full"></div>
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                                    <div className="space-y-6 relative border-l border-zinc-800 ml-2 pl-6">
                                        {RECENT_ACTIVITY.map((act) => (
                                            <div key={act.id} className="relative">
                                                <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-black ${act.type === 'alert' ? 'bg-red-500' : 'bg-zinc-600'
                                                    }`}></div>
                                                <p className="text-sm text-zinc-300 mb-1">{act.text}</p>
                                                <p className="text-xs text-zinc-600">{act.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shift Manager */}
                                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Shift Manager</h3>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-sm text-zinc-400">Day Shift</div>
                                        <div className="text-sm font-bold text-white">08:00 - 16:00</div>
                                    </div>
                                    <div className="w-full bg-zinc-900 rounded-full h-2 mb-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                    </div>
                                    <div className="text-right text-xs text-blue-500 font-bold">2 hours remaining</div>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

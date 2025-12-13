"use client"
import React from 'react';
import { RealTimeAnalytics } from "@/components/ui/real-time-analytics";
import { AnalogClock } from "@/components/ui/analog-clock";
import { cn } from "@/lib/utils";
import { User, Activity, Calendar, FileText, BadgeDollarSign, LayoutDashboard, LogOut, Search, Bell, HeartHandshake, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientDashboardProps {
    userName?: string;
    onLogout?: () => void;
}

export function PatientDashboard({ userName = "User", onLogout }: PatientDashboardProps) {
    const [activeTab, setActiveTab] = React.useState("overview");

    // Mock Data for Real Statistics
    const orders = [
        { id: 'ORD-2938', hospital: 'Lagos Island General', service: 'Full Body Scan', date: 'Oct 24, 2024', status: 'Completed', feedback: '4.8/5' },
        { id: 'ORD-8473', hospital: 'Blue Cross Hospital', service: 'Malaria Treatment', date: 'Nov 02, 2024', status: 'Processing', feedback: 'Pending' },
        { id: 'ORD-1102', hospital: 'Reddington Hospital', service: 'Cardiology Consult', date: 'Dec 10, 2024', status: 'Booked', feedback: 'Pending' },
    ];

    const appointments = [
        { id: 'APT-1', doctor: 'Dr. A. Okonkwo', type: 'Cardiologist', date: 'Dec 15, 2024', time: '10:00 AM', hospital: 'Reddington Hospital' },
        { id: 'APT-2', doctor: 'Dr. B. Adeyemi', type: 'General Practitioner', date: 'Dec 20, 2024', time: '02:00 PM', hospital: 'Lagos Island General' },
    ];

    const aiSummaries = [
        { id: 'SUM-001', date: 'Dec 12, 2024', complaint: 'Severe Migraine with Aura', risk: 'Yellow', advice: 'Monitor blood pressure, consult neurologist.' },
        { id: 'SUM-002', date: 'Nov 05, 2024', complaint: 'Mild Fever & Fatigue', risk: 'Green', advice: 'Rest and hydration recommended.' },
    ];

    return (
        <div className="min-h-screen bg-black flex font-sans text-slate-100">
            {/* Sidebar */}
            <aside className="w-20 lg:w-64 bg-black/50 border-r border-white/10 flex flex-col fixed h-full z-20 backdrop-blur-xl">
                <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
                    <div className="size-10 bg-green-500 rounded-xl flex items-center justify-center text-black shadow-lg shadow-green-900/50">
                        <Activity size={24} />
                    </div>
                    <span className="ml-3 font-bold text-lg hidden lg:block text-white">Express<span className="text-green-500">Care</span></span>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-2">
                    <NavButton icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <NavButton icon={Calendar} label="Booked Orders" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
                    <NavButton icon={FileText} label="AI Summaries" active={activeTab === 'summaries'} onClick={() => setActiveTab('summaries')} />
                    <NavButton icon={HeartHandshake} label="Crowd Funding" active={activeTab === 'funding'} onClick={() => setActiveTab('funding')} />
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button onClick={onLogout} className="flex items-center justify-center lg:justify-start w-full p-3 text-slate-400 hover:bg-white/5 hover:text-red-500 rounded-xl transition-all gap-3">
                        <LogOut size={20} />
                        <span className="hidden lg:block font-medium">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-20 lg:ml-64 relative">
                {/* Header */}
                <header className="h-20 bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10 px-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {activeTab === 'overview' && 'Dashboard Overview'}
                            {activeTab === 'appointments' && 'My Bookings'}
                            {activeTab === 'summaries' && 'Health Reports'}
                            {activeTab === 'funding' && 'Crowd Funding Support'}
                        </h1>
                        <p className="text-slate-500 text-sm">Welcome back, {userName}</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-400 hover:bg-white/10 rounded-full transition-colors">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-black"></span>
                            </button>
                            <div className="size-10 bg-white/10 rounded-full flex items-center justify-center overflow-hidden border border-white/20">
                                <User size={20} className="text-slate-300" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 space-y-8">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatsCard title="Total Orders" value="12" icon={Calendar} trend="+2 this month" color="blue" />
                                <StatsCard title="Funds Received" value="₦ 450,000" icon={BadgeDollarSign} trend="Crowd Funding" color="green" />
                                <StatsCard title="Avg. Feedback" value="4.8" icon={Activity} trend="Based on 5 visits" color="purple" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Recent Activity / Orders Table */}
                                <div className="lg:col-span-2 bg-white/5 rounded-3xl border border-white/10 p-6 overflow-hidden">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold text-white">Recent Hospital Orders</h3>
                                        <button className="text-xs text-green-500 hover:text-green-400">View All</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-slate-400">
                                            <thead className="text-xs uppercase text-slate-500 border-b border-white/5">
                                                <tr>
                                                    <th className="pb-3 pl-2">Hospital</th>
                                                    <th className="pb-3">Service</th>
                                                    <th className="pb-3">Date</th>
                                                    <th className="pb-3">Status</th>
                                                    <th className="pb-3">Feedback</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {orders.map((order, i) => (
                                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                                        <td className="py-4 pl-2 font-medium text-white">{order.hospital}</td>
                                                        <td className="py-4">{order.service}</td>
                                                        <td className="py-4">{order.date}</td>
                                                        <td className="py-4">
                                                            <span className={cn(
                                                                "px-2 py-1 rounded-full text-xs font-bold",
                                                                order.status === 'Completed' ? "bg-green-500/20 text-green-400" :
                                                                    order.status === 'Processing' ? "bg-yellow-500/20 text-yellow-400" :
                                                                        "bg-blue-500/20 text-blue-400"
                                                            )}>{order.status}</span>
                                                        </td>
                                                        <td className="py-4 text-white">⭐ {order.feedback}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Right Side: Time & Funding Mini */}
                                <div className="space-y-6">
                                    <div className="bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                                        <h3 className="relative z-10 text-slate-400 font-medium mb-4 text-sm tracking-widest uppercase">ExpressCare Time</h3>
                                        <div className="scale-75 origin-center grayscale opacity-80">
                                            {/* Analog Clock styled for dark mode if possible, wrapper filters it */}
                                            <AnalogClock />
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-900 to-black rounded-3xl p-6 text-white border border-green-500/30 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h3 className="text-green-300 font-medium mb-1 text-sm">Active Funding</h3>
                                            <div className="text-3xl font-bold mb-2">₦ 120,500</div>
                                            <div className="w-full bg-black/40 h-2 rounded-full mb-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                            </div>
                                            <div className="text-xs text-green-200/60">Target: ₦ 185,000 for Surgery</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* APPOINTMENTS TAB */}
                    {activeTab === 'appointments' && (
                        <div className="bg-white/5 rounded-3xl border border-white/10 p-6">
                            <h2 className="text-xl font-semibold text-white mb-6">Upcoming Appointments & Orders</h2>
                            <div className="grid gap-4">
                                {appointments.map((apt) => (
                                    <div key={apt.id} className="bg-black/40 p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-green-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-500/20 p-3 rounded-full text-blue-400">
                                                <Calendar size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{apt.doctor}</h3>
                                                <p className="text-slate-400">{apt.type} • {apt.hospital}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-white">{apt.time}</div>
                                            <div className="text-slate-500 text-sm">{apt.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SUMMARIES TAB */}
                    {activeTab === 'summaries' && (
                        <div className="bg-white/5 rounded-3xl border border-white/10 p-6">
                            <h2 className="text-xl font-semibold text-white mb-6">AI Health Screening Reports</h2>
                            <div className="grid gap-4">
                                {aiSummaries.map((sum) => (
                                    <div key={sum.id} className="bg-black/40 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-green-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "p-3 rounded-full",
                                                sum.risk === 'Red' ? "bg-red-500/20 text-red-500" :
                                                    sum.risk === 'Yellow' ? "bg-yellow-500/20 text-yellow-500" :
                                                        "bg-green-500/20 text-green-500"
                                            )}>
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{sum.complaint}</h3>
                                                <p className="text-slate-400 text-sm">{sum.date} • Risk Level: <span className={sum.risk === 'Red' ? "text-red-400" : sum.risk === 'Yellow' ? "text-yellow-400" : "text-green-400"}>{sum.risk}</span></p>
                                            </div>
                                        </div>
                                        <div className="md:max-w-md text-slate-300 text-sm bg-white/5 p-3 rounded-lg">
                                            <span className="text-slate-500 uppercase text-xs font-bold mr-2">Advice:</span>
                                            {sum.advice}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FUNDING TAB */}
                    {activeTab === 'funding' && (
                        <div className="bg-white/5 rounded-3xl border border-white/10 p-6">
                            <h2 className="text-xl font-semibold text-white mb-6">Crowd Funding & Financial Support</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-500/10 border border-green-500/30 p-8 rounded-2xl text-center">
                                    <div className="text-green-400 mb-2 font-medium uppercase tracking-wider">Total Received</div>
                                    <div className="text-5xl font-bold text-white mb-4">₦ 450,000</div>
                                    <p className="text-slate-400 mb-6">From 142 generous donors for "Emergency Surgery Fund"</p>
                                    <button className="bg-green-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-green-400 transition-colors">
                                        Request Withdrawal
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white/10 p-2 rounded-full"><HeartHandshake size={16} /></div>
                                            <div>
                                                <div className="text-white font-medium">Anonymous Donor</div>
                                                <div className="text-xs text-slate-500">2 mins ago</div>
                                            </div>
                                        </div>
                                        <div className="text-green-400 font-bold">+ ₦ 5,000</div>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white/10 p-2 rounded-full"><HeartHandshake size={16} /></div>
                                            <div>
                                                <div className="text-white font-medium">Community Health Fund</div>
                                                <div className="text-xs text-slate-500">1 hour ago</div>
                                            </div>
                                        </div>
                                        <div className="text-green-400 font-bold">+ ₦ 25,000</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

function NavButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center lg:justify-start justify-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                active ? "bg-green-500/10 text-green-500 font-semibold" : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
        >
            <Icon size={22} className={cn("transition-colors", active ? "text-green-500" : "text-slate-500 group-hover:text-white")} />
            <span className="hidden lg:block">{label}</span>
        </button>
    )
}

function StatsCard({ title, value, icon: Icon, trend, color }: any) {
    const colors: any = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        green: "text-green-400 bg-green-500/10 border-green-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    }

    return (
        <div className={cn("rounded-3xl p-6 border transition-all hover:scale-105", colors[color])}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-slate-300 text-sm font-medium mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-white">{value}</div>
                </div>
                <div className={cn("p-3 rounded-xl", colors[color].replace('border', ''))}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="text-xs opacity-70 flex items-center gap-1">
                <Clock size={12} />
                {trend}
            </div>
        </div>
    )
}

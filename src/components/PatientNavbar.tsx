import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import { Scan, Map, LayoutDashboard, Wallet } from "lucide-react";

interface PatientNavbarProps {
    currentView: string;
    onNavigate: (view: string) => void;
}

export function PatientNavbar({ currentView, onNavigate }: PatientNavbarProps) {
    // Map internal views to tab IDs
    // 'wizard' or 'interview' or 'screener' -> 'screener'
    // 'map' -> 'map'
    // 'patient-dashboard' -> 'dashboard'
    // 'crowdfunding' -> 'funding'

    const getTabId = (view: string) => {
        if (view === 'wizard' || view === 'interview' || view === 'screener') return 'screener';
        if (view === 'map') return 'map';
        if (view === 'patient-dashboard') return 'dashboard';
        if (view === 'crowdfunding') return 'funding';
        return 'screener';
    };

    const handleValueChange = (tabId: string) => {
        if (tabId === 'screener') onNavigate('wizard');
        if (tabId === 'map') onNavigate('map');
        if (tabId === 'dashboard') onNavigate('patient-dashboard');
        if (tabId === 'funding') onNavigate('crowdfunding');
    };

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-lg bg-black/40 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/10">
            <Tabs
                items={[
                    { id: "screener", label: "Scanner", icon: <Scan size={18} /> },
                    { id: "map", label: "Map", icon: <Map size={18} /> },
                    { id: "dashboard", label: "Data", icon: <LayoutDashboard size={18} /> },
                    { id: "funding", label: "Funding", icon: <Wallet size={18} /> },
                ]}
                value={getTabId(currentView)}
                onValueChange={handleValueChange}
                variant="ghost"
                className="w-full"
                indicatorColor="rgba(255, 255, 255, 0.2)"
            />
        </div>
    );
}

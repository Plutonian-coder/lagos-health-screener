import React from 'react';
import { Home, Activity, Map, LayoutDashboard, Stethoscope, User } from 'lucide-react';

export default function Navbar({ currentView, setView, userRole }) {
    const navItems = [
        { id: 'welcome', label: 'Home', icon: <Home size={18} /> },
        { id: 'wizard', label: 'Screener', icon: <Activity size={18} /> },
        { id: 'map', label: 'Find Care', icon: <Map size={18} /> },
    ];

    if (userRole === 'hospital') {
        navItems.push({ id: 'admin', label: 'Hospital Admin', icon: <LayoutDashboard size={18} /> });
    }

    return (
        <nav style={{
            background: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '60px',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div
                onClick={() => setView('welcome')}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-color)', cursor: 'pointer'
                }}
            >
                <div style={{ width: '12px', height: '12px', background: 'var(--accent-color)', borderRadius: '50%' }}></div>
                <span>ExpressCare AI</span>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: currentView === item.id ? 'var(--accent-color)' : '#ffffff',
                            borderBottom: currentView === item.id ? '2px solid var(--accent-color)' : '2px solid transparent',
                            padding: '18px 0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            textShadow: '0 0 10px rgba(0,0,0,0.5)'
                        }}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    padding: '6px 12px',
                    background: '#222',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    color: '#888',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <div style={{ width: '8px', height: '8px', background: '#39ff14', borderRadius: '50%' }}></div>
                    System Live
                </div>
            </div>
        </nav>
    );
}

import React from 'react';

export default function WarpShaderHero({ children }) {
    return (
        <div className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #001f3f, #003366, #004080)' }}>
            {/* Fallback Animated Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 50% 50%, rgba(57, 255, 20, 0.1) 0%, transparent 50%)',
                animation: 'pulse 5s infinite alternate'
            }}></div>
            <style>{`@keyframes pulse { from { opacity: 0.5; transform: scale(1); } to { opacity: 0.8; transform: scale(1.1); } }`}</style>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-8">
                <div className="max-w-4xl w-full text-center space-y-8">
                    {children}
                </div>
            </div>
        </div>
    )
}

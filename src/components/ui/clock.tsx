import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

export function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2 text-white bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-full font-mono text-sm">
            <ClockIcon size={14} className="text-green-500" />
            <span>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-zinc-500 border-l border-zinc-700 pl-2 ml-1">
                {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
        </div>
    );
}

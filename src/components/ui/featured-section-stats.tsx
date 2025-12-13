"use client";

import React from 'react';
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const stats = [
    { label: "Lives Saved", value: "152" },
    { label: "Doctors Active", value: "85+" },
    { label: "Partner Clinics", value: "40+" },
    { label: "Avg. Response", value: "45s" },
];

const chartData = [
    { name: "Jan", value: 40 },
    { name: "Feb", value: 65 },
    { name: "Mar", value: 85 },
    { name: "Apr", value: 110 },
    { name: "May", value: 140 },
    { name: "Jun", value: 180 },
    { name: "Jul", value: 240 },
];

export default function FeaturedSectionStats() {
    return (
        <section className="w-full bg-black border-t border-zinc-900 mx-auto text-left py-24">
            <div className="mx-auto max-w-7xl px-8 border-x border-zinc-900 border-dashed h-full">
                <h3 className="text-3xl lg:text-5xl font-bold text-white mb-16 tracking-tighter">
                    Real Impact, Real Time.{" "}
                    <span className="block text-zinc-500 text-lg lg:text-xl font-normal mt-4 max-w-3xl">
                        We don't just facilitate care; we track every life impacted. Our transparency engine ensures every donor and doctor sees the difference they make instantly.
                    </span>
                </h3>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-8 mb-16">
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
                            <p className="text-zinc-500 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Area Chart */}
                <div className="w-full h-64 mt-12 relative">
                    <div className="absolute top-0 left-0 text-sm text-green-500 font-bold mb-2 z-10">
                        + Growth in Cases Treated (YTD)
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                                itemStyle={{ color: '#22c55e' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#22c55e"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorGreen)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}

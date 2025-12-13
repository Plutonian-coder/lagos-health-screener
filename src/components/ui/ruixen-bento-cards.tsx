"use client"

import React from "react"
import { cn } from "@/lib/utils"
// import Link from "next/link" // This is a Vite app, use <a> or just div for now as it's a section.
import { Brain, MapPin, Wallet, Zap, ShieldCheck } from 'lucide-react';

const cardContents = [
    {
        title: "1. Chat with AI",
        description:
            "Our advanced AI screener understands local languages and triage protocols. Describe your symptoms naturally and get a preliminary diagnosis in seconds, not hours.",
        icon: Brain,
        colSpan: "lg:col-span-3",
        rowSpan: "lg:row-span-2"
    },
    {
        title: "2. Instant Match",
        description:
            "The system instantly locates the nearest verified hospital with the right specialist and equipment for your specific condition. No more running from hospital to hospital.",
        icon: MapPin,
        colSpan: "lg:col-span-2",
        rowSpan: "lg:row-span-2"
    },
    {
        title: "3. Secure Funding",
        description:
            "Lack of funds shouldn't mean lack of care. ExpressCare instantly connects verified emergency cases with a network of donors and smart-contract funding to cover treatment costs immediately.",
        icon: Wallet,
        colSpan: "lg:col-span-4",
        rowSpan: "lg:row-span-1"
    },
    {
        title: "Speed",
        description:
            "From symptom to admission in under 10 minutes.",
        icon: Zap,
        colSpan: "lg:col-span-2",
        rowSpan: "lg:row-span-1"
    },
    {
        title: "Trust",
        description:
            "Every hospital and case is verified by our agent network.",
        icon: ShieldCheck,
        colSpan: "lg:col-span-2",
        rowSpan: "lg:row-span-1"
    },
]


const PlusCard = ({
    className = "",
    title,
    description,
    icon: Icon
}) => {
    return (
        <div
            className={cn(
                "relative border border-dashed border-zinc-800 rounded-lg p-6 bg-black text-white min-h-[200px] hover:bg-zinc-900/50 transition-colors group",
                "flex flex-col justify-between",
                className
            )}
        >
            <CornerPlusIcons />
            {/* Content */}
            <div className="relative z-10 space-y-4">
                {Icon && (
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                        <Icon size={24} />
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>
                </div>
            </div>
        </div>
    )
}

const CornerPlusIcons = () => (
    <>
        <PlusIcon className="absolute -top-3 -left-3" />
        <PlusIcon className="absolute -top-3 -right-3" />
        <PlusIcon className="absolute -bottom-3 -left-3" />
        <PlusIcon className="absolute -bottom-3 -right-3" />
    </>
)

const PlusIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={24}
        height={24}
        strokeWidth="1"
        stroke="currentColor"
        className={`text-zinc-700 size-6 ${className}`}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
)

export default function RuixenBentoCards() {
    return (
        <section className="bg-black border-t border-zinc-900">
            <div className="mx-auto max-w-7xl border-x border-zinc-900 py-20 px-4 md:px-8">

                <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter">
                        How ExpressCare Works
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl">
                        A seamless agentic workflow designed to save lives.
                    </p>
                </div>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 auto-rows-auto gap-8">
                    {cardContents.map((card, idx) => (
                        <PlusCard
                            key={idx}
                            title={card.title}
                            description={card.description}
                            icon={card.icon}
                            className={`${card.colSpan} ${card.rowSpan}`}
                        />
                    ))}
                </div>

                {/* Section Footer Heading */}
                <div className="max-w-3xl ml-auto text-right mt-16 lg:mt-24">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Built for Urgency. <br />Designed for <span className="text-green-500">Trust.</span>
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        ExpressCare gives you the power of an intelligent medical agent handling logistics, finance, and triage while you focus on what matters most—getting better.
                    </p>
                </div>
            </div>
        </section>
    )
}

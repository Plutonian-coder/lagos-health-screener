import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, MapPin, Stethoscope, Activity, FileText, UserPlus, ClipboardList, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Summary({ data, clinic, onReset }) {
    // Destructure based on the new schema with safe defaults
    const { clinicalReasoning = {}, doctorType, preConsultSummary = {}, advice } = data || {};
    const { signal, riskDescription } = clinicalReasoning || {};
    const { mainComplaint, redFlags, differentials, vitalSigns, riskCategory } = preConsultSummary || {};

    if (!data) return <div className="p-8 text-white">Loading analysis...</div>;

    const isUrgent = signal === 'Red' || signal === 'Yellow';

    return (
        <div className="w-full max-w-4xl mx-auto p-6 text-white font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                {/* Header */}
                <div className="text-center space-y-2 border-b border-green-500/30 pb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        <span className="text-green-500">AI</span> Health Analysis
                    </h1>
                    <p className="text-green-500/60 text-sm uppercase tracking-widest">Pre-Consultation Summary</p>
                </div>

                {/* Patient Notification Status (Replaces Signal Indicator) */}
                <div className="rounded-2xl border border-white/10 overflow-hidden relative">
                    <div className={cn(
                        "absolute inset-0 opacity-10",
                        isUrgent ? "bg-red-500" : "bg-green-500"
                    )} />
                    <div className="relative p-8 flex flex-col items-center text-center gap-4">
                        {isUrgent ? (
                            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center animate-pulse">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                                <CheckCircle size={32} className="text-green-500" />
                            </div>
                        )}

                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                {isUrgent ? "Medical Attention Recommended" : "Condition Requires Monitoring"}
                            </h2>
                            <p className="text-white/70 max-w-xl mx-auto text-lg leading-relaxed">
                                {advice}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Detailed Summary (Green/White Theme) */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column: Complaint & Risk */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <div className="text-green-500 text-xs font-bold uppercase tracking-wider mb-2">Primary Concern</div>
                            <div className="text-xl font-medium">{mainComplaint}</div>
                        </div>

                        {doctorType && (
                            <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl">
                                <div className="text-green-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <UserPlus size={14} /> Recommended Specialist
                                </div>
                                <div className="text-2xl font-bold text-white">{doctorType}</div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Vitals & Notes */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-full">
                        <div className="text-green-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ClipboardList size={14} /> Clinical Notes
                        </div>
                        <ul className="space-y-4">
                            {redFlags?.length > 0 && (
                                <li className="flex gap-3 text-red-400">
                                    <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                                    <span>Symptoms require immediate evaluation.</span>
                                </li>
                            )}
                            <li className="flex gap-3 text-white/80">
                                <Activity size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{vitalSigns || "No critical vitals reported."}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Clinic Recommendation */}
                {clinic && (
                    <div className="mt-8 relative overflow-hidden rounded-2xl border border-green-500/50">
                        <div className="absolute inset-0 bg-green-500/5" />
                        <div className="relative p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-green-500 mb-2">
                                    <MapPin size={20} />
                                    <span className="font-bold tracking-wide">NEAREST AVAILABLE FACILITY</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">{clinic.name}</h3>
                                <p className="text-white/60">{clinic.location}</p>
                            </div>

                            <div className="text-right">
                                <div className="bg-green-500 text-black font-bold px-4 py-2 rounded-lg inline-block mb-2">
                                    {clinic.cost}
                                </div>
                                <div className="text-white/40 text-sm">{clinic.type}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="pt-8 flex justify-center">
                    <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors font-medium flex items-center gap-2" onClick={onReset}>
                        <ArrowRight size={18} /> Start New Assessment
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

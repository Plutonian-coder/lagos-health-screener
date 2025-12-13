import React from 'react';
import { Wallet, ArrowLeft, ShieldCheck, Activity } from 'lucide-react';

export default function CrowdFundingView({ onNavigate }) {
    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col font-sans">
            {/* Simple Navbar */}
            <div className="p-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="bg-green-500/10 p-2 rounded-lg">
                        <Activity className="text-green-500" size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ExpressCare Aid</span>
                </div>
                <button
                    onClick={() => onNavigate('patient-dashboard')}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
            </div>

            {/* Main Content - Static Design */}
            <div className="flex-1 flex flex-col items-center justify-start pt-12 px-4">
                <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12">

                    {/* Left: Message */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase">
                            <ShieldCheck size={12} /> Secure Protocol
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Decentralized <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                                Medical Funding
                            </span>
                        </h1>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            A transparent system where donors fund treatments directly via smart contracts.
                            Funds are released only when verified hospitals confirm the diagnosis.
                        </p>

                        <div className="pt-4">
                            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Wallet className="text-blue-500" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">Wallet Connection</div>
                                        <div className="text-xs text-gray-500">Ethereum Testnet (Sepolia)</div>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-2/3"></div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    <span>Status</span>
                                    <span className="text-blue-400">Integration Pending</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual Placeholder */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent blur-3xl rounded-full opacity-30"></div>
                        <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Total Value Locked</h3>
                                <div className="text-5xl font-bold text-white mb-1">45.2 ETH</div>
                                <div className="text-sm text-green-500">+12% this week</div>
                            </div>

                            <div className="space-y-4 mt-12">
                                <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 text-xs font-bold">D</div>
                                        <div className="text-sm text-gray-300">Dangote Fdn</div>
                                    </div>
                                    <div className="text-sm font-mono">+ 20.0 ETH</div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 text-xs font-bold">A</div>
                                        <div className="text-sm text-gray-300">Anon Donor</div>
                                    </div>
                                    <div className="text-sm font-mono">+ 5.0 ETH</div>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-xl transition-colors border border-white/5 cursor-not-allowed">
                                Connect Wallet (Coming Soon)
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

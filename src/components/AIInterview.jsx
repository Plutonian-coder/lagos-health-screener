import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIInterview({ initialData, apiKey, onComplete }) {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [questionCount, setQuestionCount] = useState(0);
    const chatEndRef = useRef(null);
    const [activeModel, setActiveModel] = useState("Gemini 2.5 Flash");

    // Initialize AI
    const genAI = new GoogleGenerativeAI(apiKey);

    const MAX_QUESTIONS = 3;

    useEffect(() => {
        startInterview();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        // Auto-focus input when loading finishes
        if (!loading) {
            document.querySelector('input[type="text"]')?.focus();
        }
    }, [history, loading]);

    const formatWizardData = (data) => {
        if (!data) return "No initial data provided.";
        return Object.entries(data)
            .map(([key, value]) => `- ${key.replace(/([A-Z])/g, ' $1').trim()}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
    };

    const generateWithFallback = async (prompt) => {
        try {
            // Priority: User Requested Model (Gemini 2.5 Flash)
            const modelPrimary = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await modelPrimary.generateContent(prompt);
            setActiveModel("Gemini 2.5 Flash");
            return result.response.text();

        } catch (error) {
            console.warn("Gemini 2.5 Flash failed (possibly unavailable), attempting fallback to 1.5-flash...", error);
            try {
                // Fallback: Stable Model (Gemini 1.5 Flash)
                const modelFallback = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await modelFallback.generateContent(prompt);
                setActiveModel("Gemini 1.5 Flash (Fallback)");
                return result.response.text();
            } catch (fallbackError) {
                console.error("All Gemini models failed:", fallbackError);
                throw fallbackError;
            }
        }
    };

    const startInterview = async () => {
        try {
            const prompt = `
        You are an advanced medical diagnostic AI for Lagos Health Screener.
        
        RETRIEVED PATIENT RECORDS (RAG CONTEXT):
        ${formatWizardData(initialData)}

        INSTRUCTIONS:
        1. Contextualize: Review the patient's records above used as your Knowledge Base.
        2. Acknowledge: Confirm you have received their specific symptoms (e.g., "I see your report regarding...").
        3. Investigate: Ask ONE high-value clinical question to narrow down the differential diagnosis.
        4. Tone: Professional, clinically precise, yet accessible.
        
        Output only the response message.
      `;

            const text = await generateWithFallback(prompt);

            setHistory([
                { role: 'model', text: text }
            ]);
            setLoading(false);
        } catch (error) {
            console.error("AI Error:", error);
            setHistory([
                { role: 'model', text: "System Alert: Unable to connect to Neural Core. Please verify your API Key is valid and has access to Gemini API." }
            ]);
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput("");
        setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        const newCount = questionCount + 1;
        setQuestionCount(newCount);

        try {
            if (newCount >= MAX_QUESTIONS) {
                onComplete({ ...initialData, interviewTranscript: [...history, { role: 'user', text: userMsg }] });
            } else {
                const prompt = `
          You are Dr. AI, conducting a clinical assessment.

          RETRIEVED CONTEXT (RAG):
          ${formatWizardData(initialData)}

          SESSION TRANSCRIPT:
          ${history.map(h => `${h.role === 'user' ? 'PATIENT' : 'DOCTOR'}: ${h.text}`).join('\n')}
          PATIENT LATEST UPDATE: ${userMsg}

          CLINICAL REASONING:
          - Synthesize the new information with the retrieved context.
          - Formulate a targeted follow-up question to assess severity or etiology.
          - Maintain context continuity.
          
          Response:
        `;

                const text = await generateWithFallback(prompt);

                setHistory(prev => [...prev, { role: 'model', text: text }]);
                setLoading(false);
            }

        } catch (error) {
            console.error("AI Error:", error);
            setTimeout(() => {
                setHistory(prev => [...prev, { role: 'model', text: "Connection interrupted. Please try again." }]);
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col h-[85vh] relative z-10 pt-8">
            {/* Glass Card Container */}
            <div className="flex-1 flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 bg-black/40 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-20" />
                        </div>
                        <span className="font-semibold text-white tracking-wide">AI Medical Assistant</span>
                    </div>
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                        {activeModel}
                    </span>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {history.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white text-black' : 'bg-green-500/10 border border-green-500/20'
                                }`}>
                                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} className="text-green-400" />}
                            </div>

                            <div className={`max-w-[80%] p-4 rounded-2xl text-lg leading-relaxed ${msg.role === 'user'
                                ? 'bg-white text-black rounded-tr-none shadow-lg'
                                : 'bg-white/5 border border-white/10 text-white rounded-tl-none backdrop-blur-md'
                                }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                <Loader2 size={20} className="text-green-400 animate-spin" />
                            </div>
                            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none text-white/50 text-sm flex items-center gap-2">
                                <span className="animate-pulse">Analyzing symptoms...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-black/60 border-t border-white/5">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your response..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-6 pr-14 py-4 text-white placeholder-white/30 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all text-lg"
                            autoFocus
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="absolute right-2 p-2.5 bg-green-500 hover:bg-green-400 text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

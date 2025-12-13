import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const questions = [
    {
        id: 'mainSymptom',
        text: "What is your main symptom?",
        subtext: "e.g., Headache, Fever, Stomach pain",
        type: 'text',
        placeholder: "Describe what you feel..."
    },
    {
        id: 'duration',
        text: "How long have you had this?",
        type: 'options',
        options: ["Less than 24 hours", "1-3 days", "4-7 days", "More than a week"]
    },
    {
        id: 'severity',
        text: "How severe is the pain/discomfort?",
        type: 'options',
        options: ["Mild (I can work)", "Moderate (Uncomfortable)", "Severe (Can't do anything)", "Unbearable"]
    },
    {
        id: 'redFlags',
        text: "Do you have any of these serious signs?",
        type: 'multiselect',
        options: [
            "Chest pain or tightness",
            "Difficulty breathing",
            "Severe bleeding",
            "Sudden weakness/numbness",
            "Confusion or fainting",
            "None of the above"
        ]
    },
    {
        id: 'associated',
        text: "Any other symptoms?",
        type: 'text',
        placeholder: "e.g., Vomiting, Dizziness, Rash..."
    },
    {
        id: 'history',
        text: "Do you have any existing conditions?",
        type: 'options',
        options: ["None", "Hypertension", "Diabetes", "Asthma", "Ulcer", "Pregnancy", "Other"]
    },
    {
        id: 'location',
        text: "Where are you located in Lagos?",
        type: 'options',
        options: ["Ikeja", "Lekki", "Surulere", "Lagos Island", "Yaba", "Victoria Island", "Agege", "Ikorodu", "Other"]
    }
];

export default function Wizard({ onComplete }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [currentInput, setCurrentInput] = useState("");
    const [multiSelection, setMultiSelection] = useState([]);

    const currentQ = questions[step];

    const handleNext = () => {
        if (currentQ.type === 'text' && !currentInput.trim()) return;
        if (currentQ.type === 'multiselect' && multiSelection.length === 0) return;

        const answer = currentQ.type === 'multiselect' ? multiSelection : currentInput;

        setAnswers(prev => ({ ...prev, [currentQ.id]: answer }));

        if (step < questions.length - 1) {
            setStep(step + 1);
            setCurrentInput("");
            setMultiSelection([]);
        } else {
            onComplete({ ...answers, [currentQ.id]: answer });
        }
    };

    const handleOptionClick = (option) => {
        setAnswers(prev => ({ ...prev, [currentQ.id]: option }));
        if (step < questions.length - 1) {
            setStep(step + 1);
            setCurrentInput("");
        } else {
            onComplete({ ...answers, [currentQ.id]: option });
        }
    };

    const toggleSelection = (option) => {
        if (option === "None of the above") {
            setMultiSelection(["None of the above"]);
            return;
        }

        let newSelection = [...multiSelection];
        if (newSelection.includes("None of the above")) {
            newSelection = [];
        }

        if (newSelection.includes(option)) {
            newSelection = newSelection.filter(item => item !== option);
        } else {
            newSelection.push(option);
        }
        setMultiSelection(newSelection);
    };

    const progress = ((step + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans">
            <div
                className="w-full max-w-xl relative overflow-hidden rounded-3xl"
                style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                {/* Header / Progress */}
                <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-white/5">
                    <span className="text-white/60 text-sm font-medium tracking-wide">
                        Question {step + 1} <span className="text-white/30">/ {questions.length}</span>
                    </span>
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 min-h-[400px] flex flex-col">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex-1 flex flex-col"
                        >
                            <h2 className="text-3xl font-bold text-white mb-3 leading-tight tracking-tight">
                                {currentQ.text}
                            </h2>
                            {currentQ.subtext && (
                                <p className="text-white/50 text-lg mb-8">{currentQ.subtext}</p>
                            )}

                            <div className="mt-4 flex-1">
                                {currentQ.type === 'text' && (
                                    <div className="space-y-6">
                                        <div className="group relative">
                                            <input
                                                autoFocus
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xl text-white placeholder-white/20 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all font-light"
                                                placeholder={currentQ.placeholder}
                                                value={currentInput}
                                                onChange={(e) => setCurrentInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
                                        </div>
                                        <button
                                            onClick={handleNext}
                                            disabled={!currentInput.trim()}
                                            className="w-full bg-white text-black py-4 rounded-xl text-lg font-bold hover:bg-green-400 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next Step
                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {currentQ.type === 'options' && (
                                    <div className="grid gap-3">
                                        {currentQ.options.map((opt, idx) => (
                                            <motion.button
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                onClick={() => handleOptionClick(opt)}
                                                className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-green-500/30 text-white text-lg transition-all flex items-center justify-between group"
                                            >
                                                <span>{opt}</span>
                                                <ArrowRight size={18} className="text-white/20 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {currentQ.type === 'multiselect' && (
                                    <div className="space-y-6">
                                        <div className="grid gap-3">
                                            {currentQ.options.map((opt, idx) => {
                                                const isSelected = multiSelection.includes(opt);
                                                return (
                                                    <motion.button
                                                        key={idx}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        onClick={() => toggleSelection(opt)}
                                                        className={cn(
                                                            "w-full text-left p-4 rounded-xl border text-lg transition-all flex items-center justify-between group",
                                                            isSelected
                                                                ? "bg-green-500/20 border-green-500/50 text-white"
                                                                : "bg-white/5 border-white/5 hover:bg-white/10 text-white/80 hover:text-white"
                                                        )}
                                                    >
                                                        <span>{opt}</span>
                                                        <div className={cn(
                                                            "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                                                            isSelected ? "bg-green-500 border-green-500" : "border-white/30 group-hover:border-white/50 bg-transparent"
                                                        )}>
                                                            {isSelected && <Check size={14} className="text-black" />}
                                                        </div>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={handleNext}
                                            disabled={multiSelection.length === 0}
                                            className="w-full bg-green-500 text-black py-4 rounded-xl text-lg font-bold hover:bg-green-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-white/30"
                                        >
                                            Continue
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="px-8 pb-8 pt-4 flex justify-between items-center text-white/40 text-sm">
                    {step > 0 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="flex items-center gap-2 hover:text-white transition-colors py-2"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    ) : <div></div>}

                    <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>AI Screener Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

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

    return (
        <div className="container" style={{ justifyContent: 'center' }}>
            <div className="card fade-in">
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Question {step + 1} of {questions.length}
                    </span>
                    <div style={{ width: '100px', height: '4px', background: '#333', borderRadius: '2px' }}>
                        <div
                            style={{
                                width: `${((step + 1) / questions.length) * 100}%`,
                                height: '100%',
                                background: 'var(--accent-color)',
                                borderRadius: '2px',
                                transition: 'width 0.3s ease'
                            }}
                        />
                    </div>
                </div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                            {currentQ.text}
                        </h2>
                        {currentQ.subtext && (
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{currentQ.subtext}</p>
                        )}

                        <div style={{ marginTop: '24px' }}>
                            {currentQ.type === 'text' && (
                                <div>
                                    <input
                                        autoFocus
                                        type="text"
                                        className="input-field"
                                        placeholder={currentQ.placeholder}
                                        value={currentInput}
                                        onChange={(e) => setCurrentInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                    />
                                    <button className="btn-primary" onClick={handleNext}>
                                        Next <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
                                    </button>
                                </div>
                            )}

                            {currentQ.type === 'options' && (
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {currentQ.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            className="btn-secondary"
                                            style={{ textAlign: 'left', justifyContent: 'space-between', display: 'flex' }}
                                            onClick={() => handleOptionClick(opt)}
                                        >
                                            {opt} <ArrowRight size={16} style={{ opacity: 0.5 }} />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentQ.type === 'multiselect' && (
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {currentQ.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            className="btn-secondary"
                                            style={{
                                                textAlign: 'left',
                                                borderColor: multiSelection.includes(opt) ? 'var(--accent-color)' : '#333',
                                                color: multiSelection.includes(opt) ? 'var(--accent-color)' : 'var(--text-primary)'
                                            }}
                                            onClick={() => toggleSelection(opt)}
                                        >
                                            {opt}
                                            {multiSelection.includes(opt) && <Check size={16} />}
                                        </button>
                                    ))}
                                    <button
                                        className="btn-primary"
                                        style={{ marginTop: '12px' }}
                                        onClick={handleNext}
                                        disabled={multiSelection.length === 0}
                                    >
                                        Continue
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {step > 0 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            marginTop: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.9rem',
                            padding: 0
                        }}
                    >
                        <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back
                    </button>
                )}
            </div>
        </div>
    );
}

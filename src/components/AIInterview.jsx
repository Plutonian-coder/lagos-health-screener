import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIInterview({ initialData, apiKey, onComplete }) {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [questionCount, setQuestionCount] = useState(0);
    const chatEndRef = useRef(null);

    // Initialize AI with Gemini 2.5 Flash (User Requested)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const MAX_QUESTIONS = 3;

    useEffect(() => {
        startInterview();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, loading]);

    const startInterview = async () => {
        try {
            const prompt = `
        You are an advanced medical triage AI assistant for Lagos, Nigeria.
        
        MEDICAL CONTEXT (RAG DATA):
        Patient Initial Form Data: ${JSON.stringify(initialData, null, 2)}

        INSTRUCTIONS:
        - Analyze the patient's initial data.
        - Ask EXACTLY ONE follow-up question to clarify their condition.
        - Focus on ruling out emergencies or understanding severity.
        - Be empathetic but professional.
        - Do NOT diagnose yet.
      `;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            setHistory([
                { role: 'model', text: text }
            ]);
            setLoading(false);
        } catch (error) {
            console.error("AI Error:", error);
            // Fallback: Simulate AI behavior if API fails (Quota/Error)
            setHistory([
                { role: 'model', text: "I see. Could you tell me a bit more about how severe the pain is right now on a scale of 1 to 10?" }
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
            // Build conversation history for context
            if (newCount >= MAX_QUESTIONS) {
                // Time to wrap up
                onComplete({ ...initialData, interviewTranscript: [...history, { role: 'user', text: userMsg }] });
                return;
            } else {
                // Continue interview with full context awareness
                const prompt = `
          You are Dr. AI, a triage assistant.
          
          MEDICAL CONTEXT (KNOWN DATA):
          ${JSON.stringify(initialData, null, 2)}

          CONVERSATION HISTORY:
          ${history.map(h => `${h.role.toUpperCase()}: ${h.text}`).join('\n')}
          USER: ${userMsg}

          TASK:
          - Review the entire context above.
          - Ask ONE relevant follow-up question based on what the user just said AND their initial form data.
          - If they mentioned a symptom earlier, you can reference it.
          - Keep it short.
        `;

                const result = await model.generateContent(prompt);
                const text = result.response.text();

                setHistory(prev => [...prev, { role: 'model', text: text }]);
                setLoading(false);
            }

        } catch (error) {
            console.error("AI Error:", error);
            // Fallback mock response
            setTimeout(() => {
                setHistory(prev => [...prev, { role: 'model', text: "Thank you for sharing that. Is there anything else you think I should know?" }]);
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '700px' }}>
            <div className="card" style={{ height: '80vh', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ padding: '16px', borderBottom: '1px solid #333', background: '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '10px', height: '10px', background: 'var(--accent-color)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-color)' }}></div>
                        <span style={{ fontWeight: 'bold' }}>Dr. AI Assistant (Gemini 2.5)</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Question {Math.min(questionCount + 1, MAX_QUESTIONS)} / {MAX_QUESTIONS}
                    </span>
                </div>

                {/* Chat Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {history.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                display: 'flex',
                                gap: '12px',
                                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                            }}
                        >
                            <div style={{
                                width: '32px', height: '32px',
                                borderRadius: '50%',
                                background: msg.role === 'user' ? '#333' : 'rgba(57, 255, 20, 0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: msg.role === 'model' ? '1px solid var(--accent-color)' : 'none',
                                flexShrink: 0
                            }}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} color="var(--accent-color)" />}
                            </div>

                            <div style={{
                                background: msg.role === 'user' ? '#333' : '#1a1a1a',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                borderTopLeftRadius: msg.role === 'model' ? '0' : '12px',
                                borderTopRightRadius: msg.role === 'user' ? '0' : '12px',
                                border: msg.role === 'model' ? '1px solid #333' : 'none',
                                lineHeight: '1.5'
                            }}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}

                    {loading && (
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{
                                width: '32px', height: '32px',
                                borderRadius: '50%',
                                background: 'rgba(57, 255, 20, 0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid var(--accent-color)'
                            }}>
                                <Loader2 size={16} className="spin" color="var(--accent-color)" style={{ animation: 'spin 1s linear infinite' }} />
                            </div>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Thinking...</span>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: '16px', borderTop: '1px solid #333', background: '#111', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your answer..."
                        style={{
                            flex: 1,
                            background: '#050505',
                            border: '1px solid #333',
                            padding: '12px',
                            borderRadius: '8px',
                            color: '#fff',
                            outline: 'none'
                        }}
                        autoFocus
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        style={{
                            background: 'var(--accent-color)',
                            border: 'none',
                            borderRadius: '8px',
                            width: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                            opacity: loading || !input.trim() ? 0.5 : 1
                        }}
                    >
                        <Send size={20} color="#000" />
                    </button>
                </div>
            </div>
        </div>
    );
}

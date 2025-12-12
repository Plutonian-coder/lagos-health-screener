import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, MapPin, Stethoscope, Activity, FileText, UserPlus, ClipboardList } from 'lucide-react';

export default function Summary({ data, clinic, onReset }) {
    // Destructure based on the new schema
    // Destructure based on the new schema with safe defaults
    const { clinicalReasoning = {}, doctorType, preConsultSummary = {}, advice } = data || {};
    const { signal, riskDescription } = clinicalReasoning || {};
    const { mainComplaint, redFlags, differentials, vitalSigns, riskCategory } = preConsultSummary || {};

    const getSignalColor = (sig) => {
        switch (sig?.toLowerCase()) {
            case 'red': return '#ff3333';
            case 'yellow': return '#ffcc00';
            case 'green': return '#39ff14';
            default: return '#555'; // Fallback color
        }
    };

    const signalColor = getSignalColor(signal);

    if (!data) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', color: 'var(--accent-color)' }}>
                        AI Health Screen Report
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Lagos Edition • {new Date().toLocaleDateString()}</p>
                </div>

                {/* Clinical Reasoning / Signal Card */}
                <div className="card" style={{ borderLeft: `6px solid ${signalColor}`, display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '60px', height: '60px',
                        borderRadius: '50%',
                        background: `rgba(${signal === 'Red' ? '255, 51, 51' : signal === 'Yellow' ? '255, 204, 0' : '57, 255, 20'}, 0.1)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `2px solid ${signalColor}`,
                        boxShadow: `0 0 15px ${signalColor}40`
                    }}>
                        <Activity size={32} color={signalColor} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Clinical Reasoning</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: signalColor, lineHeight: '1.2' }}>{signal} SIGNAL</div>
                        <div style={{ color: '#fff', fontSize: '1.1rem' }}>{riskDescription}</div>
                    </div>
                </div>

                {/* Doctor Pre-Consult Summary */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>
                        <ClipboardList size={24} color="var(--accent-color)" />
                        <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Doctor Pre-Consult Summary</h3>
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        {/* Main Complaint */}
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Main Complaint</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{mainComplaint}</div>
                        </div>

                        {/* Red Flags */}
                        {redFlags && redFlags.length > 0 && (
                            <div style={{ background: 'rgba(255, 51, 51, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 51, 51, 0.3)' }}>
                                <div style={{ color: '#ff3333', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <AlertTriangle size={16} /> RED FLAG SYMPTOMS
                                </div>
                                <ul style={{ margin: 0, paddingLeft: '20px', color: '#ffcccc' }}>
                                    {redFlags.map((flag, i) => <li key={i}>{flag}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* Differentials & Vitals */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Possible Differentials</div>
                                <ul style={{ margin: 0, paddingLeft: '20px', color: '#ddd' }}>
                                    {differentials?.map((diff, i) => <li key={i}>{diff}</li>)}
                                </ul>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Vital Signs</div>
                                <div style={{ color: '#ddd' }}>{vitalSigns}</div>
                            </div>
                        </div>

                        {/* Doctor Type */}
                        <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Recommended Specialist</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{doctorType}</div>
                            </div>
                            <UserPlus size={32} color="#666" />
                        </div>
                    </div>
                </div>

                {/* Action Plan */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Stethoscope size={20} color="var(--accent-color)" />
                        <h3 style={{ margin: 0 }}>Immediate Action</h3>
                    </div>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>{advice}</p>
                </div>

                {/* Clinic Recommendation */}
                {clinic && (
                    <div className="card" style={{ background: 'linear-gradient(145deg, #111 0%, #0a1a0a 100%)', border: '1px solid var(--accent-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <MapPin size={20} color="var(--accent-color)" />
                            <h3 style={{ margin: 0 }}>Nearest Recommended Facility</h3>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' }}>{clinic.name}</div>
                                <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{clinic.location}</div>
                                <div style={{ display: 'inline-block', background: 'var(--accent-glow)', color: 'var(--accent-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {clinic.cost}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TYPE</div>
                                <div>{clinic.type}</div>
                            </div>
                        </div>
                    </div>
                )}

                <button className="btn-secondary" onClick={onReset} style={{ marginTop: '20px', marginBottom: '40px' }}>
                    Start New Screening
                </button>
            </motion.div>
        </div>
    );
}

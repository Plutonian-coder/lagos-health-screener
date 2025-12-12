import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, Clock, CheckCircle, XCircle, Search, RefreshCw, User, Award, MapPin, DollarSign, BrainCircuit, Activity } from 'lucide-react';

export default function HospitalAdmin({ doctors, onUpdateStatus }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDocId, setSelectedDocId] = useState(null);

    // Calculate dynamic status and stats for each doctor
    const processedDoctors = useMemo(() => {
        return doctors.map(doc => {
            const openSlots = doc.schedule.filter(s => !s.isBooked && !s.isBreak).length;
            let calculatedStatus = 'Available';

            if (doc.statusOverride === 'Offline') {
                calculatedStatus = 'Offline';
            } else if (openSlots === 0) {
                calculatedStatus = 'Fully Booked';
            } else if (openSlots <= 2) {
                calculatedStatus = 'Few Slots Left';
            }

            return { ...doc, openSlots, calculatedStatus };
        });
    }, [doctors]);

    const filteredDoctors = processedDoctors.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedDoc = processedDoctors.find(d => d.id === selectedDocId);

    // AI Suggestions Logic
    const aiSuggestions = useMemo(() => {
        if (!selectedDoc) return [];

        return processedDoctors.filter(d =>
            d.id !== selectedDoc.id &&
            d.calculatedStatus !== 'Offline' &&
            d.calculatedStatus !== 'Fully Booked' &&
            (d.specialty === selectedDoc.specialty || d.specialty === 'General Practitioner')
        ).sort((a, b) => {
            // Simple scoring: prioritize distance > price > rating
            const scoreA = (a.distanceFromUser * 2) + (a.price / 1000) - (a.rating * 5);
            const scoreB = (b.distanceFromUser * 2) + (b.price / 1000) - (b.rating * 5);
            return scoreA - scoreB;
        }).slice(0, 2); // Top 2
    }, [selectedDoc, processedDoctors]);


    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return '#39ff14'; // Green
            case 'Few Slots Left': return '#ffcc00'; // Yellow
            case 'Fully Booked': return '#ff3333'; // Red
            case 'Offline': return '#000'; // Black (handled via opacity usually, but hex for border)
            default: return '#fff';
        }
    };

    const getStatusBadgeStyles = (status) => {
        const base = { padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' };
        switch (status) {
            case 'Available': return { ...base, background: 'rgba(57, 255, 20, 0.15)', color: '#39ff14', border: '1px solid #39ff14' };
            case 'Few Slots Left': return { ...base, background: 'rgba(255, 204, 0, 0.15)', color: '#ffcc00', border: '1px solid #ffcc00' };
            case 'Fully Booked': return { ...base, background: 'rgba(255, 51, 51, 0.15)', color: '#ff3333', border: '1px solid #ff3333' };
            case 'Offline': return { ...base, background: '#333', color: '#888', border: '1px solid #444' };
            default: return base;
        }
    };

    return (
        <div className="container" style={{ maxWidth: '1400px', display: 'flex', gap: '20px', alignItems: 'start' }}>

            {/* LEFT: Dashboard List */}
            <div style={{ flex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', margin: '0 0 4px 0' }}>Real-Time Availability</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Live tracking of physician status & slots.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['Available', 'Few Slots Left', 'Fully Booked', 'Offline'].map(status => (
                            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#888' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(status) }}></div>
                                {status}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div style={{ background: '#111', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', border: '1px solid #222' }}>
                    <Search size={18} style={{ color: '#666', marginRight: '10px' }} />
                    <input
                        type="text"
                        placeholder="Search doctors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, background: 'none', border: 'none', color: '#fff', outline: 'none' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {filteredDoctors.map(doc => (
                        <motion.div
                            key={doc.id}
                            layoutId={doc.id}
                            onClick={() => setSelectedDocId(doc.id)}
                            className="card"
                            style={{
                                padding: '16px',
                                borderLeft: `4px solid ${getStatusColor(doc.calculatedStatus)}`,
                                cursor: 'pointer',
                                background: selectedDocId === doc.id ? '#1a1a1a' : '#111',
                                borderColor: selectedDocId === doc.id ? 'var(--accent-color)' : '#222'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                                <img src={doc.image} alt={doc.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <h3 style={{ margin: '0 0 2px 0', fontSize: '1rem' }}>{doc.name}</h3>
                                        <span style={getStatusBadgeStyles(doc.calculatedStatus)}>
                                            {doc.calculatedStatus === 'Available' ? 'G' : doc.calculatedStatus === 'Few Slots Left' ? 'Y' : doc.calculatedStatus === 'Fully Booked' ? 'R' : 'OFF'}
                                        </span>
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{doc.specialty} • {doc.hospital}</div>

                                    <div style={{ marginTop: '12px', display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#888' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CheckCircle size={12} color="#39ff14" /> {doc.openSlots} Open
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={12} /> {doc.schedule.filter(s => s.isBooked).length} Booked
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Detail View */}
            <div style={{ flex: 1.2, position: 'sticky', top: '80px' }}>
                <AnimatePresence mode="wait">
                    {selectedDoc ? (
                        <motion.div
                            key={selectedDoc.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="card"
                            style={{ padding: '24px', background: '#0a0a0a' }}
                        >
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                                <img src={selectedDoc.image} alt={selectedDoc.name} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #333' }} />
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{selectedDoc.name}</h2>
                                    <div style={{ color: 'var(--accent-color)' }}>{selectedDoc.specialty}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontSize: '0.9rem', color: '#888' }}>
                                        <span>⭐ {selectedDoc.rating}</span>
                                        <span>📍 {selectedDoc.distanceFromUser}km away</span>
                                        <span>₦{selectedDoc.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Manual Override for Admin */}
                            <div style={{ marginBottom: '24px', padding: '12px', background: '#111', borderRadius: '8px' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px', color: '#666', fontWeight: 'bold' }}>ADMIN ACTION: OVERRIDE STATUS</label>
                                <select
                                    value={selectedDoc.statusOverride || ''}
                                    onChange={(e) => onUpdateStatus(selectedDoc.id, e.target.value || null)}
                                    style={{ width: '100%', background: '#000', border: '1px solid #333', padding: '8px', color: '#fff', borderRadius: '4px' }}
                                >
                                    <option value="">Auto (Use Schedule)</option>
                                    <option value="Offline">Force Offline</option>
                                </select>
                            </div>

                            {/* Schedule Grid */}
                            <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #222', paddingBottom: '8px', marginBottom: '16px' }}>Today's Live Schedule</h3>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {selectedDoc.schedule.map((slot, i) => (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '10px 14px', borderRadius: '6px',
                                        background: slot.isBreak ? '#222' : slot.isBooked ? 'rgba(255, 51, 51, 0.1)' : 'rgba(57, 255, 20, 0.05)',
                                        borderLeft: slot.isBreak ? '3px solid #666' : slot.isBooked ? '3px solid #ff3333' : '3px solid #39ff14',
                                        color: slot.isBreak ? '#888' : slot.isBooked ? '#ff9999' : '#fff'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clock size={14} /> {slot.time}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                                            {slot.isBreak ? 'BREAK TIME' : slot.isBooked ? 'BOOKED' : 'OPEN SLOT'}
                                        </div>
                                        {slot.patient && <div style={{ fontSize: '0.75rem', color: '#888' }}>{slot.patient}</div>}
                                    </div>
                                ))}
                            </div>

                            {/* AI Suggestions */}
                            {(selectedDoc.calculatedStatus === 'Fully Booked' || selectedDoc.calculatedStatus === 'Offline' || selectedDoc.openSlots < 2) && (
                                <div style={{ marginTop: '30px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-color)' }}>
                                        <BrainCircuit size={18} />
                                        <h3 style={{ margin: 0, fontSize: '1rem' }}>AI Alternative Suggestions</h3>
                                    </div>

                                    {aiSuggestions.map(sug => (
                                        <div key={sug.id} onClick={() => setSelectedDocId(sug.id)} style={{ cursor: 'pointer', background: '#111', padding: '12px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <img src={sug.image} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                                <div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{sug.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                        {sug.distanceFromUser < selectedDoc.distanceFromUser ? 'Closer' : 'Available'} • ₦{sug.price.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ background: 'var(--accent-color)', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>View</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </motion.div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#666' }}>
                            <Activity size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p>Select a doctor to view live status and schedule.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}

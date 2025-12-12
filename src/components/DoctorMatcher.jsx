import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, User, MapPin } from 'lucide-react';

export default function DoctorMatcher({ clinics, onMatchFound }) {
    if (!clinics || clinics.length === 0) return <div className="container">No clinics available for matching.</div>;

    const [currentClinic, setCurrentClinic] = useState(clinics[0]);
    const [isMatching, setIsMatching] = useState(true);

    useEffect(() => {
        let interval;
        let timeout;

        // Spin effect
        interval = setInterval(() => {
            const randomClinic = clinics[Math.floor(Math.random() * clinics.length)];
            setCurrentClinic(randomClinic);
        }, 100);

        // Stop after 3 seconds
        timeout = setTimeout(() => {
            clearInterval(interval);
            setIsMatching(false);
            // Select a "best match" (mock logic: random for now, or passed prop)
            const bestMatch = clinics[Math.floor(Math.random() * clinics.length)];
            setCurrentClinic(bestMatch);

            setTimeout(() => {
                onMatchFound(bestMatch);
            }, 1500); // Show the winner for 1.5s before moving on
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [clinics, onMatchFound]);

    return (
        <div className="container" style={{ justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ marginBottom: '30px', position: 'relative' }}>
                    <div style={{
                        width: '120px', height: '120px',
                        borderRadius: '50%',
                        border: '4px solid var(--accent-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto',
                        background: '#111',
                        boxShadow: '0 0 30px var(--accent-glow)'
                    }}>
                        <User size={60} color="var(--accent-color)" />
                    </div>
                    {isMatching && (
                        <motion.div
                            style={{
                                position: 'absolute', top: -10, left: '50%', marginLeft: '-70px',
                                width: '140px', height: '140px',
                                borderRadius: '50%',
                                border: '2px dashed var(--accent-color)',
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />
                    )}
                </div>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                    {isMatching ? "AI Matching Best Specialist..." : "Best Match Found!"}
                </h2>

                <div style={{ height: '60px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: isMatching ? '#888' : '#fff' }}>
                        {currentClinic.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <MapPin size={14} /> {currentClinic.location}
                    </div>
                </div>

                {isMatching && (
                    <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666' }}>
                        Analyzing proximity, wait times, and equipment...
                    </div>
                )}
            </motion.div>
        </div>
    );
}

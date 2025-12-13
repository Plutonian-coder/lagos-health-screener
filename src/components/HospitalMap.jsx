import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, Clock, Activity, MapPin, CheckCircle } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export default function HospitalMap({ clinics = [], recommendedClinic, onBook }) {
    const [selectedClinic, setSelectedClinic] = useState(recommendedClinic);

    const center = selectedClinic?.coordinates || [6.5244, 3.3792]; // Default Lagos center

    return (
        <div className="w-full h-screen" style={{ padding: 0, display: 'flex', flexDirection: 'column', background: '#000' }}>
            <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.1)', zIndex: 10, paddingTop: '80px' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                    <MapPin color="#22c55e" /> Hospital Intelligence Map
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                    Showing best matches based on proximity, cost, and facilities.
                </p>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <ChangeView center={center} zoom={13} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {clinics.map(clinic => (
                        <Marker
                            key={clinic.id}
                            position={clinic.coordinates}
                            eventHandlers={{
                                click: () => setSelectedClinic(clinic),
                            }}
                        >
                            <Popup>
                                <div style={{ color: '#000' }}>
                                    <strong>{clinic.name}</strong><br />
                                    {clinic.type}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Selected Clinic Detail Card Overlay */}
                {selectedClinic && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '20px',
                            right: '20px',
                            background: 'rgba(17, 17, 17, 0.95)',
                            backdropFilter: 'blur(10px)',
                            padding: '20px',
                            borderRadius: '16px',
                            border: '1px solid #333',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            zIndex: 1000
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>{selectedClinic.name}</h3>
                                <div style={{ color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    {selectedClinic.cost} • {selectedClinic.type}
                                </div>
                            </div>
                            <div style={{ background: '#222', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Star size={14} fill="#ffcc00" color="#ffcc00" />
                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>4.8</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #333' }}>
                                <div style={{ fontSize: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={12} /> AVG WAIT TIME
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{selectedClinic.waitTime}</div>
                            </div>
                            <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #333' }}>
                                <div style={{ fontSize: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Activity size={12} /> FACILITIES
                                </div>
                                <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {selectedClinic.facilities[0]}, {selectedClinic.facilities[1]}...
                                </div>
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={() => onBook(selectedClinic)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            Book Appointment <CheckCircle size={18} />
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

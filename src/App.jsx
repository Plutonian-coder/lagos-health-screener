import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Wizard from './components/Wizard';
import Summary from './components/Summary';
import AIInterview from './components/AIInterview';
import HospitalMap from './components/HospitalMap';
import DoctorMatcher from './components/DoctorMatcher';
import HospitalAdmin from './components/HospitalAdmin';
import { clinics as initialClinics } from './data/clinics';
import { initialDoctors } from './data/doctors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Loader2, ShieldCheck, User, Building2, Stethoscope, ClipboardCheck, Clock, LogOut, HeartPulse } from 'lucide-react';
import WarpShaderHero from './components/ui/WarpShaderHero';
import { PromptInputBox } from './components/ui/ai-prompt-box';
import { Toaster, toast } from 'sonner';

// --- Hospital Onboarding Component ---
function HospitalOnboarding({ onComplete, user, apiKey }) {
  const [step, setStep] = useState(1); // 1: Info, 2: Doctors, 3: KYC, 4: Success
  const [loading, setLoading] = useState(false);

  // Form Data
  const [info, setInfo] = useState(() => {
    try {
      const savedInfo = localStorage.getItem('hospital_onboarding_info');
      return savedInfo ? JSON.parse(savedInfo) : { name: '', address: '', phone: '', type: 'General Hospital' };
    } catch (e) {
      return { name: '', address: '', phone: '', type: 'General Hospital' };
    }
  });
  const [doctorList, setDoctorList] = useState(() => {
    try {
      const savedDoctors = localStorage.getItem('hospital_onboarding_doctors');
      return savedDoctors ? JSON.parse(savedDoctors) : [{ name: '', specialty: 'General Practitioner' }];
    } catch (e) {
      return [{ name: '', specialty: 'General Practitioner' }];
    }
  });
  const [kycResult, setKycResult] = useState(null);

  // Video KYC State
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'

  // Persist info and doctorList
  useEffect(() => {
    localStorage.setItem('hospital_onboarding_info', JSON.stringify(info));
  }, [info]);

  useEffect(() => {
    localStorage.setItem('hospital_onboarding_doctors', JSON.stringify(doctorList));
  }, [doctorList]);

  // Cleanup Camera on Unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Auto-start camera when entering Step 3
  useEffect(() => {
    if (step === 3) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [step, facingMode]);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const startCamera = async () => {
    setKycResult(null);
    setScanProgress(0);
    stopCamera(); // Ensure previous stream is closed

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });

      // Wait a bit for ref to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Play promise to handle autoplay restrictions
          videoRef.current.play().catch(e => console.error("Autoplay prevented:", e));
          setIsCameraActive(true);
        }
      }, 100);

    } catch (err) {
      console.error("Camera Error:", err);
      // Fallback to any camera if specific mode fails
      if (facingMode === 'environment') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Autoplay prevented:", e));
            setIsCameraActive(true);
          }
        } catch (e) {
          console.error("Fallback Camera Error:", e);
          setIsCameraActive(false);
        }
      } else {
        setIsCameraActive(false);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Handlers
  const addDoctor = () => {
    if (doctorList.length < 10) setDoctorList([...doctorList, { name: '', specialty: 'General Practitioner' }]);
  };

  const updateDoctor = (index, field, value) => {
    const list = [...doctorList];
    list[index][field] = value;
    setDoctorList(list);
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleDoctorsSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const captureFrames = async () => {
    if (!videoRef.current) return [];

    const frames = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 480;

    // Capture 3 frames with 800ms delay
    for (let i = 0; i < 3; i++) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      frames.push(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
      setScanProgress((i + 1) * 33);
      await new Promise(r => setTimeout(r, 800));
    }
    return frames;
  };

  const performLiveAnalysis = async () => {
    if (!apiKey) {
      alert("API Key missing. Please configure it in the main menu.");
      return;
    }

    setLoading(true);

    try {
      const frames = await captureFrames();
      stopCamera(); // Stop after capture

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Analyze these 3 video frames from a live facility walkthrough.
        Target: Verifying existence of "${info.name}" at "${info.address}".
        
        Task:
        1. Consistency: Do the frames show a consistent real-world environment (not a screen recording or static photo)?
        2. Facility Check: Do you see signs of a hospital/clinic (signboard, reception, medical chart, waiting area, or building exterior)?
        
        Output JSON only:
        {
          "verified": boolean,
          "confidence": "high" | "medium" | "low",
          "reasoning": "Explain what was seen across frames."
        }
      `;

      // Construct parts: Prompt + 3 Images
      const parts = [prompt, ...frames.map(f => ({ inlineData: { data: f, mimeType: "image/jpeg" } }))];

      const result = await model.generateContent(parts);
      const response = await result.response;
      const text = response.text();
      const json = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());

      setKycResult(json);
      setLoading(false);

      if (json.verified) {
        setTimeout(() => {
          const newHospital = {
            id: `h_${Date.now()}`,
            name: info.name,
            location: "Lagos",
            coordinates: [6.5244 + (Math.random() * 0.1), 3.3792 + (Math.random() * 0.1)],
            type: info.type,
            facilities: ["Emergency Unit", "General Ward", "Pharmacy"],
            waitTime: "30 mins",
            cost: "Standard",
            specialists: ["GP"]
          };

          const newDoctors = doctorList.map((d, i) => ({
            id: `d_${Date.now()}_${i}`,
            name: d.name,
            specialty: d.specialty,
            hospital: info.name,
            schedule: [
              { time: '09:00', isBooked: false, isBreak: false },
              { time: '10:00', isBooked: true, isBreak: false, patient: 'Obi K.' },
              { time: '11:00', isBooked: false, isBreak: false },
              { time: '12:00', isBooked: false, isBreak: true },
              { time: '14:00', isBooked: false, isBreak: false }
            ],
            rating: 4.8,
            price: 15000,
            statusOverride: 'Available',
            image: `https://i.pravatar.cc/150?u=${d.name.replace(/\s/g, '')}`,
            distanceFromUser: 3.2
          }));

          onComplete(newHospital, newDoctors);
        }, 3000);
      } else {
        // Allow retry without auto-restart to prevent loop
      }

    } catch (error) {
      console.error(error);
      alert("Analysis Failed. Please try again.");
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px', background: '#111', border: '1px solid #333', borderRadius: '6px', color: '#fff' };

  return (
    <div className="container" style={{ maxWidth: '700px', margin: '40px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem' }}>
          {step === 1 && "Facility Details"}
          {step === 2 && "Register Doctors"}
          {step === 3 && "Live Video Check"}
        </h1>
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '10px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ width: '40px', height: '4px', background: s <= step ? 'var(--accent-color)' : '#333', borderRadius: '2px' }}></div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleInfoSubmit} className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input required type="text" placeholder="Hospital Name" value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })} style={inputStyle} />
          <input required type="text" placeholder="Full Address" value={info.address} onChange={e => setInfo({ ...info, address: e.target.value })} style={inputStyle} />
          <input required type="tel" placeholder="Official Phone" value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })} style={inputStyle} />
          <select value={info.type} onChange={e => setInfo({ ...info, type: e.target.value })} style={inputStyle}>
            <option>General Hospital</option>
            <option>Specialist Clinic</option>
          </select>
          <button className="btn-primary">Next: Add Doctors →</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleDoctorsSubmit} className="card" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Add Staff (Max 10)</h3>
          {doctorList.map((doc, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input required placeholder="Doctor Name" value={doc.name} onChange={e => updateDoctor(i, 'name', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <select value={doc.specialty} onChange={e => updateDoctor(i, 'specialty', e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                <option>General Practitioner</option>
                <option>Cardiologist</option>
                <option>Dermatologist</option>
                <option>Pediatrician</option>
              </select>
            </div>
          ))}
          {doctorList.length < 10 && (
            <button type="button" onClick={addDoctor} style={{ background: '#222', border: '1px dashed #444', color: '#888', width: '100%', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>+ Add Another Doctor</button>
          )}
          <button className="btn-primary" style={{ width: '100%' }}>Next: Start Live Video →</button>
        </form>
      )}

      {step === 3 && (
        <div className="card" style={{ padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {!kycResult ? (
            <>
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px', height: '300px', margin: '0 auto 20px', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: isCameraActive ? 'block' : 'none' }}
                />

                {!isCameraActive && (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#666', gap: '10px' }}>
                    <p>Camera is off or pending...</p>
                    <button className="btn-secondary" onClick={startCamera}>Reconnect Camera</button>
                  </div>
                )}

                {/* Scanning Overlay */}
                {loading && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 className="spin" size={50} color="var(--accent-color)" />
                    <p style={{ color: '#fff', marginTop: '16px', fontWeight: 'bold' }}>Scanning Environment...</p>
                    <p style={{ color: 'var(--accent-color)' }}>{scanProgress}%</p>
                  </div>
                )}
              </div>

              <h3>Live Facility Scan</h3>
              <p style={{ color: '#888', marginBottom: '30px' }}>
                Point camera at your facility. We will scan to verify it's a real medical environment.
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {isCameraActive ? (
                  <>
                    <button className="btn-primary" onClick={performLiveAnalysis} disabled={loading} style={{ background: 'red', borderColor: 'red' }}>
                      {loading ? "Scanning..." : "Scan"}
                    </button>
                    <button className="btn-secondary" onClick={toggleCamera} disabled={loading} title="Switch Camera" style={{ padding: '0 12px' }}>
                      🔄
                    </button>
                  </>
                ) : (
                  <button className="btn-secondary" onClick={startCamera}>Start Camera</button>
                )}
              </div>
            </>
          ) : (
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
                {kycResult.verified ? '✅' : '❌'}
              </div>
              <h2 style={{ color: kycResult.verified ? '#4CAF50' : '#ff4444', marginBottom: '10px' }}>
                {kycResult.verified ? 'Verification Successful' : 'Verification Failed'}
              </h2>
              <p style={{ color: '#fff', marginBottom: '20px', fontSize: '1.1rem' }}>"{kycResult.reasoning}"</p>

              {kycResult.verified ? (
                <div style={{ color: 'var(--accent-color)' }}>
                  <Loader2 className="spin" size={24} style={{ display: 'inline-block', marginRight: '8px' }} />
                  Setting up Admin Dashboard...
                </div>
              ) : (
                <button className="btn-secondary" onClick={() => { setKycResult(null); startCamera(); }}>Try Again</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Auth Landing Component (Local) ---
function AuthLanding({ onLogin, onSignup }) {
  const [mode, setMode] = useState('landing'); // 'landing', 'login', 'signup-patient', 'signup-hospital'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const inputStyle = { width: '100%', padding: '12px', background: '#111', border: '1px solid #333', borderRadius: '6px', color: '#fff' };
  const cardStyle = { padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', border: '1px solid #333' };
  const iconBoxStyle = { background: '#111', padding: '20px', borderRadius: '50%', marginBottom: '20px', border: '1px solid #222' };

  const BackButton = () => (
    <button onClick={() => setMode('landing')} style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10 }}>
      ← Back
    </button>
  );

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate Login
    const role = formData.email.includes('hospital') ? 'hospital' : 'patient';
    onLogin({ name: 'Test User', email: formData.email, role });
  };

  const handleSignup = (role) => (e) => {
    e.preventDefault();
    onSignup({ name: formData.name, email: formData.email, role });
  };

  if (mode === 'login') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', padding: '20px' }}>
        <BackButton />
        <form onSubmit={handleLogin} className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center' }}>Welcome Back</h2>
          <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
          <input required type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={inputStyle} />
          <button className="btn-primary">Sign In</button>
          <p style={{ color: '#666', fontSize: '0.8rem', textAlign: 'center' }}>Tip: Use 'hospital@test.com' to simulate hospital role.</p>
        </form>
      </div>
    );
  }

  if (mode === 'signup-patient') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', padding: '20px' }}>
        <BackButton />
        <form onSubmit={handleSignup('patient')} className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center' }}>Patient Registration</h2>
          <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
          <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
          <input required type="password" placeholder="Create Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={inputStyle} />
          <button className="btn-primary">Create Account</button>
        </form>
      </div>
    );
  }

  if (mode === 'signup-hospital') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', padding: '20px' }}>
        <BackButton />
        <form onSubmit={handleSignup('hospital')} className="card" style={{ padding: '40px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ textAlign: 'center', color: 'var(--accent-color)' }}>Facility Registration</h2>
          <input type="email" placeholder="Official Email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
          <input type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={inputStyle} />
          <button className="btn-secondary">Start Verification</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: '100%' }}>
      <div style={{
        width: '100px', height: '100px', background: 'var(--accent-glow)', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', border: '3px solid var(--accent-color)'
      }}>
        <ShieldCheck size={48} color="var(--accent-color)" />
      </div>

      <h1 style={{ fontSize: '3rem', marginBottom: '16px', lineHeight: '1.1' }}>
        Lagos Health <span style={{ color: 'var(--accent-color)' }}>AI</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '500px', marginBottom: '60px' }}>
        Secure, intelligent healthcare access. Local & Fast.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', width: '100%', maxWidth: '800px' }}>
        <div className="card" style={cardStyle} onClick={() => setMode('login')}>
          <div style={iconBoxStyle}><User size={32} color="#fff" /></div>
          <h3>Existing User</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Log in to account.</p>
        </div>

        <div className="card" style={cardStyle} onClick={() => setMode('signup-patient')}>
          <div style={iconBoxStyle}><HeartPulse size={32} color="var(--accent-color)" /></div>
          <h3>I am a Patient</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Get screened & find doctors.</p>
        </div>

        <div className="card" style={cardStyle} onClick={() => setMode('signup-hospital')}>
          <div style={iconBoxStyle}><Building2 size={32} color="var(--accent-color)" /></div>
          <h3>Hospital Admin</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Manage facility & doctors.</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : { isAuthenticated: false, name: '', email: '', role: '' };
    } catch (e) {
      return { isAuthenticated: false, name: '', email: '', role: '' };
    }
  });

  const [view, setView] = useState(() => {
    // Check for query param first (Higher priority after redirect)
    const params = new URLSearchParams(window.location.search);
    if (params.get('setup') === 'hospital') {
      window.history.replaceState({}, document.title, window.location.pathname); // Clean URL
      return 'hospital-setup';
    }

    // Check for verification status persistence
    const verificationStatus = localStorage.getItem('hospital_verification_status');
    if (verificationStatus === 'pending') {
      return 'hospital-setup';
    }

    // Then check hash
    if (window.location.hash === '#map') return 'map';
    if (window.location.hash === '#hospital-setup') return 'hospital-setup';
    if (window.location.hash === '#admin') return 'admin';
    return 'welcome';
  });

  // Sync view to hash
  useEffect(() => {
    if (view === 'hospital-setup') {
      // logic handled in component
    }
    window.location.hash = view;
  }, [view]);

  // Auth Handlers
  const handleLogin = (userData) => {
    const newUser = { ...userData, isAuthenticated: true };
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    if (newUser.role === 'hospital' && view !== 'hospital-setup') {
      // Check if setup needed? For now just go to welcome or admin
      setView('welcome');
    }
  };

  const handleSignup = (userData) => {
    const newUser = { ...userData, isAuthenticated: true };
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    if (userData.role === 'hospital') {
      setView('hospital-setup');
    } else {
      setView('welcome');
    }
  };

  const handleLogout = () => {
    setUser({ isAuthenticated: false, name: '', email: '', role: '' });
    localStorage.removeItem('currentUser');
    setView('welcome');
    window.location.hash = '';
  };

  const [results, setResults] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [wizardData, setWizardData] = useState(null);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [clinicsData, setClinicsData] = useState(initialClinics);
  // Hardcoded key as requested by user
  const [apiKey, setApiKey] = useState("AIzaSyD3R0Jmq-Rf-fotVidF4FWtVuciAm5yllo");
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Update a doctor's status
  const handleUpdateDoctorStatus = (id, newStatus) => {
    setDoctors(prevDoctors =>
      prevDoctors.map(doc =>
        doc.id === id ? { ...doc, statusOverride: newStatus } : doc
      )
    );
  };

  const handleWizardComplete = (answers) => {
    setWizardData(answers);
    setView('interview');
  };

  const handleInterviewComplete = async (finalData) => {
    setView('loading');

    try {
      let analysisData;
      let recommendedClinic;

      if (apiKey) {
        // Real AI Call
        const genAI = new GoogleGenerativeAI(apiKey);
        // Using Gemini 2.5 Flash as requested
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
      Act as an expert medical AI for Lagos, Nigeria. Perform Clinical Reasoning and generate a Doctor Pre-consult Summary.

      Patient Data & Interview:
      ${JSON.stringify(finalData, null, 2)}

      Available Clinics in Lagos:
      ${JSON.stringify(clinicsData, null, 2)}

      Output strictly valid JSON with this schema:
      {
        "clinicalReasoning": {
        "signal": "Red" | "Yellow" | "Green",
      "riskDescription": "High Risk (Emergency)" | "Moderate (Within 24 hours)" | "Low (Home care/Routine)"
            },
      "doctorType": "Recommended Specialist (e.g. Dermatologist, Cardiologist, GP)",
      "preConsultSummary": {
        "mainComplaint": "Concise statement of the main symptom",
      "redFlags": ["List of specific red flags detected"],
      "differentials": ["List of 3 possible differential diagnoses"],
      "vitalSigns": "Note 'Not Recorded' or infer from text if mentioned (e.g. 'High fever')",
      "riskCategory": "High/Moderate/Low",
      "recommendedDoctorType": "Same as doctorType"
            },
      "advice": "Immediate action advice for the patient",
      "recommendedClinicName": "Exact name of one clinic from the provided list"
          }
      `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        analysisData = JSON.parse(jsonStr);

        recommendedClinic = clinicsData.find(c => c.name === analysisData.recommendedClinicName) || clinicsData[0];

      } else {
        // Fallback logic
        const fallbackClinic = clinicsData.find(c => c.location === finalData.location) || clinicsData[0];
        analysisData = {
          clinicalReasoning: { signal: "Yellow", riskDescription: "Moderate" },
          doctorType: "GP",
          preConsultSummary: { mainComplaint: "Unknown", redFlags: [], differentials: [], vitalSigns: "N/A", riskCategory: "Moderate", recommendedDoctorType: "GP" },
          advice: "Consult doctor",
          recommendedClinicName: fallbackClinic.name
        };
        recommendedClinic = fallbackClinic;
      }

      setResults(analysisData);
      setSelectedClinic(recommendedClinic);
      setView('summary');

    } catch (error) {
      console.error("AI Error:", error);
      // Fallback to mock if AI fails (Quota/Error)
      const fallbackClinic = clinicsData.find(c => c.location === finalData.location) || clinicsData[0];
      setResults({
        clinicalReasoning: {
          signal: "Yellow",
          riskDescription: "Moderate (Within 24 hours)"
        },
        doctorType: "General Practitioner",
        preConsultSummary: {
          mainComplaint: finalData.mainSymptom || "Undetermined",
          redFlags: finalData.redFlags || [],
          differentials: ["Viral Infection", "Stress", "Undetermined"],
          vitalSigns: "Not Recorded",
          riskCategory: "Moderate",
          recommendedDoctorType: "General Practitioner"
        },
        advice: "Please visit the nearest clinic for a proper check-up.",
        recommendedClinicName: fallbackClinic.name
      });
      setSelectedClinic(fallbackClinic);
      setView('summary');
    }
  };

  const handleStartBooking = () => {
    setView('matching');
  };

  const handleMatchFound = (clinic) => {
    setSelectedClinic(clinic);
    setView('map');
  };

  const handleBookAppointment = (clinic) => {
    alert(`Appointment Request Sent to ${clinic.name}! \n\nA confirmation SMS has been sent to your phone.`);
    setView('welcome');
  };

  const handleHospitalSetupComplete = (newHospital, newDoctors) => {
    setClinicsData(prev => [...prev, newHospital]);
    setDoctors(prev => [...prev, ...newDoctors]);
    setView('admin');
  };

  const saveKey = (e) => {
    setApiKey(e.target.value);
    localStorage.setItem('gemini_key', e.target.value);
  };

  const handleSend = (message, files) => {
    toast(message);
    console.log("Files:", files);
  };

  if (!user.isAuthenticated) {
    return <AuthLanding onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <>
      <Toaster />
      <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
        {/* Active Navigation Bar */}
        {view !== 'hospital-setup' && <Navbar currentView={view} setView={setView} userRole={user.role} />}

        <div style={{ position: 'fixed', top: '15px', right: '20px', zIndex: 1001, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#222', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', background: '#4CAF50', borderRadius: '50%' }}></div>
            {user.name} ({user.role})
          </div>
          <button onClick={handleLogout} style={{ background: '#333', border: 'none', color: '#fff', padding: '8px', borderRadius: '50%', cursor: 'pointer' }} title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>

        {/* Main Content */}
        <div style={{ paddingTop: view === 'hospital-setup' ? '0' : '20px' }}>
          {showKeyInput && (
            <div style={{ padding: '10px 20px', background: '#111', borderBottom: '1px solid #222', maxWidth: '600px', margin: '0 auto 20px auto', borderRadius: '8px' }}>
              <input
                type="password"
                placeholder="Enter Gemini API Key..."
                value={apiKey}
                onChange={saveKey}
                style={{ width: '100%', padding: '8px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
              />
            </div>
          )}

          {view === 'hospital-setup' && (
            <HospitalOnboarding
              onComplete={handleHospitalSetupComplete}
              user={user}
              apiKey={apiKey}
            />
          )}

          {view === 'welcome' && (
            user.role === 'hospital' ? (
              <div className="container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  width: '80px', height: '80px',
                  background: 'var(--accent-glow)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '24px',
                  border: '2px solid var(--accent-color)'
                }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--accent-color)', borderRadius: '50%' }}></div>
                </div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', lineHeight: '1.1' }}>
                  Welcome back, <br />
                  <span style={{ color: 'var(--accent-color)' }}>{user?.name || 'User'}</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '400px', marginBottom: '40px' }}>
                  Manage your hospital facilities and doctors.
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setView('admin')}
                    style={{ minWidth: '160px', borderColor: '#333' }}
                  >
                    Hospital Admin
                  </button>
                </div>
                <button
                  onClick={() => setShowKeyInput(!showKeyInput)}
                  style={{ background: 'none', border: 'none', color: '#333', fontSize: '0.8rem', marginTop: '40px' }}
                >
                  {apiKey ? 'API Key Set' : 'Configure API Key'}
                </button>
              </div>
            ) : <WarpShaderHero>
              <div style={{ width: '100%', maxWidth: '600px' }}>
                <PromptInputBox onSend={handleSend} placeholder="Ask me anything about health..." />
              </div>
            </WarpShaderHero>
          )}

          {view === 'wizard' && <Wizard onComplete={handleWizardComplete} />}

          {view === 'interview' && (
            <AIInterview
              initialData={wizardData}
              apiKey={apiKey}
              onComplete={handleInterviewComplete}
            />
          )}

          {view === 'loading' && (
            <div className="container" style={{ justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
              <Loader2 className="spin" size={48} color="var(--accent-color)" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Analyzing symptoms...</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {view === 'summary' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Summary
                data={results}
                clinic={selectedClinic}
                onReset={() => setView('welcome')}
              />
              <div className="container" style={{ paddingTop: 0, paddingBottom: '40px' }}>
                <button className="btn-primary" onClick={handleStartBooking}>
                  Find & Book Specialist
                </button>
              </div>
            </div>
          )}

          {view === 'matching' && (
            <DoctorMatcher
              clinics={clinicsData}
              onMatchFound={handleMatchFound}
            />
          )}

          {view === 'map' && (
            <HospitalMap
              clinics={clinicsData}
              recommendedClinic={selectedClinic}
              onBook={handleBookAppointment}
            />
          )}

          {view === 'admin' && (
            <HospitalAdmin
              doctors={doctors}
              onUpdateStatus={handleUpdateDoctorStatus}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Wizard from './components/Wizard';
import Summary from './components/Summary';
import AIInterview from './components/AIInterview';
import HospitalMap from './components/HospitalMap';
import DoctorMatcher from './components/DoctorMatcher';
// import HospitalAdmin from './components/HospitalAdmin'; // REMOVED
import HospitalDashboard from './components/ui/hospital-dashboard';
import { clinics as initialClinics } from './data/clinics';
import { initialDoctors } from './data/doctors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Loader2, ShieldCheck, User, Building2, Stethoscope, ClipboardCheck, Clock, LogOut, HeartPulse } from 'lucide-react';
import WarpShaderHero from './components/ui/WarpShaderHero';
import { PromptInputBox } from './components/ui/ai-prompt-box';
import { HeroSection } from './components/ui/hero-section-5';
import { Toaster, toast } from 'sonner';
import { PatientDashboard } from './components/ui/patient-dashboard';
import CrowdFundingView from './components/CrowdFundingView';
import { PatientNavbar } from './components/PatientNavbar'; // Import Navbar
import SmoothWavyCanvas from './components/ui/smooth-wavy-canvas';

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

  // Styles
  const accentGreen = '#39ff14';

  return (
    <div className="min-h-screen w-full bg-black text-white p-4 md:p-10 flex flex-col items-center">
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_10%,rgba(57,255,20,0.1),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            {step === 1 && "Facility Details"}
            {step === 2 && "Register Doctors"}
            {step === 3 && "Live Video Verification"}
          </h1>
          <p className="text-zinc-400 text-lg">
            {step === 1 && "Let's start with the basics of your medical center."}
            {step === 2 && "Add your primary specialists to the directory."}
            {step === 3 && "Verify your facility's physical existence with AI."}
          </p>

          {/* Progress Bar */}
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'w-12 bg-[#39ff14] shadow-[0_0_10px_#39ff14]' : 'w-8 bg-zinc-800'}`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleInfoSubmit} className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Hospital Name</label>
                <input required type="text" placeholder="e.g. Lagos City General" value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Full Address</label>
                <input required type="text" placeholder="Street, Area, State" value={info.address} onChange={e => setInfo({ ...info, address: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Official Phone</label>
                <input required type="tel" placeholder="+234..." value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Facility Type</label>
                <select value={info.type} onChange={e => setInfo({ ...info, type: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all">
                  <option>General Hospital</option>
                  <option>Specialist Clinic</option>
                  <option>Diagnostic Centre</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-[#39ff14] text-black font-bold py-4 rounded-lg hover:bg-[#32cc11] transition-colors mt-4 text-lg">
              continue →
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleDoctorsSubmit} className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Medical Staff</h3>
              <span className="text-sm text-zinc-500">{doctorList.length} / 10 Added</span>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {doctorList.map((doc, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-3 bg-black/40 p-3 rounded-lg border border-zinc-800/50">
                  <input required placeholder="Dr. Name" value={doc.name} onChange={e => updateDoctor(i, 'name', e.target.value)}
                    className="flex-1 bg-transparent border-b border-zinc-800 px-2 py-2 text-white focus:outline-none focus:border-[#39ff14] transition-colors" />
                  <select value={doc.specialty} onChange={e => updateDoctor(i, 'specialty', e.target.value)}
                    className="flex-1 bg-transparent border-b border-zinc-800 px-2 py-2 text-zinc-300 focus:outline-none focus:border-[#39ff14] transition-colors">
                    <option>General Practitioner</option>
                    <option>Cardiologist</option>
                    <option>Dermatologist</option>
                    <option>Pediatrician</option>
                    <option>Neurologist</option>
                    <option>Surgeon</option>
                  </select>
                </div>
              ))}
            </div>

            {doctorList.length < 10 && (
              <button type="button" onClick={addDoctor} className="w-full py-3 mt-4 border border-dashed border-zinc-700 text-zinc-400 rounded-lg hover:border-[#39ff14] hover:text-[#39ff14] transition-all">
                + Add Another Specialist
              </button>
            )}

            <button className="w-full bg-[#39ff14] text-black font-bold py-4 rounded-lg hover:bg-[#32cc11] transition-colors mt-8 text-lg">
              Proceed to Verification →
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
            {!kycResult ? (
              <>
                <div className="relative w-full max-w-md mx-auto aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 mb-6 group">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
                  />

                  {!isCameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-4">
                      <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
                        <span className="text-2xl">📷</span>
                      </div>
                      <p>Camera inactive</p>
                    </div>
                  )}

                  {/* Scan Overlay UI */}
                  {isCameraActive && !loading && (
                    <div className="absolute inset-0 border-[2px] border-[#39ff14]/30 pointer-events-none">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#39ff14]" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#39ff14]" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#39ff14]" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#39ff14]" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#39ff14]/50 text-xs tracking-widest uppercase">
                        Live Feed
                      </div>
                    </div>
                  )}

                  {loading && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-20">
                      <Loader2 className="animate-spin text-[#39ff14] mb-4" size={40} />
                      <p className="text-white font-mono uppercase tracking-widest text-sm">Analyzing Environment...</p>
                      <p className="text-[#39ff14] mt-2 font-mono">{scanProgress}%</p>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Live Environment Scan</h3>
                <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                  Pan your camera across the facility reception or signage. Our AI will verify the authenticity of the medical center.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  {isCameraActive ? (
                    <>
                      <button onClick={performLiveAnalysis} disabled={loading}
                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        {loading ? "Scanning..." : "Start Scan"}
                      </button>
                      <button onClick={toggleCamera} disabled={loading} className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all">
                        Switch Cam
                      </button>
                    </>
                  ) : (
                    <button onClick={startCamera} className="px-8 py-3 bg-[#39ff14] hover:bg-[#32cc11] text-black font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                      Activate Camera
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="py-10">
                <div className="mb-6">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${kycResult.verified ? 'bg-[#39ff14]/20 text-[#39ff14]' : 'bg-red-500/20 text-red-500'}`}>
                    {kycResult.verified ? <ShieldCheck size={48} /> : <LogOut size={48} />}
                  </div>
                  <h2 className={`text-2xl font-bold mb-2 ${kycResult.verified ? 'text-[#39ff14]' : 'text-red-500'}`}>
                    {kycResult.verified ? 'Verification Successful' : 'Verification Failed'}
                  </h2>
                  <p className="text-zinc-300 italic max-w-md mx-auto">"{kycResult.reasoning}"</p>
                </div>

                {kycResult.verified ? (
                  <div className="flex items-center justify-center gap-3 text-[#39ff14] animate-pulse">
                    <Loader2 className="animate-spin" size={20} />
                    <span className="font-mono">INITIALIZING ADMIN DASHBOARD...</span>
                  </div>
                ) : (
                  <button onClick={() => { setKycResult(null); startCamera(); }} className="px-6 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-lg text-white transition-all">
                    Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { AuthComponent } from './components/ui/sign-up';
import { AnimatedLoginPage } from './components/ui/animated-characters-login-page';

// ... (previous helper components like AuthLanding could be simplified or replaced)

function AuthLanding({ onLogin, onSignup }) {
  const [mode, setMode] = useState('landing'); // 'landing', 'login', 'signup-patient', 'signup-hospital'

  // New Signup Component Handler
  const handleAuthSuccess = () => {
    // Defaulting to "patient" role for this new flow as requested,
    // or we could add role selection inside AuthComponent if needed.
    // For now, assuming "User" name and "Patient" role for the fancy flow.
    onSignup({ name: 'New User', email: 'user@example.com', role: 'patient' });
  };

  if (mode === 'landing') {
    return <HeroSection onLogin={() => setMode('login')} onSignup={() => setMode('signup-patient')} />;
  }

  if (mode === 'signup-patient') {
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#000' }}>
        <button
          onClick={() => setMode('landing')}
          style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 50, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>←</span> Back
        </button>
        <AnimatedLoginPage
          initialMode="signup"
          onLoginSuccess={(data) => onLogin({ name: data?.name || 'User', email: data?.email || 'user@example.com', role: data?.role || 'patient' })}
          onSignupSuccess={(data) => onSignup({ name: data.name, email: data.email, role: data.role })}
        />
      </div>
    );
  }

  // ... (keep existing login/hospital logic below for now, or just return null if unreachable)

  if (mode === 'login') {
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#000' }}>
        <button
          onClick={() => setMode('landing')}
          style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 50, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>←</span> Back
        </button>
        <AnimatedLoginPage
          initialMode="login"
          onLoginSuccess={(data) => onLogin({ name: data?.name || 'User', email: data?.email || 'user@example.com', role: data?.role || 'patient' })}
          onSignupSuccess={() => onSignup({ name: 'New User', email: 'newuser@example.com', role: 'patient' })}
        />
      </div>
    );
  }

  return null;
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

    // Hash overrides verification status for dev access using '#admin'
    if (window.location.hash === '#admin') return 'admin';
    if (window.location.hash === '#map') return 'map';
    if (window.location.hash === '#crowdfunding') return 'crowdfunding';
    if (window.location.hash === '#hospital-setup') return 'hospital-setup';

    // Check for verification status persistence
    const verificationStatus = localStorage.getItem('hospital_verification_status');
    if (verificationStatus === 'pending') {
      return 'hospital-setup';
    }

    try {
      const savedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (savedUser.role === 'hospital') return 'admin';
      if (savedUser.role === 'patient') return 'wizard'; // Scanner page
    } catch (e) { }

    return 'wizard';
  });

  // DEV: Auto-login as admin if accessing #admin directly
  useEffect(() => {
    if (view === 'admin' && !user.isAuthenticated) {
      const dummyAdmin = { isAuthenticated: true, name: 'Dr. Admin', email: 'admin@lagoshealth.com', role: 'hospital' };
      setUser(dummyAdmin);
      localStorage.setItem('currentUser', JSON.stringify(dummyAdmin));
    }
  }, [view, user.isAuthenticated]);

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

    if (newUser.role === 'hospital') {
      setView('admin');
    } else {
      setView('wizard'); // Redirect to Scanner
    }
  };

  const handleSignup = (userData) => {
    const newUser = { ...userData, isAuthenticated: true };
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    if (userData.role === 'hospital') {
      setView('hospital-setup');
    } else {
      setView('wizard'); // Redirect to Scanner
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
  const [apiKey, setApiKey] = useState("AIzaSyDKG_J-TMbaQ42C2GJVJxLmtQHlrF_ssqc");
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
    // Open Calendar for scheduling
    window.open("https://calendar.app.google/HchmC7HacPvPHBnA9", "_blank");
    // Do NOT redirect to welcome. Maybe stay on summary or go to dashboard?
    // User said "remove this page... http://localhost:5194/#welcome".
    // I will set view to 'patient-dashboard' to be safe, or just keep it current.
    // "remove this page as its not needed after clicked on book appointment... it implies we move on".
    // I will redirect to 'patient-dashboard' in the background so when they come back they are central.
    setView('patient-dashboard');
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
      <div style={{ minHeight: '100vh', background: (view === 'wizard' || view === 'map' || view === 'interview' || view === 'summary' || view === 'crowdfunding') ? '#000000' : '#ffffff', color: (view === 'wizard' || view === 'map' || view === 'interview' || view === 'summary' || view === 'crowdfunding') ? '#ffffff' : '#000000', transition: 'background-color 0.5s ease' }}>
        {/* Patient Navigation Bar */}
        {user.isAuthenticated && user.role === 'patient' && (view === 'wizard' || view === 'map' || view === 'patient-dashboard' || view === 'interview' || view === 'screener' || view === 'crowdfunding') && (
          <PatientNavbar currentView={view} onNavigate={setView} />
        )}

        {/* Active Navigation Bar - REMOVED as per request */}
        {/* {view !== 'hospital-setup' && view !== 'admin' && !(view === 'welcome' && user.role !== 'hospital') && <Navbar currentView={view} setView={setView} userRole={user.role} />} */}

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



          {(view === 'wizard' || view === 'interview') && (
            <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <SmoothWavyCanvas
                  backgroundColor="#000000"
                  primaryColor="120, 120, 120"
                  secondaryColor="80, 80, 80"
                  accentColor="74, 222, 128"
                  lineOpacity={0.3}
                />
              </div>
              <div style={{ position: 'relative', zIndex: 10 }}>
                {view === 'wizard' && <Wizard onComplete={handleWizardComplete} />}
                {view === 'interview' && (
                  <AIInterview
                    initialData={wizardData}
                    apiKey={apiKey}
                    onComplete={handleInterviewComplete}
                  />
                )}
              </div>
            </div>
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

          {view === 'crowdfunding' && <CrowdFundingView onNavigate={setView} />}

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
            <HospitalDashboard
              hospitalName={user.role === 'hospital' ? user.name : "Lagos General"}
              onLogout={handleLogout}
              doctors={doctors}
              onUpdateStatus={handleUpdateDoctorStatus}
            />
          )}

          {view === 'patient-dashboard' && (
            <PatientDashboard
              userName={user.name}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;

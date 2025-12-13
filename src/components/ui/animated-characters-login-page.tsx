"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Sparkles } from "lucide-react";

interface PupilProps {
    size?: number;
    maxDistance?: number;
    pupilColor?: string;
    forceLookX?: number;
    forceLookY?: number;
}

const Pupil = ({
    size = 12,
    maxDistance = 5,
    pupilColor = "black",
    forceLookX,
    forceLookY
}: PupilProps) => {
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);
    const pupilRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const calculatePupilPosition = () => {
        if (!pupilRef.current) return { x: 0, y: 0 };
        if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };

        const pupil = pupilRef.current.getBoundingClientRect();
        const pupilCenterX = pupil.left + pupil.width / 2;
        const pupilCenterY = pupil.top + pupil.height / 2;
        const deltaX = mouseX - pupilCenterX;
        const deltaY = mouseY - pupilCenterY;
        const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
        const angle = Math.atan2(deltaY, deltaX);
        return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
    };

    const pupilPosition = calculatePupilPosition();

    return (
        <div
            ref={pupilRef}
            className="rounded-full"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: pupilColor,
                transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                transition: 'transform 0.1s ease-out',
            }}
        />
    );
};

interface EyeBallProps {
    size?: number;
    pupilSize?: number;
    maxDistance?: number;
    eyeColor?: string;
    pupilColor?: string;
    isBlinking?: boolean;
    forceLookX?: number;
    forceLookY?: number;
}

const EyeBall = ({
    size = 48,
    pupilSize = 16,
    maxDistance = 10,
    eyeColor = "white",
    pupilColor = "black",
    isBlinking = false,
    forceLookX,
    forceLookY
}: EyeBallProps) => {
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);
    const eyeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const calculatePupilPosition = () => {
        if (!eyeRef.current) return { x: 0, y: 0 };
        if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };

        const eye = eyeRef.current.getBoundingClientRect();
        const eyeCenterX = eye.left + eye.width / 2;
        const eyeCenterY = eye.top + eye.height / 2;
        const deltaX = mouseX - eyeCenterX;
        const deltaY = mouseY - eyeCenterY;
        const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
        const angle = Math.atan2(deltaY, deltaX);
        return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
    };

    const pupilPosition = calculatePupilPosition();

    return (
        <div
            ref={eyeRef}
            className="rounded-full flex items-center justify-center transition-all duration-150"
            style={{
                width: `${size}px`,
                height: isBlinking ? '2px' : `${size}px`,
                backgroundColor: eyeColor,
                overflow: 'hidden',
            }}
        >
            {!isBlinking && (
                <div className="rounded-full" style={{ width: `${pupilSize}px`, height: `${pupilSize}px`, backgroundColor: pupilColor, transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`, transition: 'transform 0.1s ease-out' }} />
            )}
        </div>
    );
};

interface AnimatedLoginPageProps {
    onLoginSuccess: () => void;
    onSignupSuccess: (data: { name: string; email: string; role: 'patient' | 'hospital' }) => void;
    initialMode?: 'login' | 'signup';
}

export function AnimatedLoginPage({ onLoginSuccess, onSignupSuccess, initialMode = 'login' }: AnimatedLoginPageProps) {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [showPassword, setShowPassword] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<'patient' | 'hospital'>('patient');

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Animation States
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);
    const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
    const [isBlackBlinking, setIsBlackBlinking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
    const [isPurplePeeking, setIsPurplePeeking] = useState(false);

    const purpleRef = useRef<HTMLDivElement>(null);
    const blackRef = useRef<HTMLDivElement>(null);
    const yellowRef = useRef<HTMLDivElement>(null);
    const orangeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsPurpleBlinking(true);
            setTimeout(() => setIsPurpleBlinking(false), 150);
        }, Math.random() * 4000 + 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsBlackBlinking(true);
            setTimeout(() => setIsBlackBlinking(false), 150);
        }, Math.random() * 4000 + 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isTyping) {
            setIsLookingAtEachOther(true);
            const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
            return () => clearTimeout(timer);
        } else {
            setIsLookingAtEachOther(false);
        }
    }, [isTyping]);

    useEffect(() => {
        if (password.length > 0 && showPassword) {
            const interval = setInterval(() => {
                setIsPurplePeeking(true);
                setTimeout(() => setIsPurplePeeking(false), 800);
            }, Math.random() * 3000 + 2000);
            return () => clearInterval(interval);
        } else {
            setIsPurplePeeking(false);
        }
    }, [password, showPassword]);

    const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 3;
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const faceX = Math.max(-15, Math.min(15, deltaX / 20));
        const faceY = Math.max(-10, Math.min(10, deltaY / 30));
        const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));
        return { faceX, faceY, bodySkew };
    };

    const purplePos = calculatePosition(purpleRef);
    const blackPos = calculatePosition(blackRef);
    const yellowPos = calculatePosition(yellowRef);
    const orangePos = calculatePosition(orangeRef);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 800));

        if (mode === 'login') {
            onLoginSuccess({ email, role, name: 'Returning User' });
        } else {
            onSignupSuccess({ name, email, role });
        }

        setIsLoading(false);
    };

    const toggleMode = (e: React.MouseEvent) => {
        e.preventDefault();
        setMode(mode === 'login' ? 'signup' : 'login');
        setError("");
    };

    return (
        <div className="min-h-screen bg-black w-full flex">
            {/* Left Content Section (Animation) - Hidden on mobile, visible on lg+ */}
            <div className="relative hidden w-1/2 lg:flex flex-col justify-between bg-black p-12 overflow-hidden border-r border-white/10">
                <div className="relative z-20">
                    <div className="flex items-center gap-2 text-lg font-semibold text-white">
                        <div className="size-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <Sparkles className="size-4 text-white" />
                        </div>
                        <span>ExpressCare</span>
                    </div>
                </div>

                <div className="relative z-20 flex items-end justify-center h-[500px]">
                    <div className="relative" style={{ width: '550px', height: '400px' }}>
                        {/* Characters */}
                        {/* Purple Character */}
                        <div
                            ref={purpleRef}
                            className="absolute bottom-0 transition-all duration-700 ease-in-out"
                            style={{
                                left: '70px', width: '180px', height: (isTyping || (password.length > 0 && !showPassword)) ? '440px' : '400px',
                                backgroundColor: '#6C3FF5', borderRadius: '10px 10px 0 0', zIndex: 1,
                                transform: `skewX(${purplePos.bodySkew}deg) translateX(${isTyping ? 40 : 0}px)`,
                                transformOrigin: 'bottom center',
                            }}
                        >
                            <div className="absolute flex gap-8 transition-all duration-700 ease-in-out" style={{ left: isLookingAtEachOther ? 55 : 45 + purplePos.faceX, top: isLookingAtEachOther ? 65 : 40 + purplePos.faceY }}>
                                <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isPurpleBlinking} forceLookX={isLookingAtEachOther ? 3 : undefined} forceLookY={isLookingAtEachOther ? 4 : undefined} />
                                <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isPurpleBlinking} forceLookX={isLookingAtEachOther ? 3 : undefined} forceLookY={isLookingAtEachOther ? 4 : undefined} />
                            </div>
                        </div>

                        {/* Black Character */}
                        <div
                            ref={blackRef}
                            className="absolute bottom-0 transition-all duration-700 ease-in-out"
                            style={{
                                left: '240px', width: '120px', height: '310px', backgroundColor: '#2D2D2D', borderRadius: '8px 8px 0 0', zIndex: 2,
                                transform: `skewX(${blackPos.bodySkew * 1.5}deg) translateX(${isLookingAtEachOther ? 20 : 0}px)`,
                                transformOrigin: 'bottom center',
                            }}
                        >
                            <div className="absolute flex gap-6 transition-all duration-700 ease-in-out" style={{ left: isLookingAtEachOther ? 32 : 26 + blackPos.faceX, top: isLookingAtEachOther ? 12 : 32 + blackPos.faceY }}>
                                <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isBlackBlinking} forceLookX={isLookingAtEachOther ? 0 : undefined} forceLookY={isLookingAtEachOther ? -4 : undefined} />
                                <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isBlackBlinking} forceLookX={isLookingAtEachOther ? 0 : undefined} forceLookY={isLookingAtEachOther ? -4 : undefined} />
                            </div>
                        </div>

                        {/* Orange Character */}
                        <div ref={orangeRef} className="absolute bottom-0 transition-all duration-700 ease-in-out" style={{ left: '0px', width: '240px', height: '200px', zIndex: 3, backgroundColor: '#FF9B6B', borderRadius: '120px 120px 0 0', transform: `skewX(${orangePos.bodySkew}deg)`, transformOrigin: 'bottom center' }}>
                            <div className="absolute flex gap-8 transition-all duration-200 ease-out" style={{ left: 82 + orangePos.faceX, top: 90 + orangePos.faceY }}>
                                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" />
                                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" />
                            </div>
                        </div>

                        {/* Yellow Character */}
                        <div ref={yellowRef} className="absolute bottom-0 transition-all duration-700 ease-in-out" style={{ left: '310px', width: '140px', height: '230px', backgroundColor: '#E8D754', borderRadius: '70px 70px 0 0', zIndex: 4, transform: `skewX(${yellowPos.bodySkew}deg)`, transformOrigin: 'bottom center' }}>
                            <div className="absolute flex gap-6 transition-all duration-200 ease-out" style={{ left: 52 + yellowPos.faceX, top: 40 + yellowPos.faceY }}>
                                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" />
                                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" />
                            </div>
                            <div className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out" style={{ left: 40 + yellowPos.faceX, top: 88 + yellowPos.faceY }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black text-white w-full lg:w-1/2">
                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {mode === 'login' ? "Welcome back" : "Create an account"}
                        </h1>
                        <p className="text-zinc-400">
                            {mode === 'login' ? "Enter your credentials to access the dashboard" : "Join as a patient or hospital admin"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Role Selection for Both Modes as requested */}
                        <div className="space-y-2">
                            <Label className="text-zinc-300">I am a</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('patient')}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${role === 'patient'
                                        ? 'bg-white text-black border-white'
                                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                                        }`}
                                >
                                    Patient
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('hospital')}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${role === 'hospital'
                                        ? 'bg-white text-black border-white'
                                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                                        }`}
                                >
                                    Hospital Admin
                                </button>
                            </div>
                        </div>

                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder={role === 'hospital' ? "Admin Name" : "Your Name"}
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setIsTyping(true); }}
                                    onBlur={() => setIsTyping(false)}
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={role === 'hospital' ? "admin@hospital.com" : "you@example.com"}
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setIsTyping(true); }}
                                onBlur={() => setIsTyping(false)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-zinc-300">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setIsTyping(true); }}
                                    onBlur={() => setIsTyping(false)}
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>

                        {mode === 'login' && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" className="bg-zinc-800 border-zinc-700" />
                                    <label htmlFor="remember" className="text-sm font-medium text-zinc-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Remember me</label>
                                </div>
                                <a href="#" className="text-sm font-medium text-green-500 hover:text-green-400">Forgot password?</a>
                            </div>
                        )}

                        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                        <Button type="submit" disabled={isLoading} className="w-full h-11 bg-white text-black hover:bg-zinc-200 font-bold">
                            {isLoading ? "Processing..." : (mode === 'login' ? "Sign in" : "Create Account")}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-zinc-500">
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <a href="#" onClick={toggleMode} className="ml-1 font-semibold text-white hover:underline">
                            {mode === 'login' ? "Sign up" : "Sign in"}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

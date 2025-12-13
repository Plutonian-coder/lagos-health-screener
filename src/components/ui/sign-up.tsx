import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useMemo, useCallback, createContext, Children } from "react";
// Importing class-variance-authority for the built-in button component
import { cva, type VariantProps } from "class-variance-authority";
// Importing icons from lucide-react
import { ArrowRight, Mail, Gem, Lock, Eye, EyeOff, ArrowLeft, X, AlertCircle, PartyPopper, Loader } from "lucide-react";
// Importing animation components from framer-motion
import { AnimatePresence, motion, useInView, Variants, Transition } from "framer-motion";

// --- CONFETTI LOGIC ---
import type { ReactNode } from "react"
import type { GlobalOptions as ConfettiGlobalOptions, CreateTypes as ConfettiInstance, Options as ConfettiOptions } from "canvas-confetti"
import confetti from "canvas-confetti"

type Api = { fire: (options?: ConfettiOptions) => void }
export type ConfettiRef = Api | null
const ConfettiContext = createContext<Api>({} as Api)

const Confetti = forwardRef<ConfettiRef, React.ComponentPropsWithRef<"canvas"> & { options?: ConfettiOptions; globalOptions?: ConfettiGlobalOptions; manualstart?: boolean }>((props, ref) => {
    const { options, globalOptions = { resize: true, useWorker: true }, manualstart = false, ...rest } = props
    const instanceRef = useRef<ConfettiInstance | null>(null)
    const canvasRef = useCallback((node: HTMLCanvasElement) => {
        if (node !== null) {
            if (instanceRef.current) return
            instanceRef.current = confetti.create(node, { ...globalOptions, resize: true })
        } else {
            if (instanceRef.current) {
                instanceRef.current.reset()
                instanceRef.current = null
            }
        }
    }, [globalOptions])
    const fire = useCallback((opts = {}) => instanceRef.current?.({ ...options, ...opts }), [options])
    const api = useMemo(() => ({ fire }), [fire])
    useImperativeHandle(ref, () => api, [api])
    useEffect(() => { if (!manualstart) fire() }, [manualstart, fire])
    return <canvas ref={canvasRef} {...rest} />
})
Confetti.displayName = "Confetti";

// --- TEXT LOOP ANIMATION COMPONENT ---
type TextLoopProps = { children: React.ReactNode[]; className?: string; interval?: number; transition?: Transition; variants?: Variants; onIndexChange?: (index: number) => void; stopOnEnd?: boolean; };
export function TextLoop({ children, className, interval = 2, transition = { duration: 0.3 }, variants, onIndexChange, stopOnEnd = false }: TextLoopProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const items = Children.toArray(children);
    useEffect(() => {
        const intervalMs = interval * 1000;
        const timer = setInterval(() => {
            setCurrentIndex((current) => {
                if (stopOnEnd && current === items.length - 1) {
                    clearInterval(timer);
                    return current;
                }
                const next = (current + 1) % items.length;
                onIndexChange?.(next);
                return next;
            });
        }, intervalMs);
        return () => clearInterval(timer);
    }, [items.length, interval, onIndexChange, stopOnEnd]);
    const motionVariants: Variants = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -20, opacity: 0 },
    };
    return (
        <div className={cn('relative inline-block whitespace-nowrap', className)}>
            <AnimatePresence mode='popLayout' initial={false}>
                <motion.div key={currentIndex} initial='initial' animate='animate' exit='exit' transition={transition} variants={variants || motionVariants}>
                    {items[currentIndex]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// --- BUILT-IN BLUR FADE ANIMATION COMPONENT ---
interface BlurFadeProps { children: React.ReactNode; className?: string; variant?: { hidden: { y: number }; visible: { y: number } }; duration?: number; delay?: number; yOffset?: number; inView?: boolean; inViewMargin?: string; blur?: string; }
function BlurFade({ children, className, variant, duration = 0.4, delay = 0, yOffset = 6, inView = true, inViewMargin = "-50px", blur = "6px" }: BlurFadeProps) {
    const ref = useRef(null);
    const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
    const isInView = !inView || inViewResult;
    const defaultVariants: Variants = {
        hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
        visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
    };
    const combinedVariants = variant || defaultVariants;
    return (
        <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} exit="hidden" variants={combinedVariants} transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }} className={className}>
            {children}
        </motion.div>
    );
}


// --- BUILT-IN GLASS BUTTON COMPONENT (WITH CLICK FIX) ---
const glassButtonVariants = cva("relative isolate all-unset cursor-pointer rounded-full transition-all", { variants: { size: { default: "text-base font-medium", sm: "text-sm font-medium", lg: "text-lg font-medium", icon: "h-10 w-10" } }, defaultVariants: { size: "default" } });
const glassButtonTextVariants = cva("glass-button-text relative block select-none tracking-tighter", { variants: { size: { default: "px-6 py-3.5", sm: "px-4 py-2", lg: "px-8 py-4", icon: "flex h-10 w-10 items-center justify-center" } }, defaultVariants: { size: "default" } });
export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof glassButtonVariants> { contentClassName?: string; }
const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
    ({ className, children, size, contentClassName, onClick, ...props }, ref) => {
        const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
            const button = e.currentTarget.querySelector('button');
            if (button && e.target !== button) button.click();
        };
        return (
            <div className={cn("glass-button-wrap cursor-pointer rounded-full relative", className)} onClick={handleWrapperClick}>
                <button className={cn("glass-button relative z-10", glassButtonVariants({ size }))} ref={ref} onClick={onClick} {...props}>
                    <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>{children}</span>
                </button>
                <div className="glass-button-shadow rounded-full pointer-events-none"></div>
            </div>
        );
    }
);
GlassButton.displayName = "GlassButton";


// --- THEME-AWARE SVG GRADIENT BACKGROUND WITH SUBTLE ANIMATION ---
const GradientBackground = () => (
    <>
        <style>
            {` @keyframes float1 { 0% { transform: translate(0, 0); } 50% { transform: translate(-10px, 10px); } 100% { transform: translate(0, 0); } } @keyframes float2 { 0% { transform: translate(0, 0); } 50% { transform: translate(10px, -10px); } 100% { transform: translate(0, 0); } } `}
        </style>
        <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="absolute top-0 left-0 w-full h-full">
            <defs>
                <linearGradient id="rev_grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 0.8 }} /><stop offset="100%" style={{ stopColor: 'var(--color-chart-3)', stopOpacity: 0.6 }} /></linearGradient>
                <linearGradient id="rev_grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{ stopColor: 'var(--color-chart-4)', stopOpacity: 0.9 }} /><stop offset="50%" style={{ stopColor: 'var(--color-secondary)', stopOpacity: 0.7 }} /><stop offset="100%" style={{ stopColor: 'var(--color-chart-1)', stopOpacity: 0.6 }} /></linearGradient>
                <radialGradient id="rev_grad3" cx="50%" cy="50%" r="50%"><stop offset="0%" style={{ stopColor: 'var(--color-destructive)', stopOpacity: 0.8 }} /><stop offset="100%" style={{ stopColor: 'var(--color-chart-5)', stopOpacity: 0.4 }} /></radialGradient>
                <filter id="rev_blur1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="35" /></filter>
                <filter id="rev_blur2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="25" /></filter>
                <filter id="rev_blur3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="45" /></filter>
            </defs>
            <g style={{ animation: 'float1 20s ease-in-out infinite' }}>
                <ellipse cx="200" cy="500" rx="250" ry="180" fill="url(#rev_grad1)" filter="url(#rev_blur1)" transform="rotate(-30 200 500)" />
                <rect x="500" y="100" width="300" height="250" rx="80" fill="url(#rev_grad2)" filter="url(#rev_blur2)" transform="rotate(15 650 225)" />
            </g>
            <g style={{ animation: 'float2 25s ease-in-out infinite' }}>
                <circle cx="650" cy="450" r="150" fill="url(#rev_grad3)" filter="url(#rev_blur3)" opacity="0.7" />
                <ellipse cx="50" cy="150" rx="180" ry="120" fill="var(--color-accent)" filter="url(#rev_blur2)" opacity="0.8" />
            </g>
        </svg>
    </>
);


// --- CHILD COMPONENTS ---
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-6 h-6"> <g fillRule="evenodd" fill="none"> <g fillRule="nonzero" transform="translate(3, 2)"> <path fill="#4285F4" d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267"></path> <path fill="#34A853" d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667"></path> <path fill="#FBBC05" d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120237 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782"></path> <path fill="#EB4335" d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769"></path> </g> </g></svg>);
const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-6 h-6"> <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" /> </svg>);

const modalSteps = [
    { message: "Signing you up...", icon: <Loader className="w-12 h-12 text-primary animate-spin" /> },
    { message: "Onboarding you...", icon: <Loader className="w-12 h-12 text-primary animate-spin" /> },
    { message: "Finalizing...", icon: <Loader className="w-12 h-12 text-primary animate-spin" /> },
    { message: "Welcome Aboard!", icon: <PartyPopper className="w-12 h-12 text-green-500" /> }
];
const TEXT_LOOP_INTERVAL = 1.5;

const DefaultLogo = () => (<div className="bg-primary text-primary-foreground rounded-md p-1.5"> <Gem className="h-4 w-4" /> </div>);

// --- MAIN COMPONENT ---
interface AuthComponentProps {
    logo?: React.ReactNode;
    brandName?: string;
    onSuccess?: () => void;
    onLoginClick?: () => void;
}

export const AuthComponent = ({ logo = <DefaultLogo />, brandName = "EaseMize", onSuccess, onLoginClick }: AuthComponentProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [authStep, setAuthStep] = useState("email");
    const [modalStatus, setModalStatus] = useState<'closed' | 'loading' | 'error' | 'success'>('closed');
    const [modalErrorMessage, setModalErrorMessage] = useState('');
    const confettiRef = useRef<ConfettiRef>(null);

    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = password.length >= 6;
    const isConfirmPasswordValid = confirmPassword.length >= 6;

    const passwordInputRef = useRef<HTMLInputElement>(null);
    const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

    const fireSideCanons = () => {
        const fire = confettiRef.current?.fire;
        if (fire) {
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
            const particleCount = 50;
            fire({ ...defaults, particleCount, origin: { x: 0, y: 1 }, angle: 60 });
            fire({ ...defaults, particleCount, origin: { x: 1, y: 1 }, angle: 120 });
        }
    };

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalStatus !== 'closed' || authStep !== 'confirmPassword') return;

        if (password !== confirmPassword) {
            setModalErrorMessage("Passwords do not match!");
            setModalStatus('error');
        } else {
            setModalStatus('loading');
            const loadingStepsCount = modalSteps.length - 1;
            const totalDuration = loadingStepsCount * TEXT_LOOP_INTERVAL * 1000;
            setTimeout(() => {
                fireSideCanons();
                setModalStatus('success');
                // Trigger parent callback after success animation
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                }, 2000);
            }, totalDuration);
        }
    };

    const handleProgressStep = () => {
        if (authStep === 'email') {
            if (isEmailValid) setAuthStep("password");
        } else if (authStep === 'password') {
            if (isPasswordValid) setAuthStep("confirmPassword");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleProgressStep();
        }
    };

    const handleGoBack = () => {
        if (authStep === 'confirmPassword') {
            setAuthStep('password');
            setConfirmPassword('');
        }
        else if (authStep === 'password') setAuthStep('email');
    };

    const closeModal = () => {
        setModalStatus('closed');
        setModalErrorMessage('');
    };

    useEffect(() => {
        if (authStep === 'password') setTimeout(() => passwordInputRef.current?.focus(), 500);
        else if (authStep === 'confirmPassword') setTimeout(() => confirmPasswordInputRef.current?.focus(), 500);
    }, [authStep]);

    useEffect(() => {
        if (modalStatus === 'success') {
            fireSideCanons();
        }
    }, [modalStatus]);

    const Modal = () => (
        <AnimatePresence>
            {modalStatus !== 'closed' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-black border-2 border-zinc-800 rounded-2xl p-8 w-full max-w-sm flex flex-col items-center gap-4 mx-2 shadow-2xl">
                        {(modalStatus === 'error' || modalStatus === 'success') && <button onClick={closeModal} className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>}
                        {modalStatus === 'error' && <>
                            <AlertCircle className="w-12 h-12 text-red-500" />
                            <p className="text-lg font-medium text-white">{modalErrorMessage}</p>
                            <GlassButton onClick={closeModal} size="sm" className="mt-4 bg-red-600 hover:bg-red-700 text-white border-none">Try Again</GlassButton>
                        </>}
                        {modalStatus === 'loading' &&
                            <TextLoop interval={TEXT_LOOP_INTERVAL} stopOnEnd={true}>
                                {modalSteps.slice(0, -1).map((step, i) =>
                                    <div key={i} className="flex flex-col items-center gap-4 text-center">
                                        {step.icon}
                                        <p className="text-lg font-medium text-white">{step.message}</p>
                                    </div>
                                )}
                            </TextLoop>
                        }
                        {modalStatus === 'success' &&
                            <div className="flex flex-col items-center gap-4 text-center">
                                {modalSteps[modalSteps.length - 1].icon}
                                <p className="text-lg font-medium text-white">{modalSteps[modalSteps.length - 1].message}</p>
                            </div>
                        }
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="bg-black min-h-screen w-full flex flex-col text-white font-[Inter] overflow-hidden relative">
            <style>{`
            input[type="password"]::-ms-reveal, input[type="password"]::-ms-clear { display: none !important; } input[type="password"]::-webkit-credentials-auto-fill-button, input[type="password"]::-webkit-strong-password-auto-fill-button { display: none !important; } input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active { -webkit-box-shadow: 0 0 0 30px transparent inset !important; -webkit-text-fill-color: white !important; background-color: transparent !important; background-clip: content-box !important; transition: background-color 5000s ease-in-out 0s !important; color: white !important; caret-color: white !important; } input:autofill { background-color: transparent !important; background-clip: content-box !important; -webkit-text-fill-color: white !important; color: white !important; } input:-internal-autofill-selected { background-color: transparent !important; background-image: none !important; color: white !important; -webkit-text-fill-color: white !important; } input:-webkit-autofill::first-line { color: white !important; -webkit-text-fill-color: white !important; }
            @property --angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; } @property --angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }
            .glass-button-wrap { --anim-time: 400ms; --anim-ease: cubic-bezier(0.25, 1, 0.5, 1); --border-width: clamp(1px, 0.0625em, 4px); position: relative; z-index: 2; transform-style: preserve-3d; transition: transform var(--anim-time) var(--anim-ease); } .glass-button-wrap:has(.glass-button:active) { transform: rotateX(25deg); } .glass-button-shadow { --shadow-cutoff-fix: 2em; position: absolute; bottom: 0; left: 0; right: 0; height: 50%; z-index: 10; transform: translateY(var(--shadow-cutoff-fix)) translateZ(0); overflow: hidden; pointer-events: none; }
            .glass-button { --lighting: rgba(255, 255, 255, 0.4); --base: #111; --shadow: rgba(0, 0, 0, 0.3); border: var(--border-width) solid rgba(255,255,255,0.1); background: var(--base); overflow: hidden; user-select: none; -webkit-user-select: none; }
            `}</style>

            <GradientBackground />

            {/* --- NAVBAR --- */}
            <nav className="relative z-10 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = ''}>
                    {logo}
                    <span className="font-bold text-xl tracking-tight hidden sm:block">{brandName}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-zinc-400 hidden sm:block">Already have an account?</span>
                    <button onClick={onLoginClick} className="text-sm font-semibold text-white hover:text-green-400 transition-colors">Sign in</button>
                </div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8">

                    {/* HEADLINES */}
                    <div className="text-center space-y-2">
                        <BlurFade delay={0.1}>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                                {authStep === 'email' ? "Create your account" : authStep === 'password' ? "Set a password" : "Confirm password"}
                            </h1>
                        </BlurFade>
                        <BlurFade delay={0.2}>
                            <p className="text-zinc-400">
                                {authStep === 'email' ? "Start your journey in seconds. No credit card required." : authStep === 'password' ? "Choose a strong password to protect your account." : "One last step to secure your account."}
                            </p>
                        </BlurFade>
                    </div>

                    {/* FORM CONTAINER */}
                    <div className="w-full relative min-h-[300px]">
                        <AnimatePresence mode="wait">

                            {/* STEP 1: EMAIL */}
                            {authStep === 'email' && (
                                <motion.div key="step-email" initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex flex-col gap-6 w-full absolute top-0 left-0">
                                    <div className="flex flex-col gap-4">
                                        <GlassButton size="lg" className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white" onClick={() => console.log('Google Auth')}>
                                            <GoogleIcon /> <span className="text-base">Continue with Google</span>
                                        </GlassButton>
                                        <GlassButton size="lg" className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white" onClick={() => console.log('Github Auth')}>
                                            <GitHubIcon /> <span className="text-base">Continue with GitHub</span>
                                        </GlassButton>
                                    </div>
                                    <div className="relative flex items-center gap-4">
                                        <div className="h-px bg-zinc-800 flex-1" />
                                        <span className="text-xs font-medium text-zinc-500 uppercase">Or continue with email</span>
                                        <div className="h-px bg-zinc-800 flex-1" />
                                    </div>
                                    <div className="group relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 group-focus-within:text-white transition-colors" />
                                        <input autoFocus type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} className="w-full bg-black/40 border border-white/10 rounded-full py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all shadow-xl" />
                                    </div>
                                    <GlassButton size="lg" disabled={!isEmailValid} onClick={handleProgressStep} className={cn("w-full transition-all duration-300", isEmailValid ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-zinc-500 cursor-not-allowed border-none opacity-50")}>
                                        Continue <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                                    </GlassButton>
                                </motion.div>
                            )}

                            {/* STEP 2: PASSWORD */}
                            {authStep === 'password' && (
                                <motion.div key="step-password" initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex flex-col gap-6 w-full absolute top-0 left-0">
                                    <div className="group relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 group-focus-within:text-white transition-colors" />
                                        <input ref={passwordInputRef} type={showPassword ? "text" : "password"} placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} className="w-full bg-black/40 border border-white/10 rounded-full py-4 pl-12 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all shadow-xl" />
                                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors focus:outline-none"><span className="sr-only">{showPassword ? "Hide" : "Show"} password</span>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                                    </div>
                                    <div className="space-y-4">
                                        <GlassButton size="lg" disabled={!isPasswordValid} onClick={handleProgressStep} className={cn("w-full transition-all duration-300", isPasswordValid ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-zinc-500 cursor-not-allowed border-none opacity-50")}>
                                            Continue <ArrowRight className="ml-2 inline-block w-4 h-4" />
                                        </GlassButton>
                                        <button onClick={handleGoBack} className="w-full py-4 text-zinc-400 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to email</button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: CONFIRM PASSWORD */}
                            {authStep === 'confirmPassword' && (
                                <motion.div key="step-confirm" initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex flex-col gap-6 w-full absolute top-0 left-0">
                                    <div className="group relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 group-focus-within:text-white transition-colors" />
                                        <input ref={confirmPasswordInputRef} type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleFinalSubmit(e); }} className="w-full bg-black/40 border border-white/10 rounded-full py-4 pl-12 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all shadow-xl" />
                                        <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors focus:outline-none"><span className="sr-only">{showConfirmPassword ? "Hide" : "Show"} password</span>{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                                    </div>
                                    <div className="space-y-4">
                                        <GlassButton size="lg" disabled={!isConfirmPasswordValid} onClick={handleFinalSubmit} className={cn("w-full transition-all duration-300", isConfirmPasswordValid ? "bg-[#39ff14] text-black hover:bg-[#32dd12] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] font-bold" : "bg-zinc-800 text-zinc-500 cursor-not-allowed border-none opacity-50")}>
                                            {modalStatus === 'loading' ? <Loader className="w-5 h-5 animate-spin" /> : "Complete Sign Up"}
                                        </GlassButton>
                                        <button onClick={handleGoBack} className="w-full py-4 text-zinc-400 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to password</button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="relative z-10 w-full p-6 text-center">
                <p className="text-zinc-600 text-xs">
                    © {new Date().getFullYear()} {brandName}. All rights reserved. <br className="sm:hidden" /> <a href="#" className="hover:text-zinc-400">Privacy Policy</a> • <a href="#" className="hover:text-zinc-400">Terms of Service</a>
                </p>
            </div>

            <Confetti ref={confettiRef} className="absolute left-0 top-0 z-0 size-full pointer-events-none" onMouseEnter={() => { }} />
            <Modal />
        </div>
    );
};

'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useScroll, motion } from 'framer-motion';

const menuItems = [
    { name: 'Features', href: '#' },
    { name: 'Solution', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'About', href: '#' },
];

const Logo = ({ className }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('h-5 w-auto', className)}
        >
            <path d="M12.468 13.9118C12.468 15.8647 11.1396 17.1999 9.1571 17.1999H2.60742C1.07725 17.1999 0.177256 16.3299 0.177256 14.89V3.11181C0.177256 1.67188 1.07725 0.80188 2.60742 0.80188H8.89708C10.9596 0.80188 12.308 2.11187 12.308 4.10185C12.308 5.61184 11.518 6.64183 10.358 7.08182L12.468 13.9118ZM8.73708 6.70183C9.42708 6.70183 9.87708 6.27183 9.87708 5.43184V3.53186C9.87708 2.69186 9.42708 2.26187 8.73708 2.26187H4.49735V6.70183H8.73708ZM9.1571 15.7399C9.8471 15.7399 10.2971 15.3099 10.2971 14.4699V12.5699C10.2971 11.7299 9.8471 11.2999 9.1571 11.2999H4.49735V15.7399H9.1571ZM22.5645 14.2818C23.5145 13.5618 24.0845 12.5618 24.0845 11.0219V6.98188C24.0845 3.39191 21.8445 0.80188 18.0046 0.80188H13.7946C12.2647 0.80188 11.3647 1.67188 11.3647 3.11181V14.89C11.3647 16.3299 12.2647 17.1999 13.7946 17.1999H18.0046C20.2146 17.1999 21.6845 16.1599 22.5645 14.2818ZM18.0046 12.6318C16.9246 12.6318 16.3446 11.9018 16.3446 10.5919V7.41188C16.3446 6.10189 16.9246 5.37189 18.0046 5.37189C19.0846 5.37189 19.6646 6.10189 19.6646 7.41188V10.5919C19.6646 11.9018 19.0846 12.6318 18.0046 12.6318Z" fill="currentColor" />
        </svg>
    );
};

const HeroHeader = ({ onLogin, onSignup }) => {
    const [menuState, setMenuState] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const { scrollYProgress } = useScroll();

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05);
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="group fixed z-20 w-full pt-2"
            >
                <div className={cn('mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12', scrolled && 'bg-background/50 backdrop-blur-2xl border border-white/10')}>
                    <motion.div
                        className={cn('relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6', scrolled && 'lg:py-4')}
                    >
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <a
                                href="#"
                                aria-label="home"
                                className="flex items-center space-x-2 text-white"
                            >
                                <Logo />
                                <span className="font-bold text-xl tracking-tighter">ExpressCare</span>
                            </a>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-white"
                            >
                                <Menu className="m-auto size-6 duration-200 group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0" />
                                <X className="absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm font-medium">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <a
                                                href={item.href}
                                                className="text-zinc-400 hover:text-white transition-colors duration-150"
                                            >
                                                <span>{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/10 p-6 shadow-2xl shadow-black/80 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <a
                                                href={item.href}
                                                className="text-zinc-400 hover:text-white block duration-150"
                                            >
                                                <span>{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onLogin}
                                    className="text-white hover:text-green-400 hover:bg-white/5"
                                >
                                    Login
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={onSignup}
                                    className="bg-white text-black hover:bg-zinc-200 rounded-full font-semibold"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </nav>
        </header>
    );
};

export function HeroSection({ onLogin, onSignup }) {
    return (
        <div className="bg-[#050505] relative min-h-screen w-full overflow-hidden text-white font-[Inter] inset-0 z-[5]">

            <HeroHeader onLogin={onLogin} onSignup={onSignup} />

            <section className="relative pt-32 lg:pt-48 pb-20 max-w-7xl mx-auto h-full">
                <div className="px-6 lg:px-12">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-white">
                            Build <span className="bg-gradient-to-r from-[#39ff14] to-white bg-clip-text text-transparent">10x Faster</span> <br />
                            with NS
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl">
                            Highly customizable components for building modern websites and applications you mean it.
                        </p>

                        <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                            <Button
                                size="lg"
                                className="h-12 rounded-full pl-5 pr-3 text-base bg-[#39ff14] text-black hover:bg-[#32dd12] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all duration-300 font-bold"
                                onClick={onSignup}
                            >
                                <span className="whitespace-nowrap">Start Building</span>
                                <ChevronRight className="ml-1" />
                            </Button>
                            <Button
                                size="lg"
                                variant="ghost"
                                className="h-12 rounded-full px-5 text-base text-white hover:bg-white/5 border border-white/10"
                            >
                                <span className="whitespace-nowrap">Request a demo</span>
                            </Button>
                        </div>
                    </div>

                    {/* Video Container */}
                    <div className="mt-20 relative mx-auto max-w-5xl">
                        <div className="aspect-[2/3] relative overflow-hidden rounded-3xl border border-white/10 sm:aspect-video lg:rounded-[3rem]">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="size-full object-cover opacity-80"
                                src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477"
                            />
                        </div>
                    </div>
                </div>


                <section className="bg-[#050505] pb-2 border-t border-white/5 pt-10 mt-20">
                    <div className="group relative m-auto max-w-7xl px-6">
                        <div className="flex flex-col items-center md:flex-row gap-8">
                            <div className="md:max-w-44 md:border-r md:border-white/10 md:pr-6">
                                <p className="text-right text-sm font-medium text-zinc-500">Powering the best teams</p>
                            </div>
                            <div className="relative py-6 w-full overflow-hidden">
                                <InfiniteSlider
                                    speedOnHover={20}
                                    speed={40}
                                    gap={112}
                                >
                                    {[
                                        "https://html.tailus.io/blocks/customers/nvidia.svg",
                                        "https://html.tailus.io/blocks/customers/column.svg",
                                        "https://html.tailus.io/blocks/customers/github.svg",
                                        "https://html.tailus.io/blocks/customers/nike.svg",
                                        "https://html.tailus.io/blocks/customers/lemonsqueezy.svg",
                                        "https://html.tailus.io/blocks/customers/laravel.svg",
                                        "https://html.tailus.io/blocks/customers/lilly.svg",
                                        "https://html.tailus.io/blocks/customers/openai.svg"
                                    ].map((src, i) => (
                                        <div key={i} className="flex items-center justify-center">
                                            <img
                                                className="mx-auto h-5 w-fit brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
                                                src={src}
                                                alt="Logo"
                                            />
                                        </div>
                                    ))}
                                </InfiniteSlider>

                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-[#050505]"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-[#050505]"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </div>
    );
}

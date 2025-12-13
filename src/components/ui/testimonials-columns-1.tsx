"use client";
import React from "react";
import { motion } from "framer-motion";

const testimonials = [
    {
        text: "I didn't have cash for admission, but ExpressCare connected me to a donor in 5 minutes. They saved my life when I had lost all hope.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        name: "Chioma Okeke",
        role: "Lagos Island",
    },
    {
        text: "The AI agent diagnosed my malaria symptoms instantly and directed me to the nearest clinic with available tests. Fast and effortless.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Tunde Bakare",
        role: "Ikeja",
    },
    {
        text: "As a donor, seeing exactly who I'm helping and knowing the funds go directly to the hospital smart contract gives me 100% trust.",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        name: "Aisha Bello",
        role: "Lekki (Donor)",
    },
    {
        text: "ExpressCare is the future. The speed at which it matches patients to doctors is unheard of in Lagos.",
        image: "https://randomuser.me/api/portraits/men/86.jpg",
        name: "Dr. Femi Adeyemi",
        role: "Chief Surgeon",
    },
    {
        text: "My son had a high fever at 2 AM. The agent found us an open pediatric emergency room within 3 minutes.",
        image: "https://randomuser.me/api/portraits/women/12.jpg",
        name: "Mrs. Johnson",
        role: "Surulere",
    },
    {
        text: "Finally, a healthcare system that works for the people. Secure, fast, and transparent.",
        image: "https://randomuser.me/api/portraits/men/11.jpg",
        name: "Emeka Obi",
        role: "Yaba",
    },
];

const firstColumn = testimonials.slice(0, 2);
const secondColumn = testimonials.slice(2, 4);
const thirdColumn = testimonials.slice(4, 6);

export const TestimonialsColumn = (props) => {
    return (
        <div className={props.className}>
            <motion.div
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6 bg-black"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                            {props.testimonials.map(({ text, image, name, role }, i) => (
                                <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950/50 shadow-xl max-w-xs w-full" key={i}>
                                    <div className="text-zinc-300 text-sm leading-relaxed">"{text}"</div>
                                    <div className="flex items-center gap-3 mt-5 border-t border-zinc-800 pt-4">
                                        <img
                                            width={40}
                                            height={40}
                                            src={image}
                                            alt={name}
                                            className="h-10 w-10 rounded-full border border-zinc-700"
                                        />
                                        <div className="flex flex-col">
                                            <div className="font-bold text-white text-sm">{name}</div>
                                            <div className="text-xs text-green-500 font-medium">{role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    )),
                ]}
            </motion.div>
        </div>
    );
};

export default function Testimonials() {
    return (
        <section className="bg-black border-t border-zinc-900 py-24 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-green-500/5 blur-[120px] pointer-events-none"></div>

            <div className="container z-10 mx-auto px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center max-w-3xl mx-auto mb-16"
                >
                    <div className="flex justify-center mb-6">
                        <div className="border border-green-500/20 bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                            Community Impact
                        </div>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white text-center mb-6">
                        Stories from <span className="text-green-500">Lagos</span>
                    </h2>
                    <p className="text-center text-zinc-400 text-lg max-w-xl">
                        Real people, real emergencies, real solutions. See how ExpressCare is changing the narrative of healthcare in Nigeria.
                    </p>
                </motion.div>

                <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[600px] overflow-hidden">
                    <TestimonialsColumn testimonials={firstColumn} duration={25} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={35} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={30} />
                </div>
            </div>
        </section>
    );
};

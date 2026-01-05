"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export type HeroProps = {
    data?: {
        title?: string;
        subtitle?: string;
    },
    images?: { id: string, url: string }[]
};

export function Hero({ data, images = [] }: HeroProps) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Parallax effect - Reduced/Disabled on mobile to prevent jitter
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const yBg = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "100%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], isMobile ? [1, 1] : [1, 0]);

    const title = data?.title ?? "静寂と、美しさ。";
    const subtitle = data?.subtitle ?? "日常に、洗練された余白を。";

    // Slideshow Logic
    const [currentIndex, setCurrentIndex] = useState(0);
    // Use raw images list, no fallback
    const displayImages = images;

    useEffect(() => {
        if (displayImages.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [displayImages.length]);

    return (
        <section ref={containerRef} className="relative w-full h-[90vh] min-h-[600px] flex items-center overflow-hidden">
            {/* Parallax Background & Slideshow */}
            <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 h-[120%] -top-[10%]">
                <AnimatePresence mode="popLayout">
                    {displayImages.length > 0 && (
                        <motion.div
                            key={displayImages[currentIndex].id}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={displayImages[currentIndex].url}
                                alt="Salon Interior"
                                fill
                                className="object-cover object-center opacity-90"
                                priority
                                sizes="100vw"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-stone-100/10 mix-blend-overlay z-10" />
            </motion.div>

            {/* Content: Asymmetrical Layout */}
            <div className="relative z-20 container mx-auto px-6 md:px-12 h-full flex flex-col justify-center">
                <motion.div
                    style={{ y: textY, opacity }}
                    className="flex flex-col md:flex-row md:items-end justify-between w-full pb-20 md:pb-0 gap-12"
                >
                    {/* Main Title - Bottom Left */}
                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="font-serif text-5xl md:text-8xl text-stone-900 tracking-[0.1em] leading-tight whitespace-pre-line"
                        >
                            {title}
                        </motion.h1>
                    </div>

                    {/* Subtitle/Concept - Offset Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className="md:mb-4 text-right md:text-left md:max-w-xs"
                    >
                        <p className="text-stone-800 text-sm md:text-base tracking-[0.2em] font-medium leading-loose mb-3 drop-shadow-sm whitespace-pre-line">
                            {subtitle}
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-stone-400 text-[10px] tracking-[0.3em] uppercase flex flex-col items-center gap-2 opacity-60"
            >
                Scroll
                <div className="w-[1px] h-12 bg-stone-300" />
            </motion.div>
        </section>
    );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type StaffItem = {
    id: string;
    name: string;
    role: string;
    image: string;
    message?: string;
};

export function Staff({ items }: { items: StaffItem[] }) {
    if (!items || items.length === 0) return null;

    return (
        <section id="staff" className="py-20 md:py-32 bg-white">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16 space-y-3">
                    <h2 className="font-serif text-3xl md:text-4xl text-stone-800">Staff</h2>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">スタッフ紹介</p>
                </div>

                {/* Responsive Layout: Mobile Scroll / Desktop Grid */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-20 md:pb-0 md:mx-0 md:px-0 scrollbar-hide">
                    {items.map((staff) => (
                        <div key={staff.id} className="group relative min-w-[85vw] md:min-w-0 snap-center flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                            {/* Image with Hover Effect */}
                            <div className="relative w-full aspect-[4/5] md:w-64 md:aspect-[3/4] flex-shrink-0 overflow-hidden bg-stone-100">
                                <Image
                                    src={staff.image}
                                    alt={staff.name}
                                    fill
                                    className="object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
                                    sizes="(max-width: 768px) 90vw, 30vw"
                                />
                                {/* Mobile: Name Overlay (for trendiness) */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-stone-900/60 to-transparent md:hidden">
                                    <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">{staff.role}</p>
                                    <h3 className="font-serif text-2xl text-white">{staff.name}</h3>
                                </div>
                            </div>

                            {/* Info Area (Desktop Only for details, Mobile separate?) */}
                            <div className="space-y-4 pt-2 w-full">
                                <div className="hidden md:block">
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 group-hover:text-stone-800 transition-colors">{staff.role}</p>
                                    <h3 className="font-serif text-2xl text-stone-800 group-hover:tracking-wider transition-all duration-500">{staff.name}</h3>
                                </div>
                                <div className="hidden md:block w-8 h-[1px] bg-stone-300 group-hover:w-16 transition-all duration-500" />
                                <p className="hidden md:block text-sm text-stone-600 leading-loose font-light md:opacity-40 md:group-hover:opacity-100 transition-opacity duration-500">
                                    {staff.message}
                                </p>

                                {/* Mobile Message (Simplified) */}
                                <p className="md:hidden text-sm text-stone-600 leading-relaxed font-light px-2">
                                    {staff.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Message */}
            </div>
        </section>
    );
}

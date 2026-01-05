"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { X } from "lucide-react";

type GalleryItem = {
    id: string;
    image: string;
    title: string;
    description: string;
};

export function Gallery({ items }: { items: GalleryItem[] }) {
    const [showAll, setShowAll] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
    const INITIAL_LIMIT = 6;

    if (!items || items.length === 0) return null;

    const visibleItems = showAll ? items : items.slice(0, INITIAL_LIMIT);
    const hasMore = items.length > INITIAL_LIMIT;

    return (
        <section id="gallery" className="py-20 md:py-32 bg-stone-50">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-12 md:mb-16 space-y-3">
                    <h2 className="font-serif text-3xl md:text-4xl text-stone-800">Style Gallery</h2>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">ヘアカタログ</p>
                </div>

                {/* Responsive Grid Layout (Unified) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12">
                    {visibleItems.map((style) => (
                        <div
                            key={style.id}
                            className="group cursor-pointer"
                            onClick={() => setSelectedImage(style)}
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-stone-200 mb-3 md:mb-6">
                                <Image
                                    src={style.image}
                                    alt={style.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-500" />
                            </div>
                            <div className="text-center space-y-1 md:space-y-2">
                                <h3 className="font-serif text-sm md:text-xl text-stone-800">{style.title}</h3>
                                <p className="text-[10px] md:text-xs text-stone-500 tracking-wider font-light truncate px-2">{style.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {hasMore && !showAll && (
                    <div className="mt-12 md:mt-16 text-center">
                        <button
                            onClick={() => setShowAll(true)}
                            className="inline-block border-b border-stone-800 pb-1 text-sm tracking-widest hover:text-stone-500 hover:border-stone-500 transition-colors"
                        >
                            VIEW MORE
                        </button>
                    </div>
                )}
            </div>



            {/* Fullscreen Image Modal (Light Theme) */}
            <AnimatePresence>
                {
                    selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-50/95 p-4 backdrop-blur-sm"
                            onClick={() => setSelectedImage(null)}
                        >
                            <button
                                className="absolute top-4 right-4 text-stone-800 p-2 hover:bg-stone-200 rounded-full transition-colors z-50"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X size={32} />
                            </button>

                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
                                className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={selectedImage.image}
                                    alt={selectedImage.title}
                                    className="object-contain max-w-[95vw] max-h-[80vh] w-auto h-auto shadow-lg"
                                />
                                <div className="mt-6 text-center text-stone-800 space-y-2">
                                    <h3 className="font-serif text-xl md:text-2xl">{selectedImage.title}</h3>
                                    <p className="text-sm text-stone-600 font-light">{selectedImage.description}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </section >
    );
}

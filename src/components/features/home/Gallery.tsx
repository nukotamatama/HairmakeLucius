"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { GalleryItem } from "@/types";

export function Gallery({ items }: { items: GalleryItem[] }) {
    const [showAll, setShowAll] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
    const INITIAL_LIMIT = 6;

    // Scroll Lock
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [selectedImage]);

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
                            <motion.div
                                layoutId={`gallery-image-${style.id}`}
                                className="relative aspect-[3/4] overflow-hidden bg-stone-200 mb-3 md:mb-6"
                            >
                                <Image
                                    src={style.images?.[0] || "/images/hero.png"}
                                    alt={style.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-500" />
                            </motion.div>
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
                {selectedImage && (
                    <GalleryModal item={selectedImage} onClose={() => setSelectedImage(null)} />
                )}
            </AnimatePresence>
        </section>
    );
}

function GalleryModal({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    // Handle both new images array and old image string for backward compatibility
    const images = item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : []);

    const onSelect = useCallback((api: any) => {
        setSelectedIndex(api.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        onSelect(emblaApi);
    }, [emblaApi, onSelect]);

    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-50/95 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-stone-800 p-2 hover:bg-stone-200 rounded-full transition-colors z-50"
                onClick={onClose}
            >
                <X size={32} />
            </button>

            <div
                className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center pointer-events-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Carousel Container */}
                <div className="relative w-full pointer-events-auto group">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex touch-pan-y">
                            {images.map((src, index) => (
                                <div className="flex-[0_0_100%] min-w-0 relative flex items-center justify-center py-4 px-2" key={index}>
                                    <motion.div
                                        layoutId={index === 0 ? `gallery-image-${item.id}` : undefined}
                                        className="relative shadow-lg max-h-[70vh] w-auto inline-block"
                                    >
                                        <img
                                            src={src}
                                            alt={`${item.title} - ${index + 1}`}
                                            className="object-contain max-w-full max-h-[70vh] w-auto h-auto mx-auto select-none drag-none"
                                            style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
                                        />
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                className="hidden md:block absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-800 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                className="hidden md:block absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-800 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                onClick={(e) => { e.stopPropagation(); scrollNext(); }}
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Dots Indicator */}
                            <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
                                {scrollSnaps.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex ? "bg-stone-800 w-4" : "bg-stone-300 hover:bg-stone-400"
                                            }`}
                                        onClick={(e) => { e.stopPropagation(); scrollTo(index); }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-10 text-center text-stone-800 space-y-2 pointer-events-auto"
                >
                    <h3 className="font-serif text-xl md:text-2xl">{item.title}</h3>
                    <p className="text-sm text-stone-600 font-light">{item.description}</p>
                </motion.div>
            </div>
        </motion.div>
    );
}

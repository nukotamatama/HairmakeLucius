"use client";

import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import Image from "next/image";
import { upload } from '@vercel/blob/client';
import { Button } from "@/components/ui/button";
import { X, Upload, GripVertical } from "lucide-react";

type Props = {
    images: string[];
    onChange: (newImages: string[]) => void;
};

export function GalleryImageManager({ images, onChange }: Props) {
    // Generate stable IDs for images based on index/url for DND to work
    // Since strings are primitives, we map them to objects with IDs for DND, then map back
    // Actually, SortableContext needs unique IDs. URLs should be unique enough, but duplicates are possible?
    // Let's use index-based IDs or something. Or just map to {id, url} internally.
    const [uploading, setUploading] = useState(false);

    const items = images.map((url, index) => ({ id: `${url}-${index}`, url }));

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            const newItems = arrayMove(images, oldIndex, newIndex);
            onChange(newItems);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const newUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const newBlob = await upload(file.name, file, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                newUrls.push(newBlob.url);
            }
            onChange([...images, ...newUrls]);
        } catch (e) {
            console.error("Upload failed", e);
            alert("アップロードに失敗しました");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (index: number) => {
        const urlToCheck = images[index];
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages); // Update UI immediately

        // Attempt to delete from blob storage if it looks like a blob url
        if (urlToCheck.startsWith('/images/')) {
            // Local image, maybe don't delete? Or call API?
            // The text 'startsWith /images/' suggests it might be a statically imported image or public folder image.
            // Blob URLs usually start with https. Content.ts check for /images/ was for deleting local placeholder?
            // Let's keep logic simple: just remove from list.
            // The original code tried to delete from /api/delete-image.
            try {
                await fetch('/api/delete-image', {
                    method: 'POST',
                    body: JSON.stringify({ url: urlToCheck })
                });
            } catch (err) { console.error(err); }
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
                        {items.map((item, index) => (
                            <SortableItem key={item.id} id={item.id}>
                                <div className="relative aspect-square bg-stone-100 rounded border overflow-hidden group">
                                    <Image src={item.url} alt="Gallery" fill className="object-cover" />
                                    {index === 0 && (
                                        <div className="absolute top-0 left-0 bg-stone-800 text-white text-[10px] px-2 py-0.5 rounded-br">
                                            Main
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault(); // Prevent drag start if clicking delete
                                            handleDelete(index);
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </SortableItem>
                        ))}
                    </SortableContext>
                </DndContext>

                {/* Upload Button */}
                <label className={`relative aspect-square bg-stone-50 border-2 border-dashed border-stone-200 rounded hover:bg-stone-100 transition-colors flex flex-col items-center justify-center cursor-pointer text-stone-400 hover:text-stone-600 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload size={24} />
                    <span className="text-xs mt-1">{uploading ? '...' : 'Add'}</span>
                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleUpload} />
                </label>
            </div>
            <p className="text-xs text-stone-400">ドラッグして並び替え（一番左上がメイン画像になります）</p>
        </div>
    );
}

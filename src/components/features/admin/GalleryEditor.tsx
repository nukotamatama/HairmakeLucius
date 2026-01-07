"use client";

import { useAdmin } from "./AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";

type GalleryItem = {
    id: string;
    image: string;
    title: string;
    description: string;
};

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { upload } from '@vercel/blob/client';

export function GalleryEditor() {
    const { state, updateSection } = useAdmin();
    const items = state.gallery as GalleryItem[];

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const setItems = (newItems: GalleryItem[]) => {
        updateSection('gallery', newItems);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            setItems(arrayMove(items, oldIndex, newIndex));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const newBlob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                // @ts-ignore
                addRandomSuffix: true,
            });
            if (newBlob.url) {
                setItems(items.map(item => item.id === id ? { ...item, image: newBlob.url } : item));
            }
        } catch (e) {
            console.error("Upload failed", e);
            alert("アップロードに失敗しました (通信エラー: " + (e as Error).message + ")");
        }
    };

    const addItem = () => {
        const newItem = { id: crypto.randomUUID(), image: "/images/hero.png", title: "New Style", description: "" };
        setItems([...items, newItem]);
    };

    const deleteItem = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        const item = items.find(i => i.id === id);
        if (item?.image?.startsWith('/images/')) {
            try {
                await fetch('/api/delete-image', {
                    method: 'POST',
                    body: JSON.stringify({ url: item.image })
                });
            } catch (err) {
                console.error("Failed to delete image:", err);
            }
        }

        setItems(items.filter(i => i.id !== id));
    };

    const handleChange = (id: string, field: keyof GalleryItem, value: string) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-end">
                <Button onClick={addItem}>+ スタイル追加</Button>
            </div>

            <DndContext
                id="gallery-editor-dnd"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {items && items.map((item) => (
                            <SortableItem key={item.id} id={item.id}>
                                <div className="p-4 space-y-4">
                                    <div className="aspect-[3/4] w-full bg-stone-100 rounded-lg overflow-hidden relative group border border-stone-200">
                                        <Image src={item.image} alt={item.title} fill className="object-cover transition-transform group-hover:scale-105" />
                                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                                            <span className="font-bold text-sm">画像を変更</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, item.id)} />
                                        </label>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-xs text-stone-500 font-bold mb-1 block">スタイル名</Label>
                                            <Input
                                                className="bg-stone-50 border-stone-200"
                                                value={item.title}
                                                onChange={(e) => handleChange(item.id, 'title', e.target.value)}
                                                placeholder="スタイル名"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-stone-500 font-bold mb-1 block">説明</Label>
                                            <Textarea
                                                className="bg-stone-50 border-stone-200 h-20 text-xs"
                                                value={item.description}
                                                onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                                                placeholder="スタイルの説明"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2 border-t border-stone-100">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => deleteItem(e, item.id)}
                                            className="text-red-400 hover:text-red-500 hover:bg-red-50 text-xs h-8"
                                        >
                                            削除する
                                        </Button>
                                    </div>
                                </div>
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

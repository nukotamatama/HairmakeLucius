"use client";

import { useAdmin } from "./AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

type StaffItem = {
    id: string;
    name: string;
    role: string;
    image: string;
    message: string;
};

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { upload } from '@vercel/blob/client';

export function StaffEditor() {
    const { state, updateSection } = useAdmin();
    const items = state.staff as StaffItem[];

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

    const setItems = (newItems: StaffItem[]) => {
        updateSection('staff', newItems);
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
            });
            if (newBlob.url) {
                setItems(items.map(item => item.id === id ? { ...item, image: newBlob.url } : item));
            }
        } catch (e) {
            console.error(e);
            alert("画像のアップロードに失敗しました: " + (e as Error).message);
        }
    };

    const addItem = () => {
        const newItem = { id: crypto.randomUUID(), name: "New Staff", role: "Stylist", image: "/images/hero.png", message: "" };
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

    const handleChange = (id: string, field: keyof StaffItem, value: string) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-end">
                <Button onClick={addItem}>+ スタッフ追加</Button>
            </div>

            <DndContext
                id="staff-editor-dnd"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 gap-6">
                        {items && items.map((item) => (
                            <SortableItem key={item.id} id={item.id}>
                                <div className="flex flex-col md:flex-row gap-6 p-4">
                                    <div className="flex-shrink-0">
                                        <label className="block text-xs text-stone-500 font-bold mb-1 ml-1">写真</label>
                                        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-stone-100 rounded-lg overflow-hidden group border border-stone-200 shadow-sm">
                                            <Image src={item.image} alt={item.name} fill className="object-cover transition-transform group-hover:scale-105" />
                                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                                                <span className="text-xs font-bold">画像を変更</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, item.id)} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-stone-500 font-bold mb-1 block">役職</label>
                                                <Input
                                                    className="bg-stone-50 border-stone-200"
                                                    value={item.role}
                                                    onChange={(e) => handleChange(item.id, 'role', e.target.value)}
                                                    placeholder="Role"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-stone-500 font-bold mb-1 block">名前</label>
                                                <Input
                                                    className="bg-stone-50 border-stone-200"
                                                    value={item.name}
                                                    onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                                                    placeholder="Name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs text-stone-500 font-bold mb-1 block">メッセージ</label>
                                            <Textarea
                                                value={item.message}
                                                onChange={(e) => handleChange(item.id, 'message', e.target.value)}
                                                placeholder="お客様へのメッセージ"
                                                className="min-h-[100px] bg-stone-50 border-stone-200"
                                            />
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
                                </div>
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

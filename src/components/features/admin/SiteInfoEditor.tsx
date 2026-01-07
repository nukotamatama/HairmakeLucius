"use client";

import { useAdmin } from "./AdminContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { upload } from '@vercel/blob/client';
import Image from "next/image";

export function SiteInfoEditor() {
    const { state, updateSection } = useAdmin();
    const data = state.siteInfo || {};
    const heroImages = (data.heroImages || []) as { id: string, url: string }[];

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const setHeroImages = (newImages: { id: string, url: string }[]) => {
        updateSection('siteInfo', { ...data, heroImages: newImages });
    };

    const handleHeroDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = heroImages.findIndex((item) => item.id === active.id);
            const newIndex = heroImages.findIndex((item) => item.id === over.id);
            setHeroImages(arrayMove(heroImages, oldIndex, newIndex));
        }
    };

    // Generic upload handler for hero images
    const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id?: string) => {
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
                if (id) {
                    // Replace existing
                    setHeroImages(heroImages.map(img => img.id === id ? { ...img, url: newBlob.url } : img));
                } else {
                    // Add new
                    setHeroImages([...heroImages, { id: crypto.randomUUID(), url: newBlob.url }]);
                }
            }
        } catch (e) {
            console.error("Upload failed", e);
            alert("アップロードに失敗しました: " + (e as Error).message);
        }
    };

    const deleteHeroImage = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        const img = heroImages.find(i => i.id === id);
        if (img?.url?.startsWith('/images/')) {
            try {
                await fetch('/api/delete-image', {
                    method: 'POST',
                    body: JSON.stringify({ url: img.url })
                });
            } catch (err) { console.error("Failed to delete image", err); }
        }
        setHeroImages(heroImages.filter(i => i.id !== id));
    };

    const checkNested = (obj: any, path: string[], value: any) => {
        const newObj = JSON.parse(JSON.stringify(obj));
        let current = newObj;
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) current[path[i]] = {};
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        return newObj;
    };

    const handleChange = (path: string[], value: string) => {
        const newData = checkNested(data, path, value);
        updateSection('siteInfo', newData);
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto pb-12">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>トップ画像 (スライドショー)</CardTitle>
                        <label className="cursor-pointer bg-stone-800 text-white px-4 py-2 rounded text-sm hover:bg-stone-700 transition-colors">
                            + 画像を追加
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleHeroImageUpload(e)} />
                        </label>
                    </div>
                </CardHeader>
                <CardContent>
                    <DndContext id="site-info-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleHeroDragEnd}>
                        <SortableContext items={heroImages.map(i => i.id)} strategy={rectSortingStrategy}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {heroImages.map((img) => (
                                    <SortableItem key={img.id} id={img.id} className="relative aspect-video bg-stone-100 rounded overflow-hidden group border">
                                        <Image src={img.url} alt="Hero" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button type="button" onClick={(e) => deleteHeroImage(e, img.id)} className="bg-red-500 text-white text-xs px-2 py-1 rounded">削除</button>
                                        </div>
                                    </SortableItem>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>コンセプト</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>タイトル</Label>
                        <Textarea
                            className="min-h-[80px] bg-stone-50 border-stone-200"
                            value={data.concept?.title || ""}
                            onChange={(e) => handleChange(['concept', 'title'], e.target.value)}
                            placeholder="改行を入れてレイアウトを調整できます"
                        />
                    </div>
                    <div>
                        <Label>サブタイトル</Label>
                        <Textarea
                            className="min-h-[80px] bg-stone-50 border-stone-200"
                            value={data.concept?.subtitle || ""}
                            onChange={(e) => handleChange(['concept', 'subtitle'], e.target.value)}
                            placeholder="改行を入れてレイアウトを調整できます"
                        />
                    </div>
                    <div>
                        <Label>説明文</Label>
                        <Textarea className="h-40 bg-stone-50 border-stone-200" value={data.concept?.description || ""} onChange={(e) => handleChange(['concept', 'description'], e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>店舗情報</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>サロン名</Label>
                        <Input value={data.access?.salonName || ""} onChange={(e) => handleChange(['access', 'salonName'], e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>郵便番号</Label>
                            <Input value={data.access?.postalCode || ""} onChange={(e) => handleChange(['access', 'postalCode'], e.target.value)} />
                        </div>
                        <div>
                            <Label>電話番号</Label>
                            <Input value={data.access?.tel || ""} onChange={(e) => handleChange(['access', 'tel'], e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <Label>住所</Label>
                        <Input value={data.access?.address || ""} onChange={(e) => handleChange(['access', 'address'], e.target.value)} />
                    </div>
                    <div>
                        <Label>Web予約URL</Label>
                        <Input
                            value={data.access?.reservationUrl || ""}
                            onChange={(e) => handleChange(['access', 'reservationUrl'], e.target.value)}
                            placeholder="https://..."
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>営業時間</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>平日</Label>
                            <Input value={data.access?.open?.weekday || ""} onChange={(e) => handleChange(['access', 'open', 'weekday'], e.target.value)} />
                        </div>
                        <div>
                            <Label>土日祝</Label>
                            <Input value={data.access?.open?.weekend || ""} onChange={(e) => handleChange(['access', 'open', 'weekend'], e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <Label>定休日</Label>
                        <Input value={data.access?.open?.close || ""} onChange={(e) => handleChange(['access', 'open', 'close'], e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>SEO / メタデータ</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>サイト説明文 (検索結果やリンク等のプレビューに表示されます)</Label>
                        <Textarea
                            className="h-24 bg-stone-50 border-stone-200"
                            value={data.metadata?.description || ""}
                            onChange={(e) => handleChange(['metadata', 'description'], e.target.value)}
                            placeholder="サイトの魅力や特徴を簡潔に記述してください..."
                        />
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}

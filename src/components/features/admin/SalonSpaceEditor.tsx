"use client";

import { useAdmin } from "./AdminContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { upload } from '@vercel/blob/client';

export function SalonSpaceEditor() {
    const { state, updateSection } = useAdmin();
    // Default structure if missing
    const defaultSpace = {
        title: "Salon Space",
        description: "",
        images: [
            { src: "", alt: "" },
            { src: "", alt: "" },
            { src: "", alt: "" }
        ]
    };
    const data = state.siteInfo?.salonSpace || defaultSpace;

    // Helper to update deeply nested state in siteInfo
    const updateSalonSpace = (newData: any) => {
        const currentSiteInfo = state.siteInfo || {};
        updateSection('siteInfo', { ...currentSiteInfo, salonSpace: newData });
    };

    const handleChange = (field: string, value: any) => {
        updateSalonSpace({ ...data, [field]: value });
    };

    const handleImageChange = (index: number, field: 'src' | 'alt', value: string) => {
        const newImages = [...(data.images || [])];
        if (!newImages[index]) newImages[index] = { src: "", alt: "" };
        newImages[index] = { ...newImages[index], [field]: value };
        handleChange('images', newImages);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
                handleImageChange(index, 'src', newBlob.url);
            }
        } catch (e) {
            console.error("Upload failed", e);
            alert("アップロードに失敗しました: " + (e as Error).message);
        }
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto pb-12">
            <Card>
                <CardHeader>
                    <CardTitle>Salon Space 設定</CardTitle>
                    <p className="text-sm text-stone-500">トップページの「Salon Space」セクションの内容を編集します。</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label>セクションタイトル</Label>
                        <Input
                            className="bg-stone-50 border-stone-200"
                            value={data.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="例: Salon Space"
                        />
                    </div>
                    <div>
                        <Label>説明文</Label>
                        <Textarea
                            className="h-32 bg-stone-50 border-stone-200"
                            value={data.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="サロンの雰囲気についての説明文..."
                        />
                    </div>

                    <div className="space-y-6 pt-4">
                        <Label className="text-base border-b pb-2 block">画像設定 (3枚)</Label>
                        {[0, 1, 2].map((index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-stone-50">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="font-bold">Image {index + 1}</Label>
                                        <span className="text-xs text-stone-400">
                                            {index === 0 ? "縦長 (左)" : index === 1 ? "横長 (右中)" : "縦長 (下中)"}
                                        </span>
                                    </div>
                                    <div className="relative aspect-video md:aspect-square bg-stone-200 rounded overflow-hidden group border border-stone-300">
                                        {data.images?.[index]?.src ? (
                                            <img
                                                src={data.images[index].src}
                                                alt={data.images[index].alt || "Preview"}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-stone-400 text-xs">
                                                No Image
                                            </div>
                                        )}

                                        {/* Overlay for upload */}
                                        <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold">
                                            <span className="text-sm">画像を変更</span>
                                            <span className="text-[10px] font-normal mt-1">クリックして選択</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, index)}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

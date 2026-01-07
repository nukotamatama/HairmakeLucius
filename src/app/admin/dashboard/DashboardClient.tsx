"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MenuEditor } from "@/components/features/admin/MenuEditor";
import { GalleryEditor } from "@/components/features/admin/GalleryEditor";
import { StaffEditor } from "@/components/features/admin/StaffEditor";
import { FAQEditor } from "@/components/features/admin/FAQEditor";
import { SiteInfoEditor } from "@/components/features/admin/SiteInfoEditor";
import { SalonSpaceEditor } from "@/components/features/admin/SalonSpaceEditor";
import { AdminProvider } from "@/components/features/admin/AdminContext";
import { SaveBar } from "@/components/features/admin/SaveBar";

export function DashboardClient({
    initialData,
    userIdentifier,
    canSignOut,
    signOutAction
}: {
    initialData: any,
    userIdentifier: string | null | undefined,
    canSignOut: boolean,
    signOutAction: () => Promise<void>
}) {
    // Prevent hydration mismatch by rendering only after mount? 
    // Actually, "use client" component can still be SSR'd. 
    // To strictly fix Radix ID mismatch, we can rely on next/dynamic ssr: false in the parent.
    // Or just accept this component is Client-only.

    return (
        <AdminProvider initialData={initialData}>
            <div className="min-h-screen bg-stone-50 p-4 md:p-8 pb-32">
                <div className="mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="font-serif text-2xl md:text-3xl text-stone-800">管理ダッシュボード</h1>
                            <p className="text-sm text-stone-500 mt-1">ログイン中: {userIdentifier}</p>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" asChild>
                                <Link href="/" target="_blank">サイトを確認</Link>
                            </Button>

                            {canSignOut && (
                                <form action={signOutAction}>
                                    <Button variant="ghost" type="submit">ログアウト</Button>
                                </form>
                            )}
                        </div>
                    </div>

                    <Tabs defaultValue="menu" className="w-full">
                        <TabsList className="grid w-full grid-cols-6 mb-8">
                            <TabsTrigger value="menu">Menu</TabsTrigger>
                            <TabsTrigger value="gallery">Gallery</TabsTrigger>
                            <TabsTrigger value="staff">Staff</TabsTrigger>
                            <TabsTrigger value="space">Space</TabsTrigger>
                            <TabsTrigger value="faq">Q&A</TabsTrigger>
                            <TabsTrigger value="info">Site Info</TabsTrigger>
                        </TabsList>

                        <TabsContent value="menu" className="space-y-4 animate-in fade-in-50">
                            <MenuEditor />
                        </TabsContent>

                        <TabsContent value="gallery" className="space-y-4 animate-in fade-in-50">
                            <GalleryEditor />
                        </TabsContent>

                        <TabsContent value="staff" className="space-y-4 animate-in fade-in-50">
                            <StaffEditor />
                        </TabsContent>

                        <TabsContent value="space" className="space-y-4 animate-in fade-in-50">
                            <SalonSpaceEditor />
                        </TabsContent>

                        <TabsContent value="faq" className="space-y-4 animate-in fade-in-50">
                            <FAQEditor />
                        </TabsContent>

                        <TabsContent value="info" className="space-y-4 animate-in fade-in-50">
                            <SiteInfoEditor />
                        </TabsContent>
                    </Tabs>
                </div>
                <SaveBar />
            </div>
        </AdminProvider>
    );
}

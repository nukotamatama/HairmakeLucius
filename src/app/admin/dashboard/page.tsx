import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
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

import { getGallery, getStaff, getFAQ, getSiteInfo, getMenuItems } from "@/actions/content";

export default async function DashboardPage() {
    const session = await auth();

    // If NOT jumping auth and no session, redirect.
    if (process.env.SKIP_AUTH !== "true" && !session?.user) {
        redirect(process.env.NEXT_PUBLIC_ADMIN_PATH || "/admin");
    }

    // Fetch ALL data server-side
    const [menu, gallery, staff, faq, siteInfo] = await Promise.all([
        getMenuItems(),
        getGallery(),
        getStaff(),
        getFAQ(),
        getSiteInfo()
    ]);

    const initialData = { menu, gallery, staff, faq, siteInfo };
    const userIdentifier = process.env.SKIP_AUTH === "true" ? "開発者モード (認証なし)" : session?.user?.email;

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

                            {process.env.SKIP_AUTH !== "true" && (
                                <form action={async () => {
                                    "use server";
                                    await signOut({ redirectTo: "/" });
                                }}>
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

                        {/* Editors now handle their own state via Context, no props needed except maybe index/key logic if needed */}
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

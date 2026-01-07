import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { getGallery, getStaff, getFAQ, getSiteInfo, getMenuItems } from "@/actions/content";
import { DashboardLoader } from "./DashboardLoader";

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
        <DashboardLoader
            initialData={initialData}
            userIdentifier={userIdentifier}
            canSignOut={process.env.SKIP_AUTH !== "true"}
            signOutAction={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
            }}
        />
    );
}

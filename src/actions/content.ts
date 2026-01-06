"use server";

import { db } from "@/db";
import { menuItems, staff, galleryItems, faqItems, siteSettings } from "@/db/schema";
import { MenuItem, GalleryItem, Staff, FAQ, SiteInfo } from "@/types";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Helpers ---
const DEFAULT_SITE_INFO: SiteInfo = {
    heroImages: [],
    concept: { title: "", subtitle: "", description: "" },
    access: {
        salonName: "Hairmake Lucias",
        postalCode: "",
        address: "",
        tel: "",
        open: { weekday: "", weekend: "", close: "" },
        reservationUrl: "",
        menuCategories: ["Cut", "Color", "Perm", "Treatment", "Spa", "Other"]
    },
    salonSpace: { title: "Salon Space", description: "", images: [] },
    menuCategories: ["Cut", "Color", "Perm", "Treatment", "Spa", "Other"],
    metadata: { description: "" }
};
// Fix typo in default object above: description: images: [] -> description: "", images: []

// --- Getters ---

export async function getMenuItems(): Promise<MenuItem[]> {
    try {
        const items = await db.select().from(menuItems).orderBy(asc(menuItems.order));
        return items.map(item => ({
            id: String(item.id),
            category: item.category as any,
            name: item.name,
            price: item.price,
            description: item.description || ""
        }));
    } catch (e) {
        console.error("Failed to fetch menu items", e);
        return [];
    }
}

export async function getStaff(): Promise<Staff[]> {
    try {
        const items = await db.select().from(staff).orderBy(asc(staff.order));
        return items.map(item => ({
            id: String(item.id),
            name: item.name,
            role: item.role,
            roleJa: item.roleJa || undefined,
            image: item.image,
            message: item.message || undefined
        }));
    } catch (e) {
        console.error("Failed to fetch staff", e);
        return [];
    }
}

export async function getGallery(): Promise<GalleryItem[]> {
    try {
        const items = await db.select().from(galleryItems).orderBy(asc(galleryItems.order));
        return items.map(item => ({
            id: String(item.id),
            title: item.title,
            description: item.description || "",
            image: item.image,
            category: item.category || undefined
        }));
    } catch (e) {
        console.error("Failed to fetch gallery", e);
        return [];
    }
}

export async function getFAQ(): Promise<FAQ[]> {
    try {
        const items = await db.select().from(faqItems).orderBy(asc(faqItems.order));
        return items.map(item => ({
            id: String(item.id),
            question: item.question,
            answer: item.answer
        }));
    } catch (e) {
        console.error("Failed to fetch FAQ", e);
        return [];
    }
}

export async function getSiteInfo(): Promise<SiteInfo> {
    try {
        const settings = await db.select().from(siteSettings).limit(1);
        if (settings.length === 0) return DEFAULT_SITE_INFO;

        const s = settings[0];
        // Merge with default to ensure all fields exist
        return {
            ...DEFAULT_SITE_INFO,
            ...(s.heroImages ? { heroImages: s.heroImages } : {}),
            ...(s.concept ? { concept: s.concept } : {}),
            ...(s.access ? { access: s.access } : {}),
            ...(s.salonSpace ? { salonSpace: s.salonSpace } : {}),
            ...(s.metadata ? { metadata: s.metadata } : {})
        };
    } catch (e) {
        console.error("Failed to fetch site info", e);
        return DEFAULT_SITE_INFO;
    }
}

// --- Save Action ---

export async function saveAllContent(data: {
    menu: MenuItem[];
    gallery: GalleryItem[];
    staff: Staff[];
    faq: FAQ[];
    siteInfo: SiteInfo;
}) {
    // Transactional update
    await db.transaction(async (tx) => {
        // 1. Menu
        await tx.delete(menuItems);
        if (data.menu.length > 0) {
            await tx.insert(menuItems).values(data.menu.map((item, i) => ({
                category: item.category,
                name: item.name,
                price: item.price,
                description: item.description,
                order: i
            })));
        }

        // 2. Staff
        await tx.delete(staff);
        if (data.staff.length > 0) {
            await tx.insert(staff).values(data.staff.map((item, i) => ({
                name: item.name,
                role: item.role,
                roleJa: item.roleJa,
                image: item.image,
                message: item.message,
                order: i
            })));
        }

        // 3. Gallery
        await tx.delete(galleryItems);
        if (data.gallery.length > 0) {
            await tx.insert(galleryItems).values(data.gallery.map((item, i) => ({
                title: item.title,
                description: item.description,
                image: item.image,
                category: item.category,
                order: i
            })));
        }

        // 4. FAQ
        await tx.delete(faqItems);
        if (data.faq.length > 0) {
            await tx.insert(faqItems).values(data.faq.map((item, i) => ({
                question: item.question,
                answer: item.answer,
                order: i
            })));
        }

        // 5. Site Info (Upsert)
        await tx.insert(siteSettings).values({
            singletonKey: 'default',
            heroImages: data.siteInfo.heroImages,
            concept: data.siteInfo.concept,
            access: data.siteInfo.access,
            salonSpace: data.siteInfo.salonSpace,
            metadata: data.siteInfo.metadata
        }).onConflictDoUpdate({
            target: siteSettings.singletonKey,
            set: {
                heroImages: data.siteInfo.heroImages,
                concept: data.siteInfo.concept,
                access: data.siteInfo.access,
                salonSpace: data.siteInfo.salonSpace,
                metadata: data.siteInfo.metadata,
                updatedAt: new Date()
            }
        });
    });

    revalidatePath("/");
}

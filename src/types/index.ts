export type MenuItem = {
    id: string;
    category: string;
    name: string;
    price: number;
    description: string;
};


export type Category = "Cut" | "Color" | "Perm" | "Treatment" | "Spa" | "Other";

export type GalleryItem = {
    id: string;
    title: string;
    description: string;
    images: string[];
    image?: string; // Deprecated: kept for backward compatibility checking
    category?: string;
};

export type Staff = {
    id: string;
    name: string;
    role: string;
    roleJa?: string;
    image: string;
    message?: string;
};

export type FAQ = {
    id: string;
    question: string;
    answer: string;
};

export type SiteInfo = {
    heroImages: { id: string; url: string }[];
    concept: { title: string; subtitle: string; description: string };
    access: {
        salonName: string;
        postalCode: string;
        address: string;
        tel: string;
        open: { weekday: string; weekend: string; close: string };
        reservationUrl: string;
        menuCategories: string[];
    };
    salonSpace: {
        title: string;
        description: string;
        images: { src: string; alt: string }[];
    };
    menuCategories: string[];
    metadata?: { description: string };
};

import { pgTable, serial, text, integer, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const menuItems = pgTable('menu_items', {
    id: serial('id').primaryKey(),
    category: text('category').notNull(),
    name: text('name').notNull(),
    price: integer('price').notNull(),
    description: text('description'),
    order: integer('order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const staff = pgTable('staff', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(), // e.g., "Taro Yamada"
    role: text('role').notNull(), // e.g., "Director"
    roleJa: text('role_ja'), // e.g., "ディレクター"
    image: text('image').notNull(),
    message: text('message'),
    order: integer('order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const galleryItems = pgTable('gallery_items', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    images: jsonb('images').$type<string[]>(),
    image: text('image'), // Deprecated, kept for backward compatibility until migration is complete
    category: text('category'),
    order: integer('order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const faqItems = pgTable('faq_items', {
    id: serial('id').primaryKey(),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    order: integer('order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const siteSettings = pgTable('site_settings', {
    id: serial('id').primaryKey(),
    singletonKey: text('singleton_key').unique().default('default'), // Ensure only one row
    heroImages: jsonb('hero_images').$type<{ id: string; url: string }[]>(),
    concept: jsonb('concept').$type<{ title: string; subtitle: string; description: string }>(),
    access: jsonb('access').$type<{
        salonName: string;
        postalCode: string;
        address: string;
        tel: string;
        open: { weekday: string; weekend: string; close: string; lastEntry?: string };
        reservationUrl: string;
        menuCategories: string[];
    }>(),
    salonSpace: jsonb('salon_space').$type<{
        title: string;
        description: string;
        images: { src: string; alt: string }[];
    }>(),
    metadata: jsonb('metadata').$type<{ description: string }>(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

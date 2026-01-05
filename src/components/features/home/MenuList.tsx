"use client";


import { MenuItem } from "@/types";


type MenuListProps = {
    menuItems: MenuItem[];
};

export function MenuList({ menuItems }: MenuListProps) {
    // Fixed category order to match Admin
    const ORDERED_CATEGORIES = ["Cut", "Color", "Perm", "Treatment", "Spa", "Other"];

    // Get unique categories from items
    const availableCategories = Array.from(new Set(menuItems.map((item) => item.category)));

    // Sort available categories based on the fixed order
    const categories = ORDERED_CATEGORIES.filter(cat => availableCategories.includes(cat));

    // Fallback: Append any categories that might be in items but not in fixed list
    const extraCategories = availableCategories.filter(cat => !ORDERED_CATEGORIES.includes(cat));
    categories.push(...extraCategories);

    return (
        <section id="menu" className="py-20 md:py-32 bg-stone-50 border-t border-stone-100 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">

                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16 space-y-3">
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="font-serif text-3xl md:text-4xl text-stone-800">Menu</h2>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">メニュー</span>
                    </div>
                </div>

                {/* Content Area - Vertical Layout for both Mobile and Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-24 items-start">
                    {categories.map((category) => (
                        <div key={category} className="space-y-6 break-inside-avoid">
                            <h3 className="text-xl font-serif text-stone-800 border-b border-stone-300 pb-2 text-left sticky top-20 bg-stone-50 z-10 md:static md:bg-transparent">
                                {category}
                            </h3>
                            <ul className="space-y-6">
                                {menuItems
                                    .filter((item) => item.category === category)
                                    .map((item) => (
                                        <MenuItemRow key={item.id} item={item} />
                                    ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Subcomponent for cleaner render
function MenuItemRow({ item }: { item: MenuItem }) {
    return (
        <li className="flex flex-col justify-between items-baseline gap-1 group">
            <div className="flex justify-between items-baseline w-full">
                <h4 className="text-base md:text-lg font-medium text-stone-700 group-hover:text-stone-900 transition-colors relative">
                    {item.name}
                    <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-stone-400 transition-all group-hover:w-full opacity-50" />
                </h4>
                <div className="flex-1 border-b border-dotted border-stone-300 mx-4 relative top-[-4px] hidden md:block opacity-50" />
                <span className="font-serif text-stone-800 text-sm md:text-base">
                    ¥{item.price.toLocaleString()}
                </span>
            </div>
            {item.description && (
                <p className="text-xs text-stone-500 mt-1 font-light leading-relaxed tracking-wide">
                    {item.description}
                </p>
            )}
        </li>
    );
}

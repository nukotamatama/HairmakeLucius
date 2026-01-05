import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header({ salonName, tel, reservationUrl }: { salonName?: string, tel?: string, reservationUrl?: string }) {
    const navItems = [
        { label: "コンセプト", sub: "CONCEPT", href: "#concept" },
        { label: "ギャラリー", sub: "GALLERY", href: "#gallery" },
        { label: "スタッフ", sub: "STAFF", href: "#staff" },
        { label: "メニュー", sub: "MENU", href: "#menu" },
        { label: "スペース", sub: "SPACE", href: "#space" },
        { label: "Q&A", sub: "FAQ", href: "#faq" },
        { label: "アクセス", sub: "ACCESS", href: "#access" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-stone-50/90 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
            <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/" className="flex flex-col items-center leading-none group">
                        <span className="font-serif text-lg md:text-xl tracking-widest text-stone-800 group-hover:text-stone-600 transition-colors">
                            {salonName ?? "Hairmake Lucias"}
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex flex-col items-center text-stone-600 hover:text-stone-900 transition-colors"
                        >
                            <span className="font-serif text-sm tracking-wider">{item.label}</span>
                            <span className="text-[10px] uppercase tracking-widest text-stone-400 group-hover:text-stone-500 mt-0.5">{item.sub}</span>
                        </Link>
                    ))}
                    <div className="flex items-center gap-4 ml-6 pl-6 border-l border-stone-200 h-10">
                        {tel && (
                            <div className="flex flex-col items-end mr-2">
                                <span className="text-[10px] text-stone-400 tracking-wider">ご予約・お問い合わせ</span>
                                <span className="font-serif text-lg tracking-widest text-stone-800">{tel}</span>
                            </div>
                        )}
                        <Button variant="primary" size="sm" asChild>
                            <Link href={reservationUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center leading-tight py-1 px-6 h-10">
                                <span className="text-xs font-serif tracking-widest">Web予約</span>
                            </Link>
                        </Button>
                    </div>
                </nav>

                {/* Mobile Menu Placeholder */}
                <div className="md:hidden">
                    {/* Mobile header is kept minimal. */}
                </div>
            </div>
        </header>
    );
}

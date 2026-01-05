import type { Metadata } from "next";
import { Shippori_Mincho, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { getSiteInfo } from "@/actions/content";

const shipporiMincho = Shippori_Mincho({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-shippori-mincho",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo();
  const title = siteInfo.access?.salonName || "Hairmake Lucias";

  return {
    title: title,
    description: siteInfo.metadata?.description ?? "日常に洗練された余白を。青山にある大人のためのプライベートサロン。",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${shipporiMincho.variable} ${notoSansJP.variable} antialiased font-sans bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}

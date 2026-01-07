
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/features/home/Hero";
import { Concept } from "@/components/features/home/Concept";
import { MenuList } from "@/components/features/home/MenuList";
import { Access } from "@/components/features/home/Access";
import { ReservationButton } from "@/components/features/home/ReservationButton";
import { Gallery } from "@/components/features/home/Gallery";
import { Staff } from "@/components/features/home/Staff";
import { SalonSpace } from "@/components/features/home/SalonSpace";
import { FAQ } from "@/components/features/home/FAQ";
import { MenuItem } from "@/types";
import { getGallery, getStaff, getFAQ, getSiteInfo, getMenuItems } from "@/actions/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const menuItems = await getMenuItems();
  const galleryItems = await getGallery();
  const staffItems = await getStaff();
  const faqItems = await getFAQ();
  const siteInfo = await getSiteInfo();

  return (
    <main className="min-h-screen bg-stone-50 font-sans selection:bg-stone-200">
      <Header salonName={siteInfo.access?.salonName} tel={siteInfo.access?.tel} reservationUrl={siteInfo.access?.reservationUrl} />
      <Hero data={siteInfo.concept} images={siteInfo.heroImages} />
      <Concept data={siteInfo.concept} />
      <Gallery items={galleryItems} />
      <Staff items={staffItems} />
      <MenuList menuItems={menuItems} />
      <SalonSpace data={siteInfo.salonSpace} /> {/* Salon Atmosphere */}
      <FAQ items={faqItems} />
      <Access data={siteInfo.access} />
      <footer className="py-8 bg-stone-900 text-stone-400 text-center text-xs tracking-wider">
        &copy; {new Date().getFullYear()} {siteInfo.access?.salonName ?? "SALON NAME"}. All Rights Reserved.
      </footer>
      <ReservationButton url={siteInfo.access?.reservationUrl} tel={siteInfo.access?.tel} />
    </main>
  );
}

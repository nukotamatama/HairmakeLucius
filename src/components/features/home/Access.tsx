
type AccessData = {
    salonName: string;
    postalCode: string;
    address: string;
    tel: string;
    open: {
        weekday: string;
        weekend: string;
        close: string;
        lastEntry?: string;
    };
};

export function Access({ data }: { data?: AccessData }) {
    // defaults
    const salonName = data?.salonName ?? "Salon Name";
    const postalCode = data?.postalCode ?? "107-0062";
    const address = data?.address ?? "東京都港区南青山 5-1-1 Example Building 2F";
    const tel = data?.tel ?? "03-1234-5678";
    const open = data?.open ?? { weekday: "11:00 - 20:00", weekend: "10:00 - 19:00", close: "火曜日", lastEntry: "" };

    return (
        <section id="access" className="py-20 md:py-32 bg-white">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-12 md:mb-16 space-y-3">
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="font-serif text-2xl md:text-3xl text-stone-800">Access</h2>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">アクセス・店舗情報</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-start">
                    {/* Info */}
                    <div className="space-y-8 font-light text-stone-600 order-2 md:order-1">
                        <div className="space-y-3">
                            <h3 className="font-serif text-xl text-stone-800 mb-2">{salonName}</h3>
                            <div className="text-sm md:text-base space-y-1">
                                <p>〒{postalCode}</p>
                                <p>{address}</p>
                                <a href={`tel:${tel.replace(/-/g, '')}`} className="inline-block mt-2 text-stone-800 border-b border-stone-300 pb-0.5">TEL: {tel}</a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="border-b border-stone-200 pb-2 mb-2 inline-block font-serif text-stone-800">Open</h4>
                            <ul className="space-y-2 text-sm md:text-base">
                                <li className="flex justify-between w-full max-w-xs">
                                    <span>平日</span>
                                    <span>{open.weekday}</span>
                                </li>
                                <li className="flex justify-between w-full max-w-xs">
                                    <span>土日祝</span>
                                    <span>{open.weekend}</span>
                                </li>
                                {open.lastEntry && (
                                    <li className="flex justify-between w-full max-w-xs text-stone-500">
                                        <span>最終入店</span>
                                        <span>{open.lastEntry}</span>
                                    </li>
                                )}
                                <li className="flex justify-between w-full max-w-xs text-stone-400">
                                    <span>定休日</span>
                                    <span>{open.close}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="w-full aspect-square md:aspect-video bg-stone-100 relative transition-all duration-500 order-1 md:order-2">
                        <iframe
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(salonName + " " + address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            width="100%"
                            height="100%"
                            className="border-0"
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google Map"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}

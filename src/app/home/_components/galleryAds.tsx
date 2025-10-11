export type GalleryImage = {
    src: string;
    alt: string;
    title: string;
    description: string;
    link: string;
};

interface GalleryProps {
    images: GalleryImage[];
    cols?: string;
    className?: string;
}

function Gallery({ images, cols = "grid-cols-2 md:grid-cols-4", className }: GalleryProps) {
    return (
        <div className={`grid gap-6 ${cols} ${className ?? ""}`}>
            {images.map((img, index) => {
                const delay = (index % 3) * 0.1;

                return (
                    <figure
                        key={img.src}
                        className="home-animate-card group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
                        style={{ animationDelay: `${delay}s` }}
                    >
                        <div className="overflow-hidden">
                            <img
                                src={img.src}
                                alt={img.alt}
                                loading="lazy"
                                className="h-52 w-full object-cover transition duration-500 group-hover:scale-110"
                            />
                        </div>
                        <figcaption className="px-5 pt-6 text-lg font-semibold text-slate-900">
                            {img.title}
                        </figcaption>
                        <p className="px-5 pt-3 text-sm text-slate-600">{img.description}</p>
                        <a
                            href={img.link}
                            className="mt-6 inline-flex items-center gap-2 px-5 pb-6 text-sm font-semibold text-dodger-blue-700 transition hover:text-dodger-blue-900"
                        >
                            Shop now
                            <span aria-hidden>→</span>
                        </a>
                    </figure>
                );
            })}
        </div>
    );
}

function GalleryAds() {
    return (
        <Gallery
            images={[
                {
                    src: "/img-adidas-basket.jpg",
                    alt: "Player holding a basketball wearing Adidas sneakers",
                    title: "Santo Domingo streetball energy",
                    description: "Discover the latest Adidas court-ready styles inspired by Caribbean hoops culture.",
                    link: "#",
                },
                {
                    src: "/img-adidas-runner.jpg",
                    alt: "Runner wearing Adidas sneakers on a wet track",
                    title: "Performance for tropical miles",
                    description: "Meet the Adidas pairs built for runners chasing sunrise loops on the Malecón and beyond.",
                    link: "#",
                },
                {
                    src: "/img-adidas-pous.jpg",
                    alt: "Rear view of the X1 model sneaker",
                    title: "Style plus all-day comfort",
                    description: "The X1 model blends modern design with the cushioned feel you need for days around Zona Colonial.",
                    link: "#",
                },
                {
                    src: "/img-adidas-pose.jpg",
                    alt: "Front view of the X1 model sneaker",
                    title: "Choose your island look",
                    description: "Personalize your fit with X1 colorways that stand out from Santo Domingo nights to beach getaways.",
                    link: "#",
                },
            ]}
            className="mx-auto mt-12 w-full max-w-6xl px-6"
        />
    );
}

export { GalleryAds, Gallery };

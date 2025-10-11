import { Button } from "@/components/ui/button"
import { Gallery, type GalleryImage } from "./galleryAds"

function GalleryPreview() {
    const filters = ["New in DR", "Running", "Lifestyle"]
    const images: GalleryImage[] = [
        {
            src: "/img-adidas-basket.jpg",
            alt: "Player holding a basketball wearing Adidas sneakers",
            title: "Streetball essentials",
            description: "Tap into Santo Domingo playground energy with traction built for sudden cuts.",
            link: "#",
        },
        {
            src: "/img-adidas-runner.jpg",
            alt: "Runner wearing Adidas sneakers on a wet track",
            title: "Run the island",
            description: "Discover cushioning tuned for Caribbean heat and seaside humidity.",
            link: "#",
        },
        {
            src: "/img-adidas-pous.jpg",
            alt: "Rear view of the X1 model sneaker",
            title: "Comfort that travels",
            description: "Minimalist design with plush support for city commutes and weekend escapes.",
            link: "#",
        },
        {
            src: "/img-adidas-pose.jpg",
            alt: "Front view of the X1 model sneaker",
            title: "Style made personal",
            description: "Mix-and-match palettes that level up every Dominican Republic outfit.",
            link: "#",
        },
    ]

    return (
        <section className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="flex flex-wrap gap-3">
                {filters.map((label, index) => (
                    <Button
                        key={label}
                        variant={index === 0 ? "default" : "outline"}
                        className="rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold tracking-wide"
                    >
                        {label}
                    </Button>
                ))}
            </div>
            <Gallery images={images} className="mt-10" cols="grid-cols-1 md:grid-cols-4" />
        </section>
    )
}

export default GalleryPreview
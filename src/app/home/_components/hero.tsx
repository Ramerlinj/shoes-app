import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0">
                <video
                    src="/video-adidas.mp4"
                    loop
                    muted
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-dodger-blue-900/30" />
            </div>

            <div className="relative mx-auto flex min-h-[520px] w-full max-w-6xl flex-col justify-center px-6 py-24 text-left">
                <div className="home-animate-hero max-w-2xl space-y-6">
                    <p className="text-sm uppercase tracking-[0.35em] text-dodger-blue-200">Caribbean Drop · Autumn 2025</p>
                    <h1 className="text-4xl font-semibold leading-tight drop-shadow md:text-6xl">
                        Technology and island style for every step around the DR
                    </h1>
                    <p className="text-base text-slate-200 md:text-lg">
                        Explore sneakers with smart cushioning, heat-ready materials, and iconic silhouettes curated in Santo Domingo.
                        Each pair is tuned for your pace from the Malecón to Punta Cana nights.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button asChild size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
                            <Link to="/products">Browse catalog</Link>
                        </Button>
                        <Link
                            to="#popular"
                            className="text-sm font-medium text-dodger-blue-200 underline-offset-4 transition hover:text-white hover:underline"
                        >
                            See what's trending
                        </Link>
                    </div>
                </div>
            </div>

            <div className="relative overflow-hidden border-t border-white/10 bg-black/30 py-3">
                <div className="home-marquee flex gap-10 whitespace-nowrap text-xs uppercase tracking-[0.3em] text-white/60">
                    <span>reactive support</span>
                    <span>run the Malecón</span>
                    <span>sustainable materials</span>
                    <span>ergonomic fit</span>
                    <span>limited drops</span>
                    <span>reactive support</span>
                    <span>run the Malecón</span>
                    <span>sustainable materials</span>
                    <span>ergonomic fit</span>
                    <span>limited drops</span>
                </div>
            </div>
        </section>
    )
}

export default Hero
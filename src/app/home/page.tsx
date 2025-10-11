
import Hero from "./_components/hero"
import { GalleryAds } from "./_components/galleryAds"
import GalleryPreview from "./_components/galleryPreview"
import Cta from "./_components/cta"
import PopularNow from "./_components/popular"
import "./home-animations.css"

function Home() {
    return (
        <main className="space-y-20 pb-20">
            <Hero />
            <GalleryAds />
            <GalleryPreview />
            <div className="px-6">
                <Cta />
            </div>
            <PopularNow />
        </main>
    )
}

export default Home
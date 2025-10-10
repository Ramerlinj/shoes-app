
import Hero from "./_components/hero"
import { GalleryAds } from "./_components/galleryAds"
import GalleryPreview from "./_components/galleryPreview"
import Cta from "./_components/cta"
import PopularNow from "./_components/popular"

function Home() {
    return( 
    <main>
        <Hero />
        <GalleryAds />
        <GalleryPreview />
        <Cta />
        <PopularNow />
    </main> 
    )
}

export default Home
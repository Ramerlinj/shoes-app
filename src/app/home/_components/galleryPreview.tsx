
import { Gallery } from "./galleryAds";
import { Button } from "@/components/ui/button";

function GalleryPreview() {
    return(
        <section className="mx-40 ">
            <div className="flex gap-4">
                <Button>New Rival</Button>
                <Button>New Rival</Button>
                <Button>New Rival</Button>
            </div>
            <Gallery
                images={[
                    { src: '/img-adidas-basket.jpg', alt: 'Jugador sosteniendo balón con zapatillas Adidas', title: 'Inspiración basket urbana', description: 'Descubre la nueva colección de zapatillas Adidas inspiradas en el baloncesto urbano.', link: '#' },
                    { src: '/img-adidas-runner.jpg', alt: 'Corredora usando zapatillas Adidas en pista húmeda', title: 'Rendimiento en cada paso', description: 'Conoce las zapatillas Adidas diseñadas para corredores que buscan superar sus límites.', link: '#' },
                    { src: '/img-adidas-pous.jpg', alt: 'Vista trasera del modelo X1', title: 'Estilo y comodidad', description: 'El modelo X1 combina un diseño moderno con la comodidad que necesitas para el día a día.', link: '#' },
                    { src: '/img-adidas-pose.jpg', alt: 'Vista frontal del modelo X1', title: 'Elige tu estilo', description: 'Personaliza tu look con el modelo X1 y destaca en cualquier ocasión.', link: '#' },
                ]}
                className="my-8 "
            />
        </section>
    )
}

export default GalleryPreview;
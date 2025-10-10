
type GalleryImage = { src: string, alt: string, title: string, description: string, link: string };

interface GalleryProps {
    images: GalleryImage[];
    cols?: string;
    className?: string;
}

function Gallery({ images, cols = 'grid-cols-2 md:grid-cols-4', className }: GalleryProps) {
    return (
        <div className={`grid gap-4 ${cols} ${className}`}>
            {images.map((img) => (
                <figure
                    key={img.src}
                    className={`group overflow-hidden border p-1 border-transparent hover:border-neutral-500 transition-all duration-300 hover:scale-105 rounded-t-lg pt-1 pb-4`}
                >
                    <img src={img.src} alt={img.alt} loading="lazy" className="object-cover rounded-t-lg" />
                    <figcaption className="mt-6 text-xl mx-2 my-2 font-semibold text-black">
                        {img.title}
                    </figcaption>
                    <p className="text-md text-neutral-800 mt-4 mx-2">{img.description}</p>
                    <a href={img.link} className="mt-6 border-b-2 mx-2 font-semibold border-neutral-800 inline-block">Shop now</a>
                </figure>
            ))}
        </div>
    );
}


function GalleryAds() {
    return (
        <Gallery
            images={[
                { src: '/img-adidas-basket.jpg', alt: 'Jugador sosteniendo balón con zapatillas Adidas', title: 'Inspiración basket urbana', description: 'Descubre la nueva colección de zapatillas Adidas inspiradas en el baloncesto urbano.', link: '#' },
                { src: '/img-adidas-runner.jpg', alt: 'Corredora usando zapatillas Adidas en pista húmeda', title: 'Rendimiento en cada paso', description: 'Conoce las zapatillas Adidas diseñadas para corredores que buscan superar sus límites.', link: '#' },
                { src: '/img-adidas-pous.jpg', alt: 'Vista trasera del modelo X1', title: 'Estilo y comodidad', description: 'El modelo X1 combina un diseño moderno con la comodidad que necesitas para el día a día.', link: '#' },
                { src: '/img-adidas-pose.jpg', alt: 'Vista frontal del modelo X1', title: 'Elige tu estilo', description: 'Personaliza tu look con el modelo X1 y destaca en cualquier ocasión.', link: '#' },
            ]}
            className="my-8 mx-40 "
        />
    );
}

export { GalleryAds, Gallery };

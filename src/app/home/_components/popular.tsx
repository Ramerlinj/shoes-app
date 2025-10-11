const popularItems = [
    { name: "Ultraboost 5x", description: "Responsive cushioning built for Santo Domingo runners." },
    { name: "Campus", description: "Premium suede for everyday Caribbean street style." },
    { name: "Samba", description: "A 1950 icon refreshed with bold tropical tones." },
    { name: "Spezial", description: "Retro aesthetics with modern support for city adventures." },
    { name: "Gazelle", description: "Timeless versatility that fits any DR plan." },
    { name: "Oasis", description: "Outdoor inspiration with weather-ready finishes for island trips." },
]

function PopularNow() {
    return (
        <section id="popular" className="mx-auto w-full max-w-6xl px-6 py-20">
            <div className="home-animate-hero max-w-xl space-y-3">
                <p className="text-sm uppercase tracking-[0.35em] text-dodger-blue-600">Most wanted</p>
                <h3 className="text-3xl font-semibold text-slate-900 md:text-4xl">Popular with our DR community</h3>
                <p className="text-sm text-slate-500">
                    Pairs celebrated for design, comfort, and durability. Find the sneakers that match your Dominican lifestyle.
                </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {popularItems.map((item, index) => (
                    <article
                        key={item.name}
                        className="home-animate-card flex flex-col justify-between rounded-2xl border border-slate-100 bg-white/95 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        style={{ animationDelay: `${(index % 3) * 0.1 + 0.1}s` }}
                    >
                        <div>
                            <h4 className="text-2xl font-semibold text-slate-900">{item.name}</h4>
                            <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                        </div>
                        <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-dodger-blue-700">
                            Explore
                            <span aria-hidden>→</span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default PopularNow
import { Button } from "@/components/ui/button"

function Cta() {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-dodger-blue-900 via-dodger-blue-700 to-slate-900 text-white shadow-xl">
            <div className="absolute inset-0">
                <div className="grid h-full w-full grid-cols-3 opacity-20">
                    <div className="border-r border-white/20" />
                    <div className="border-r border-white/20" />
                </div>
            </div>
            <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center md:flex-row md:items-center md:justify-between md:text-left">
                <div className="home-animate-hero max-w-xl space-y-4">
                    <p className="text-sm uppercase tracking-[0.4em] text-dodger-blue-200">Premium service</p>
                    <h3 className="text-3xl font-semibold md:text-4xl">
                        Express delivery and personalized guidance for your next favorite pair
                    </h3>
                    <p className="text-slate-200">
                        Enjoy free shipping across the Dominican Republic, hassle-free exchanges, and recommendations tailored to your island lifestyle.
                        We want every purchase to feel memorable from the first step.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                        <Button size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
                            Join now
                        </Button>
                        <Button variant="outline" className="rounded-full border-white/60 text-white hover:bg-white/15">
                            Exclusive benefits
                        </Button>
                    </div>
                </div>
                <div className="home-animate-card mt-8 w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                    <p className="text-sm uppercase tracking-[0.35em] text-dodger-blue-200">Zapatería RD Club</p>
                    <h4 className="mt-4 text-xl font-semibold">Early launch roadmap</h4>
                    <ul className="mt-5 space-y-3 text-sm text-slate-100/90">
                        <li>· Priority access to limited drops and Caribbean collaborations.</li>
                        <li>· Suggestions based on your rotation and local climate.</li>
                        <li>· Exclusive events with Dominican sneaker ambassadors.</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Cta
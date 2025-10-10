
function PopularNow() {
    return (
        <section className="m-10 mx-32">
            <h3 className="font-black text-4xl">Popular Right Now</h3>
            <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="flex flex-col gap-8 gap-y-20 max-w-md text-4xl font-bold">
                    <span className="border-b-2 border-black hover:border-b-8 transition-all duration-300">Ultraboost 5x</span>
                    <span className="border-b-2 border-black hover:border-b-8 transition-all duration-300">Campus</span>
                </div>
                <div className="flex flex-col gap-8 max-w-md gap-y-20 text-4xl font-bold">
                    <span className="border-b-2 border-black hover:border-b-8 transition-all duration-300">samba</span>
                    <span className="border-b-2 border-black hover:border-b-8 transition-all duration-300">spezial</span>
                </div>
                <div className="flex flex-col gap-8 max-w-md gap-y-20 text-4xl font-bold">
                    <span className="border-b-2 border-black hover:border-b-8 transition-all duration-300">gazelle</span>
                    <span className="border-b-2 border-black hover:border-b-8 transition-all duration-300">oasis</span>
                </div>
            </div>
        </section>
    )
}

export default PopularNow;
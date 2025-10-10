import { Button } from "@/components/ui/button";


function Cta() {
    return(
        <section className='bg-neutral-900 gap-4 flex flex-col items-center justify-center w-full h-96 text-white py-12 px-4 md:px-8 lg:px-16'>
        <h3 className="text-7xl font-bold">NIKE</h3>
        <p>Fast, free Delivery</p>
        <Button variant={'secondary'}>Shop now</Button>
        </section>
    )
}

export default Cta; 
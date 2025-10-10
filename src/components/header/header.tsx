
import ItemsHeader from "./itemsHeader"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"


function Header() {
    return(
        <header className="flex w-full p-4 border-b items-center border-b-border h-20">
            <div className="flex-1 flex justify-center">
                <h1 className="text-3xl font-bold text-dodger-blue-900">Zapatería</h1>
            </div>
            <div className="flex-1">
                <ItemsHeader />
            </div>
            <div className="flex-1 flex justify-center">
                <Button variant={'outline'}>
                    <User /> <span className="">Account</span>
                </Button>
            </div>
        </header>
    )
}

export default Header
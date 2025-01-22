import { Footer } from "./Footer"
import { Navbar } from "./Navbar"
import { ReactNode } from 'react'

interface Props {
    children: ReactNode;
}

export const AppLayout = ({ children }: Props) => {
    return (
        <div className="flex flex-col">
            <Navbar />
            {/* <div className="p12"></div> */}
            <main className="min-h-[900px]">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default function Modal({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-screen h-screen md:w-full md:h-1/2 bg-red-500">
            {children}
        </div>
    )
}


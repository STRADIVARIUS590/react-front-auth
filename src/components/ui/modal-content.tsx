import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function ModalContent({ title, description, children }: { title: string | undefined, description?: string | undefined, children: React.ReactNode }) {
    return (
        <>
            <DialogHeader>
                <DialogTitle>{title || ""}</DialogTitle>
                <DialogDescription>
                    {description || ""}
                </DialogDescription>
            </DialogHeader>
            {children}
            <DialogFooter className="sm:justify-start">

            </DialogFooter>
        </>
    )
}




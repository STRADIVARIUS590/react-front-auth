import { Button } from "@/components/ui/button"
import { Table as ReactTable } from "@tanstack/react-table";


export default function TableNextPrev({ table }: { table: ReactTable<any> }) {
    return (
        <div className="flex justify-end items-center space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Anterior
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Siguiente
            </Button>
        </div>
    )
}


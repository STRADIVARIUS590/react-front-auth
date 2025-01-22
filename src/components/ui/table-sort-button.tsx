import { Column } from '@tanstack/react-table'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const TableSortButton = ({ column, headingText }: { column: Column<any, unknown>, headingText: string }) => {
    return (
        <Button
            className="w-full text-center hover:bg-inherit hover:text-vi-50 "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}>

            {headingText}
            {column.getIsSorted() == "asc" ? <ArrowUp className="ml-2 h-4 w-4 hover:font-bold" /> : (column.getIsSorted() == "desc") ? <ArrowDown className="ml-2 h-4 w-4 hover:font-bold" /> : <ArrowUpDown className="ml-2 h-4 w-4 hover:font-bold" />}
        </Button>
    )
}


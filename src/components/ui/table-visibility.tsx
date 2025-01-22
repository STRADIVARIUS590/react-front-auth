
import { Table as ReactTable } from "@tanstack/react-table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TableVisibility({ table }: { table: ReactTable<any> }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                Columns
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {
                    table.getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


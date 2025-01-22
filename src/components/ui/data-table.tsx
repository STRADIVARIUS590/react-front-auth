"use client"

import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    VisibilityState,
} from "@tanstack/react-table"


import { ReactNode, useState } from "react"
import TableContent from "../ui/table-content"
import TableInputFilter from "../ui/table-input-filter"
import TableNextPrev from "../ui/table-next-prev"
import { Link } from "react-router-dom"
// import TableVisibility from "../ui/table-visibility"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    loading: boolean
    error: boolean
    addButton?: React.ReactNode;
    isModal?: boolean
    filterField: string
    filterPlaceholder: string
    pathName: string,
    reports? : ReactNode | React.ReactNode[] 
    
} 

export function DataTable<TData, TValue>({
    columns,
    data,
    loading,
    error,
    filterField,
    filterPlaceholder,
    pathName,
    addButton,
    reports,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="md:w-full space-y-4">
            <div className="flex flex-col  md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-8">
                <TableInputFilter<string> table={table} field={filterField} placeholder={filterPlaceholder} />
                {
                    addButton ||
                    <Link to={`/${pathName}/edit`} className="bg-vi-200 hover:bg-vi-400 active:bg-vi-400  text-vi-900 hover:text-vi-50 active:text-vi-50 rounded-md h-fit px-4 py-1">Agregar</Link>
                }
            </div>
            {reports}
            <div className="rounded-md">
                <TableContent table={table} loading={loading} error={error} />
            </div>
            <TableNextPrev table={table} />
        </div>
    )

}

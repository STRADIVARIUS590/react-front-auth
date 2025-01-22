import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { flexRender, Table as ReactTable } from "@tanstack/react-table";

export default function TableContent({ table, loading, error }: { table: ReactTable<any>, loading: boolean, error: boolean }) {
    const message = (error) ? "Ocurrió un error, intenta actualizar la página" : (loading) ? "Cargando datos..." : "No se encontraron resultados"
    const oddColor = 'bg-snow-100';
    const evenColor = 'bg-snow-50';
    return (
        <Table className="">
            <TableHeader className="">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="">
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id} className="text-snow-50 font-medium bg-vi-900">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            )
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, i) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className={`border-vi-50 text-snow-900 border-2 hover:${(i % 2 == 0) ? evenColor : oddColor} ${(i % 2 == 0) ? evenColor : oddColor}`}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                            {message}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}


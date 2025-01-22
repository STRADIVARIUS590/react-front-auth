"use client"
import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { TableEditDelete } from "@/components/ui/table-edit-delete";
import { TableSortButton } from "@/components/ui/table-sort-button";
import { IUser } from "@/store/authSlice";

const section = 'congresses'

export interface CongressItem {
    id: string | number;
    title_trabajo: string;
    user_id: string | number;
    event_name: string | null;
    date: string | null;
    colaborators: number | null
    user: {
        name: string
    }
}

// hay una muy buena razon para la existencia de esto
// aun no la descubro
export const useCongressesTableColumns = ({ deleteFn, canEdit, canDelete, user }: { deleteFn: (id: number | string) => Promise<void>, canEdit: boolean, canDelete: boolean, user: IUser | null }) => {
    const userColumns: ColumnDef<CongressItem>[] = [
        {
            accessorKey: "id",

            header: ({ column }: { column: Column<CongressItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"ID"} />
                )

            },
        },
        {
            accessorKey: "title_trabajo",
            header: ({ column }: { column: Column<CongressItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Titulo del trabajo"} />
                )

            },
        },
        {
            accessorKey: "user",
            header: ({ column }: { column: Column<CongressItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Usuario"} />
                )
            },
            cell: ({ row }: { row: Row<CongressItem> }) => {
                const user: {
                    name: string;
                } = row.getValue("user");
                if (!user) {
                    return;
                }
                return <div className="text-center font-medium" >
                    {user?.name}
                </div>
            }
        },
        {
            accessorKey: "event_name",
            header: ({ column }: { column: Column<CongressItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Nombre del evento"} />
                )
            },
        },
        {
            accessorKey: "date",
            header: ({ column }: { column: Column<CongressItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Fecha"} />
                )
            },
            cell: ({ row }: { row: Row<CongressItem> }) => {
                const date = new Date(row.getValue("date"));
                return <div className="text-center font-medium" >
                    {date.toLocaleDateString()}
                </div>
            }
        },
        {
            accessorKey: "colaborators",
            header: ({ column }: { column: Column<CongressItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"No. de colaboradores"} />
                )
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center" > Acciones </div>,
            meta: {
                headerClassName: "bg-red-400"
            },

            cell: ({ row }: { row: Row<CongressItem> }) => {
                const rowOriginalData = row.original
                let editSelf = false;
                let deleteSelf = false;
                if (user?.id == rowOriginalData.user_id) {
                    editSelf = true;
                    deleteSelf = true;
                }
                return (
                    <TableEditDelete
                        canEdit={canEdit || editSelf}
                        canDelete={canDelete || deleteSelf}
                        deleteTitle="Eliminar congreso"
                        deleteQuestion="¿Está seguro que quiere borrar este congreso?"
                        data={rowOriginalData}
                        section={section}
                        deleteFn={deleteFn} />
                )
            }
        },
    ]
    return (
        {
            userColumns
        }
    )
}

export default useCongressesTableColumns;

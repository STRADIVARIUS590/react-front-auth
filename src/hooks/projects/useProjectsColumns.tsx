"use client"
import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { TableEditDelete } from "@/components/ui/table-edit-delete";
import { TableSortButton } from "@/components/ui/table-sort-button";
import { IUser } from "@/store/authSlice";

const section = 'projects'

export interface ProjectItem {
    id: string | number;
    name: string | undefined;
    description: string | undefined;
    user_id: string | number | undefined;
    objetives: string | undefined;
    colaborators: string | undefined;
    start_date: string | undefined;
    end_date: string | undefined;
    type: string | undefined;
    period: string | undefined;
    user: {
        name: string | undefined
    }
}

// hay una muy buena razon para la existencia de esto
// aun no la descubro
export const useProjectTableColumns = ({ deleteFn, canEdit, canDelete, user }: { deleteFn: (id: number | string) => Promise<void>, canEdit: boolean, canDelete: boolean, user: IUser | null }) => {
    const userColumns: ColumnDef<ProjectItem>[] = [
        {
            accessorKey: "id",

            header: ({ column }: { column: Column<ProjectItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"ID"} />
                )

            },
        },
        {
            accessorKey: "name",
            header: ({ column }: { column: Column<ProjectItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Nombre"} />
                )

            },
        },
        {
            accessorKey: "description",
            header: ({ column }: { column: Column<ProjectItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Descripción"} />
                )

            },
        },
        {
            accessorKey: "objetives",
            header: ({ column }: { column: Column<ProjectItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Objetivos"} />
                )
            },
        },
        {
            accessorKey: "colaborators",
            header: ({ column }: { column: Column<ProjectItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Colaboradores"} />
                )
            },
        },
        {
            accessorKey: "start_date",
            header: ({ column }: { column: Column<ProjectItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Fecha de inicio"} />
                )
            },

            cell: ({ row }: { row: Row<ProjectItem> }) => {
                const date = new Date(row.getValue("start_date"));
                return <div className="text-center font-medium" >
                    {date.toLocaleDateString()}
                </div>
            }
        },
        {
            accessorKey: "end_date",
            header: ({ column }: { column: Column<ProjectItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Fecha de finalización"} />
                )
            },
            cell: ({ row }: { row: Row<ProjectItem> }) => {
                const date = new Date(row.getValue("end_date"));
                return <div className="text-center font-medium" >
                    {date.toLocaleDateString()}
                </div>
            }
        },
        {
            accessorKey: "type",
            header: ({ column }: { column: Column<ProjectItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Tipo"} />
                )
            },
        },
        {
            accessorKey: "period",
            header: ({ column }: { column: Column<ProjectItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Periodo"} />
                )
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center" > Acciones </div>,
            meta: {
                headerClassName: "bg-red-400"
            },
            cell: ({ row }: { row: Row<ProjectItem> }) => {

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
                        deleteTitle="Eliminar proyecto"
                        deleteQuestion="¿Está seguro que quiere borrar este proyecto?"
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

export default useProjectTableColumns;

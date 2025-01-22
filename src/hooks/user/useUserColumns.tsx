"use client"
import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { TableEditDelete } from "@/components/ui/table-edit-delete";
import { TableSortButton } from "@/components/ui/table-sort-button";
import { IUser } from "@/store/authSlice";

const section = 'users'

export interface UserItem_T {
    id: number;
    name: string;
    email: string;
    date_ingreso: string;
    birth_date: string;
    sex: string;
    role_id: string | number;
    role: {
        id: number;
        name: string;
    }
}

// hay una muy buena razon para la existencia de esto
// aun no la descubro
export const useUserTableColumns = ({ deleteUser, canEdit, canDelete, user }: { deleteUser: (id: number | string) => Promise<void>, canEdit: boolean, canDelete: boolean, user: IUser | null }) => {
    const userColumns: ColumnDef<UserItem_T>[] = [
        {
            accessorKey: "id",

            header: ({ column }: { column: Column<UserItem_T, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"ID"} />
                )

            },
        },
        {
            accessorKey: "name",
            header: ({ column }: { column: Column<UserItem_T, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Nombre"} />
                )

            },
        },
        {
            accessorKey: "email",
            header: ({ column }: { column: Column<UserItem_T, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Correo electrónico"} />
                )

            },
        },
        {
            accessorKey: "date_ingreso",
            header: ({ column }: { column: Column<UserItem_T, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Fecha de ingreso"} />
                )
            },
            cell: ({ row }: { row: Row<UserItem_T> }) => {
                const date = new Date(row.getValue("date_ingreso"));
                return <div className="text-center font-medium" >
                    {date.toLocaleDateString()}
                </div>
            }
        },
        {
            accessorKey: "birth_date",
            header: ({ column }: { column: Column<UserItem_T, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Fecha de nacimiento"} />
                )
            },
            cell: ({ row }: { row: Row<UserItem_T> }) => {
                const date = new Date(row.getValue("date_ingreso"));
                return <div className="text-center font-medium" >
                    {date.toLocaleDateString()}
                </div>
            }
        },
        {
            accessorKey: "sex",
            header: ({ column }: { column: Column<UserItem_T, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Género"} />
                )
            },
            cell: ({ row }: { row: Row<UserItem_T> }) => {
                const gender: string = row.getValue("sex");
                return <div className="text-center font-medium" >
                    {gender}
                </div>
            }
        },
        {
            accessorKey: "role",
            header: ({ column }: { column: Column<UserItem_T, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Rol"} />
                )
            },

            cell: ({ row }: { row: Row<UserItem_T> }) => {
                const role: {
                    id: number;
                    name: string;
                } = row.getValue("role");
                if (!role) {
                    return;
                }
                return <div className="text-center font-medium" >
                    {role?.name}
                </div>
            }
        },
        {
            id: "actions",
            header: () => <div className="text-center" > Acciones </div>,
            meta: {
                headerClassName: "bg-red-400"
            },
            cell: ({ row }: { row: Row<UserItem_T> }) => {
                const rowUser = row.original
                let editSelf = false;
                let deleteSelf = false;
                if (user?.id == rowUser.id) {
                    editSelf = true;
                    deleteSelf = true;
                }
                return (
                    <TableEditDelete
                        canDelete={canDelete || deleteSelf}
                        canEdit={canEdit || editSelf}
                        deleteTitle="Eliminar usuario"
                        deleteQuestion="¿Está seguro que quiere borrar este usuario?"
                        data={rowUser}
                        section={section}
                        deleteFn={deleteUser} />
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

export default useUserTableColumns;

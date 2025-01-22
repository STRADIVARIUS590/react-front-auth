import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { TableSortButton } from "@/components/ui/table-sort-button";
import { TableEditDelete } from "@/components/ui/table-edit-delete";

export interface RoleItem_T {
    id: string;
    name: string;
}

const section = 'roles';
export const useRolesTableColumns = ({ deleteFn, canDelete, canEdit }: { deleteFn: (id: number | string) => Promise<void>, canEdit: boolean, canDelete: boolean }) => {
    const rolesColumns: ColumnDef<RoleItem_T>[] = [
        {
            accessorKey: "id",
            header: ({ column }: { column: Column<RoleItem_T, unknown> }) => {
                return <TableSortButton column={column} headingText={"ID"} />
            }
        },

        {
            accessorKey: "name",

            header: ({ column }: { column: Column<RoleItem_T, unknown> }) => {
                return <TableSortButton column={column} headingText={"Nombre"} />
            }
        },
        {
            id: "actions",
            header: () => <div className="text-center" > Acciones </div>,
            meta: {
                headerClassName: "bg-red-400"
            },

            cell: ({ row }: { row: Row<RoleItem_T> }) => {
                const rowOriginalData = row.original
                return (
                    <TableEditDelete
                        canDelete={canDelete}
                        canEdit={canEdit}
                        deleteTitle="Eliminar rol"
                        deleteQuestion="¿Está seguro que quiere borrar este rol?"
                        data={rowOriginalData}
                        section={section}
                        deleteFn={deleteFn} />
                )
            }
        }
    ]
    return (
        {
            rolesColumns
        }
    );
}

export default useRolesTableColumns;

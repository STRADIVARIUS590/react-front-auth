"use client"
import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { TableEditDelete } from "@/components/ui/table-edit-delete";
import { TableSortButton } from "@/components/ui/table-sort-button";
import { IUser } from "@/store/authSlice";

const section = 'academic-grades'

export interface AcademicGradeItem {
    id: string | number;
    name: string,
    titulation_date: string | number;
    institution: {
        id: string | number;
        name: string | number;
    }
    user: {
        id: string | number;
        name: string | number;
    }
}

// hay una muy buena razon para la existencia de esto
// aun no la descubro
const useAcademicGradesTableColumns = ({ deleteFn, canEdit, canDelete, user }: { deleteFn: (id: number | string) => Promise<void>, canEdit: boolean, canDelete: boolean, user: IUser | null }) => {
    const userColumns: ColumnDef<AcademicGradeItem>[] = [
        {
            accessorKey: "id",
            header: ({ column }: { column: Column<AcademicGradeItem, unknown> }) => {

                return (
                    <TableSortButton column={column} headingText={"ID"} />
                )

            },
        },
        {
            accessorKey: "name",
            header: ({ column }: { column: Column<AcademicGradeItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Nombre"} />
                )

            },
        },
        {
            accessorKey: "user",
            header: ({ column }: { column: Column<AcademicGradeItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Usuario"} />
                )
            },

            cell: ({ row }: { row: Row<AcademicGradeItem> }) => {
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
            accessorKey: "titulation_date",
            header: ({ column }: { column: Column<AcademicGradeItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Fecha de titulación"} />
                )
            },
            cell: ({ row }: { row: Row<AcademicGradeItem> }) => {
                const date = new Date(row.getValue("titulation_date"));
                return <div className="text-center font-medium" >
                    {date.toLocaleDateString()}
                </div>
            }
        },
        {
            accessorKey: "institution",
            header: ({ column }: { column: Column<AcademicGradeItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Institución"} />
                )
            },
            cell: ({ row }: { row: Row<AcademicGradeItem> }) => {
                const institution: {
                    name: string;
                } = row.getValue("institution");
                if (!institution) {
                    return;
                }
                return <div className="text-center font-medium" >
                    {institution?.name}
                </div>
            }
        },
        {
            id: "actions",
            header: () => <div className="text-center" > Acciones </div>,
            meta: {
                headerClassName: "bg-red-400"
            },
            cell: ({ row }: { row: Row<AcademicGradeItem> }) => {
                const rowOriginalData = row.original
                let editSelf = false;
                let deleteSelf = false;
                if (user?.id == rowOriginalData?.user?.id) {
                    // si
                    editSelf = true;
                    deleteSelf = true;
                }
                return (
                    <TableEditDelete
                        canEdit={canEdit || editSelf}
                        canDelete={canDelete || deleteSelf}
                        deleteTitle="Eliminar grado académico"
                        deleteQuestion="¿Está seguro que quiere borrar este grado académico?"
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
export default useAcademicGradesTableColumns

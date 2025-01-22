"use client"
import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { TableEditDelete } from "@/components/ui/table-edit-delete";
import { TableSortButton } from "@/components/ui/table-sort-button";
import { IUser } from "@/store/authSlice";

const section = 'courses'

export interface CourseItem {
    id: string | number;
    user_id: string | number;
    institution_id: string | undefined | null;
    total_hours: number | string | undefined;
    name: string | undefined;
    total_students: number | string | undefined;
    educative_level: number | string | undefined;
    period: number | string | undefined;
    start_date: number | string | undefined;
    end_date: number | string | undefined;
    user: {
        id: string,
        name: string,
    },
    institution: {
        id: string,
        name: string,
    }
}

// hay una muy buena razon para la existencia de esto
// aun no la descubro
const useCoursesTableColumns = ({ deleteFn, canEdit, canDelete, user }: { deleteFn: (id: number | string) => Promise<void>, canEdit: boolean, canDelete: boolean, user: IUser | null }) => {
    const userColumns: ColumnDef<CourseItem>[] = [
        {
            accessorKey: "id",

            header: ({ column }: { column: Column<CourseItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"ID"} />
                )

            },
        },
        {
            accessorKey: "name",
            header: ({ column }: { column: Column<CourseItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Curso"} />
                )

            },
        },
        {
            accessorKey: "total_hours",
            header: ({ column }: { column: Column<CourseItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Horas totales"} />
                )

            },
        },
        {
            accessorKey: "total_students",
            header: ({ column }: { column: Column<CourseItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Estudiantes totales"} />
                )

            },
        },
        {
            accessorKey: "educative_level",
            header: ({ column }: { column: Column<CourseItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Nivel educativo"} />
                )

            },
        },
        {
            accessorKey: "start_date",
            header: ({ column }: { column: Column<CourseItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Fecha de inicio"} />
                )
            },

            cell: ({ row }: { row: Row<CourseItem> }) => {
                const date = new Date(row.getValue("start_date"));
                return <div className="text-center font-medium" >
                    {date.toLocaleDateString()}
                </div>
            }
        },
        {
            accessorKey: "end_date",
            header: ({ column }: { column: Column<CourseItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Fecha de finalización"} />
                )
            },
            cell: ({ row }: { row: Row<CourseItem> }) => {
                const date = new Date(row.getValue("end_date"));
                return <div className="text-center font-medium" >
                    {date.toLocaleDateString()}
                </div>
            }
        },
        {
            accessorKey: "user",
            header: ({ column }: { column: Column<CourseItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Usuario"} />
                )
            },
            cell: ({ row }: { row: Row<CourseItem> }) => {
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
            accessorKey: "institution",
            header: ({ column }: { column: Column<CourseItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Institución"} />
                )
            },
            cell: ({ row }: { row: Row<CourseItem> }) => {
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
            cell: ({ row }: { row: Row<CourseItem> }) => {
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
                        deleteTitle="Eliminar curso"
                        deleteQuestion="¿Está seguro que quiere borrar este curso?"
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
export default useCoursesTableColumns

"use client"
import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { TableEditDelete } from "@/components/ui/table-edit-delete";
import { TableSortButton } from "@/components/ui/table-sort-button";
import { IUser } from "@/store/authSlice";

const section = 'publications'

export interface PublicationItem {
    id: string;
    title: string | undefined;
    user_id: string | undefined;
    type: string | undefined;
    issn_isbn: string | undefined;
    doi: string | undefined;
    magazine_name: string | undefined;
    authors: string | undefined;
    publication_date: string | undefined;
    period: string | undefined;
    user: {
        name: string | undefined
    }
    cover: {
        original_url: string
        name: string
    }
}

// hay una muy buena razon para la existencia de esto
// aun no la descubro
// src={cover?.original_url}
const usePublicationsTableColumns = ({ deleteFn, canDelete, canEdit, user }: { deleteFn: (id: number | string) => Promise<void>, canEdit: boolean, canDelete: boolean, user: IUser | null }) => {
    const userColumns: ColumnDef<PublicationItem>[] = [
        {
            accessorKey: "cover",
            header: ({ column }: { column: Column<PublicationItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Portada"} />
                )
            },
            cell: ({ row }: { row: Row<PublicationItem> }) => {
                const cover: {
                    original_url: string;
                    name: string;
                } = row.getValue("cover");
                if (!cover) {
                    return;
                }
                return <div className="text-center font-medium" >
                    <img src={cover?.original_url} alt={"portada"} className="max-h-[70px]" />
                </div>
            }
        },
        {
            accessorKey: "title",
            header: ({ column }: { column: Column<PublicationItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Titulo"} />
                )

            },
        },
        {
            accessorKey: "issn_isbn",
            header: ({ column }: { column: Column<PublicationItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"ISSN/ISBN"} />
                )

            },
        },
        {
            accessorKey: "doi",
            header: ({ column }: { column: Column<PublicationItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"DOI"} />
                )

            },
        },
        {
            accessorKey: "magazine_name",
            header: ({ column }: { column: Column<PublicationItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Revista"} />
                )

            },
        },
        {
            accessorKey: "authors_count",
            header: ({ column }: { column: Column<PublicationItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Autores"} />
                )

            },
        },
        {
            accessorKey: "user",
            header: ({ column }: { column: Column<PublicationItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Usuario"} />
                )
            },
            cell: ({ row }: { row: Row<PublicationItem> }) => {
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
            accessorKey: "publication_date",
            header: ({ column }: { column: Column<PublicationItem, unknown> }) => {
                return (
                    <TableSortButton column={column} headingText={"Fecha"} />
                )
            },
            cell: ({ row }: { row: Row<PublicationItem> }) => {
                const date = new Date(row.getValue("publication_date"));
                return <div className="text-center font-medium" >
                    {date.toLocaleDateString()}
                </div>
            }
        },
        {
            accessorKey: "period",
            header: ({ column }: { column: Column<PublicationItem, unknown> }) => {
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

            cell: ({ row }: { row: Row<PublicationItem> }) => {
                const rowOriginalData = row.original
                let editSelf = false;
                let deleteSelf = false;
                if (user?.id == rowOriginalData.user_id) {
                    editSelf = true;
                    deleteSelf = true;
                }
                return (
                    <TableEditDelete
                        canDelete={canDelete || deleteSelf}
                        canEdit={canEdit || editSelf}
                        deleteTitle="Eliminar publicación"
                        deleteQuestion="¿Está seguro que quiere borrar esta publicación?"
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

export default usePublicationsTableColumns;

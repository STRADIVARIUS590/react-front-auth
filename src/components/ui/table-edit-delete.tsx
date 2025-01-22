import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
import ModalContent from "./modal-content";

interface Data_T {
    id: string | number
}

interface EditDeleteActionProps {
    data: Data_T;
    section: string;
    deleteFn: (id: number | string) => Promise<any>;
    deleteTitle: string
    deleteQuestion: string
    canEdit: boolean;
    canDelete: boolean;
    editTitle?: string
    isEditModal?: boolean;
    editModalContent?: React.ReactNode;

}

export const TableEditDelete = ({ data, section, deleteFn, deleteTitle, canEdit, canDelete, deleteQuestion, isEditModal, editTitle, editModalContent }: EditDeleteActionProps) => {
    const editAction = (isEditModal && canEdit)
        ?
        <div className={`flex flex-col space-y-2  justify-center`}>
            <Dialog>
                <DialogTrigger asChild >
                    <Button className="bg-vi-100 hover:bg-vi-400 active:bg-vi-400  text-vi-500 hover:text-vi-50 active:text-vi-50 rounded-md h-fit px-4 py-1">Editar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <ModalContent title={editTitle} description={""}>
                        {editModalContent}
                    </ModalContent>
                </DialogContent>
            </Dialog>
        </div>
        : (canEdit) ?
            <Link to={`/${section}/edit/${data.id}`} className="bg-vi-100  text-vi-500 px-4 py-1 rounded-md hover:bg-vi-400 hover:text-vi-50 active:bg-vi-400 active:text-vi-50" type="button">Editar</Link> : ""

    return (
        <div className={`flex flex-col space-y-2  justify-center`}>
            {editAction}
            {(canDelete) ?
                <Dialog>

                    <DialogTrigger asChild >
                        <Button className="bg-red-100 hover:bg-red-400 active:bg-red-400  text-red-500 hover:text-vi-50 active:text-vi-50 rounded-md h-fit px-4 py-1">Eliminar</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <ModalContent title={deleteTitle}>
                            <div className="flex flex-col items-center space-y-6">
                                <h2>{deleteQuestion}</h2>
                                <div className="flex w-full justify-around">
                                    <DialogClose asChild>
                                        <Button type="button" className=" bg-vi-100 hover:bg-vi-400 active:bg-vi-400  text-vi-500 hover:text-vi-50 active:text-vi-50 rounded-md h-fit px-4 py-1" variant="secondary">
                                            Cancelar
                                        </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button onClick={() => deleteFn(data.id)} className="bg-red-100 hover:bg-red-400 active:bg-red-400  text-red-500 hover:text-vi-50 active:text-vi-50 rounded-md h-fit px-4 py-1">Eliminar</Button>
                                    </DialogClose>
                                </div>
                            </div>
                        </ModalContent>
                    </DialogContent>
                </Dialog> : ""}
        </div>
    )
}

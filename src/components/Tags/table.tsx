import { DataTable } from "@/components/ui/data-table";
import { useTags } from "@/hooks/tags/useTagsData";
import useTagsTableColumns from "@/hooks/tags/useTagsColumns";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TagForm } from "../Tags/tag-form"
import ModalContent from "../ui/modal-content";

export const Tags = () => {
    const { data, deleteFn, loading, error, canEdit, canDelete, fetchData: updateFn } = useTags()

    // const [ data, setData ] = useState<TagItem[]>([]);
    // const loadData = async() => {
    //     const fetchedData = await fetchData();
    //     setData(fetchedData);
    // }

    // useEffect(() => {
    //     loadData();
    // }, []);
    
    const { userColumns } = useTagsTableColumns({ deleteFn, updateFn, canDelete, canEdit });

    const addButton = (<div className={`flex flex-col space-y-2  justify-center`}>
        <Dialog>
            <DialogTrigger asChild >
                <Button className="bg-vi-200 hover:bg-vi-400 active:bg-vi-400  text-vi-900 hover:text-vi-50 active:text-vi-50 rounded-md h-fit px-4 py-1">Agregar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <ModalContent title={"Etiquetas"} description={""}>
                    <TagForm updateFn={updateFn} isEditMode={false} />
                </ModalContent>
            </DialogContent>
        </Dialog>
    </div>)

    // if (error) {
    //     <div className="mt-12"> <MessageToast message='Ha ocurrido un error' type="error" /></div>
    // }

    // if (loading) {
    //     <div className="mt-12"> <MessageToast message='Cargando...' type="loading" /></div>
    // }

    return (
        <div className="container mx-auto py-10">
            <DataTable pathName={"tags"} addButton={addButton} filterField={"name"} filterPlaceholder={"Nombre de la etiqueta"} columns={userColumns} data={data} error={error} loading={loading} />
        </div>
    )
}

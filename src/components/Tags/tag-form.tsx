import { Form, Formik, FormikHelpers } from "formik";
import { DefaultInput } from "../inputs/Forms";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Api } from "../../services/Api";
import * as Yup from 'yup';
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

interface Props {
    data?: TagItem | null;
    updateFn: () => void;
    isEditMode: boolean;
}

interface TagItem {
    id: string | number;
    name: string;
    slug: string;
}

const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    slug: Yup.string().required('El slug es requerido'),
})

export const TagForm = ({ data, updateFn, isEditMode, }: Props) => {

    const { token } = useSelector((state: RootState) => state.auth);

    const initialValues: TagItem = {
        id: data?.id || 0,
        name: data?.name || "",
        slug: data?.slug || "",
    };

    const handleSubmit = async (values: typeof initialValues, { setFieldError }: FormikHelpers<typeof initialValues>) => {
        const response = isEditMode
            ? await Api.put(`/tags`, values, {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            })
            : await Api.post(`/tags`, values, {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            });

        if (response.statusCode === 200) {
            updateFn()
        } else {
            const errors = response.data as { [key: string]: string[] };
            Object.entries(errors).forEach(([field, messages]) => {
                setFieldError(field, messages[0]);
            });
        }
    };


    return (
        <div className="relative p-6 flex-auto">
            <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit} validationSchema={validationSchema}>
                {() => (
                    <Form className="space-y-6">
                        <h2>{(isEditMode) ? "Actualizar etiqueta" : "Agregar etiqueta"}</h2>
                        <DefaultInput name="name" label="Nombre" />
                        <DefaultInput name="slug" label="Slug" />
                        <div className="flex items-center justify-around p-6 border-t border-solid border-blueGray-200 rounded-b">
                            <DialogClose asChild>
                                <Button className=" bg-red-100 hover:bg-red-400 active:bg-red-400  text-red-500 hover:text-red-50 active:text-red-50 rounded-md h-fit px-4 py-1">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="submit" className=" bg-vi-100 hover:bg-vi-400 active:bg-vi-400  text-vi-500 hover:text-vi-50 active:text-vi-50 rounded-md h-fit px-4 py-1">Guardar</Button>
                            </DialogClose>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>);
};

import { Form, Formik, FormikHelpers } from "formik";
import { DefaultInput } from "../inputs/Forms";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import { Api } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';

interface Props {
    show: boolean;
    onClose: () => void;
    id?: string | number | null | undefined;
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

export const AddEdit = ({ show, id, onClose }: Props) => {

    const { token } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const [data, setData] = useState<TagItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const loadData = async () => {
        setLoading(true);
        try {
            if (id) {
                const response = await Api.get(`/tags/get/${id}`, {
                    Authorization: "Bearer " + token,
                    Accept: "application/json",
                });
                const result: TagItem = await response.data;
                setData(result);
            } else {
                setData(null); // Reset data if no ID is provided (for adding new items)
            }
        } catch (e) {
            setError(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (show) {
            loadData();
        }
    }, [show, id]);

    const initialValues: TagItem = {
        id: data?.id || 0,
        name: data?.name || "",
        slug: data?.slug || "",
    };

    const isEditMode = !!id;

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
            onClose(); navigate(0);
        } else {
            const errors = response.data as { [key: string]: string[] };
            Object.entries(errors).forEach(([field, messages]) => {
                setFieldError(field, messages[0]);
            });
        }
    };

    if (error) {
        // return <MessageToast message="Ha ocurrido un error" type="error" />;
    }

    if (loading) {
        return;
    }

    return (
        <>
            {show && (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/* content */}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/* header */}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">{isEditMode ? "Editar" : "Agregar"}</h3>
                                    <button className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={onClose}>
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">X</span>
                                    </button>
                                </div>

                                <div className="relative p-6 flex-auto">
                                    <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit} validationSchema={validationSchema}>
                                        {() => (
                                            <Form>
                                                {/* <DefaultColumn> */}
                                                <DefaultInput name="name" label="Nombre" />
                                                <DefaultInput name="slug" label="Slug" />
                                                {/* </DefaultColumn> */}
                                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                                    <button
                                                        className="text-white m-4 bg-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                                                        type="button"
                                                        onClick={onClose}
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        className="text-white m-4 bg-blue-800 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                                                        type="submit"
                                                        onClick={() => { }}
                                                    >
                                                        Guardar
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            )}
        </>
    );
};

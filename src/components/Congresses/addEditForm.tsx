import { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FormikHelpers, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { Api } from '../../services/Api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MessageToast } from '../MessageToast';
import { DefaultColumn, DefaultInput } from '../inputs/Forms';

interface DataItem {
    id: string | number | null | undefined;
    title_trabajo: string | null | undefined;
    user_id: string;
    event_name: string | null | undefined;
    date: string | null | undefined;
    colaborators: number | null | undefined;
    tags: { id: number, name: string }[];
}

interface TagItem {
    id: string | null | undefined;
    name: string | null | undefined;
}

interface UserItem {
    name: string | null | undefined;
    id: string;
}

const validationSchema = Yup.object({
    title_trabajo: Yup.string().required('El título del trabajo es requerido'),
    user_id: Yup.string().required('El usuario es requerido'),
    event_name: Yup.string().required('El nombre del evento es requerido'),
    date: Yup.date().required('La fecha es requerida'),
    colaborators: Yup.string().required('Número de colaboradores es requerido')
});

export const AddEditForm = () => {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const user_permissions: string[] = user?.all_permissions || [];

    useEffect(() => {
        if (!user || user_permissions.indexOf("congresses.edit") === -1) {
            navigate("/dashboard");
        }
    }, [user, user_permissions, navigate]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [data, setData] = useState<DataItem>();
    const [users, setUsers] = useState<UserItem[]>([]);
    const [tags, setTags] = useState<TagItem[]>([]);

    const loadData = async () => {
        try {
            if (id) {
                const response = await Api.get("/congresses/get/" + id + "?include=user,tags", {
                    Authorization: "Bearer " + token,
                    accept: "application/json",
                });
                const result = await response.data;
                setData(result);
            }

            const response_users = await Api.get('/users', {
                Authorization: "Bearer " + token,
                accept: "application/json",
            });
            const result_users: UserItem[] = await response_users.data;
            setUsers(result_users);

            const response_tags = await Api.get('/tags', {
                Authorization: "Bearer " + token,
                accept: "application/json",
            });
            const result_tags: TagItem[] = await response_tags.data;
            setTags(result_tags);

            setLoading(false);
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const initialValues = {
        id: data?.id || 0,
        title_trabajo: data?.title_trabajo || "",
        user_id: data?.user_id || 1,
        event_name: data?.event_name || "",
        date: data?.date || "",
        colaborators: data?.colaborators || 0,
        tags: data?.tags?.map(tag => tag.id) || [],
    };

    const isEditMode = !!id;

    const handleSubmit = async (values: typeof initialValues, { setFieldError }: FormikHelpers<typeof initialValues>) => {
        const response = isEditMode
            ? await Api.put(`/congresses`, values, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            })
            : await Api.post(`/congresses`, values, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

        if (response.statusCode === 200) {
            navigate('/congresses');
        } else {
            const errors = response.data as { [key: string]: string[] };
            Object.entries(errors).forEach(([field, messages]) => {
                setFieldError(field, messages[0]);
            });
        }
    };

    if(error){       return<div className="mt-12"> <MessageToast message='Ha ocurrido un error' type="error"/></div>}
    if(loading){     return <div className="mt-12"> <MessageToast message='Cargando...' type="loading"/></div>  }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
        >
            {({ isSubmitting }) => (
                <Form>
                    <input type="hidden" name="id" />

                    <section className="py-12">
                        <div className="container mx-auto max-w-4xl p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                            <div className="flex flex-wrap -mx-4">
                                <DefaultColumn>
                                    <DefaultInput name='title_trabajo' label='Título del trabajo'/>
                                    <DefaultInput name='event_name' label='Evento' />
                                </DefaultColumn>
                              
                                <DefaultColumn>
                                    <DefaultInput name="date" label='Fecha' type='date' />
                                    <DefaultInput name="colaborators" label='Nro COlaboradores' type='number' />
                                </DefaultColumn>


                                <DefaultColumn>
                                <label htmlFor="user_id" className="block text-base font-medium text-[#180c5c] mb-2 text-left mt-4">Usuario</label>
                                    <Field as="select" name="user_id" className="w-full bg-[#f9fafb] dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500">

                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="user_id" component="div" className="text-red-500" />
                                {/* </DefaultColumn> */}

                                {/* <DefaultColumn> */}
                                <FieldArray
                                    name="tags"
                                    render={(arrayHelpers) => (
                                        <div className="w-full"> {/* no pude desplazarlo abajo xd ayuda */}
                                        <h3 className="block text-base font-medium text-[#180c5c] mb-2 mt-6 text-left">
                                            Etiquetas
                                        </h3>
                                        <div className="flex flex-wrap gap-4">
                                            {tags.map((item, index) => (
                                            <label key={index} className="flex items-center space-x-2">
                                                <Field
                                                type="checkbox"
                                                name="tags"
                                                value={item.id}
                                                checked={arrayHelpers.form.values.tags.some(
                                                    (tag: string) => tag === item.id
                                                )}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    if (e.target.checked) {
                                                    arrayHelpers.push(item.id);
                                                    } else {
                                                    const idx = arrayHelpers.form.values.tags.indexOf(item.id);
                                                    if (idx !== -1) arrayHelpers.remove(idx);
                                                    }
                                                }}
                                                className="peer w-4 h-4 text-[#180c5c] border-gray-300 dark:border-gray-700 rounded focus:ring-[#180c5c]"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-white">
                                                {item.name}
                                                </span>
                                            </label>
                                            ))}
                                        </div>
                                        </div>
                                    )}
                                    />
                                </DefaultColumn>
                            </div>
                    <div className="mt-4 mt-6 text-right">
                        <button type="submit" className="px-6 py-3 bg-[#180c5c] text-white font-semibold rounded-lg shadow-lg hover:bg-[#180c3c] focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}>
                            {isEditMode ? "Actualizar" : "Agregar"}
                                {/* <p>{JSON.stringify(errors)}</p> */}
                            </button>
                    </div>
                            </div>
                    </section>

                </Form>
            )}
        </Formik>
    );
};

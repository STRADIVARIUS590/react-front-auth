import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Field, ErrorMessage, FieldArray, Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '@/store';
import { MessageToast } from '../MessageToast';
import { DefaultColumn, DefaultInput } from '../inputs/Forms';
import { TagItem } from '../Users/AddEditForm';
import { createFormData } from '@/hooks/publications/usePublicationForm';
import { Api } from '@/services/Api';

interface CourseItem {
    id: string;
    user_id: string;
    institution_id: string | undefined | null;
    total_hours: number | string | undefined;
    name: string | undefined;
    total_students: number | string | undefined;
    educative_level: number | string | undefined;
    period: number | string | undefined;
    start_date: number | string | undefined;
    end_date: number | string | undefined;
    tags: TagItem[];
    user: {
        id: string;
        name: string;
    };
    institution: {
        id: string;
        name: string;
    };
    file: {
        original_url: string | null;
    };
}

interface InstitutionItem {
    name: string;
    id: string;
}

interface UserItem {
    name: string;
    id: string;
}

const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    total_hours: Yup.number().required('El total de horas es requerido').min(50),
    total_students: Yup.number().required('El total de estudiantes es requerido').min(5),
    period: Yup.string().required('El periodo es requerido'),
    educative_level: Yup.string().required('El nivel educativo es requerido'),
    start_date: Yup.date().required('La fecha de inicio es requerida'),
    end_date: Yup.date().required('La fecha de fin es requerida'),
    institution_id: Yup.string().required('La institucion es requerida'),
});

export const AddEditForm = () => {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const user_permissions: string[] = user?.all_permissions || [];

    useEffect(() => {
        if (!user || user_permissions.indexOf("courses.edit") === -1) {
            navigate("/dashboard");
        }
    }, [user, user_permissions, navigate]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [data, setData] = useState<CourseItem>();
    const [users, setUsers] = useState<UserItem[]>([]);
    const [tags, setTags] = useState<TagItem[]>([]);
    const [institutions, setInstitutions] = useState<InstitutionItem[]>([]);
    const [file, setFile] = useState<File | null | string>(null);

    const post = async (url: string, data: any, headers: {}) => {
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: 'POST',
            headers: headers,
            body: data
        });

        const dataResponse = await response.json();

        return {
            statusCode: response.status,
            data: dataResponse.data
        }
    }

    const loadData = async () => {
        try {
            if (id) {
                const response = await Api.get("/courses/get/" + id + "?include=user,tags,file", {
                    Authorization: "Bearer " + token,
                    accept: "application/json",
                });
                const result: CourseItem = await response.data;
                setData(result);
                setFile(result?.file?.original_url);
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

            const response_institutions = await Api.get('/institutions', {
                Authorization: "Bearer " + token,
                accept: "application/json",
            })

            const result_institutions: InstitutionItem[] = await response_institutions.data;
            setInstitutions(result_institutions);

            setLoading(false);

        } catch (error) {
            console.error(error); 
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const initialValues = {
        id: data?.id || 0,
        user_id: data?.user_id || 1,
        institution_id: data?.institution_id || '',
        name: data?.name || "",
        total_hours: data?.total_hours || 0,
        total_students: data?.total_students || 0,
        educative_level: data?.educative_level || '',
        period: data?.period || '',
        start_date: data?.start_date || '',
        end_date: data?.end_date || '',
        tags: data?.tags?.map(tag => tag.id) || [],
        user: {
            id: data?.user_id || "",
            name: data?.user.name ?? ''
        },
        institution: {
            id: data?.institution_id || "",
            name: data?.institution?.name || ''
        }
    }

    const isEditMode = !!id;

    const handleSubmit = async (values: typeof initialValues, { setFieldError }: FormikHelpers<typeof initialValues>) => {
        const formData = createFormData(values);

        if (file && file instanceof File) {
            formData.append('files[]', file);
        }

        // Append tags to the FormData
        if (values.tags && values.tags.length > 0) {
            values.tags.forEach((tag) => {
                formData.append('tags[]', tag.toString());
            });
        }

        const response = isEditMode
            ? await post(`/courses/update`, formData, {
                Authorization: `Bearer ${token}`,
            })
            : await post(`/courses`, formData, {
                Authorization: `Bearer ${token}`,
            });

        if (response.statusCode === 200) {
            navigate('/courses');
        } else {
            const errors = response.data as { [key: string]: string[] };
            Object.entries(errors).forEach(([field, messages]) => {
                setFieldError(field, messages[0]);
            });
        }
    };

    if (error) { return <div className="mt-12"> <MessageToast message='Ha ocurrido un error' type="error" /></div> }
    if (loading) { return <div className="mt-12"> <MessageToast message='Cargando...' type="loading" /></div> }

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#180c5c] mt-12">
                {isEditMode ? 'Editar Curso' : 'Agregar Curso'}
            </h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                        <input type="hidden" name='id' />
                        <section className="py-12">
                            <div className="container mx-auto max-w-4xl pl-6 pr-6 pb-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                                <div className="flex flex-wrap -mx-4">
                                    <DefaultColumn>
                                        <DefaultInput name='name' label='Nombre' />
                                        <DefaultInput name='total_hours' type='number' label='Horas' />
                                    </DefaultColumn>

                                    <DefaultColumn>
                                        <DefaultInput name='total_students' type='number' label='Nro de estudiantes' />
                                        <DefaultInput name='educative_level' label='Nivel educativo' />
                                    </DefaultColumn>

                                    <DefaultColumn>
                                        <DefaultInput type='date' name='start_date' label='Fecha de inicio' />
                                        <DefaultInput type='date' name='end_date' label='Fecha de fin' />
                                    </DefaultColumn>
                                    <DefaultColumn>
                                        <DefaultInput name='period' label='Periodo' />
                                        <div>
                                            <label htmlFor="institution_id" className="block text-base font-medium text-[#180c5c] mb-2 text-left mt-4">Institucion</label>
                                            <Field as="select" name="institution_id" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-gray-300">
                                                {institutions.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="institution_id" component="div" className="text-red-500" />
                                        </div>
                                    </DefaultColumn>

                                    <DefaultColumn>
                                        <div>
                                            <label htmlFor="user_id" className="block text-base font-medium text-[#180c5c] mb-2 text-left mt-4">Usuario</label>
                                            <Field as="select" name="user_id" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-gray-300">
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="user_id" component="div" className="text-red-500" />
                                        </div>
                                        <input
                                            accept="application/pdf"
                                            type="file" name='file' id='file'
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                if (e.target.files) {
                                                    setFile(e.target.files[0]);
                                                    console.log(JSON.stringify(data));
                                                    if (data) data.file.original_url = URL.createObjectURL(e.target.files[0]);
                                                }
                                            }} />
                                        <FieldArray
                                            name="tags"
                                            render={(arrayHelpers) => (
                                                <div className="">
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

                                    <DefaultColumn>
                                          {data?.file?.original_url && (
                                            <div className="mt-6">
                                                <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                                                    <object data={data?.file?.original_url} type="application/pdf" width="100%" height="100px">
                                                        <p>Your browser does not support embedded PDFs. You can <a href={data?.file?.original_url}>download the PDF</a> instead.</p>
                                                    </object>
                                                </div>
                                                <a href={data?.file?.original_url} target="_blank" rel="noreferrer" className="text-blue-500 mt-2 inline-block">
                                                    Ver archivo 
                                                </a>
                                            </div>
            )}
                                    </DefaultColumn>
                                </div>
                            </div>
                        </section>
                        <div className="mt-6 text-right">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-[#180c5c] text-white font-semibold rounded-lg shadow-lg hover:bg-[#180c3c] focus:ring-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            >
                                {isEditMode ? "Actualizar" : "Guardar"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
          
        </div>
    );
};

export default AddEditForm;
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { UNSAFE_SingleFetchRedirectSymbol, useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import { Api } from "../../services/Api";
import * as Yup from 'yup';
import { MessageToast } from "../MessageToast";
import { ErrorMessage, Field, Formik, FormikHelpers, Form, FieldArray } from "formik";
import { DefaultColumn, DefaultInput } from "../inputs/Forms";
import { TagItem } from "../Users/AddEditForm";
import { post } from "../Courses/addEditForm";
import { createFormData } from "@/hooks/publications/usePublicationForm";
import { log } from "console";
const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string().required('La descripcion es requerida'),
    objetives: Yup.string().required('Los objetivos son requeridos'),
    colaborators: Yup.string().required('Los colaboradores son requeridos'),
    start_date: Yup.date().required('La fecha de inicio es requerida'),
    end_date: Yup.string().required('La fecha de fin es requerida'),
    type: Yup.string().required('El tipo es reqerido'),
    period: Yup.string().required('El periodo es requerido'),
})

interface ProjectItem {
    id: string | number;
    name: string | undefined;
    description: string | undefined;
    user_id: string | number | undefined;
    objetives: string | undefined;
    colaborators: string | undefined;   
    start_date: string | undefined;
    end_date: string | undefined;
    type: string | undefined;
    period: string | undefined;
    tags: TagItem[]
    user: {
        name: string | undefined
    },
    file: {
        original_url: string | undefined
    }
}

interface UserItem {
    name: string;
    id: string
}
export const AddEditForm = () => {

    // MIDDLEWARE
    const { token, user } = useSelector((state: RootState) => state.auth);

    const { id } = useParams<{ id?: string }>();

    const navigate = useNavigate();

    const user_permissions: string[] = user?.all_permissions || [];

    const [tags, setTags] = useState<TagItem[]>();
    useEffect(() => {
        if (!user || user_permissions.indexOf("projects.edit") === -1) {
            navigate("/dashboard");
        }
    }, [user, user_permissions, navigate]);

    // INITIALIZE

    const [loading, setLoading] = useState<boolean>(true);

    const [error, setError] = useState<boolean>(false);

    const [data, setData] = useState<ProjectItem>();

    const [users, setUsers] = useState<UserItem[]>([]);

    const [ file, setFile ] = useState<File | null>();
    
   

    const loadData = async () => {
        if (id) {
            const response = await Api.get("/projects/get/" + id + "?include=user,tags,file", {
                Authorization: "Bearer " + token,
                accept: "application/json",
            });
            const result = await response.data;
            setData(result);
        }

        const response = await Api.get('/users', {
            Authorization: "Bearer " + token,
            accept: "application/json",
        })


        const result: UserItem[] = await response.data;

        const response_tags = await Api.get('/tags', {
            Authorization: "Bearer " + token,
            accept: "application/json",
        });

        const result_tags: TagItem[] = await response_tags.data;

        setTags(result_tags);

        setUsers(result);

        setLoading(false);

        setError(false);
    };

    useEffect(() => {
        loadData();
        // loadUsers();
    }, [id]);

    const initialValues = {
        id: data?.id || 0,
        name: data?.name || "",
        description: data?.description || "",
        user_id: data?.user_id || 1,
        objetives: data?.objetives || "",
        colaborators: data?.colaborators || "",
        start_date: data?.start_date || "",
        end_date: data?.end_date || "",
        type: data?.type || "",
        period: data?.period || "",
        tags: data?.tags?.map(tag => tag.id) || [],
        user: {
            name: data?.user?.name || "",
        },
        file: data?.file || null, 
    }


    const [ filePreview, setFilePreview ] = useState(initialValues.file?.original_url || '');


    const isEditMode = !!id;

    // HANDLE
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
            ? await post(`/projects/update`, formData, {
                Authorization: `Bearer ${token}`,
            })
            : await post(`/projects`, formData, {
                Authorization: `Bearer ${token}`,
            });

        if (response.statusCode === 200) {
            navigate('/projects');
        } else {
            const errors = response.data as { [key: string]: string[] };
            Object.entries(errors).forEach(([field, messages]) => {
                setFieldError(field, messages[0]);
            });
        }
    };

    if (error) { return <div className="mt-12"> <MessageToast message='Ha ocurrido un error' type="error" /></div> }
    if (loading) { return <div className="mt-12"> <MessageToast message='Cargando...' type="loading" /></div> }

    return (<div>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {( _isSubmitting ) => (
                <Form>
                    <input type="hidden" name='id' />

                    <section className="py-12 bg-gray-100 dark:bg-gray-800">
                        <div className="container mx-auto">
                            <h1 className="text-3xl font-bold text-[#180c5c] dark:text-gray-100 mb-8 text-center">
                                {isEditMode ? 'Editar Proyecto' : 'Agregar Proyecto'}
                            </h1>
                            <div
                            >
                                    <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6 md:p-8">
                                        <div className="flex flex-wrap">
                                            {/* Nombre y Descripción */}
                                            <DefaultColumn>
                                                <DefaultInput
                                                    name="name"
                                                    label="Nombre"
                                                />
                                                
                                                <DefaultInput
                                                    name="description"
                                                    label="Descripción"
                                                />

                                                 <label
                                                    htmlFor="user_id"
                                                    className="block text-base font-medium text-[#180c5c] mb-2  mt-4 text-left"
                                                >
                                                    Usuario
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="user_id"
                                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                                >
                                                    {users.map((user) => (
                                                        <option key={user.id} value={user.id}>
                                                            {user.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage
                                                    name="user_id"
                                                    component="div"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                                  <DefaultInput
                                                    name="start_date"
                                                    label="Fecha de Inicio"
                                                    type="date"
                                                />
                                                <DefaultInput
                                                    name="end_date"
                                                    label="Fecha de Fin"
                                                    type="date"
                                                />
                                            </DefaultColumn>

                                            {/* Objetivos y Colaboradores */}
                                            <DefaultColumn>
                                                <DefaultInput
                                                    name="objetives"
                                                    label="Objetivos"
                                                />
                                                <DefaultInput
                                                    name="colaborators"
                                                    label="Colaboradores"
                                                />
                                                <DefaultInput
                                                    type="number"
                                                    name="type"
                                                    label="Tipo"
                                                /> 
                                                <DefaultInput
                                                    type="text"
                                                    name="period"
                                                    label="Periodo"
                                                />
                                            </DefaultColumn>
                                            <DefaultColumn>
                                                <div className="mt-12" max-width="10%">
                                                    <input 
                                                    accept="application/pdf"
                                                    type="file" 
                                                    onChange={( e : ChangeEvent<HTMLInputElement>) => {
                                                        if(e.target.files) {
                                                            setFile(e.target.files[0]);
                                                            if (data) data.file.original_url = URL.createObjectURL(e.target.files[0]);
                                                        }
                                                    }}/>
                                                </div>

                                                {/* {data?.file?.original_url && ( */}
                                                    <div className="mt-6">
                                                        <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                                                            <object data={data?.file?.original_url } type="application/pdf" width="100%" height="100px">
                                                                <p>Your browser does not support embedded PDFs. You can <a href={data?.file?.original_url }>download the PDF</a> instead.</p>
                                                            </object>
                                                        </div>
                                                        <a href={data?.file?.original_url } target="_blank" rel="noreferrer" className="text-blue-500 mt-2 inline-block">
                                                            Ver archivo 
                                                        </a>
                                                    </div>
                                                 {/* )} */}
                                            </DefaultColumn>                                            
                                        </div>
                                        <FieldArray
                                            name="tags"
                                            render={(arrayHelpers) => (
                                                <div>
                                                <h3 className="block text-base font-medium text-[#180c5c] mb-2 mt-4 text-left">
                                                    Etiquetas
                                                </h3>
                                                <div className="flex flex-wrap gap-4">
                                                    {tags?.map((tag, index) => (
                                                    <label key={index} className="flex items-center space-x-2">
                                                        <Field
                                                        type="checkbox"
                                                        name="tags"
                                                        value={tag.id}
                                                        className="peer w-4 h-4 text-[#180c5c] border-gray-300 dark:border-gray-700 rounded focus:ring-[#180c5c]"
                                                        checked={arrayHelpers.form.values.tags.includes(tag.id)}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            if (e.target.checked) {
                                                                arrayHelpers.push(tag.id);
                                                            } else {
                                                                const idx = arrayHelpers.form.values.tags.indexOf(tag.id);
                                                            if (idx !== -1) 
                                                                arrayHelpers.remove(idx);
                                                            }
                                                        }}
                                                        />
                                                        <span className="text-sm text-gray-700 dark:text-white">
                                                        {tag.name}
                                                        </span>
                                                    </label>
                                                    ))}
                                                </div>
                                                </div>
                                            )}
                                    />
                                                    

                                        <div className="mt-6 text-right">
                                            <button
                                                type="submit"
                                                className="px-6 py-3 bg-[#180c5c] text-white font-semibold rounded-lg shadow-lg hover:bg-[#180c3c] focus:ring-2 focus:ring-blue-500"
                                                >
                                                {isEditMode ? 'Actualizar' : 'Agregar'}
                                            </button>
                                        </div>
                                        
                                    </div>
                            </div>
                        </div>
                        
                    </section>


          
                </Form>
            )}
        </Formik>
    </div>
    )
}
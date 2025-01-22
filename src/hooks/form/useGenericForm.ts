// import { useUser } from '@/hooks/user/useUserData';
// import { useTags } from '@/hooks/tags/useTagsData';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useState } from 'react';
// import { TagItem } from '../tags/useTagsColumns';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store';
// import * as Yup from 'yup';
// import { UserItem_T } from '../user/useUserColumns';
// import { usePublications } from '../publications/usePublicationsData';

// const validationSchema = Yup.object({
//     name: Yup.string().required('El nombre del rol es requerido'),
//     permissions: Yup.array().required('Los permisos son requeridos'),
// });

// interface FormValues {
//     name: string
//     permissions: string | number[]
// }

// export const useGenericForm = () => {
//     const { getById, post } = usePublications('/publications');
//     const [loading, setLoading] = useState<boolean>(true);
//     const { fetchData: fetchUsers } = useUser();
//     const [users, setUsers] = useState<UserItem_T[]>([]);
//     const { token, user } = useSelector((state: RootState) => state.auth);
//     const [tags, setTags] = useState<TagItem[]>([]);
//     const { fetchData: fetchTags } = useTags();
//     const [cover, setCover] = useState<string | undefined>();
//     const navigate = useNavigate();

//     const { reset, setError, watch, control, setValue, register, handleSubmit, formState: { errors } } = useForm<FormValues>({
//         mode: 'onChange',
//         resolver: yupResolver(validationSchema),
//     });

//     // const loadData = async () => {
//     const loadData = async ({ id }: { id?: number | string | undefined | null }) => {

//         try {
//             if (id) {
//                 const fetchedData = await getById(id);
//                 reset(fetchedData);
//                 if (fetchedData?.tags) {
//                     setValue('tags', fetchedData.tags.map((tag: TagItem) => tag.id));
//                 }
//                 if (fetchedData?.cover?.preview_url) {
//                     setCover(fetchedData.cover.preview_url); // Set the initial avatar preview
//                 }
//             }

//             const users: UserItem_T[] = await fetchUsers();
//             const tags: TagItem[] = await fetchTags();
//             setUsers(users);
//             setTags(tags);
//             setLoading(false);
//         } catch {
//             setLoading(false);
//         }
//         setLoading(false);
//     };

//     const createFormData = (data: Record<string, any>): FormData => {
//         const formData = new FormData();
//         Object.entries(data).forEach(([key, value]) => {
//             if (value !== undefined && value !== null) {
//                 formData.append(key, value);
//             }
//         });
//         return formData;
//     };

//     const onSubmit = async (data: FormValues) => {
//         const formData = createFormData(data);

//         if (data.tags && data.tags.length > 0) {
//             data.tags.forEach((tag) => {
//                 formData.append('tags[]', tag);
//             });
//         }

//         if (data.cover) {
//             formData.append('cover', data.cover);
//         }

//         const isEditMode = !!data.id

//         try {
//             const response = await (isEditMode
//                 ? post('/publications/update', formData, { Authorization: 'Bearer ' + token, 'Accept': 'application/json' })
//                 : post('/publications', formData, { Authorization: 'Bearer ' + token, 'Accept': 'application/json' }))


//             if (response.statusCode === 200) {
//                 navigate('/publications');
//             } else if (response.statusCode === 400) {
//                 Object.entries(response.data).forEach(([key, value]) => {
//                     const errorMessages = value as string[];
//                     setError(key as keyof FormValues, {
//                         type: 'server',
//                         message: errorMessages.join(', '),
//                     });
//                 });
//             }
//         } catch (error) {
//             console.log((error));
//         }
//     }

//     return { loadData, loading, register, onSubmit, handleSubmit, errors, tags, control, watch, cover, setCover, setValue, users };
// };

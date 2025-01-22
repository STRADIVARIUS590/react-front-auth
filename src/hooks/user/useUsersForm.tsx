import { useUser } from '@/hooks/user/useUserData';
import { useRoles } from '@/hooks/roles/useRolesData';
import { useTags } from '@/hooks/tags/useTagsData';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { TagItem } from '../tags/useTagsColumns';
import { RoleItem_T } from '../roles/useRolesTableColumns';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import * as Yup from 'yup';

interface FormValues {
    name: string;
    email: string;
    date_ingreso: string;
    birth_date: string;
    avatar?: File | null;
    password? : string | null; 
    password_confirmation? : string | null;
    role_id: string;
    tags?: any[];
    sex: string;
    contratation_type : string;
    category : string;
}

// Function to get the schema conditionally based on `isCreating`
const getValidationSchema = (isCreating: boolean) => {
  // Common base schema
  const baseSchema = Yup.object({
    name: Yup.string().required("El nombre es requerido"),
    email: Yup.string().email("Dirección de correo inválida").required("El correo es requerido"),
    date_ingreso: Yup.string().required("La fecha de inicio es requerida"),
    birth_date: Yup.string().required("La fecha de nacimiento es requerida"),
    role_id: Yup.string().required("El rol es requerido"),
    tags: Yup.array().optional(),
    sex: Yup.string().required("El género es requerido"),
    contratation_type: Yup.string().required("El tipo de contratación es requerido"),
    category: Yup.string().required("Selecciona al menos una categoría"),
  });

  console.log(isCreating);
  
  // Conditionally add `password` and `password_confirmation` fields if `isCreating` is true
  if (isCreating) {
    return baseSchema.shape({
      password: Yup.string()
        .min(5, "La contraseña debe tener mínimo 5 caracteres")
        .required("La contraseña es requerida"),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        .required("La confirmación de contraseña es requerida"),
    });
  }

  // Return the base schema if `isCreating` is false (update scenario)
  return baseSchema.shape({
    password: Yup.string().notRequired(),
    password_confirmation: Yup.string().notRequired(),
  });
};


// interface Props {
//     reset? : (values?: FieldValues) => void;
//     setValue? : (name: string, value: any, config?: any) => void;
//     register? : UseFormRegister<any>;
//     handleSubmit? : UseFormHandleSubmit<any>;
//     onSubmit? : (data: any) => void;
//     errors: { [key: string]: FieldError };
//     getById: (id: number | string) => Promise<void>
// }


export const useUsersForm = ({ id }: { id?: number | string | null | undefined } = {}) => {

    const navigate = useNavigate();
    const { getById, post } = useUser({ id });
    const { fetchData: fetchRoles } = useRoles();
    const { fetchData: fetchTags } = useTags();
    const [tags, setTags] = useState<TagItem[]>([]);
    const { token } = useSelector((state: RootState) => state.auth);
    const [roles, setRoles] = useState<RoleItem_T[]>([]);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // State for preview URL
    const [loading, setLoading] = useState(true)
    const { reset, setError, watch, control, setValue, register, handleSubmit, formState: { errors } } = useForm<FormValues>({

        mode: 'onChange',
        resolver: yupResolver(getValidationSchema(!!!id)),
    });

    const loadData = async () => {

        try {
            if (id) {
                const fetchedData = await getById(id);
                reset(fetchedData);
                if (fetchedData?.tags) {
                    setValue('tags', fetchedData.tags.map((tag: TagItem) => tag.id)); // Assuming `tags` in user data is an array of tag objects
                }
                if (fetchedData?.avatar?.preview_url) {
                    setAvatarPreview(fetchedData.avatar.preview_url); // Set the initial avatar preview
                }
            }
            const roles: RoleItem_T[] = await fetchRoles();
            console.log('qe' + JSON.stringify(roles));
            const tags: TagItem[] = await fetchTags();
            setRoles(roles);
            setTags(tags);
            setLoading(false);
        } catch {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormValues) => {

        const formData = new FormData();

        // Attach normal fields
        if (id) {
            formData.append('id', id.toString());
        }
        
        formData.append('name', data.name);
        formData.append('email', data.email);
        
        if(data.password){
            formData.append('password', data.password);
        }
        if(data.password_confirmation){
            formData.append('password_confirmation', data.password_confirmation);
        }
        
        formData.append('role_id', data.role_id);
        formData.append('birth_date', data.birth_date);
        formData.append('date_ingreso', data.date_ingreso);
        formData.append('sex', data.sex);
        formData.append('contratation_type', data.contratation_type);
        formData.append('category', data.category);

        // Attach tags as individual entries
        if (data.tags && data.tags.length > 0) {
            data.tags.forEach((tag) => {
                formData.append('tags[]', tag); // Backend must handle `tags[]` format
            });
        }

        // Attach files if any
        if (data.avatar && data.avatar instanceof File) {

            
            formData.append('avatar', data.avatar);
            // const file = Array.from(data.files)[0] ?? undefined;
            // if(file) formData.append('avatar', file);
            // Array.from(data.files).forEach(file => {
            //   formData.append('avatar', file); // Append each file separately
            // });
        }

        const isEditMode = !!id;
        // Append form fields to formData...
        try {
            const response = await (isEditMode
                ? post('/users/update', formData, { Authorization: 'Bearer ' + token })
                : post('/users', formData, { Authorization: 'Bearer ' + token })
            );

            if (response.statusCode === 200) {
                navigate('/users');
            } else if (response.statusCode === 400) {
                Object.entries(response.data).forEach(([key, value]) => {
                    const errorMessages = value as string[];
                    setError(key as keyof FormValues, {
                        type: 'server',
                        message: errorMessages.join(', '),
                    });
                });
            }
        } catch (error) {
            console.error('Submission Error:', error);
            // MessageToast({ message: "Error submitting the form", type: "error" });
        }
    };

    return {
        loadData,
        onSubmit,
        control,
        handleSubmit,
        roles,
        tags,
        errors,
        loading,
        register,
        setValue,
        avatarPreview,
        setAvatarPreview,
        watch
    };
};




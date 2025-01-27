import { RootState } from "@/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import useAcademicGrades from "./useAcademicGradesData";
import { UserItem_T } from "../user/useUserColumns";
import { useUser } from "../user/useUserData";
import { InstitutionItem, useInstitutions } from "../institutions/useInstitutionsData";
import { createFormData } from "../publications/usePublicationForm";
import { useNavigate } from "react-router-dom";

interface FormValues  {
    id?: string; 
    name: string;
    titulation_date: string; 
    user_id : string;
    institution_id : string;
    file?: File;
}

const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    user_id : Yup.string().required('El usuario es requerido'),
    titulation_date: Yup.string().required('La fecha de titulacion es requerida'),
    institution_id: Yup.string().required('La instutucion es requerida'),
    file: Yup.mixed()
})

export const useAcademicGradesForm = ({id}: {id ?  : number | string | null | undefined }) => {
    // const [error, setError] = useState<boolean>(false);
    const { token } = useSelector((state: RootState) => state.auth);
    const { fetchData: fetchUsers } = useUser();
    const { fetchData: fetchInstitutions } = useInstitutions();
    const { post } = useAcademicGrades({id});
    const navigate = useNavigate(); 
    const [ file, setFile ] = useState<string | undefined>();


    const { reset, setError, watch, control, register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async(data: FormValues) => {

        const formData = createFormData(data);
        
        if (data.file && data.file instanceof File) {
            formData.append('files[]', data.file);
        }
        
        const isEditMode = !!data.id
        try {
            const response = await (isEditMode
                ? post('/academic-grades/update', formData, { Authorization: 'Bearer ' + token, 'Accept' : 'application/json'})
                : post('/academic-grades', formData, { Authorization: 'Bearer ' + token, 'Accept' : 'application/json'})
            );

            if(response.statusCode == 200) {
                navigate('/academic-grades');
            } else if (response.statusCode === 400) {
                Object.entries(response.data).forEach(([key, value]) => {
                    const errorMessages = value as string[];
                    setError(key as keyof FormValues, {
                        type: 'server',
                        message: errorMessages.join(', '),
                    });
                });
            }
        }catch(err) {
        }finally {

        }
    }

    const { getById } = useAcademicGrades({id});
    const [ users, setUsers ] = useState<UserItem_T[] | []>([]);
    const [ institutions, setInstitutions ] = useState<InstitutionItem[] | []>([]);
    const [ loading, setLoading ] = useState<boolean>(true);

    const loadData = async() => {
        try{
            if(id) {
                const fetchedData = await getById(id);                
                reset(fetchedData);
                if(fetchedData?.file?.original_url){
                    setFile(fetchedData.file.original_url);
                }
            }
            const users : UserItem_T[]  = await fetchUsers() || [];
            setUsers(users);

            const institutions : InstitutionItem[] = await fetchInstitutions() || [];
            setInstitutions(institutions);
        }catch(error) {
        }finally {
            setLoading(false);
        }
    }
    return { loadData, handleSubmit, onSubmit, loading, watch, register, users, institutions, control, errors, setValue, file, setFile };
}
import { useUser } from '@/hooks/user/useUserData';
import { useTags } from '@/hooks/tags/useTagsData';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { TagItem } from '../tags/useTagsColumns';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';
import * as Yup from 'yup';
import { usePublications } from './usePublicationsData';
import { UserItem_T } from '../user/useUserColumns';

const validationSchema = Yup.object({
    title: Yup.string().required('El título es requerido'),
    user_id : Yup.string().required('EL usuario es requerido'),
    type: Yup.string().required('El tipo es requerido'),
    issn_isbn : Yup.string().required('El identificador  ISSN / ISBN es requerido'),
    doi: Yup.string().required('El doi es requerido'),
    magazine_name : Yup.string().required('EL nombre de la revista es rquerido'),
    publication_date : Yup.string().required('La fecha de publicacion es requerida'),
    period: Yup.string().required('El periodo es requerido'),
    tags: Yup.array().optional(),
    cover: Yup.mixed(),
});
export const createFormData = (data: Record<string, any>): FormData => {
    const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) { // Ensure only valid values are appended
                formData.append(key, value);
            }
        });
        return formData;
    };
interface FormValues {
    id? : string;
    title: string;
    user_id: string;
    type: string ;
    issn_isbn: string;
    doi: string;
    magazine_name: string;
    publication_date: string;
    period: string ;
    tags?: any[];
    cover? : File;
    file? : File;
    // user: {
    //     name: string | undefined
    // },
    // tags: TagItem[]
  }

export const usePublicationsForm = ({id}: {id ?  : number | string | null | undefined } ) => {
    const { getById, post } = usePublications({getEndpoint: '/publications', id: id});
    const [ loading, setLoading ] = useState<boolean>(true);
    const { fetchData : fetchUsers } = useUser();
    const [ users, setUsers ] = useState<UserItem_T[]>([]);
    const { token } = useSelector((state: RootState) => state.auth);
    const [ tags, setTags] = useState<TagItem[]>([]);
    const { fetchData : fetchTags } = useTags();
    const [ cover, setCover ] = useState<string | undefined>();
    const [ file, setFile] = useState<string | undefined>();
    const [ authors, setAuthors ] = useState<string[]>([]);
    const navigate  = useNavigate();

    const { reset, setError, watch, control, setValue, register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    
        mode: 'onChange',
            resolver: yupResolver(validationSchema),
        });

        // const loadData = async () => {
        const loadData = async ({id}: {id ?  : number | string | undefined | null } ) => {
            try {
                if(id){

                    let fetchedData = await getById(id);

                    reset(fetchedData);

                    if(fetchedData?.tags) {
                        setValue('tags', fetchedData.tags.map((tag: TagItem) => tag.id));
                    }
                    if(fetchedData?.cover?.preview_url){
                        setCover(fetchedData.cover.preview_url); // Set the initial avatar preview
                    }
                    if(fetchedData?.file?.original_url){
                        setFile(fetchedData.file.original_url);
                    }
                
                    if(fetchedData?.authors) {
                        setAuthors((JSON.parse(fetchedData.authors)).map((author : {name : string}) => author.name))
                    }
                }

                const users: UserItem_T[] = await fetchUsers() ?? [] //                
                const tags: TagItem[] = await fetchTags() ?? [];
                setUsers(users);
                setTags(tags);
                setLoading(false);

            }catch{
                setLoading(false);
            }
            setLoading(false);
        };



    const onSubmit = async (data : FormValues) => {
        const formData = createFormData(data);
        
        if(data.tags && data.tags.length > 0) {
            data.tags.forEach((tag) => {
                formData.append('tags[]', tag);
            });
        }
        if(authors){
            var authorsWithKey = authors.filter(str => str.trim() !== "").map(author => ({ name: author }));    
            formData.append('authors', (JSON.stringify(authorsWithKey)));
        }
    
        if (data.file && data.file instanceof File) {
            formData.append('files[]', data.file);
        }
    
        if (data.cover && data.cover instanceof File) { 
            formData.append('cover', data.cover);
        }
        const isEditMode = !!data.id 
        try {
             const response = await (isEditMode 
            ? post('/publications/update', formData, { Authorization: 'Bearer ' + token, 'Accept' : 'application/json'})
            : post('/publications', formData, { Authorization: 'Bearer ' + token, 'Accept' : 'application/json' }))


        if(response.statusCode === 200){
            navigate('/publications');
        }else if (response.statusCode === 400) {
             Object.entries(response.data).forEach(([key, value]) => {
            const errorMessages = value as string[];
            setError(key as keyof FormValues, {
              type: 'server',
              message: errorMessages.join(', '),
            });
          });   
        }
        }catch(error) {
            console.log((error));
        }
    }

    return { loadData, loading, register, onSubmit, handleSubmit, errors, tags, control, watch, cover, setCover, setValue, users, file, setFile, authors, setAuthors };
};

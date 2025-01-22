import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import usePermissions from '../permissions/usePermissionsData';
import { useRoles } from './useRolesData';

const validationSchema = Yup.object({
    id: Yup.string().default(""),
    name: Yup.string().required('El título es requerido'),
    permissions: Yup.array().optional(),
});

interface FormValues {
    id: string
    name: string;
    permissions?: any[];
}

export const useRolesForm = () => {
    const { getPermissions } = usePermissions();
    const { createUpdateRole } = useRoles();
    const [permissions, setPermissions] = useState([{ id: 0, name: "", guard_name: "" }]);
    const
        {
            // reset,
            // setError,
            watch,
            control,
            setValue,
            register,
            handleSubmit,
            formState: { errors }
        } = useForm<FormValues>
                ({
                    mode: 'onChange',
                    resolver: yupResolver(validationSchema),
                });

    useEffect(() => {
        const fetchPermissions = async () => {
            const permissions = await getPermissions();
            setPermissions(permissions);
        }
        fetchPermissions();
    }, [])

    const onSubmit: SubmitHandler<FormValues> = (data) => createUpdateRole(data)

    return { register, handleSubmit, onSubmit, errors, control, watch, setValue, permissions };
};

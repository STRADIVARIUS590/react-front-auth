import { ChangeEvent, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useRolesForm } from '@/hooks/roles/useRolesForm';
import { AppLayout } from '../Layout/AppLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoles } from '@/hooks/roles/useRolesData';
// yeah perdonen esto es terrible pero ya estoy cansade

export const RolesAddEditForm = () => {
    const { getRoleById } = useRoles();
    const navigate = useNavigate();
    const [role, setRole] = useState<any>();
    const [rolePermissions, setRolePermissions] = useState<any>();

    const { register, handleSubmit, onSubmit, setValue, errors, control, permissions } = useRolesForm();
    const { id } = useParams<{ id?: string }>();
    const isEditing = !!id

    useEffect(() => {
        if (!isEditing) {
            return;
        }
        async function get() {
            if (!id) {
                return;
            }
            const fetchedRole = await getRoleById(id)
            setRole(fetchedRole);
        }
        get();
    }, [])

    useEffect(() => {
        if (!isEditing) {
            return;
        }
        if (!role || !role.permissions) {
            return;
        }
        let tmp: any = {}
        role.permissions.forEach((perm: any) => {
            tmp[`${perm.name}`] = true;
        });
        setValue("name", role.name);
        setRolePermissions(tmp);
    }, [role])

    return (
        <AppLayout>
            <form onSubmit={handleSubmit((formData) => {
                const selectedPermissions = permissions
                    .filter((perm) =>
                        rolePermissions?.[perm.name] || formData.permissions?.includes(perm.id)
                    )
                    .map((perm) => perm.id);

                onSubmit({ ...formData, permissions: selectedPermissions }
                );
                navigate('/roles');
            })}>
                <section className="py-12 bg-gray-50 dark:bg-dark">
                    <div className="container mx-auto max-w-4xl p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                        <div className="flex flex-wrap -mx-4">
                            <div className="w-full md:w-1/2 px-4 mb-6">
                                {!!id ? <input hidden  {...register('id')} value={id} /> : ""}
                                <label className="mb-[10px] block text-base font-medium text-dark dark:text-white" htmlFor="name">Nombre</label>
                                <input
                                    type="text"
                                    {...register('name')}
                                    id="name"
                                    className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                                />
                                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                            </div>
                        </div>
                        <div className="w-full px-4 mb-6">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-2">
                                Permisos
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {permissions.map((item) => (
                                    <label key={item.id} className="flex items-center space-x-2">
                                        <Controller
                                            name="permissions"
                                            control={control}
                                            render={({ field: { value, onChange } }) => {
                                                const isChecked = rolePermissions ? rolePermissions[item.name] : value?.includes(item.id);
                                                return (
                                                    <input
                                                        type="checkbox"
                                                        value={item.id}
                                                        checked={isChecked}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                            const updatedRolePermissions = { ...rolePermissions };
                                                            if (isEditing) {
                                                                if (e.target.checked) {
                                                                    updatedRolePermissions[item.name] = true;
                                                                    onChange([...(value || []), item.id]);
                                                                } else {
                                                                    updatedRolePermissions[item.name] = false;
                                                                    onChange(value?.filter((v: number) => v !== item.id));
                                                                }
                                                                setRolePermissions(updatedRolePermissions);
                                                            } else {
                                                                const newValue = isChecked
                                                                    ? value?.filter((v: number) => v !== item.id)
                                                                    : [...(value || []), item.id];
                                                                onChange(newValue);
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-primary border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-primary"
                                                    />
                                                );
                                            }}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-white select-none">{item.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <input type="submit" value="Enviar solicitud" />
            </form>
        </AppLayout>

    );
};

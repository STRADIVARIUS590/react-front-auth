import { ChangeEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Controller} from 'react-hook-form';
import { MessageToast } from '../MessageToast';
import { useUsersForm } from '@/hooks/user/useUsersForm';
   
export interface UserItem {
  id: string; 
  name: string;  
}
export interface TagItem {
  name: string;
  id: string | number;
}

export const AddEditForm = () => {
    const { id } = useParams<{ id?: string }>();
    const {avatarPreview, setAvatarPreview, handleSubmit, loadData, roles,/*  watch, */ tags, onSubmit, loading, register,errors, control , setValue} = useUsersForm({id})
    const isEditMode = !!id

    useEffect(() => {
      loadData();
    }, [id]);

 

    if (loading) return <MessageToast message="Cargando..." type="loading" />;

      return (
      <form onSubmit={handleSubmit(onSubmit)}>


        <section className="py-12 bg-gray-50 dark:bg-dark">
          <div className="container mx-auto max-w-4xl p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <div className="flex flex-wrap -mx-4">
              <div className="w-full md:w-1/2 px-4 mb-6">
                <label className="block text-base font-medium text-[#180c5c] mb-2 text-left" htmlFor="name">Nombre</label>
                <input
                  type="text"
                  {...register('name')}
                  id="name"
                  className="w-full bg-transparent rounded-md border border-gray-300 dark:border-gray-700 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                />
                {errors.name && <p className="text-red-500 ">{errors.name.message}</p>}

                <div className='mt-4'>
                  <label className="block text-base font-medium text-[#180c5c] mb-2 text-left" >Correo</label>
                  <input
                    type="email"
                    {...register('email')}
                    id="email"
                    className="w-full bg-transparent rounded-md border border-gray-300 dark:border-gray-700 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                  />
                </div>

                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>
              <div className="w-full md:w-1/2 px-4 mb-6">
                <label className="block text-base font-medium text-[#180c5c] mb-2 text-left" >Fecha de ingreso</label>
                <input
                  type="date"
                  {...register('date_ingreso')}
                  id="date_ingreso"
                  className="w-full bg-transparent rounded-md border border-gray-300 dark:border-gray-700 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                />
                {errors.date_ingreso && <p className="text-red-500">{errors.date_ingreso.message}</p>}

                <div className='mt-4'>
                  <label className="block text-base font-medium text-[#180c5c] mb-2 text-left" >Fecha de nacimiento</label>
                  <input
                    type="date"
                    {...register('birth_date')}
                    id="birth_date"
                    className="w-full bg-transparent rounded-md border border-gray-300 dark:border-gray-700 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                  />
                  {errors.birth_date && <p className="text-red-500">{errors.birth_date.message}</p>}
                  </div>
                </div>

              <div className="w-full md:w-1/2 px-4 mb-6">
                <label className="block text-base font-medium text-[#180c5c] mb-2 text-left" >Contraseña</label>
                <input
                  type="password"
                  {...register('password')}
                  id="password"
                  className="w-full bg-transparent rounded-md border border-gray-300 dark:border-gray-700 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                <div className='mt-4'>
                  <label className="block text-base font-medium text-[#180c5c] mb-2 text-left" >Confirmar Contraseña</label>
                  <input
                    type="password"
                    {...register('password_confirmation')}
                    id="password_confirmation"
                    className="w-full bg-transparent rounded-md border border-gray-300 dark:border-gray-700 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                  />
                  {errors.password_confirmation && <p className="text-red-500">{errors.password_confirmation.message}</p>}
                  </div>
                </div>

                {/*previsualizacion*/}
                  {avatarPreview && (
                  
                    <div className="mt-4 ml-12">
                      <label className="block text-base font-medium text-[#180c5c] mb-2 text-left"  >Foto de Perfil</label>
                      <img 
                        src={avatarPreview} 
                        alt="Previsualización" 
                        className="w-40 h-40 object-cover rounded-full" 
                      />
                    </div>
                  )}

              <div className="w-full px-4 mb-6">
                <label className="block text-base font-medium text-[#180c5c] mb-2 text-left">Rol</label>
                <Controller
                  name="role_id"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-gray-300"
                    >
                      <option value="" disabled selected>Selecciona una opcion</option>
                      {roles && roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    
                  )}
                />
              {errors.role_id && <p className="text-red-500">{errors.role_id.message}</p>}
              </div>
              <div className="w-full px-4 mb-6">
                <label className="block text-base font-medium text-[#180c5c] mb-2 text-left">Genero</label>
                <Controller
                  name="sex"
                  control={control}
                  render={({ field }) => (
                    <select
                     
                    {...field}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-gray-300"
                    >
                    <option value="" disabled selected>Selecciona una opcion</option>
                      {[{id: 1, name: 'M'}, { id: 2, name: 'F' }].map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    
                  )}
                />
                  {errors.sex && <p className="text-red-500">{errors.sex.message}</p>}
              </div>  

               <div className="w-full px-4 mb-6">
                <label className="block text-base font-medium text-[#180c5c] mb-2 text-left">Tipo de contratacion</label>
                <Controller
                  name="contratation_type"
                  control={control}
                  render={({ field }) => (
                    <select
                     
                    {...field}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-gray-300"
                    >
                    <option value="" disabled selected>Selecciona una opcion</option>
                      {[{id: 1, name: 'Base C'}, { id: 2, name: 'Base' }].map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    
                  )}
                />
                  {errors.contratation_type && <p className="text-red-500">{errors.contratation_type.message}</p>}
              </div>


                <div className="w-full px-4 mb-6">
                <label className="block text-base font-medium text-[#180c5c] mb-2 text-left">Categoria</label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <select
                     
                    {...field}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-gray-300"
                    >
                    <option value="" disabled selected>Selecciona una opcion</option>
                      {[{id: 1, name: 'Titular C'}, { id: 2, name: 'Titular A' }].map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    
                  )}
                />
                  {errors.category && <p className="text-red-500">{errors.category.message}</p>}
              </div>

              {/* <p>{JSON.stringify(watch(), null, 2)}</p> */}

            </div>

            {/* Etiquetas */}
            <div className="">
              <h3 className="block text-base font-medium text-[#180c5c] mb-2 text-left">
                Etiquetas
              </h3>
              <div className="flex flex-wrap gap-4">
                {tags.map((item) => (
                  <label key={item.id} className="flex items-center space-x-2">
                    <Controller
                      name="tags"
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        const isChecked = value?.includes(item.id);
                        return (
                          <input
                            type="checkbox"
                            value={item.id}
                            checked={isChecked}
                            onChange={(_e: ChangeEvent<HTMLInputElement>) => {
                              const newValue = isChecked
                                ? value?.filter((v: number) => v !== item.id)
                                : [...(value || []), item.id];
                              onChange(newValue);
                            }}
                            className="peer w-4 h-4 text-[#180c5c] border-gray-300 dark:border-gray-700 rounded  focus:ring-[#180c5c]"
                          />
                        );
                      }}
                    />
                    <span className="text-sm text-gray-700 dark:text-white">{item.name}</span>
                  </label>
                ))}
                {errors.avatar && <p className="text-red-500">{errors.avatar.message}</p>}
              </div>

              <div className="mt-6">
                <label
                  className="block text-base font-medium text-[#180c5c] mb-2 text-left"
                  htmlFor="file"
                >
                  Avatar
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const fileList = e.target.files;
                    if (fileList && fileList.length > 0) {
                      const file = fileList[0];
                      setValue('avatar', file);
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full bg-[#f9fafb] dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                </div>


            </div>

             <div className="mt-6 text-right">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#180c5c] text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
                  {isEditMode ? "Actualizar" : "Guardar"}
                </button>
              </div>
              
          </div>
        </section>

        {/* <input type="submit" value="Enviar solicitud" /> */}
      </form>
    );
  };

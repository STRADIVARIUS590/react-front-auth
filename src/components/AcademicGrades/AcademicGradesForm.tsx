// Los valores por defecto de los select no son detectados, aunque aparezcan seleccionados por default se deben de seleccionar especificamente otra vez para que el formulario mande los datos
import { ChangeEvent, useEffect } from "react";
import { useParams } from "react-router-dom"
import { MessageToast } from "../MessageToast";
import { useAcademicGradesForm } from "@/hooks/academic_grades/useAcademicGradesForm";
import { Controller } from "react-hook-form";

export const AcademicGradesForm = () => {
    const { id } = useParams<{ id?: string }>();
    
    const { loadData, loading, handleSubmit,  onSubmit, register, users, institutions, control, errors, setValue, file, setFile } = useAcademicGradesForm({id});
    
    useEffect(() => {
        loadData();
    }, [id]);

    if(loading) return <MessageToast message="Cargando..." type="loading" />; 

    const isEditMode = !!id;
    return <form onSubmit={handleSubmit(onSubmit)}>

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
                    <div className="mt-4" >
                        <label className="block text-base font-medium text-[#180c5c] mb-2 text-left" >Fecha de Titulacion</label>
                        <input className="w-full bg-transparent rounded-md border border-gray-300 dark:border-gray-700 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2" 
                        type="date" {...register('titulation_date')} />
                        {errors.titulation_date && <p className="text-red-500 ">{errors.titulation_date.message}</p>}
                    </div>
                     <div className="mt-6">
                    <label className="block text-base font-medium text-[#180c5c] mb-2 text-left">Institucion</label>
                    <Controller
                        name="institution_id"
                        control={control}
                        render={({ field }) => (
                            <select
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-gray-300"
                            {...field}
                        >
                            {institutions && institutions.map((item) => (
                                <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                            ))}
                        </select>
                        )}
                    />
                        {errors.institution_id && <p className="text-red-500">{errors.institution_id.message}</p>}
                    </div>
                </div>

                 <div className="w-full md:w-1/2 px-4 mb-6">
                    <label className="block text-base font-medium text-[#180c5c] mb-2 text-left">Usuario</label>
                    <Controller
                    name="user_id"
                    control={control}
                    render={({ field }) => (
                    <select
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-gray-300"
                        {...field}
                    >
                        {users && users.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                        ))}
                    </select>
                    )}
                    />
                    {errors.user_id && <p className="text-red-500">{errors.user_id.message}</p>}
                  
                   <label className="block text-base font-medium text-[#180c5c] mb-2 mt-6 text-left">
                      Archivo
                    </label>
                    <input
                      className="w-full bg-[#f9fafb] dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"                 
                      type="file"
                       accept="application/pdf"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files) {
                            setValue('file', e.target.files[0]);
                            setFile(URL.createObjectURL(e.target.files[0]));
                        }
                    }}
                    />
                      
                    <div className="mt-4 align-center">
                        <object data={file} type="application/pdf" width="100%" height="100px">
                            <p>Your browser does not support embedded PDFs. You can <a href={file}>download the PDF</a> instead.</p>
                        </object>
                        <a href={file} target="_blank" rel="noreferrer" className="text-blue-500 mt-2 inline-block"> Ver archivo </a>
                    </div>

                   
                    <div className="mt-6 text-right">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#180c5c] text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
                            {isEditMode ? "Actualizar" : "Guardar"}
                        </button>
                    </div>
                </div> 
            </div>
        </div>
    </section>      
    </form>
}
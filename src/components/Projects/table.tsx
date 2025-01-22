import { DataTable } from "@/components/ui/data-table";
import useProjectTableColumns from "@/hooks/projects/useProjectsColumns";
import { useProjects } from "@/hooks/projects/useProjectsData";
import { MessageToast } from "../MessageToast";

export const Projects = ({ getEndpoint = "/projects?include=user" }: { getEndpoint?: string }) => {
    const { data, deleteFn, loading, error, user, canDelete, canEdit } = useProjects(getEndpoint)
    const { userColumns } = useProjectTableColumns({ deleteFn, user, canDelete, canEdit });

    if (error) {
        <div className="mt-12"> <MessageToast message='Ha ocurrido un error' type="error" /></div>
    }

    if (loading) {
        <div className="mt-12"> <MessageToast message='Cargando...' type="loading" /></div>
    }

    return (
        <div className="container mx-auto py-10">
            <DataTable pathName={"projects"} filterField={"name"} filterPlaceholder={"Nombre del proyecto"} columns={userColumns} data={data} error={error} loading={loading} />
        </div>
    )
}

// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store";
// import { useNavigate } from "react-router-dom";
// import { Api } from "../../services/Api";
// import { MessageToast } from "../MessageToast";
// import Button from "../Buttons/Button";
// // import { AppContext, Context } from "../scripts/Context";
// interface Props {
//     projects: ProjectItem[]
// }
//
// export interface ProjectItem {
//     id: string | number;
//     name: string | undefined;
//     description: string | undefined;
//     user_id: string | number | undefined;
//     objetives: string | undefined;
//     colaborators: string | undefined;
//     start_date: string | undefined;
//     end_date: string | undefined;
//     type: string | undefined;
//     period: string | undefined;
//     user: {
//         name: string | undefined
//     }
// }
//
// export const Projects = ({ projects }: Props) => {
//
//     const { token, user } = useSelector((state: RootState) => state.auth);
//
//     const navigate = useNavigate();
//
//     const user_permissions: string[] = user?.all_permissions || [];
//
//     const [canDelete, setCanDelete] = useState<boolean>(false);
//
//     const [canEdit, setCanEdit] = useState<boolean>(false);
//
//     const [data, setData] = useState<ProjectItem[]>(projects);
//
//     useEffect(() => {
//
//         if (!user || user_permissions.indexOf("projects.get") === -1) {
//             navigate(-1);
//         }
//
//         if (user && user_permissions.indexOf("projects.destroy") > -1) {
//             setCanDelete(true);
//         }
//
//         if (user && user_permissions.indexOf("projects.edit") > -1) {
//             setCanEdit(true)
//         }
//     }, [user, user_permissions, navigate, data]);
//
//
//     const [error, setError] = useState<boolean>(false)
//
//     const deleteProject = async (id: number | string) => {
//         const response = Api.delete('/projects/' + id, {
//             Authorization: 'Bearer ' + token,
//             accept: 'application/json'
//         })
//
//         const result = await response;
//
//         if (result.statusCode == 200) {
//             const updatedTags = data.filter(tag => tag.id !== id); // Create a new array without the deleted tag
//             setData(updatedTags); // Update state to trigger re-render
//
//             setError(false);
//         } else {
//             setError(true)
//         }
//     }
//
//
//     if (error) { return <MessageToast message='Ha ocurrido un error' type="error" /> }
//
//     return <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//         <h1>Proyectos </h1>
//         <table className="w-full text-sm text-left rtl:text-right font-small text-gray-900 dark:text-gray-400">
//             <thead>
//                 <tr>
//                     <th scope="col" className="px-6 py-3">#</th>
//                     <th scope="col" className="px-6 py-3">Nombre</th>
//                     <th scope="col" className="px-6 py-3">Descripcion</th>
//                     <th scope="col" className="px-6 py-3">Usuario</th>
//                     <th scope="col" className="px-6 py-3">Objetivos</th>
//                     <th scope="col" className="px-6 py-3">Colaboradores</th>
//                     <th scope="col" className="px-6 py-3">Fecha de inicio</th>
//                     <th scope="col" className="px-6 py-3">Fecha de Fin</th>
//                     <th scope="col" className="px-6 py-3">Tipo</th>
//                     <th scope="col" className="px-6 py-3">Periodo</th>
//                     <th scope="col" className="px-6 py-3">Acciones</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {data.map((item) => (
//                     <tr key={item.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
//                         <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</td>
//                         <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.name}</td>
//                         <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.description}</td>
//                         <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.user?.name}</td>
//                         <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.objetives}</td>
//                         <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.colaborators}</td>
//                         <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.start_date}</td>
//                         <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.end_date}</td>
//                         <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.type}</td>
//                         <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.period}</td>
//                         <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                             {/* <button onClick={() => deleteProject(item.id)}>Eliminar </button> */}
//                             {/* <button onClick={() => navigate('/projects/edit/' + item.id)}> Editar </button> */}
//                             <Button
//                                 value={"Eliminar"}
//                                 onClick={() => deleteProject(item.id)}
//                                 className={!canDelete && user?.id != item.user_id ? 'hidden' : "text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"}
//                                 disabled={!canDelete && user?.id != item.user_id}
//                             />
//                             <Button
//                                 value={"Editar"}
//                                 onClick={() => navigate('/projects/edit/' + item.id)}
//                                 className={!canEdit && user?.id != item.user_id ? 'hidden' : 'text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"'}
//                                 disabled={canDelete && user?.id != item.user_id}
//                             />
//
//                         </td>
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     </div>
// }

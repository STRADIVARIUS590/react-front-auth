import { DataTable } from "@/components/ui/data-table";
import { MessageToast } from "../MessageToast";
import useCongressesTableColumns from "@/hooks/congresses/useCongressesColumns";
import { useCongresses } from "@/hooks/congresses/useCongressesData";

export const Congresses = () => {
    const { data, deleteFn, loading, error, user, canDelete, canEdit } = useCongresses()
    const { userColumns } = useCongressesTableColumns({ deleteFn, user, canDelete, canEdit });

    if (error) {
        <div className="mt-12"> <MessageToast message='Ha ocurrido un error' type="error" /></div>
    }

    if (loading) {
        <div className="mt-12"> <MessageToast message='Cargando...' type="loading" /></div>
    }

    return (
        <div className="container mx-auto py-10">
            <DataTable pathName={"congresses"} filterField={"title_trabajo"} filterPlaceholder={"Titulo del trabajo"} columns={userColumns} data={data} error={error} loading={loading} />
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
// // interface UserCon
//  interface CongressItem {
//     id: string | number;
//     title_trabajo: string;
//     user_id: string | number;
//     event_name: string | null;
//     date: string | null;
//     colaborators: number | null
//     user: {
//         name: string
//     }
// }
//
// export const Congresses = () => {
//
//     const  { token, user } = useSelector((state: RootState ) => state.auth);
//
//     const navigate = useNavigate();
//
//     const user_permissions: string[] = user?.all_permissions || [];
//
//     const [data, setData] = useState<CongressItem[]>([]);
//
//     const [canDelete, setCanDelete ] = useState<boolean>(false);
//
//     const [canEdit, setCanEdit ] = useState<boolean>(false);
//
//     useEffect(() => {
//         if (!user || user_permissions.indexOf('congresses.get' ) === -1) {
//             navigate(-1);
//         }
//
//         if(user && user_permissions.indexOf("congresses.destroy") > -1) {
//             setCanDelete(true);
//         }
//
//         if(user && user_permissions.indexOf("congresses.edit") > -1) {
//             setCanEdit(true)
//         }
//
//     }, [user, user_permissions, navigate, data]);
//     const [loading, setLoading] = useState<boolean>(true);
//
//     const [error, setError] = useState<boolean>();
//
//     const fetchData = async () => {
//
//         const response =  await Api.get('/congresses?include=user', {
//             Authorization: 'Bearer ' + token,
//             accept: 'application/json'
//         })
//
//         const result: CongressItem[] = await response.data
//
//         if(response.statusCode === 200) {
//             setError(false);
//             setData(result)
//             setLoading(false);
//         }else{
//             setError(true);
//             navigate(-1)
//         }
//     }
//
//     const deleteCongress = async ( id: number | string) => {
//         const response = Api.delete('/congresses/' + id, {
//             Authorization: 'Bearer ' + token,
//             accept: 'application/json'
//         })
//
//         const result = await response;
//
//         if(result.statusCode == 200) {
//             setError(false);
//         }else {
//             setError(true)
//         }
//         fetchData();
//     }
//
//
//     useEffect(() => { fetchData(); }, [])
//
//     if(error){   return  <div className="mt-12"> <MessageToast message='Ha ocurrido un error' type="error"/></div>}
//     if(loading){ return <div className="mt-12"> <MessageToast message='Cargando...' type="loading"/></div>}
//
//     return <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//
//         <h1>Congresos</h1>
//         <table className="w-full text-sm text-left rtl:text-right font-small text-gray-900 dark:text-gray-400">
//         <thead>
//             <tr className="text-center">
//                 <th scope="col" className="px-6 py-3">#</th>
//                 <th scope="col" className="px-6 py-3" >Titulo del trabajo</th>
//                 <th scope="col" className="px-6 py-3">Usuario</th>
//                 <th scope="col" className="px-6 py-3">Evento</th>
//                 <th scope="col" className="px-6 py-3">Fecha</th>
//                 <th scope="col" className="px-6 py-3">Nro de Colaboradores</th>
//                 <th scope="col" className="px-6 py-3">Acciones</th>
//             </tr>
//         </thead>
//         <tbody>
//             {data.map((item) => (
//                 <tr key={item.id} className="text-center odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
//                 <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</td>
//                 <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.title_trabajo}</td>
//                 <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.user?.name}</td>
//                 <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.event_name}</td>
//                 <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.date}</td>
//                 <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.colaborators}</td>
//                 <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//
//                     <Button
//                             value={"Eliminar"}
//                             onClick={() => deleteCongress(item.id)}
//                             className={!canDelete && user?.id != item.user_id ? 'hidden' : "text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"}
//                             disabled={!canDelete && user?.id != item.user_id }
//                         />
//                     <Button
//                             value={"Editar"}
//                             onClick={() => navigate('/congresses/edit/' + item.id)}
//                             className={!canEdit && user?.id != item.user_id ? 'hidden' : 'text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"' }
//                             disabled={!canDelete && user?.id != item.user_id }
//                         />
//                 </td>
//                 </tr>
//             ))}
//         </tbody>
//     </table>
//     </div>
// }

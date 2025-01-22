import { useUser } from "@/hooks/user/useUserData";
import { useUserTableColumns } from "@/hooks/user/useUserColumns";
import { DataTable } from "@/components/ui/data-table";
import { ButtonFilters } from "./ReportFilters";



export const Users = () => {
    const { data, deleteUser, loading, error, user, canDelete, canEdit, canGetUserReport } = useUser();
    // const [ data, setData] = useState<UserItem_T[]>([]);

    // const loadData = async () => { 
    //     const fetchedData = await fetchData();
    //     setData(fetchedData); 
    //     alert('e');
    // };
    // useEffect(() => {
    //     loadData(); 
    // }, []);

    
    const { userColumns } = useUserTableColumns({ deleteUser, user, canDelete, canEdit });
    return (
        // className="bg-vi-200 hover:bg-vi-400 active:bg-vi-400  text-vi-900 hover:text-vi-50 active:text-vi-50 rounded-md h-fit px-4 py-1"
        <div className="container mx-auto py-10">
            <DataTable reports={ canGetUserReport && 
                <div> 
                    <details style={{ transition: "all 0.9s ease-in-out"}}>
                        <summary className="bg-vi-200 hover:bg-vi-400 active:bg-vi-400  text-vi-900 hover:text-vi-50 active:text-vi-50 rounded-md h-fit px-4 py-1" >Reportes</summary>
                        <ButtonFilters/>
                    </details>
                </div>
                
                } pathName="users" filterField={"email"} filterPlaceholder={"correo@uabcs.mx"} columns={userColumns} data={data} error={error} loading={loading} />
        </div>
    )
}

// import { useEffect, useState } from "react";
// import { RootState } from "../../store";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Api } from "../../services/Api";
// import { MessageToast } from "../MessageToast";
// import Button from "../Buttons/Button";
//
// interface UserItem {
//   id: number;
//   name: string;
//   email: string;
//   date_ingreso: string;
//   birth_date: string;
//   sex: string;
//   role_id: string;
//     role: {
//         id: number;
//         name: string;
//     }
//   // Add more fields as necessary
// }
// export const Users = () => {
//
//         const  { token, user } = useSelector((state: RootState ) => state.auth);
//
//         const navigate = useNavigate();
//
//         const user_permissions: string[] = user?.all_permissions || [];
//
//         const [canDelete, setCanDelete ] = useState<boolean>(false);
//
//         const [canEdit, setCanEdit ] = useState<boolean>(false);
//
//         const [error, setError] = useState<boolean>();
//
//         const [data, setData] = useState<UserItem[]>([]);
//
//         useEffect(() => {
//             if (!user || user_permissions.indexOf("users.get") === -1) {
//                 navigate(-1);
//             }
//
//             if(user && user_permissions.indexOf("users.destroy") > -1) {
//                 setCanDelete(true);
//             }
//
//             if(user && user_permissions.indexOf("users.edit") > -1) {
//                 setCanEdit(true)
//             }
//         }, [user, user_permissions, navigate, data]);
//
//         const [loading, setLoading] = useState<boolean>(true); // Optional: Typed loading state
//
//             const fetchData = async () => {
//
//                     const response = await Api.get('/users', {
//                         Authorization: 'Bearer ' + token,
//                         accept: 'application/json'
//                     })
//
//                     const result: UserItem[] = await response.data
//
//                     if(response.statusCode === 200) {
//                         setError(false);
//                         setData(result)
//                         setLoading(false);
//                     }else{
//                         setError(true);
//                         navigate(-1);
//                     }
//
//             }
//
//
//         useEffect(() => { fetchData();}, [])
//
//         const deleteUser = async ( id : number ) => {
//             const response = Api.delete('/users/' + id, {
//                 Authorization: 'Bearer ' + token,
//                 accept: 'application/json'
//             })
//
//             const result = await response;
//
//             if(result.statusCode == 200) {
//                 setError(false);
//             }else {
//                 setError(true)
//             }
//             fetchData();
//         }
//
//         if(error){       return <div className="mt-12"> <MessageToast message='Ha ocurrido un error' type="error"/></div>}
//         if(loading){     return <div className="mt-12"> <MessageToast message='Cargando...' type="loading"/></div>}
//
//         return (
//         <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//
//             <h1 >Usuarios</h1>
//             <table className="text-center w-full text-sm text-left rtl:text-right font-small text-gray-900 dark:text-gray-400">
//                 <thead>
//                     <tr>
//                         <th scope="col" className="px-6 py-3"> #</th>
//                         <th scope="col" className="px-6 py-3"> Nombre</th>
//                         <th scope="col" className="px-6 py-3"> Correo</th>
//                         <th scope="col" className="px-6 py-3"> Fecha de ingreso</th>
//                         <th scope="col" className="px-6 py-3"> Fecha de nacimiento</th>
//                         <th scope="col" className="px-6 py-3"> Sexo </th>
//                         <th scope="col" className="px-6 py-3"> Rol   </th>
//                         <th scope="col" className="px-6 py-3"> Acciones </th>
//                     </tr>
//                 </thead>
//                     <tbody>
//
//                     {data.map((item) => (
//                     <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={item.id}>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</th>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.name}</th>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.email}</th>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.date_ingreso}</th>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.birth_date}</th>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.sex}</th>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.role?.name}</th>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                             {/* solo puedes actualizar tu propio usuario si no tienes permisos */}
//                             <Button
//                                 value={"Eliminar"}
//                                 onClick={() => deleteUser(item.id)}
//                                 className={!canDelete && user?.id != item.id ? 'hidden' : "text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"}
//                                 disabled={!canDelete && user?.id != item.id }
//                            />
//                             <Button
//                                 value={"Editar"}
//                                 onClick={() => navigate('/users/edit/' + item.id)}
//                                 className={!canEdit && user?.id != item.id ? 'hidden' : 'text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"' }
//                                 disabled={!canDelete && user?.id != item.id }
//                            />
//                         </th>
//                     </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     )
// }

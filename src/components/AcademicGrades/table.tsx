import { DataTable } from "@/components/ui/data-table";
import { MessageToast } from "../MessageToast";
import useAcademicGrades from "@/hooks/academic_grades/useAcademicGradesData";
import useAcademicGradesTableColumns from "@/hooks/academic_grades/useAcademicGradesColumns";

export const AcademicGrades = ({ getEndpoint = "/academic-grades?include=institution,user" }: { getEndpoint?: string }) => {
    const { data, deleteFn, loading, error, user, canDelete, canEdit } = useAcademicGrades({ getEndpoint })

    const { userColumns } = useAcademicGradesTableColumns({ deleteFn, user, canDelete, canEdit });

    if (error) {
        <div className="mt-12"> <MessageToast message='Ha ocurrido un error' type="error" /></div>
    }

    if (loading) {
        <div className="mt-12"> <MessageToast message='Cargando...' type="loading" /></div>
    }

    return (
        <div className="container mx-auto py-10">
            <DataTable pathName={"academic-grades"} filterField={"name"} filterPlaceholder={"Nombre del grado académico"} columns={userColumns} data={data} error={error} loading={loading} />
        </div>
    )
}
// import { useSelector } from "react-redux";
// import { Api } from "../../services/Api";
// import { RootState } from "../../store";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { MessageToast } from "../MessageToast";
// import Button from "../Buttons/Button";
//
// interface Props {
//     academic_grades : {
//         id: string | number;
//         name: string,
//         user_id: string | number;
//         titulation_date : string | number;
//         institution : {
//             id: string | number;
//             name: string | number;
//
//         }
//         user : {
//             id: string | number;
//             name: string | number;
//         }
//     }[]
// }
//
// export const AcademicGrades = ({academic_grades} : Props) => {
//
//     const navigate = useNavigate();
//
//     const { token, user } = useSelector((state: RootState) => state.auth);
//
//     const [ error, setError ] = useState<boolean>(false);
//
//     const [ data, setData ] = useState(academic_grades);
//
//     const [ canEdit, setCanEdit ] = useState<boolean>(false);
//
//     const [ canDelete, setCanDelete ] = useState<boolean>(false);
//
//     const user_permissions: string[] = user?.all_permissions || [];
//
//     useEffect(() => {
//         if (!user || user_permissions.indexOf("academic-grades.get") === -1) {
//             navigate(-1);
//         }
//         if(user && user_permissions.indexOf("academic-grades.destroy") > -1) {
//             setCanDelete(true);
//         }
//
//         if(user && user_permissions.indexOf("academic-grades.edit") > -1) {
//             setCanEdit(true)
//         }
//     }, [user, user_permissions, navigate, data]);
//     // const [loading ]= useState<boolean>(false);
//
//     const deleteAcademicGrade = async ( id : number | string ) => {
//         // setLoading(true);
//         const response = Api.delete('/academic-grades/' + id, {
//             Authorization: 'Bearer ' + token,
//             accept: 'application/json'
//         })
//
//         const result = await response;
//
//           if(result.statusCode == 200) {
//                 setData((prevTags) => prevTags.filter((tag) => tag.id !== id));
//             }else {
//                 setError(true)
//             }
//         }
//         // setLoading(false);
//
//     if(error){ return <div className="mt-12">  <MessageToast message='Ha ocurrido un error' type="error"/> </div>}
//
//     return (
//         <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//
//             <h1 >Grados Academicos</h1>
//             <table className="text-center w-full text-sm text-left rtl:text-right font-small text-gray-900 dark:text-gray-400">
//                 <thead>
//                     <tr>
//                         <th scope="col" className="px-6 py-3"> #</th>
//                         <th scope="col" className="px-6 py-3"> Nombre</th>
//                         <th scope="col" className="px-6 py-3"> Usuario </th>
//                         <th scope="col" className="px-6 py-3"> Institution </th>
//                         <th scope="col" className="px-6 py-3"> Fecha de Titulacion </th>
//                         <th scope="col" className="px-6 py-3"> Acciones </th>
//                     </tr>
//                 </thead>
//                     <tbody>
//
//                     {data.map((item) => (
//                     <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={item.id}>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</th>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.name}</th>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.user?.name}</th>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.institution?.name }</th>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.titulation_date}</th>
//                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                             {/* <button onClick={() => deleteAcademicGrade(item.id)}> Eliminar</button> */}
//                             {/* <button onClick={() => navigate('/academic-grades/edit/' + item.id)}>Editar</button> */}
//
//                          <Button
//                             value={"Eliminar"}
//                             onClick={() => deleteAcademicGrade(item.id)}
//                             className={!canDelete && user?.id != item.user_id ? 'hidden' : "text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"}
//                             disabled={!canDelete && user?.id != item.user_id }
//                     />
//                     <Button
//                             value={"Editar"}
//                             onClick={() => navigate('/academic-grades/edit/' + item.id)}
//                             className={!canEdit && user?.id != item.user_id ? 'hidden' : 'text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"' }
//                             disabled={!canDelete && user?.id != item.user_id }
//                     />
//
//                         </th>
//                     </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     )
// }

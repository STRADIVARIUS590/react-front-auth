import { useSelector } from "react-redux";
import { AcademicGrades } from "./table"
import { RootState } from "../../store";
// import { useEffect, useState } from "react";
// import { Api } from "../../services/Api";
// import { MessageToast } from "../MessageToast";
// interface AcademicGradeItem {
//     id: string | number;
//     name: string,
//     titulation_date: string | number;
//     institution: {
//         id: string | number;
//         name: string | number;

//     }
//     user: {
//         id: string | number;
//         name: string | number;
//     }
// }


export const AcademicGradesTab = () => {

    const { user } = useSelector((state: RootState) => state.auth);

    // const [, setData] = useState<AcademicGradeItem[]>();

    // const [error, setError] = useState<boolean>(false);

    // const [loading, setLoading] = useState<boolean>(true);

    // const fetchData = async () => {
    //     const response = await Api.get('/academic-grades?include=institution,user&filter[user_id]=' + user?.id, {
    //         Authorization: 'Bearer ' + token,
    //         accept: 'application/json'
    //     })

    //     const result: AcademicGradeItem[] = await response.data;

    //     if (response.statusCode === 200) {

    //         setError(false);
    //         setData(result);
    //         setLoading(false)
    //     }
    // }

    // useEffect(() => {
    //     fetchData();
    // }, []);


    return <>
        {/* {
            error && <MessageToast message='Ha ocurrido un error' type="error" />
        }
        {
            loading && <MessageToast message='Cargando...' type="loading" />
        } */}
        {
             <AcademicGrades getEndpoint={`/academic-grades?include=institution,user&filter[user_id]=${user?.id}`} />
        }
    </>
}
// academic_grades={data}

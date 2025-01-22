import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { Courses } from "./table";

export const CoursesTab = () => {

    const { user } = useSelector((state: RootState) => state.auth);

    // const navigate = useNavigate();

    // const [, setData] = useState<CourseItem[]>([]);

    // const [error, setError] = useState<boolean>(false);

    // const [loading, setLoading] = useState<boolean>(true);

    // const fetchData = async () => {
    //     const response = await Api.get('/courses?include=user,institution&filter[user_id]=' + user?.id, {
    //         Authorization: 'Bearer ' + token,
    //         accept: 'application/json'
    //     })

    //     const result: [] = await response.data

    //     if (response.statusCode === 200) {
    //         setError(false);
    //         setData(result)
    //         setLoading(false);
    //     } else {
    //         setError(true);
    //         navigate(-1)
    //     }
    // }

    // useEffect(() => { fetchData() }, [])

    return <>
        {/* {
            error && <MessageToast message='Ha ocurrido un error' type="error" />
        }
        {
            loading && <MessageToast message='Cargando...' type="loading" />
        } */}
        {
            <Courses getEndpoint={`/courses?include=user,institution&filter[user_id]=${user?.id}`} />
        }
    </>
}
// courses={data}

import { useSelector } from "react-redux";
import { Projects } from "./table"
import { RootState } from "../../store";

export const ProjectsTab = () => {
    const {  user } = useSelector((state: RootState) => state.auth);

    // const navigate = useNavigate();

    // const [, setData] = useState<ProjectItem[]>();

    // const [error, setError] = useState<boolean>(false);

    // const [loading, setLoading] = useState<boolean>(true);

    // const fetchData = async () => {
    //     const response = await Api.get('/projects?include=user&filter[user_id]=' + user?.id, {
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
            // !error && !loading &&
             <Projects getEndpoint={`/projects?include=user&filter[user_id]=${user?.id}`} />
        }

    </>
}
// projects={data}

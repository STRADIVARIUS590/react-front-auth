import { useSelector } from "react-redux";
import { Publications } from "./table"
import { RootState } from "../../store";
export const PublicationsTab = () => {

    const { user } = useSelector((state: RootState) => state.auth);

    // const [, setData] = useState<PublicationItem[]>();

    // const [error, setError] = useState<boolean>(false);

    // const [loading, setLoading] = useState<boolean>(true);

    // const fetchData = async () => {
    //     const response = await Api.get('/publications?include=user&filter[user_id]=' + user?.id, {
    //         Authorization: 'Bearer ' + token,
    //         accept: 'application/json'
    //     })

    //     const result: PublicationItem[] = await response.data;

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
            <Publications getEndpoint={`/publications?include=user,cover&filter[user_id]=${user?.id}`} />
        }
    </>
}

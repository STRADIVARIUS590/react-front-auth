import { AppLayout } from "../Layout/AppLayout"
import { Publications } from "./table"

export interface PublicationItem {
    id: string;
    title: string | undefined;
    user_id: string | undefined;
    type: string | undefined;
    issn_isbn: string | undefined;
    doi: string | undefined;
    magazine_name: string | undefined;
    authors: string | undefined;
    publication_date: string | undefined;
    period: string | undefined;
    user: {
        name: string | undefined
    }
}
export const PulicationsIndex = () => {

    
    // const navigate = useNavigate();

    // // const { user } = useSelector((state: RootState) => state.auth);

    // // const user_permissions: string[] = user?.all_permissions || [];

    // // useEffect(() => {
    // //     if (!user || user_permissions.indexOf("publications.get") === -1) {
    // //         alert('wer');
    // //         navigate(-1);
    // //     }
    // }, [user, user_permissions, navigate]);

    // const [loading, setLoading] = useState<boolean>(true);

    // const [, setData] = useState<PublicationItem[]>([]);

    // const [error, setError] = useState<boolean>(false);

    // const fetchData = async () => {

    //     const response = await Api.get('/publications?include=user', {
    //         Authorization: 'Bearer ' + token,
    //         accept: 'application/json'
    //     })

    //     const result: PublicationItem[] = await response.data

    //     if (response.statusCode === 200) {
    //         setError(false);
    //         setData(result)
    //         setLoading(false);
    //     } else {
    //         setError(true);
    //         navigate(-1);
    //     }

    // }

    // useEffect(() => { fetchData() }, []);
    return (<AppLayout>
        {/* {
            error && <div className="mt-12"> <MessageToast message='Ha ocurrido un error' type="error" /></div>
        }
        {
            loading && <div className="mt-12"> <MessageToast message='Cargando...' type="loading" /></div>
        } */}
        {
            // !error && !loading &&
            // <AuthContext.Provider value={user}>
            <Publications />
            // </AuthContext.Provider>
        }
    </AppLayout>
    )
}
// publications={data}

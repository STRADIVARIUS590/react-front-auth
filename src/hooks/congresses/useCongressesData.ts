import { Api } from "@/services/Api";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CongressItem } from "./useCongressesColumns";

export const useCongresses = () => {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const user_permissions: string[] = user?.all_permissions || [];


    const [error, setError] = useState<boolean>(false);
    const [data, setData] = useState<CongressItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [canDelete, setCanDelete] = useState<boolean>(true);
    const fetchData = async () => {
        const response = await Api.get('/congresses?include=user', {
            Authorization: 'Bearer ' + token,
            accept: 'application/json'
        })
        const result: CongressItem[] = await response.data
        if (response.statusCode === 200) {
            setError(false);
            setLoading(false);
            setData(result)
        } else {
            // no usar navigate!
            setError(true);
            navigate(-1);
        }
    }

    // TODO no retornar con navigate si no retornar un error
    useEffect(() => {
        if (!user || user_permissions.indexOf('congresses.get') === -1) {
            navigate(-1);
        }

        if (user && user_permissions.indexOf("congresses.destroy") > -1) {
            setCanDelete(true);
        }

        if (user && user_permissions.indexOf("congresses.edit") > -1) {
            setCanEdit(true)
        }
    }, [user, user_permissions, navigate]);

    const deleteFn = async (id: number | string) => {
        const response = Api.delete('/congresses/' + id, {
            Authorization: 'Bearer ' + token,
            accept: 'application/json'
        })

        const result = await response;

        if (result.statusCode == 200) {
            setError(false);
        } else {
            setError(true)
        }
        fetchData();
    }

    useEffect(() => { fetchData(); }, [])
    return { data, user, deleteFn, loading, error, canDelete, canEdit }
}

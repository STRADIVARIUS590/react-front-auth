import { Api } from "@/services/Api";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TagItem } from "./useTagsColumns";

export const useTags = ({id}: {id ?  : number | string | null | undefined } = {}) => {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const user_permissions: string[] = user?.all_permissions || [];


    const [error, setError] = useState<boolean>(false);
    const [data, setData] = useState<TagItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const fetchData = async () => {
        const response = await Api.get('/tags', {
            Authorization: 'Bearer ' + token,
            accept: 'application/json'
        })
        const result: TagItem[] = await response.data
        if (response.statusCode == 200) {
            setError(false);
            setLoading(false);
            setData(result)
            return result;
        } else {
            setError(true);
            return [];
            // no usar navigate!
            // navigate(-1);
        }
    }

    // TODO no retornar con navigate si no retornar un error
    useEffect(() => {
        if (!user || user_permissions.indexOf("tags.get") === -1) {
            navigate(-1);
        }
    }, [user, user_permissions, navigate]);

    const deleteFn = async (id: number | string) => {
        const response = Api.delete('/tags/' + id, {
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

    useEffect(() => {  if(!id) { fetchData(); } }, [])
    return {data, user, deleteFn, fetchData, loading, error, canEdit: true, canDelete: true }
}

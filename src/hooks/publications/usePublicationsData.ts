import { Api } from "@/services/Api";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PublicationItem } from "./usePublicationsColumns";

export const usePublications = ({getEndpoint, id}: {id ?  : number | string | null | undefined,  getEndpoint : string }) => {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const user_permissions: string[] = user?.all_permissions || [];
    const [error, setError] = useState<boolean>(false);
    const [data, setData] = useState<PublicationItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [canDelete, setCanDelete] = useState<boolean>(true);
    const fetchData = async () => {
        // const response = await Api.get('/publications?include=user&filter[user_id]=' + user?.id, {
        const response = await Api.get(getEndpoint, {
            Authorization: 'Bearer ' + token,
            accept: 'application/json'
        })
        const result: PublicationItem[] = await response.data
        if (response.statusCode === 200) {
            setError(false);
            setLoading(false);
            setData(result)
        } else {
            setError(true);
        }
    }

    // TODO no retornar con navigate si no retornar un error
    useEffect(() => {
        if (!user || user_permissions.indexOf("publications.get") === -1) {
            
            // navigate(-1);
        }
        if (user && user_permissions.indexOf("publications.destroy") > -1) {
            setCanDelete(true);
        }

        if (user && user_permissions.indexOf("publications.edit") > -1) {
            setCanEdit(true)
        }
    }, [user, user_permissions, navigate]);

    const deleteFn = async (id: number | string) => {
        const response = Api.delete('/publications/' + id, {
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

    const post = async (url : string, data: any, headers : {}) => {
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: 'POST',
            headers : headers,
            body : data
        });

        const dataResponse = await response.json();

        return {
            statusCode: response.status,
            data: dataResponse.data
        }
    } 

    const getById = async (id : number | string) => {
        const response = await Api.get(getEndpoint + '/get/' + id + '?include=tags,cover,file', {
            Authorization: 'Bearer ' + token,
            accept: 'application/json'
        })

        const result = await response.data
        return result || null
    }

    useEffect(() => { if(!id) fetchData(); },[])
    return { data, post, getById, user, deleteFn, loading, error, canDelete, canEdit }
}

import { Api } from "@/services/Api";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ProjectItem } from "./useProjectsColumns";

export const useProjects = (getEndpoint: string) => {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const user_permissions: string[] = user?.all_permissions || [];


    const [error, setError] = useState<boolean>(false);
    const [data, setData] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [canDelete, setCanDelete] = useState<boolean>(true);
    const fetchData = async () => {
        const response = await Api.get(getEndpoint, {
            Authorization: 'Bearer ' + token,
            accept: 'application/json'
        })
        const result: ProjectItem[] = await response.data
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
        if (!user || user_permissions.indexOf("projects.get") === -1) {
            // navigate(-1);
        }

        if (user && user_permissions.indexOf("projects.destroy") > -1) {
            setCanDelete(true);
        }

        if (user && user_permissions.indexOf("projects.edit") > -1) {
            setCanEdit(true)
        }
    }, [user, user_permissions, navigate]);

    const deleteFn = async (id: number | string) => {
        const response = Api.delete('/projects/' + id, {
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
    return { data, user, deleteFn, loading, error, canEdit, canDelete }
}

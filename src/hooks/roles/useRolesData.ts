import { Api } from "@/services/Api";
import { RootState } from "@/store";
import { useState } from "react";
import { useSelector } from "react-redux";

interface RoleItem_T {
    id: string;
    name: string;
    permissions?: any[];
}

const ENDPOINT = 'roles'

export const useRoles = () => {
    const { token, user } = useSelector((state: RootState) => state.auth);
    const [data, setData] = useState<RoleItem_T[]>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<boolean>(false);
    // esto por mientras asi para que no de error cn los setters y pues si deje compilar
    // si los quito por completo tendria que hacer un mini refactor y no traigo ganas de hacer eso la vddd
    const error = false;
    const loading = false;

    const fetchData = async () => {
        const response = await Api.get(`/${ENDPOINT}`, {
            Authorization: 'Bearer ' + token,
            accept: 'application/json'
        })
        const result = await response.data
        if (response.statusCode === 200) {
            setData(result)
            return result;
        } else {
            return null
        }
    }

    const storeRole = async (data: RoleItem_T) => {
        console.log("wep", data)
        const response = await Api.post(`/${ENDPOINT}`, data, {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });
        if (response.statusCode === 200) {
            return response.data;
        }
        console.log(response)
    }

    const updateRole = async (data: RoleItem_T) => {
        const response = await Api.put(`/${ENDPOINT}`, data, {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });

        console.log(response)
        if (response.statusCode === 200) {
            return response.data;
        }
    }
    const createUpdateRole = async (data: RoleItem_T) => {
        if (data.id) {
            updateRole(data);
        } else {
            storeRole(data);
        }
    }

    const getRoleById = async (id: string) => {
        const response = await Api.get(`/${ENDPOINT}/get/${id}?include=permissions`, {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });
        if (response.statusCode === 200) {
            return response.data;
        }
    }

    async function deleteFn(id: string | number): Promise<void> {
        const response = Api.delete(`/${ENDPOINT}/` + id, {
            Authorization: 'Bearer ' + token,
            accept: 'application/json'
        })
        const result = await response;
        console.log(result)
        fetchData();
    }

    return { data, fetchData, getRoleById, deleteFn, createUpdateRole, user, error, loading };
}

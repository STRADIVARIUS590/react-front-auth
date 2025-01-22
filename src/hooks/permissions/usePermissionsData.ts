import { Api } from "@/services/Api";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const ENDPOINT = 'permissions'

export default function usePermissions() {
    const { token } = useSelector((state: RootState) => state.auth);

    const getPermissions = async () => {
        const response = await Api.get(`/${ENDPOINT}`, {
            Authorization: 'Bearer ' + token,
            accept: 'application/json'
        })
        const result = await response.data
        if (response.statusCode === 200) {
            return result;
        } else {
            return null
        }
    }


    // const storePermissions = async (data: any) => {
    //     const response = await Api.get(`/${ENDPOINT}`, {
    //         Authorization: 'Bearer ' + token,
    //         accept: 'application/json'
    //     })
    //     const result = await response.data
    //     if (response.statusCode === 200) {
    //         return result;
    //     } else {
    //         return null
    //     }
    // }

    return { getPermissions }
}

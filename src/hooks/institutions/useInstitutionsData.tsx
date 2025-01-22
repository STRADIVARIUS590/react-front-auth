import { Api } from "@/services/Api";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export interface InstitutionItem {
    id : string;
    name: string;
}
// export interface 
const ENDPOINT = 'institutions';
export const useInstitutions = () => { 

    const { token } = useSelector((state: RootState) => state.auth);
    const fetchData = async () => {
        const response = await Api.get(`/${ENDPOINT}`, {
            Authorization: 'Bearer ' + token,
            accept: 'application/json'
        })
        const result = await response.data
        if (response.statusCode === 200) {
            return result;
        } else {
            return [];
        }
    }

    return {
        fetchData
    }
}
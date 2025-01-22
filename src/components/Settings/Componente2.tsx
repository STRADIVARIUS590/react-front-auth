import { UserContext } from "./SettingsPage"
import { useContext } from "react";

export const Componente2 = ( ) => {
    const user = useContext(UserContext);
    return <p>Componente 2 +   {JSON.stringify(user.set)}
    </p>

}
import { UserContext } from "./SettingsPage";

export const Componente = () => {

    // const context = useContext(UserContext);
    
    return<div>

    <UserContext.Consumer>
        {({val, set}) => (
            <h1>{set}  {val} </h1>
        )}
    </UserContext.Consumer>
        </div>

}
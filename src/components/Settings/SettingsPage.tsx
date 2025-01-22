import { createContext, useEffect, useReducer, useRef } from "react";
import { Componente } from "./Componente";
import { Componente2 } from "./Componente2";

interface ContextInterface {
    val?: number | null | undefined;
    set?: string | null | undefined;
    filters?: { user_id?: string | null | undefined | number };
}

export const UserContext = createContext<ContextInterface>({});

export const SettingsPage = () => {
    // context
    let user: ContextInterface = { val: 213, set: "wetro", filters: { user_id: 12 } };
    
    // ref
    const count = useRef(0);
    useEffect(() => {
        count.current = count.current + 1;
    });

    interface Item {
        name: string;
    }

    // initial state
    const initial: Item[] = [
        { name: "jeol" },
        { name: "sjn" },
    ];

    // action types
    type Actions =
        | { type: "ADD_TO_CART"; payload: Item}
        | { type: "REMOVE_FROM_CART"; payload: Item }
        | { type: "CHANGE_CART_QTY"; payload: Item };

    // reducer
    const reducer = (state: Item[], action: Actions): Item[] => {
        switch (action.type) {
            case "ADD_TO_CART": {
                console.log("Adding to cart");
                return [...state, { name: action.payload.name }];
            }
            case "REMOVE_FROM_CART": {
                console.log("Removing from cart");
                return state.filter((item) => item.name !== action.payload.name);
            }
            default:
                return state;
        }
    };

    // useReducer
    const [state, dispatch] = useReducer(reducer, initial);

    return (
        <div>
            {count.current}
            <UserContext.Provider value={user}>
                <Componente />
                <Componente2 />
                <ul>
                    {state.map((item, index) => (
                        <div>
                        <button onClick={() => dispatch({ type: "ADD_TO_CART", payload: item })}  key={index}>{item.name}</button>
                        <button onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item })}  key={index}>{item.name}</button>
                        </div>
                    ))}
                </ul>
            </UserContext.Provider>
        </div>
    );
};

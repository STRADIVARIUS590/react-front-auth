import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { useNavigate } from "react-router-dom"
import { ReactNode, useEffect } from "react"

type Props = {
    children: ReactNode | ReactNode[]
    type: string | undefined
}

export const Middleware = ({ children, type }: Props) => {

    const { isLogged } = useSelector((state: RootState) => state.auth)

    const navigate = useNavigate();

    useEffect(() => {

        // si es de ipo auth y no esta logueado => mandar al login
        if (type == 'auth' && !isLogged)
            navigate('/login')

        // si es de tipo guest (no logueado) y esta logueado, mandar al dashboard
        else if (type == 'guest' && isLogged) {
            navigate('/dashboard')
        }
    }, [isLogged])

    return <>{children}</>
}

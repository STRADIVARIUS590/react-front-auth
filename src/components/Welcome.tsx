import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '../store';
const Welcome = () => {

    const { isLogged } = useSelector((state: RootState) => state.auth);
    
    const navigate = useNavigate();

    if(isLogged){
        navigate("/dashboard");    
    }
    return (
            <div>
                <div className="flex justify-around">
                    <Link to='/login'>Login </Link>
                    <Link to='/register'>Register </Link>
                    <Link to='/dashboard'>Dashboard </Link>
                </div>
            </div>
    )
}
export default  Welcome
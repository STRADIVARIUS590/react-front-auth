import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

export const useLogout = () => {
    const navigate = useNavigate();
    const logout = () => {
        // Clear local storage or tokens
        localStorage.removeItem('persist:seproac-root');

        // Navigate to login
        navigate('/login', { replace: true });
    };

    return logout;
};

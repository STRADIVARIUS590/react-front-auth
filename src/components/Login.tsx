import { Formik } from "formik";
import * as Yup from "yup";
import InputLabel from "./inputs/InputLabel";
import Button from "./Buttons/Button";
import { useAppDispatch } from "../store";
import { loginUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import LoadingComponent from "./ui/loading";

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

    // const initialValues = {
    //     // email: 'sistemas@gmail.com',
    //     // password: 'secret',
    // };

    const initialValues = {
        email: '',
        password: '',
    };

    const onSubmit = (values: typeof initialValues, { setErrors }: any) => {
        setLoading(true);
        dispatch(loginUser(values)).then((response) => {
            setLoading(false);
            if (response.type === 'auth/loginUser/fulfilled' && response.payload.id) {
                navigate('/dashboard');
            } else {
                const errors = { email: "Credenciales Incorrectas" }; // Example error
                setErrors(errors);
                setFormErrors(errors); // Store the errors for re-render
            }
        });
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Correo inválido').required('Requerido'),
        password: Yup.string().required('Requerido'),
    });

    if (loading) {
        return <LoadingComponent />;
    }

    return (
        <div className="w-full h-screen bg-left-top-radial flex justify-center flex-col content-center items-center">
            <div className="w-full my-auto flex flex-col items-center content-center">
                <img src="./logohd-gm.png" alt="Logo" className="w-[325px] h-auto" />
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                    }) => (
                        <form
                            onSubmit={handleSubmit}
                            className="font-sans text-violet-50 flex flex-col w-full p-4 space-y-2 md:p-24 md:w-3/4 xl:w-1/3 rounded-xl md:shadow-2xl md:ring-4 m-4 mb-auto"
                        >
                            <InputLabel
                                label="Correo electrónico"
                                name="email"
                                type="email"
                                error={errors.email || formErrors.email} // Combine errors from Formik and state
                                value={values.email}
                                onChange={handleChange}
                            />
                            <InputLabel
                                label="Contraseña"
                                name="password"
                                type="password"
                                error={errors.password || formErrors.password} // Combine errors from Formik and state
                                value={values.password}
                                onChange={handleChange}
                            />
                            <Link
                                to="/send-reset-token"
                                className="text-left text-xs opacity-85 hover:opacity-100"
                            >
                                ¿Olvidaste tu contraseña? Ni modo.
                            </Link>
                            <Button
                                value="Entrar"
                                type="submit"
                                className="rounded-full bg-vi-50 text-vi-900 font-bold py-2 px-4 hover:bg-vi-400 hover:text-white w-full md:w-1/2 mx-auto"
                            />
                        </form>
                    )}
                </Formik>
            </div>
            <footer className="bg-vi-50 h-1/6 w-full rounded-t-[70px] flex justify-center items-center">
                <img src="./dasclogo.png" alt="Footer Logo" className="h-24" />
            </footer>
        </div>
    );
};

export default Login;

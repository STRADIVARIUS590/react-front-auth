import { useState } from "react";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import InputLabel from "./inputs/InputLabel";
import Button from "./Buttons/Button";
import { Link } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const { token } = useParams();
    const [isPasswordReset, setIsPasswordReset] = useState(false);

    const initialValues = {
        password: "",
        confirmPassword: "",
    };

    const onSubmit = (values: typeof initialValues) => {
        if (!token) {
            console.error("Token no encontrado en la URL");
            return;
        }

        const resetPasswordUrl = `${import.meta.env.VITE_API_URL}/password/reset`;

        axios
            .post(resetPasswordUrl, {
                password: values.password,
                token, 
            })
            .then(() => {
                console.log("Contraseña cambiada correctamente");
                setIsPasswordReset(true);
            })
            .catch((error) => {
                console.error("Error al cambiar la contraseña", error);
            });
    };

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .required("Requerido"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
            .required("Requerido"),
    });

    return (
        <div className="w-full h-screen bg-left-top-radial flex justify-center flex-col content-center items-center">
            <div className="w-full my-auto flex flex-col items-center content-center">
                <img src="/logohd-gm.png" alt="Logo" className="w-[325px] h-auto mb-8" />
                {!isPasswordReset ? (
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        {({ handleSubmit, handleChange, values, errors }) => (
                            <form
                                onSubmit={handleSubmit}
                                className="font-sans text-violet-50 flex flex-col w-full p-4 space-y-2 md:p-24 md:w-3/4 xl:w-1/3 rounded-xl md:shadow-2xl md:ring-4 m-4 mb-auto space-y-6"
                            >
                                <InputLabel
                                    label="Nueva Contraseña"
                                    name="password"
                                    type="password"
                                    error={errors.password}
                                    value={values.password}
                                    onChange={handleChange}
                                />
                                <InputLabel
                                    label="Confirmar Contraseña"
                                    name="confirmPassword"
                                    type="password"
                                    error={errors.confirmPassword}
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                />
                                <Button
                                    value="Confirmar Contraseña"
                                    type="submit"
                                    className="rounded-full bg-vi-50 text-vi-900 font-bold py-2 px-4 hover:bg-vi-100 hover:text-vi-900 w-full mx-auto"
                                />
                                <Link
                                    to="/login"
                                    className="text-left text-xs opacity-85 hover:opacity-100 mt-4 flex justify-center"
                                >
                                    Regresar al login
                                </Link>
                            </form>
                        )}
                    </Formik>
                ) : (
                    <div className="text-center text-violet-50 space-y-6 p-6 md:p-8 bg-vi-900/50 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold">¡Contraseña cambiada!</h2>
                        <p className="text-lg">
                            Tu contraseña ha sido cambiada correctamente. Ahora puedes usarla para iniciar sesión.
                        </p>
                        <br></br>
                        
                        
                        <Link
                            to="/login"
                            className="text-violet-900 bg-violet-50 py-2 px-6 rounded-full font-bold hover:bg-violet-100 hover:text-violet-900 transition duration-200"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>
                )}
            </div>
            <footer className="bg-vi-50 h-1/6 w-full rounded-t-[70px] flex justify-center items-center mt-8">
                <img src="/dasclogo.png" alt="Logo Footer" className="h-24" />
            </footer>
        </div>
    );
};

export default ResetPassword;

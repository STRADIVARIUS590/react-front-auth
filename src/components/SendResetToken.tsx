import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import InputLabel from "./inputs/InputLabel";
import Button from "./Buttons/Button";
import { Link } from "react-router-dom";
import axios from "axios";

const SendResetToken = () => {
    const [isTokenSent, setIsTokenSent] = useState(false);
    const initialValues = {
        email: "",
    };

    const resetPasswordUrl = `${import.meta.env.VITE_API_URL}/password/send-token`;

    const onSubmit = (values: typeof initialValues) => {
        axios
            .post(resetPasswordUrl, { email: values.email })
            .then(() => {
                console.log("Correo de restablecimiento enviado");
                setIsTokenSent(true);
            })
            .catch((error) => {
                console.error("Error al enviar el correo de restablecimiento", error);
            });
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Correo no válido").required("Requerido"),
    });

    return (
        <div className="w-full h-screen bg-left-top-radial flex justify-center flex-col content-center items-center">
            <div className="w-full my-auto flex flex-col items-center content-center">
                <img src="./logohd-gm.png" alt="Logo" className="w-[325px] h-auto mb-8" />
                {!isTokenSent ? (
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        {({ handleSubmit, handleChange, values, errors }) => (
                            <form
                                onSubmit={handleSubmit}
                                className="font-sans text-violet-50 flex flex-col w-full p-4 space-y-2 md:p-24 md:w-3/4 xl:w-1/3 rounded-xl md:shadow-2xl md:ring-4 m-4 mb-auto space-y-6"
                            >
                                <InputLabel
                                    label="Correo electrónico"
                                    name="email"
                                    type="email"
                                    error={errors.email}
                                    value={values.email}
                                    onChange={handleChange}
                                />

                                <Button
                                    value="Enviar Código"
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
                        <h2 className="text-2xl font-bold">¡Código enviado!</h2>
                        <p className="text-lg">
                            Revisa tu correo electrónico para obtener el código de verificación.
                        </p>
                        <p></p>
                        <p></p>
                        <p></p>
                        
                        <Link
                            to="/login"
                            className="text-sm opacity-85 hover:opacity-100 block mt-4"
                        >
                            Regresar al login
                        </Link>
                    </div>
                )}
            </div>
            <footer className="bg-vi-50 h-1/6 w-full rounded-t-[70px] flex justify-center items-center mt-8">
                <img src="./dasclogo.png" alt="Logo Footer" className="h-24" />
            </footer>
        </div>
    );
};

export default SendResetToken;

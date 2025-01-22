import { Formik, FormikHelpers } from "formik"
import * as Yup from "yup"
import InputLabel from "./inputs/InputLabel"
import Button from "./Buttons/Button"
import { registerUSer } from "../store/authSlice"
import { RootState, useAppDispatch } from "../store"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"

const Register = () => {
    const initialValues = {
        name: 'test',
        email: "email@example.com",
        date_ingreso: (new Date).toISOString(),
        birth_date: new Date,
        sex: "M",
        password: "secret",
        password_confirmation: "secret",
    }

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const  { isLogged } = useSelector((state: RootState ) => state.auth);

    useEffect(() => {
        if(isLogged){
            navigate('/dashboard');
        }
    }, [isLogged])

    const onSubmit = (values: typeof initialValues, { setFieldError } : FormikHelpers< typeof initialValues > ) => {


        dispatch(registerUSer(values)).then((response) => {
            console.log(response);
            if(response.type == 'auth/registerUser/fulfilled'){
                navigate('/dashboard');
            }else{
                const errors = response.payload as { [key: string]: string[] };
                
                Object.entries(errors).forEach(([field, messages]) => {
                    setFieldError(field, messages[0]);
                });    
                
            }
        });

    }


    const validationSchema = Yup.object({
        name: Yup.string().min(3, 'El nombre debe tener al menos 3 letras').required("EL nombre es requerido"),
        email: Yup.string(),
        // .email('El correo es invalid'),
        password: Yup.string()
            .min(5, 'la contraseña debe tener minio 5 caracteres')
            .max(10, 'la contraseña debe maximo 10 caracteres')
            .required('La contraseña es requerida'),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref('password')], 'LAs contraseñas no coinciden'). required('la conformacion de contraseña es requirida')
    })

    return (
        <div>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                
                {({
                    values,
                    errors,
                    // touched,
                    handleChange,
                    // handleBlur,
                    handleSubmit,
                    // isSubmitting
                }) => (
                <form onSubmit={handleSubmit} action="">
                    {/* {JSON.stringify(errors)} */}
                    <InputLabel
                        label="Nombre"
                        name="name"
                        placeholder="Escribe tu nombre"
                        error={errors.name}
                        onChange={handleChange}
                        value={values.name}
                        />
                    <InputLabel 
                        label="Correo" 
                        name="email" 
                        placeholder="Escrible tu correo" 
                        type="text"
                        error={errors.email}    
                        onChange={handleChange}
                        value={values.email}
                        />

                    <InputLabel
                        label="Contraseña"
                        name="password"
                        placeholder="Escribe tu contraseña"
                        error={errors.password}
                        onChange={handleChange}
                        value={values.password}
                        />
                  
                    <InputLabel
                        label="Confirma tu Contraseña"
                        name="password_confirmation"
                        placeholder="Confirma tu contraseña"
                        type="password"
                        error={errors.password_confirmation}
                        onChange={handleChange}
                        value={values.password_confirmation}
                    />

                    <Button value="Enviar!" type="submit"/>


                    {/* <label htmlFor="nombre">Nombre</label> */}
                    {/* <input type="text" name="nombre"/> */}


                    {/* <small className="text-red-500"> error </small> */}
                    {/* <input type="submit" value="Enviar!!"/> */}
                </form>
                    )}
                {/* <form className="w-full max-lg">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-2 mb-6">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                            First Name
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane"/>
                        <p className="text-red-500 text-xs italic">Please fill out this field.</p>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                            Last Name
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe"/>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                            Password
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************"/>
                        <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                            City
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Albuquerque"/>
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                            State
                        </label>
                        <div className="relative">
                            <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                            <option>New Mexico</option>
                            <option>Missouri</option>
                            <option>Texas</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
                            Zip
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="90210"/>
                        </div>
                    </div>
                    </form> */}
            </Formik>
        </div>
    )
}

export default Register
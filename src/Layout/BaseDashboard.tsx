import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { useEffect, useState } from "react";
import { Api } from "../services/Api";
import { MessageToast } from "../components/MessageToast";


interface Data {
    academic_grades : {
        id: string | number;
        name : string;
        titulation_date : string;
        institution: {
            id: string | number;
            name: string,
            titulation_date: string
        }
    }[],
    production : {
        publications: {
            count: number;
            tags: {id: string, name: string, publications_count : number}[]
        },
        courses: {
            count: number;
            tags: {id: string, name: string, courses_count : number}[]
        },
        projects: {
            count: number;
            tags: {id: string, name: string, projects_count : number}[]
        },
        congresses: {
            count: number;
            tags: {id: string, name: string, congresses_count : number}[]
        }
    }
 }

 const BaseDashBoard = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const [data, setData] = useState<Data | null>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const fetchData = async () => {
        try {
            const response = await Api.get("/dashboard", {
                Authorization: "Bearer " + token,
                accept: "application/json",
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    if (error) {
        return <MessageToast message="Ha ocurrido un error" type="error" />;
    }
    if (loading) {
        return <MessageToast message="Cargando..." type="loading" />;
    }

    const cards = [
        {
            title: "Producción Académica",
            values: [
                { label: "Artículos", value: data?.production?.projects?.tags[0]?.projects_count ?? 0 },
                { label: "Libros", value: data?.production?.projects?.tags[1]?.projects_count ?? 0 },
                { label: "Capítulos", value: data?.production?.projects?.tags[2]?.projects_count ?? 0 },
            ],
        },
        {
            title: "Proyectos de Investigación",
            values: [
                { label: "Interno", value: data?.production?.projects?.tags[0]?.projects_count ?? 0 },
                { label: "Externo", value: data?.production?.projects?.tags[1]?.projects_count ?? 0 },
            ],
        },
        {
            title: "Cursos Impartidos",
            values: [
                { label: "Licenciatura", value: data?.production?.courses?.tags[0]?.courses_count ?? 0 },
                { label: "Maestría", value: data?.production?.courses?.tags[1]?.courses_count ?? 0 },
                { label: "Doctorado", value: data?.production?.courses?.tags[2]?.courses_count ?? 0 },
            ],
        },
        {
            title: "Participación en Congresos",
            values: [
                { label: "Nacionales", value: data?.production?.congresses?.tags[0]?.congresses_count ?? 0 },
                { label: "Internacionales", value: data?.production?.congresses?.tags[1]?.congresses_count ?? 0 },
            ],
        },
        {
            title: "Trabajos de Titulación",
            values: [
                { label: "Licenciatura", value: data?.production?.publications?.tags[0]?.publications_count ?? 0 },
                { label: "Maestría", value: data?.production?.publications?.tags[1]?.publications_count ?? 0 },
                { label: "Doctorado", value: data?.production?.publications?.tags[2]?.publications_count ?? 0 },
            ],
        },
    ];
    return (
        <div className="bg-[#f2f2f2] p-10 rounded-lg flex flex-wrap justify-center gap-6 max-w-full w-full">
            {/* Trayectoria academica */}
            <div className="bg-white shadow-lg rounded-3xl p-6 sm:w-80 md:w-80 lg:w-80 xl:w-72">
                <div className="text-center text-3xl font-bold text-[#2a2d77] border-b-2 arial font-sans border-red-500 pb-6 mb-6">
                    Trayectoria Académica
                </div>
                {data?.academic_grades.map((item) => (
                    
                    <div className="mb-4">
                    <p className="text-[#2a2d77] font-bold text-lg mb-1">{item.name}</p>
                    <p className="text-[#ba0d0d] text-sm mb-1">{item.titulation_date}</p>
                    <p className="text-gray-600 text-sm">{item.institution.name}</p>
                    </div> 
                ))}
                {/* <div className="mb-4">
                    <p className="text-[#2a2d77] font-bold text-lg mb-1">Doctorado en Proyectos</p>
                    <p className="text-[#ba0d0d] text-sm mb-1">Doctorado - 31 mayo 2021</p>
                    <p className="text-gray-600 text-sm">Universidad Internacional Iberoamericana</p>
                </div>
                <div className="mb-4">
                    <p className="text-[#2a2d77] font-bold text-lg mb-1">Maestría en Sistemas Computacionales</p>
                    <p className="text-[#ba0d0d] text-sm mb-1">Maestría - 16 marzo 2005</p>
                    <p className="text-gray-600 text-sm">Instituto Tecnológico de La Paz</p>
                </div>
                <div className="mb-4">
                    <p className="text-[#2a2d77] font-bold text-lg mb-1">Ingeniería en Sistemas Computacionales</p>
                    <p className="text-[#ba0d0d] text-sm mb-1">Licenciatura - 01 agosto 1996</p>
                    <p className="text-gray-600 text-sm">Instituto Tecnológico de La Paz</p>
                </div> */}
            </div>
    
            {/* Tarjetas dinámicas */}
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white shadow-lg rounded-3xl p-6 sm:w-80 md:w-80 lg:w-80 xl:w-72"
                >
                    {/* Título */}
                    <div className="text-center text-3xl font-bold text-[#2a2d77] border-b-2 arial font-sans border-red-500 pb-6 mb-6">
                        {card.title}
                    </div>
    
                    {/* Contenido */}
                    {card.values.map((value, i) => (
                        <div key={i} className="mb-4">
                            <div className="bg-[#eeeaf2] rounded-3xl px-4 py-4 text-center">
                                <p className="text-[#2a2d77] font-semibold text-center mt-2">{value.label}</p>
                                <p className="text-5xl font-normal text-[#2a2d77]">{value.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
    
    
    
    
    
    
};

export default BaseDashBoard;

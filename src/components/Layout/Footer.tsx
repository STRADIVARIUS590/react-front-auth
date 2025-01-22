import { RootState } from "@/store";
import { useSelector } from "react-redux";

export const Footer = () => {
    const  { user } = useSelector((state: RootState ) => state.auth);

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f2f2f2", padding: "20px" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "90%",
                    maxWidth: "1200px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                }}
            >
            
                <div
                    style={{
                        backgroundColor: "#180c5c",
                        color: "white",
                        fontWeight: "bold",
                        padding: "28px 20px",
                        fontSize: "25px",
                        textAlign: "center",
                        flexBasis: "30%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    Tus datos:
                </div>

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        color: "#180c5c",
                        padding: "10px 20px",
                        flexBasis: "70%",
                        fontSize: "16px",
                    }}
                >
                    <p><strong>Profesor:</strong> tiempo completo definitivo</p>
                    <p><strong>Tipo de contratación:</strong> {user?.contratation_type} </p>
                    <p><strong>Categoría:</strong> {user?.category}</p>
                </div>
            </div>

            <div style={{ marginLeft: "20px" }}>
                <img src="/dasclogo.png" alt="Logo" style={{ height: "60px" }} />
            </div>
        </div>
    );
};

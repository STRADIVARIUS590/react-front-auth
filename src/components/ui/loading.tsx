import { useState } from 'react';

const LoadingComponent = () => {
    const [loading ] = useState(true); // State to track loading

    // useEffect(() => {
    //     // Simulate a data fetch
    //     const timer = setTimeout(() => {
    //         setLoading(false);
    //     }, 3000); // 3-second delay

    //     return () => clearTimeout(timer); // Cleanup the timer
    // }, []);
    
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {loading ? (
                <div>
                    <div 
                        style={{
                            margin: '0 auto',
                            width: '50px',
                            height: '50px',
                            border: '5px solid lightgray',
                            borderTop: '5px solid blue',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}
                    ></div>
                    <p style={{ fontSize: '20px', marginTop: '10px' }}>Cargando...</p>
                
                </div>
            ) : (
                <p style={{ fontSize: '20px' }}>Data loaded!</p>
            )}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default LoadingComponent;

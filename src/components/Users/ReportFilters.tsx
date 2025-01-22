import { Api } from "@/services/Api";
import { RootState } from "@/store";
import { useState } from "react";
import { useSelector } from "react-redux";

export const ButtonFilters = () => {
    const { token } = useSelector((state: RootState) => state.auth);

    const [ startDate, setStartDate ] = useState<string | null>();
    const [ endDate, setEndDate ] = useState<string | null>();

    const handleDownload = async ({ format, startDate, endDate }: { format: string, startDate?: string | null, endDate?: string | null }) => {
        var endpoint = Api.baseUrl + '/reports?type=users&format=' + format;

        if(startDate){
            endpoint += `&start_date=${startDate}`;
        }

        if(endDate) {
            endpoint += `&end_date=${endDate}`;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': format === 'xlsx'
                        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        : format === 'pdf'
                        ? 'application/pdf'
                        : format === 'xml'
                        ? 'application/xml'
                        : format === 'txt'
                        ? 'text/plain'
                        : 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch the ${format} file`);
            }

            const headers = response.headers;
            console.log('Response headers:', headers);
            
            const disposition = headers.get('Content-Disposition') || headers.get('content-disposition');
            let filename = `report.${format}`; 

            if (disposition) {
                const matches = /filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/.exec(disposition);
                if (matches && matches[1]) {
                    filename = matches[1].trim();
                }
            }

            const blob = await response.blob();
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            link.download = filename;  

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(`Error downloading the ${format} file:`, error);
        }
    };

    const svgIcons = {
        xlsx: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M19 2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h8c.55 0 1-.45 1-1s-.45-1-1-1H8V4h11v5c0 .55.45 1 1 1s1-.45 1-1V4c0-1.1-.9-2-2-2z" />
                <path d="M16 13.41L14.59 12 10 16.59 5.41 12 4 13.41 10 19.41 16 13.41z" />
            </svg>
        ),
        txt: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                <path d="M8 14h8v2H8zm0-4h8v2H8z" />
            </svg>
        ),
        json: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M16 3H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V8l-5-5zm4 16H5V5h10v4h4v10z" />
                <path d="M10 14h4v2h-4zm0-4h4v2h-4z" />
            </svg>
        ),
        xml: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M6 2h9l6 6v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm6 13l3.5-5h-7L12 9l-3.5 5h7L12 17z" />
            </svg>
        ),
        pdf: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M17.7 2.3a1 1 0 0 0-1.4 0L12 6.6 7.7 2.3a1 1 0 0 0-1.4 1.4L10.6 8 3.3 15.3a1 1 0 0 0 1.4 1.4L12 9.4l5.3 7.3a1 1 0 0 0 1.4-1.4L13.4 8l6.3-7.3a1 1 0 0 0 0-1.4z" />
            </svg>
        ),
    };

    const buttonConfig = [
        { format: 'xlsx', color: '#217346', icon: svgIcons.xlsx, label: 'XLSX' },
        { format: 'txt', color: '#4A4A4A', icon: svgIcons.txt, label: 'TXT' },
        { format: 'json', color: '#F7A41D', icon: svgIcons.json, label: 'JSON' },
        { format: 'xml', color: '#005B96', icon: svgIcons.xml, label: 'XML' },
        { format: 'pdf', color: '#D32F2F', icon: svgIcons.pdf, label: 'PDF' },
    ];

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap', 
                gap: '10px',
                padding: '20px',
                justifyContent: 'space-between', 
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '250px', width: '100%' }}>
                <label htmlFor="start_date" style={{ fontSize: '14px', color: '#333' }}>Fecha de inicio</label>
                <input 
                    id="start_date" 
                    type="date" 
                    value={startDate || ''}
                    onChange={(e) => setStartDate(e.target.value)} 
                    style={{
                        padding: '10px',
                        fontSize: '14px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        backgroundColor: '#f9f9f9',
                        width: '100%',
                        maxWidth: '250px',
                    }} 
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '250px', width: '100%' }}>
                <label htmlFor="end_date" style={{ fontSize: '14px', color: '#333' }}>Fecha de Fin</label>
                <input 
                    id="end_date" 
                    type="date" 
                    value={endDate || ''} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    style={{
                        padding: '10px',
                        fontSize: '14px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        backgroundColor: '#f9f9f9',
                        width: '100%',
                        maxWidth: '250px',
                    }} 
                />
            </div>

            {buttonConfig.map(({ format, color, icon, label }) => (
                <button
                    key={format}
                    onClick={() => handleDownload({ format, startDate, endDate })}
                    style={{
                        backgroundColor: color,
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        minWidth: '120px',
                        textAlign: 'center',
                    }}
                >
                    {icon}
                    {label}
                </button>
            ))}
        </div>
    );
};

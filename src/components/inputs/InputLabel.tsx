type Props = {
    label: string,
    name: string,
    placeholder?: string,
    id?: string,
    error?: string,
    type?: 'text' | 'email' | 'password' | 'date' | 'select',
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | number
}

const InputLabel = ({ label, name, placeholder, id, error, type, onChange, value }: Props) => {
    return (
        <div className="flex flex-col">
            <label className="text-left font-bold" htmlFor={id}>{label}</label>
            <input
                className="rounded-xl bg-[#726C93] text-vi-50 outline-none focus:ring-2 focus:ring-vi-500 focus:border-vi-500"
                type={type ?? 'text'}
                name={name}
                id={id}
                onChange={onChange}
                placeholder={placeholder}
                value={value}
            />
            {
                error && <small className="text-red-500"> {error} </small>
            }
        </div>
    )
}

export default InputLabel

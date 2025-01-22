type Props = {
    value: string,
    type?: "submit" | "button",
    className?: string
    onClick?: () => void,
    disabled? : boolean
    
}
const Button = ({ value, type, className, onClick, disabled }: Props) => {
    return (
        <button
            type={type ?? 'button'}
            className={className}
            disabled={disabled}
            onClick={onClick}
        >
            {value}
        </button>
    )
}

export default Button;

export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex items-center px-6 py-3 bg-[#0056A4] border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
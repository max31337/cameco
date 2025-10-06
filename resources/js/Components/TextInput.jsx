export default function TextInput({ className = '', isFocused = false, ...props }) {
    const inputRef = (input) => {
        if (input && isFocused) {
            input.focus();
        }
    };

    return (
        <input
            {...props}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all border-gray-300 placeholder-gray-400 ${className}`}
            ref={inputRef}
        />
    );
}
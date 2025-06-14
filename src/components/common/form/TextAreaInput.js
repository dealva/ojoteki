
const TextareaInput = ({ label, name, value, onChange, required = false }) => {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none"
        />
      </div>
    );
  };
  
  export default TextareaInput;
  
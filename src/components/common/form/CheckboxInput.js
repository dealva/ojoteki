// components/form/CheckboxInput.js
export default function CheckboxInput({ label, name, checked, onChange }) {
  return (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      {label}
    </label>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import clsx from 'clsx';

const TextInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  required = false,
  disabled = false, 
}) => {
  const [clientValue, setClientValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 🔒 default is hidden

  useEffect(() => {
    setClientValue(value || '');
  }, [value]);

  if (type === 'hidden') {
    return (
      <input
        type="hidden"
        name={name}
        id={name}
        defaultValue={clientValue}
        onChange={onChange}
      />
    );
  }

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const isActive = isFocused || clientValue;

  return (
    <div className="relative mt-6">
      <label
        htmlFor={name}
        className={clsx(
          'absolute left-2 text-sm transition-all duration-200 bg-white px-1',
          isActive
            ? '-top-2 text-xs text-[#C24B4B]'
            : 'top-3 text-gray-500'
        )}
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          name={name}
          id={name}
          value={clientValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            setClientValue(e.target.value);
            onChange?.(e);
          }}
          required={required}
          disabled={disabled} 
          className={clsx(
            'w-full border-b bg-transparent px-2 pb-1 pt-4 focus:outline-none transition-colors duration-200',
            isActive ? 'border-[#C24B4B]' : 'border-gray-300',
            disabled ? 'text-gray-400 cursor-not-allowed' : 'text-black cursor-text'
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C24B4B] focus:outline-none cursor-pointer"
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            disabled={disabled} 
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default TextInput;

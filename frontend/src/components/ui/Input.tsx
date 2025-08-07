import React from 'react';

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
  error?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  multiline = false,
  rows = 4,
  className = '',
  error,
  disabled = false
}) => {
  const inputClasses = `w-full px-4 py-3 text-base border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none touch-manipulation transition-colors ${
    error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
  } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          disabled={disabled}
          className={inputClasses}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
        />
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
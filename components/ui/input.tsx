import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-4 py-3 border rounded-xl text-sm placeholder-gray-400 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
        border-gray-300 transition ${error ? 'border-red-500' : ''} ${className}`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

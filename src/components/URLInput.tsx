"use client";

import { useState } from "react";

interface URLInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
}

export function URLInput({ label, placeholder, value, onChange, optional }: URLInputProps) {
  const [touched, setTouched] = useState(false);

  const isValid = !value || value.startsWith("http://") || value.startsWith("https://") || value.startsWith("github.com") || value.startsWith("linkedin.com");

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {optional && <span className="ml-1 text-gray-500 font-normal">(optional)</span>}
      </label>
      <input
        type="url"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all text-sm ${
          touched && !isValid
            ? "border-red-500 focus:ring-red-500/30"
            : "border-gray-700 focus:ring-indigo-500/30 focus:border-indigo-500"
        }`}
      />
      {touched && !isValid && (
        <p className="text-xs text-red-400">Please enter a valid URL</p>
      )}
    </div>
  );
}

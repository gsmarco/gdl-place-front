import React from "react";

interface TextInputProps {
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

import React from "react";

const InputField = ({ type, name, value, onChange, onBlur, placeholder, icon: Icon, error }) => {
  return (
    <div className="w-full max-w-sm md:w-64 relative">
      <div className={`relative bg-gray-100 p-2 flex items-center rounded-md transition-all duration-300 ${error ? "border-2 border-red-500" : "focus-within:ring-2 focus-within:ring-zinc-800"}`}>
        {Icon && <Icon className="text-zinc-500 m-2" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="bg-gray-100 outline-none text-sm flex-1 text-black placeholder-transparent peer"
          placeholder=" "
        />
        <label className="absolute left-10 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-gray-100 px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-gray-500">
          {placeholder}
        </label>
      </div>
      {error && <p className="text-red-500 text-xs text-left mt-1">{error}</p>}
    </div>
  );
};

export default InputField;

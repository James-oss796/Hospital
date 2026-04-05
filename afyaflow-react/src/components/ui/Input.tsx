import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  prefix, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant px-1 block">
          {label}
        </label>
      )}
      <div className="flex">
        {prefix && (
          <span className="bg-surface-container-high rounded-l-xl px-4 py-4 text-sm font-bold border-r border-outline-variant/20">
            {prefix}
          </span>
        )}
        <input 
          className={`
            w-full 
            bg-surface-container-highest 
            border-none 
            ${prefix ? 'rounded-r-xl' : 'rounded-xl'} 
            px-4 
            py-4 
            text-sm 
            focus:ring-2 
            focus:ring-primary/40 
            transition-all 
            placeholder:text-outline/50
          `}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;

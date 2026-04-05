import React from 'react';

interface SignatureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'clear';
  fullWidth?: boolean;
  className?: string;
  icon?: string;
}

const SignatureButton: React.FC<SignatureButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "signature-gradient text-white shadow-lg shadow-primary/20 hover:opacity-90",
    secondary: "bg-surface-container-high text-primary hover:bg-surface-container-highest",
    clear: "bg-surface-container-highest text-on-surface hover:bg-surface-variant",
  };

  const widthStyle = fullWidth ? "w-full" : "px-8";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`} 
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
      {children}
    </button>
  );
};

export default SignatureButton;

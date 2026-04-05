import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'lowest' | 'low' | 'high' | 'highest';
  noPadding?: boolean;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  children, 
  className = '', 
  variant = 'lowest',
  noPadding = false,
  onClick
}) => {
  const variantClasses = {
    lowest: 'bg-surface-container-lowest',
    low: 'bg-surface-container-low',
    high: 'bg-surface-container-high',
    highest: 'bg-surface-container-highest',
  };

  return (
    <div 
      onClick={onClick}
      className={`
      ${variantClasses[variant]} 
      rounded-xl 
      ${noPadding ? '' : 'p-8'} 
      shadow-[24px_24px_48px_-4px_rgba(24,28,28,0.05)] 
      border border-outline-variant/10
      ${className}
    `}>
      {children}
    </div>
  );
};

export default DashboardCard;

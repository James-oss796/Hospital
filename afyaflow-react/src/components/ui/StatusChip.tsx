import React from 'react';

export type ChipVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export type StatusType = 
  | 'standard' | 'urgent' | 'emergency' 
  | 'available' | 'in-surgery' | 'on-call' | 'off-duty'
  | 'queued' | 'in-progress' | 'served' | 'admitted'
  | 'upcoming' | 'completed' | 'cancelled';

interface StatusChipProps {
  label?: string;
  status?: StatusType;
  variant?: ChipVariant;
  className?: string;
  dot?: boolean;
}

const STATUS_MAP: Record<StatusType, { variant: ChipVariant; label: string }> = {
  // Patient Priority
  standard: { variant: 'success', label: 'Standard' },
  urgent: { variant: 'info', label: 'Urgent' },
  emergency: { variant: 'error', label: 'Emergency' },
  
  // Doctor Status
  available: { variant: 'success', label: 'Available' },
  'in-surgery': { variant: 'error', label: 'In Surgery' },
  'on-call': { variant: 'warning', label: 'On Call' },
  'off-duty': { variant: 'neutral', label: 'Off Duty' },
  
  // Patient Status
  queued: { variant: 'info', label: 'Queued' },
  'in-progress': { variant: 'warning', label: 'In Progress' },
  served: { variant: 'success', label: 'Served' },
  admitted: { variant: 'error', label: 'Admitted' },
  
  // Appointment Status
  upcoming: { variant: 'info', label: 'Upcoming' },
  completed: { variant: 'success', label: 'Completed' },
  cancelled: { variant: 'error', label: 'Cancelled' },
};

const StatusChip: React.FC<StatusChipProps> = ({ 
  label, 
  status,
  variant, 
  className = '', 
  dot = false 
}) => {
  const config = status ? STATUS_MAP[status] : { variant: variant || 'neutral', label: label || '' };
  const activeVariant = variant || config.variant;
  const activeLabel = label || config.label;

  const variants = {
    success: 'bg-secondary-container/50 text-secondary border border-secondary/10',
    warning: 'bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/10',
    error: 'bg-error-container text-on-error-container border border-error/10',
    info: 'bg-primary-container/20 text-primary border border-primary/10',
    neutral: 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/20',
  };

  const dotColors = {
    success: 'bg-secondary',
    warning: 'bg-tertiary',
    error: 'bg-error',
    info: 'bg-primary',
    neutral: 'bg-outline',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${variants[activeVariant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[activeVariant]}`}></span>}
      {activeLabel}
    </span>
  );
};

export default StatusChip;

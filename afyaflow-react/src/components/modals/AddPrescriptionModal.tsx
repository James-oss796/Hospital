import React, { useState } from 'react';
import DashboardCard from '../ui/DashboardCard';
import Input from '../ui/Input';
import SignatureButton from '../ui/SignatureButton';
import type { Prescription } from '../../context/DataContext';

interface AddPrescriptionModalProps {
  patientId: string;
  onClose: () => void;
  onAdd: (prescription: Omit<Prescription, 'id' | 'prescribedAt'>) => void;
  doctorName: string;
}

const AddPrescriptionModal: React.FC<AddPrescriptionModalProps> = ({ onClose, onAdd, doctorName }) => {
  const [form, setForm] = useState({
    medicineName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.medicineName || !form.dosage) return;

    onAdd({
      ...form,
      prescribedBy: doctorName
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg animate-in zoom-in-95 duration-300">
        <DashboardCard className="p-8 shadow-2xl border-outline-variant/20 bg-white">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-primary tracking-tight">Add Prescription</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Issue medications to active patient</p>
            </div>
            <button 
              onClick={onClose}
              className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Medicine Name" 
              placeholder="e.g. Amoxicillin" 
              required 
              value={form.medicineName}
              onChange={e => setForm(f => ({ ...f, medicineName: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Dosage" 
                placeholder="e.g. 500mg" 
                required 
                value={form.dosage}
                onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))}
              />
              <Input 
                label="Frequency" 
                placeholder="e.g. Twice Daily (BID)" 
                required 
                value={form.frequency}
                onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
              />
            </div>
            <Input 
              label="Duration" 
              placeholder="e.g. 7 Days" 
              required 
              value={form.duration}
              onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
            />
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest pl-1">Special Instructions</label>
              <textarea 
                className="w-full h-24 bg-surface-container-low text-on-surface text-sm font-medium px-4 py-3 rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all resize-none"
                placeholder="Optional instructions like 'Take after meals'..."
                value={form.instructions}
                onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
              />
            </div>

            <div className="pt-4 flex gap-4">
              <SignatureButton variant="clear" type="button" onClick={onClose} className="flex-1">
                Cancel
              </SignatureButton>
              <SignatureButton icon="medication" type="submit" className="flex-1">
                Add Prescription
              </SignatureButton>
            </div>
          </form>
        </DashboardCard>
      </div>
    </div>
  );
};

export default AddPrescriptionModal;

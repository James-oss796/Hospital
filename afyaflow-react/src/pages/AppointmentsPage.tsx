import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { AppointmentStatus } from '../context/DataContext';
import DashboardCard from '../components/ui/DashboardCard';
import StatusChip from '../components/ui/StatusChip';
import SignatureButton from '../components/ui/SignatureButton';

const STATUS_VARIANTS: Record<AppointmentStatus, 'success' | 'info' | 'neutral' | 'error'> = {
    upcoming: 'info',
    'in-progress': 'warning' as any,
    completed: 'success',
    cancelled: 'error',
};

const TYPE_LABELS: Record<string, string> = {
    scheduled: 'Scheduled',
    'walk-in': 'Walk-in',
    'follow-up': 'Follow-up',
};

const AppointmentsPage: React.FC = () => {
    const { appointments, patients, updateAppointmentStatus } = useData();
    const [filter, setFilter] = useState < AppointmentStatus | 'all' > ('all');
    const [search, setSearch] = useState('');
    const [showBookModal, setShowBookModal] = useState(false);

    const queue = patients.filter(p => p.status === 'queued' || p.status === 'in-progress');

    const filtered = appointments
        .filter(a => filter === 'all' || a.status === filter)
        .filter(a =>
            !search ||
            a.patientName.toLowerCase().includes(search.toLowerCase()) ||
            a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
            a.department.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.time.localeCompare(b.time));

    const counts = {
        all: appointments.length,
        upcoming: appointments.filter(a => a.status === 'upcoming').length,
        'in-progress': appointments.filter(a => a.status === 'in-progress').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-[2.5rem] font-extrabold text-primary tracking-tight leading-none mb-2">Appointments</h1>
                    <p className="text-on-surface-variant font-medium">All bookings and walk-in queue for today</p>
                </div>
                <SignatureButton icon="add" onClick={() => setShowBookModal(true)}>
                    Book Appointment
                </SignatureButton>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Left: Appointment Table */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Filter Tabs + Search */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex bg-surface-container-low rounded-2xl p-1 gap-1">
                            {(['all', 'upcoming', 'in-progress', 'completed', 'cancelled'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === tab
                                            ? 'bg-white shadow-sm text-primary'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                        }`}
                                >
                                    {tab === 'all' ? 'All' : tab.replace('-', ' ')}
                                    <span className="ml-1.5 opacity-60">({counts[tab]})</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-2xl flex-1 max-w-xs">
                            <span className="material-symbols-outlined text-outline text-sm">search</span>
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-outline"
                                placeholder="Search patient or doctor..."
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <DashboardCard noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-outline-variant/10">
                                        {['Time', 'Patient', 'Doctor', 'Department', 'Type', 'Status', ''].map((h, i) => (
                                            <th key={i} className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10">
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                                                No appointments found
                                            </td>
                                        </tr>
                                    ) : filtered.map(appt => (
                                        <tr key={appt.id} className="hover:bg-surface-container-low transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-bold text-sm text-primary">{appt.time}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-primary">
                                                        {appt.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-on-surface">{appt.patientName}</p>
                                                        {appt.notes && <p className="text-[10px] text-on-surface-variant">{appt.notes}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-on-surface-variant">{appt.doctorName}</td>
                                            <td className="px-6 py-4 text-sm text-on-surface-variant">{appt.department}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold uppercase px-2 py-1 bg-surface-container-high rounded text-on-surface-variant">
                                                    {TYPE_LABELS[appt.type]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusChip
                                                    label={appt.status.replace('-', ' ')}
                                                    variant={STATUS_VARIANTS[appt.status]}
                                                    dot
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                {appt.status === 'upcoming' && (
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => updateAppointmentStatus(appt.id, 'in-progress')}
                                                            className="text-[10px] font-bold px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                                                        >
                                                            Start
                                                        </button>
                                                        <button
                                                            onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                                                            className="text-[10px] font-bold px-2 py-1 bg-error/10 text-error rounded hover:bg-error/20 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                                {appt.status === 'in-progress' && (
                                                    <button
                                                        onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                                                        className="text-[10px] font-bold px-2 py-1 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </DashboardCard>
                </div>

                {/* Right: Live Walk-in Queue */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <DashboardCard>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">queue</span>
                                Live Walk-in Queue
                            </h3>
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                                {queue.length} waiting
                            </span>
                        </div>
                        <div className="space-y-3">
                            {queue.length === 0 ? (
                                <p className="text-sm text-on-surface-variant text-center py-6">Queue is empty</p>
                            ) : queue.map((p, i) => (
                                <div key={p.id} className={`p-4 rounded-xl border-l-4 ${p.status === 'in-progress' ? 'bg-primary/5 border-primary' :
                                        p.priority === 'urgent' ? 'bg-secondary/5 border-secondary' :
                                            p.priority === 'emergency' ? 'bg-error/5 border-error' :
                                                'bg-surface-container-low border-transparent'
                                    }`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs font-bold text-primary">{p.tokenId}</span>
                                                {p.status === 'in-progress' && (
                                                    <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded font-bold uppercase">Active</span>
                                                )}
                                                {p.priority === 'urgent' && (
                                                    <span className="text-[9px] bg-secondary text-white px-1.5 py-0.5 rounded font-bold uppercase">Urgent</span>
                                                )}
                                                {p.priority === 'emergency' && (
                                                    <span className="text-[9px] bg-error text-white px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">Emergency</span>
                                                )}
                                            </div>
                                            <p className="font-bold text-sm text-on-surface">{p.name}</p>
                                            <p className="text-[10px] text-on-surface-variant">{p.department}</p>
                                        </div>
                                        <span className="text-[10px] text-on-surface-variant font-mono bg-surface-container-high px-2 py-1 rounded">
                                            #{i + 1}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>

                    {/* Stats Card */}
                    <DashboardCard variant="low" className="p-6">
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-on-surface-variant mb-4">Today's Summary</h4>
                        <div className="space-y-3">
                            {[
                                { label: 'Total Appointments', value: counts.all },
                                { label: 'Completed', value: counts.completed },
                                { label: 'In Progress', value: counts['in-progress'] },
                                { label: 'Upcoming', value: counts.upcoming },
                            ].map(s => (
                                <div key={s.label} className="flex justify-between items-center text-sm">
                                    <span className="text-on-surface-variant">{s.label}</span>
                                    <span className="font-bold text-primary">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                </div>
            </div>

            {/* Simple Book Appointment Modal */}
            {showBookModal && (
                <BookAppointmentModal onClose={() => setShowBookModal(false)} />
            )}
        </div>
    );
};

const BookAppointmentModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addAppointment, doctors, departments } = useData();
    const today = new Date().toISOString().split('T')[0];
    const [form, setForm] = useState({
        patientName: '', 
        doctorName: '', 
        department: departments[0]?.name || 'General',
        date: today, 
        time: '09:00', 
        type: 'scheduled' as const, 
        notes: '',
    });
    const [saved, setSaved] = useState(false);

    const set = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: v }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addAppointment({ ...form, status: 'upcoming' });
        setSaved(true);
        setTimeout(onClose, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-lg border border-outline-variant/20">
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
                    <h2 className="text-lg font-bold text-on-surface">Book Appointment</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
                {saved ? (
                    <div className="p-10 text-center space-y-3">
                        <span className="material-symbols-outlined text-5xl text-secondary">check_circle</span>
                        <p className="font-bold text-on-surface">Appointment booked successfully!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Patient Name *</label>
                                <input required value={form.patientName} onChange={e => set('patientName', e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                                    placeholder="Patient full name" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Assign Doctor *</label>
                                <select required value={form.doctorName} onChange={e => set('doctorName', e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all appearance-none">
                                    <option value="">Select doctor</option>
                                    {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Date *</label>
                                <input required type="date" value={form.date} onChange={e => set('date', e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Time *</label>
                                <input required type="time" value={form.time} onChange={e => set('time', e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Type</label>
                                <select value={form.type} onChange={e => set('type', e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all appearance-none">
                                    <option value="scheduled">Scheduled</option>
                                    <option value="follow-up">Follow-up</option>
                                    <option value="walk-in">Walk-in</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Department</label>
                                <select value={form.department} onChange={e => set('department', e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all appearance-none">
                                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Notes</label>
                            <input value={form.notes} onChange={e => set('notes', e.target.value)}
                                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                                placeholder="Optional notes" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-3 border border-outline-variant text-on-surface font-semibold rounded-xl hover:bg-surface-container-low text-sm transition-colors">
                                Cancel
                            </button>
                            <SignatureButton type="submit" className="flex-1 py-3 text-sm">
                                Book Appointment
                            </SignatureButton>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AppointmentsPage;
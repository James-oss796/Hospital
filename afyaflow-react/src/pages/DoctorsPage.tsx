import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { DoctorStatus } from '../context/DataContext';
import DashboardCard from '../components/ui/DashboardCard';
import StatusChip from '../components/ui/StatusChip';

const STATUS_CONFIG: Record<DoctorStatus, { label: string; variant: 'success' | 'error' | 'info' | 'neutral'; color: string }> = {
    available: { label: 'Available', variant: 'success', color: 'bg-secondary' },
    'in-surgery': { label: 'In Surgery', variant: 'error', color: 'bg-error' },
    'on-call': { label: 'On Call', variant: 'info', color: 'bg-primary' },
    'off-duty': { label: 'Off Duty', variant: 'neutral', color: 'bg-outline' },
};

const DoctorsPage: React.FC = () => {
    const { doctors, patients, appointments } = useData();
    const [view, setView] = useState < 'grid' | 'list' > ('grid');
    const [statusFilter, setStatusFilter] = useState < DoctorStatus | 'all' > ('all');

    const filtered = doctors.filter(d => statusFilter === 'all' || d.status === statusFilter);

    const getDoctorAppointments = (name: string) =>
        appointments.filter(a => a.doctorName === name);

    const getDoctorPatients = (name: string) =>
        patients.filter(p => p.assignedDoctor === name);

    const totalPatients = doctors.reduce((s, d) => s + d.patientsSeenToday, 0);
    const available = doctors.filter(d => d.status === 'available').length;
    const busy = doctors.filter(d => d.status === 'in-surgery' || d.status === 'on-call').length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-[2.5rem] font-extrabold text-primary tracking-tight leading-none mb-2">Doctors</h1>
                    <p className="text-on-surface-variant font-medium">Clinical staff profiles, status, and daily performance</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('grid')}
                        className={`p-2.5 rounded-xl transition-colors ${view === 'grid' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                        <span className="material-symbols-outlined">grid_view</span>
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`p-2.5 rounded-xl transition-colors ${view === 'list' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                        <span className="material-symbols-outlined">list</span>
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Doctors', value: doctors.length, icon: 'stethoscope', color: 'text-primary bg-primary/10' },
                    { label: 'Available', value: available, icon: 'check_circle', color: 'text-secondary bg-secondary/10' },
                    { label: 'Busy / On Call', value: busy, icon: 'medical_services', color: 'text-error bg-error/10' },
                    { label: 'Patients Seen', value: totalPatients, icon: 'group', color: 'text-tertiary bg-tertiary/10' },
                ].map(s => (
                    <DashboardCard key={s.label} variant="low" className="p-5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                            <span className="material-symbols-outlined text-sm">{s.icon}</span>
                        </div>
                        <p className="text-3xl font-black text-primary">{s.value}</p>
                        <p className="text-xs text-on-surface-variant mt-1">{s.label}</p>
                    </DashboardCard>
                ))}
            </div>

            {/* Filter */}
            <div className="flex bg-surface-container-low rounded-2xl p-1 gap-1 w-fit">
                {(['all', 'available', 'on-call', 'in-surgery', 'off-duty'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setStatusFilter(tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === tab
                                ? 'bg-white shadow-sm text-primary'
                                : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                    >
                        {tab === 'all' ? 'All Staff' : tab.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Grid View */}
            {view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map(doc => {
                        const docAppts = getDoctorAppointments(doc.name);
                        const docPatients = getDoctorPatients(doc.name);
                        const upcoming = docAppts.filter(a => a.status === 'upcoming').length;
                        
                        const statusKey = (doc.status?.toLowerCase() || 'off-duty') as DoctorStatus;
                        const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG['off-duty'];
                        
                        return (
                            <DashboardCard key={doc.id} className="p-6 hover:shadow-lg transition-shadow">
                                {/* Status indicator */}
                                <div className="flex justify-between items-start mb-5">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-lg">
                                            {doc.name.split(' ').filter(n => !n.startsWith('Dr')).map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface-container-lowest ${cfg.color}`} />
                                    </div>
                                    <StatusChip label={cfg.label} variant={cfg.variant} dot />
                                </div>

                                {/* Info */}
                                <h3 className="font-black text-on-surface text-base leading-tight">{doc.name}</h3>
                                <p className="text-xs text-primary font-semibold mt-0.5">{doc.specialization}</p>
                                <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">location_on</span>
                                    {doc.station}
                                </p>

                                {/* Shift */}
                                <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-low rounded-lg px-3 py-2">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    <span className="font-medium">Shift: {doc.shift}</span>
                                </div>

                                {/* Stats */}
                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Seen Today', value: doc.patientsSeenToday },
                                        { label: 'Upcoming', value: upcoming },
                                        { label: 'Active Pts', value: docPatients.filter(p => p.status !== 'served').length },
                                    ].map(s => (
                                        <div key={s.label} className="text-center bg-surface-container-low rounded-xl py-3">
                                            <p className="text-lg font-black text-primary">{s.value}</p>
                                            <p className="text-[9px] text-on-surface-variant uppercase tracking-wider">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Contact */}
                                <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] text-on-surface-variant">{doc.email}</p>
                                        <p className="text-xs font-bold text-on-surface">{doc.phone}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors">
                                            <span className="material-symbols-outlined text-sm">call</span>
                                        </button>
                                        <button className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors">
                                            <span className="material-symbols-outlined text-sm">mail</span>
                                        </button>
                                    </div>
                                </div>
                            </DashboardCard>
                        );
                    })}
                </div>
            ) : (
                /* List View */
                <DashboardCard noPadding>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-outline-variant/10">
                                    {['Doctor', 'Specialization', 'Station', 'Shift', 'Patients Today', 'Status', 'Contact'].map((h, i) => (
                                        <th key={i} className={`px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant ${i === 6 ? 'text-right' : ''}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {filtered.map(doc => {
                                    const statusKey = (doc.status?.toLowerCase() || 'off-duty') as DoctorStatus;
                                    const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG['off-duty'];
                                    return (
                                        <tr key={doc.id} className="hover:bg-surface-container-low transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                                                        {doc.name.split(' ').filter(n => !n.startsWith('Dr')).map(n => n[0]).join('').slice(0, 2)}
                                                    </div>
                                                    <p className="font-bold text-sm text-on-surface">{doc.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-on-surface-variant">{doc.specialization}</td>
                                            <td className="px-6 py-4 text-sm text-on-surface-variant">{doc.station}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs bg-surface-container-high px-2 py-1 rounded font-mono">{doc.shift}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-primary">{doc.patientsSeenToday}</td>
                                            <td className="px-6 py-4">
                                                <StatusChip label={cfg.label} variant={cfg.variant} dot />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-all">
                                                    <span className="material-symbols-outlined">call</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            )}
        </div>
    );
};

export default DoctorsPage;
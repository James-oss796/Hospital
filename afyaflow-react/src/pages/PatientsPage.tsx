import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { PatientStatus } from '../context/DataContext';
import DashboardCard from '../components/ui/DashboardCard';
import StatusChip from '../components/ui/StatusChip';

const STATUS_CHIP: Record<PatientStatus, { variant: 'success' | 'info' | 'error' | 'neutral' | 'warning'; label: string }> = {
    queued: { variant: 'neutral', label: 'In Queue' },
    'in-progress': { variant: 'info', label: 'In Progress' },
    served: { variant: 'success', label: 'Served' },
    admitted: { variant: 'error', label: 'Admitted' },
};

const PatientsPage: React.FC = () => {
    const { patients } = useData();
    const [filter, setFilter] = useState < PatientStatus | 'all' > ('all');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState < string | null > (null);

    const filtered = patients
        .filter(p => filter === 'all' || p.status === filter)
        .filter(p =>
            !search ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.tokenId.toLowerCase().includes(search.toLowerCase()) ||
            p.department.toLowerCase().includes(search.toLowerCase()) ||
            (p.diagnosis || '').toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());

    const selectedPatient = selected ? patients.find(p => p.id === selected) : null;

    const formatTime = (iso: string) =>
        new Date(iso).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

    const counts = {
        all: patients.length,
        served: patients.filter(p => p.status === 'served').length,
        admitted: patients.filter(p => p.status === 'admitted').length,
        queued: patients.filter(p => p.status === 'queued').length,
        'in-progress': patients.filter(p => p.status === 'in-progress').length,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-[2.5rem] font-extrabold text-primary tracking-tight leading-none mb-2">Patients</h1>
                <p className="text-on-surface-variant font-medium">All registered patients and their consultation records</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Today', value: counts.all, icon: 'group', color: 'text-primary bg-primary/10' },
                    { label: 'Served', value: counts.served, icon: 'check_circle', color: 'text-secondary bg-secondary/10' },
                    { label: 'In Queue', value: counts.queued, icon: 'hourglass_empty', color: 'text-on-surface-variant bg-surface-container-high' },
                    { label: 'Admitted', value: counts.admitted, icon: 'hotel', color: 'text-error bg-error/10' },
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

            <div className="grid grid-cols-12 gap-8">
                {/* Patient List */}
                <div className={`${selectedPatient ? 'col-span-12 lg:col-span-7' : 'col-span-12'} space-y-4`}>
                    {/* Filter & Search */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex bg-surface-container-low rounded-2xl p-1 gap-1">
                            {(['all', 'served', 'in-progress', 'queued', 'admitted'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === tab
                                            ? 'bg-white shadow-sm text-primary'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                        }`}
                                >
                                    {tab === 'all' ? 'All' : tab.replace('-', ' ')}
                                    <span className="ml-1 opacity-60">({counts[tab]})</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-2xl flex-1 max-w-xs">
                            <span className="material-symbols-outlined text-outline text-sm">search</span>
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-outline"
                                placeholder="Search name, token, diagnosis..."
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <DashboardCard noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-outline-variant/10">
                                        {['Token', 'Patient', 'Dept.', 'Registered', 'Priority', 'Status', ''].map((h, i) => (
                                            <th key={i} className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10">
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                                                No patients found
                                            </td>
                                        </tr>
                                    ) : filtered.map(p => (
                                        <tr
                                            key={p.id}
                                            className={`hover:bg-surface-container-low transition-colors cursor-pointer ${selected === p.id ? 'bg-primary/5' : ''}`}
                                            onClick={() => setSelected(selected === p.id ? null : p.id)}
                                        >
                                            <td className="px-5 py-4">
                                                <span className="font-mono font-bold text-sm text-primary">{p.tokenId}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                                        {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-on-surface whitespace-nowrap">{p.name}</p>
                                                        <p className="text-[10px] text-on-surface-variant">{p.age}y · {p.gender}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-xs text-on-surface-variant">{p.department}</td>
                                            <td className="px-5 py-4">
                                                <p className="text-xs text-on-surface-variant">{formatTime(p.registeredAt)}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${p.priority === 'emergency' ? 'bg-error/10 text-error' :
                                                        p.priority === 'urgent' ? 'bg-secondary/10 text-secondary' :
                                                            'bg-surface-container-high text-on-surface-variant'
                                                    }`}>{p.priority}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <StatusChip
                                                    label={STATUS_CHIP[p.status].label}
                                                    variant={STATUS_CHIP[p.status].variant as any}
                                                    dot
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="material-symbols-outlined text-sm text-on-surface-variant">
                                                    {selected === p.id ? 'expand_less' : 'chevron_right'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </DashboardCard>
                </div>

                {/* Patient Detail Panel */}
                {selectedPatient && (
                    <div className="col-span-12 lg:col-span-5 space-y-4">
                        <DashboardCard className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-lg">
                                        {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-on-surface text-lg leading-tight">{selectedPatient.name}</h3>
                                        <p className="text-xs text-on-surface-variant">{selectedPatient.age} yrs · {selectedPatient.gender}</p>
                                        <span className="font-mono text-xs font-bold text-primary">{selectedPatient.tokenId}</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Phone', value: selectedPatient.phone, icon: 'call' },
                                        { label: 'National ID', value: selectedPatient.nationalId, icon: 'badge' },
                                        { label: 'Department', value: selectedPatient.department, icon: 'apartment' },
                                        { label: 'Priority', value: selectedPatient.priority, icon: 'priority_high' },
                                    ].map(f => (
                                        <div key={f.label} className="bg-surface-container-low rounded-xl p-3">
                                            <div className="flex items-center gap-1.5 mb-1 text-on-surface-variant">
                                                <span className="material-symbols-outlined text-[14px]">{f.icon}</span>
                                                <span className="text-[9px] font-extrabold uppercase tracking-widest">{f.label}</span>
                                            </div>
                                            <p className="text-sm font-bold text-on-surface capitalize">{f.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-surface-container-low rounded-xl p-4">
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant mb-2">Chief Complaint</p>
                                    <p className="text-sm text-on-surface leading-relaxed">{selectedPatient.reason}</p>
                                </div>

                                {selectedPatient.assignedDoctor && (
                                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                        <span className="material-symbols-outlined text-primary text-sm">stethoscope</span>
                                        <div>
                                            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Assigned Doctor</p>
                                            <p className="text-sm font-bold text-primary">{selectedPatient.assignedDoctor}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedPatient.diagnosis && (
                                    <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/10">
                                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary mb-2">Diagnosis</p>
                                        <p className="text-sm font-bold text-on-surface">{selectedPatient.diagnosis}</p>
                                        {selectedPatient.consultationNotes && (
                                            <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{selectedPatient.consultationNotes}</p>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-3 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/10">
                                    <div>
                                        <p className="font-bold">Registered</p>
                                        <p>{formatDate(selectedPatient.registeredAt)} at {formatTime(selectedPatient.registeredAt)}</p>
                                    </div>
                                    {selectedPatient.servedAt && (
                                        <div className="pl-4 border-l border-outline-variant/20">
                                            <p className="font-bold">Served</p>
                                            <p>{formatDate(selectedPatient.servedAt)} at {formatTime(selectedPatient.servedAt)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DashboardCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientsPage;
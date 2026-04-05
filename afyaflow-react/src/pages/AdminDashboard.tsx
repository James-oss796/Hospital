import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DashboardCard from '../components/ui/DashboardCard';
import SignatureButton from '../components/ui/SignatureButton';
import StatusChip from '../components/ui/StatusChip';
import ReportModal from '../components/modals/ReportModal';
import { useData } from '../context/DataContext';
import { useNotification } from '../context/NotificationContext';


const volumeData: any[] = [];
const STATUS_VARIANT_MAP: Record<string, string> = {
  'in-surgery': 'error',
  'on-call': 'success',
  'available': 'success',
  'off-duty': 'neutral',
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { patients, doctors, departments, addDepartment, deleteDepartment } = useData();
  const { notify } = useNotification();
  const [showReportModal, setShowReportModal] = useState(false);

  // Live stats from context
  const todayPatients = patients.length;
  const queueCount = patients.filter(p => p.status === 'queued').length;
  const inProgress = patients.filter(p => p.status === 'in-progress').length;

  return (
    <div className="space-y-12">

      {/* Dashboard Header */}
      <div className="flex justify-between items-end">
        <div className="mb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Hospital Overview</h1>
          <p className="text-on-surface-variant mt-1">Real-time clinical operations and revenue monitoring.</p>
        </div>
        <div className="flex gap-4">
          <SignatureButton
            variant="clear"
            onClick={() => navigate('/register')}
          >
            Register Staff
          </SignatureButton>
          <SignatureButton
            variant="clear"
            onClick={() => setShowReportModal(true)}
          >
            Generate Report
          </SignatureButton>
        </div>
      </div>

      {/* 3-Column Bento KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <DashboardCard className="relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-secondary font-bold text-sm bg-secondary-container/30 px-2 py-1 rounded">+12% vs yest.</span>
          </div>
          <p className="text-on-surface-variant font-medium text-sm mb-1 uppercase tracking-widest">Today's Patients</p>
          <p className="text-5xl font-extrabold text-primary">{todayPatients}</p>
          <div className="mt-6 flex gap-2">
            <div className="h-1 flex-1 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: `${Math.min((todayPatients / 200) * 100, 100)}%` }} />
            </div>
          </div>
          <p className="mt-2 text-xs text-on-surface-variant">Capacity: {Math.round((todayPatients / 200) * 100)}% utilized</p>
        </DashboardCard>

        <DashboardCard className="border-l-4 border-l-primary p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">hourglass_empty</span>
            </div>
            <span className="text-primary font-bold text-sm">Active</span>
          </div>
          <p className="text-on-surface-variant font-medium text-sm mb-1 uppercase tracking-widest">Active Queues</p>
          <p className="text-5xl font-extrabold text-primary">{queueCount + inProgress}</p>
          <div className="mt-6 text-sm text-on-surface-variant flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
            Avg. wait time: 14 mins
          </div>
        </DashboardCard>
      </div>

      {/* High Density Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <DashboardCard variant="low" className="lg:col-span-8 p-8">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-xl font-bold text-primary">Patient Volume Trend</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white text-xs font-bold text-primary rounded shadow-sm">Today</span>
              <span className="px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-white/50 rounded transition-all cursor-pointer">Last 7 Days</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                <Tooltip cursor={{ fill: 'rgba(0, 80, 80, 0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {volumeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value === Math.max(...volumeData.map(d => d.value)) ? '#005050' : '#0050504d'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-4">
            {[
              { label: 'Peak Volume', value: '48 p/hr' },
              { label: 'Morning Avg', value: '18 p/hr' },
              { label: 'Afternoon Avg', value: '32 p/hr' },
              { label: 'Est. Closing', value: '20:00' },
            ].map((metric) => (
              <div key={metric.label} className="border-l border-outline-variant pl-4">
                <p className="text-xs text-on-surface-variant mb-1">{metric.label}</p>
                <p className="text-lg font-bold">{metric.value}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <DashboardCard className="p-6">
            <h4 className="font-bold text-primary mb-6 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">apartment</span>
              Department Management
            </h4>
            
            <div className="space-y-4 mb-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="New Department..."
                  id="new-dept-input"
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      if (val.trim()) {
                        addDepartment(val.trim());
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('new-dept-input') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      addDepartment(input.value.trim());
                      input.value = '';
                    }
                  }}
                  className="p-2 bg-primary text-on-primary rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {departments.length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-4 italic">No departments registered</p>
              ) : (
                departments.map((dept) => (
                  <div key={dept.id} className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 group">
                    <span className="text-sm font-medium text-on-surface">{dept.name}</span>
                    <button 
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete the '${dept.name}' department? This may affect assigned staff and patient records.`)) {
                          deleteDepartment(dept.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-error hover:bg-error/10 rounded transition-all"
                      title="Delete Department"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>

          <DashboardCard className="p-6">
            <h4 className="font-bold text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">bolt</span>
              System Health
            </h4>
            <div className="space-y-4">
              {[
                { label: 'Lab Results Pending', value: '12', progress: 33, color: 'bg-primary' },
                { label: 'Bed Occupancy (Level 5)', value: '88%', progress: 88, color: 'bg-secondary' },
                { label: 'Ambulance Availability', value: '1/5', progress: 20, color: 'bg-error' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">{item.label}</span>
                    <span className="font-bold text-primary">{item.value}</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <div className="bg-gradient-to-br from-secondary to-on-secondary-container p-6 rounded-xl text-white">
            <h4 className="font-bold mb-2">Staff Briefing</h4>
            <p className="text-sm opacity-80 mb-4">Mandatory hygiene protocol review today at 4:00 PM in Seminar Room A.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 transition-all rounded font-bold text-sm">Confirm Attendance</button>
          </div>
        </div>
      </div>

      {/* Doctor Schedule Table */}
      <DashboardCard className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-extrabold text-primary tracking-tight">On-Call Specialists</h3>
          <div className="flex items-center gap-4 text-sm font-medium text-on-surface-variant">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-error" /> In Surgery</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary" /> On Call</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-outline" /> Available</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-container-high">
                {['Doctor Name', 'Department', 'Shift Hours', 'Current Status', 'Contact'].map((h, i) => (
                  <th key={h} className={`pb-4 font-bold text-on-surface-variant text-xs uppercase tracking-widest ${i === 4 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {doctors.map((doc) => (
                <tr key={doc.id} className="group hover:bg-surface-container-low transition-all">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary">
                        {doc.name.split(' ').filter(n => !n.startsWith('Dr')).map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{doc.name}</p>
                        <p className="text-xs text-on-surface-variant">{doc.specialization}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 text-sm">{doc.station}</td>
                  <td className="py-5 text-sm">{doc.shift}</td>
                  <td className="py-5">
                    <StatusChip
                      label={doc.status.replace('-', ' ')}
                      variant={STATUS_VARIANT_MAP[doc.status] as any}
                      dot
                    />
                  </td>
                  <td className="py-5 text-right">
                    <button 
                      onClick={() => notify(`Calling ${doc.name}...`, 'info', 'Connecting')}
                      className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-all"
                      title="Call Specialist"
                    >
                      <span className="material-symbols-outlined">call</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {/* Modals */}
      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardCard from '../components/ui/DashboardCard';
import SignatureButton from '../components/ui/SignatureButton';
import { useNotification } from '../context/NotificationContext';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'roster';

interface RosterEntry {
  id: string;
  staff: string;
  role: string;
  department: string;
  date: string;
  shiftType: string;
  start: string;
  end: string;
}

const today = new Date().toISOString().split('T')[0];
const nextDay = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const dayAfter = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

const INITIAL_ROSTER: RosterEntry[] = [];
const SHIFT_COLORS: Record<string, string> = {
  Morning:   'bg-amber-100 text-amber-700 border-amber-200',
  Afternoon: 'bg-blue-100 text-blue-700 border-blue-200',
  Night:     'bg-purple-100 text-purple-700 border-purple-200',
  'On-Call': 'bg-error/10 text-error border-error/20',
};

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [roster, setRoster] = useState<RosterEntry[]>(INITIAL_ROSTER);
  const [showAddShift, setShowAddShift] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    displayName: user?.username || '',
    email: user?.email || '',
    department: user?.department || '',
    phone: '',
    bio: '',
  });

  // Security form state
  const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [securityError, setSecurityError] = useState<string | null>(null);

  // Notifications state
  const [notifSettings, setNotifSettings] = useState({
    newPatient: true,
    statusChange: true,
    referral: true,
    systemAlerts: true,
    emailDigest: false,
  });

  // Add shift form
  const [shiftForm, setShiftForm] = useState({ staff: '', role: 'Doctor', department: '', date: today, shiftType: 'Morning', start: '08:00', end: '16:00' });

  const handleProfileSave = () => {
    notify('Profile updated successfully.', 'success', 'Settings Saved');
  };

  const handlePasswordChange = () => {
    setSecurityError(null);
    if (!securityForm.currentPassword) { setSecurityError('Current password is required.'); return; }
    if (securityForm.newPassword.length < 8) { setSecurityError('New password must be at least 8 characters.'); return; }
    if (securityForm.newPassword !== securityForm.confirmPassword) { setSecurityError('Passwords do not match.'); return; }
    notify('Password changed successfully.', 'success', 'Security Updated');
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAddShift = () => {
    if (!shiftForm.staff || !shiftForm.department) return;
    setRoster(prev => [...prev, { id: `r${Date.now()}`, ...shiftForm }]);
    setShowAddShift(false);
    notify('Shift added to duty roster.', 'success', 'Roster Updated');
    setShiftForm({ staff: '', role: 'Doctor', department: '', date: today, shiftType: 'Morning', start: '08:00', end: '16:00' });
  };

  const tabs: { key: SettingsTab; label: string; icon: string }[] = [
    { key: 'profile',       label: 'Profile',       icon: 'person' },
    { key: 'security',      label: 'Security',       icon: 'lock' },
    { key: 'notifications', label: 'Notifications',  icon: 'notifications' },
    { key: 'roster',        label: 'Duty Roster',    icon: 'calendar_month' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-[2.5rem] font-extrabold text-primary tracking-tight leading-none mb-2">Settings</h1>
        <p className="text-on-surface-variant font-medium">Manage your profile, security, and staff scheduling</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <div className="col-span-12 md:col-span-3 space-y-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="col-span-12 md:col-span-9 space-y-6">

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <DashboardCard className="p-8 space-y-6">
              <div className="flex items-center gap-5 pb-6 border-b border-outline-variant/10">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-extrabold text-2xl">
                  {(user?.username || 'U').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-lg">{user?.username}</h3>
                  <p className="text-sm text-on-surface-variant">{user?.role} · {user?.department || 'No Department'}</p>
                  <button className="mt-2 text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">upload</span>Change Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: 'Display Name',  field: 'displayName',  placeholder: 'Your full name' },
                  { label: 'Email Address', field: 'email',         placeholder: 'name@hospital.org' },
                  { label: 'Department',    field: 'department',    placeholder: 'Your clinical area' },
                  { label: 'Phone Number',  field: 'phone',         placeholder: '+254 7XX XXX XXX' },
                ].map(f => (
                  <div key={f.field}>
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">{f.label}</label>
                    <input type="text" placeholder={f.placeholder}
                      value={(profileForm as any)[f.field]}
                      onChange={e => setProfileForm(p => ({ ...p, [f.field]: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Short Bio</label>
                <textarea placeholder="A brief professional description…" rows={3}
                  value={profileForm.bio}
                  onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
              </div>
              <div className="flex justify-end">
                <SignatureButton onClick={handleProfileSave} icon="save">Save Changes</SignatureButton>
              </div>
            </DashboardCard>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <DashboardCard className="p-8 space-y-6">
              <div>
                <h3 className="font-bold text-on-surface mb-1">Change Password</h3>
                <p className="text-sm text-on-surface-variant">Use a strong, unique password. Updates take effect immediately.</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Current Password',     field: 'currentPassword' },
                  { label: 'New Password',          field: 'newPassword' },
                  { label: 'Confirm New Password',  field: 'confirmPassword' },
                ].map(f => (
                  <div key={f.field}>
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">{f.label}</label>
                    <input type="password" placeholder="••••••••"
                      value={(securityForm as any)[f.field]}
                      onChange={e => setSecurityForm(p => ({ ...p, [f.field]: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                ))}
              </div>
              {securityError && (
                <div className="bg-error-container/40 text-on-error-container text-sm p-3 rounded-xl border border-error/10">{securityError}</div>
              )}
              <div className="pt-2 border-t border-outline-variant/10">
                <h4 className="font-semibold text-on-surface text-sm mb-3">Recent Sessions</h4>
                {[
                  { device: 'Chrome on Windows 11', ip: '192.168.1.10', time: 'Active now', current: true },
                  { device: 'Firefox on MacOS',     ip: '10.0.0.44',    time: '2 hours ago', current: false },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-outline-variant/10 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{s.device}</p>
                      <p className="text-xs text-on-surface-variant">{s.ip} · {s.time}</p>
                    </div>
                    {s.current ? (
                      <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-1 rounded font-bold">This Device</span>
                    ) : (
                      <button className="text-[10px] text-error font-bold hover:underline">Revoke</button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <SignatureButton onClick={handlePasswordChange} icon="lock_reset">Update Password</SignatureButton>
              </div>
            </DashboardCard>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <DashboardCard className="p-8 space-y-5">
              <div>
                <h3 className="font-bold text-on-surface mb-1">Notification Preferences</h3>
                <p className="text-sm text-on-surface-variant">Choose which events trigger in-app alerts for your account.</p>
              </div>
              {[
                { key: 'newPatient',    label: 'New Patient Registered',     desc: 'Alert when a new patient is admitted to your queue' },
                { key: 'statusChange',  label: 'Queue Status Changes',        desc: 'Alert when a patient status is updated' },
                { key: 'referral',      label: 'Specialist Referrals',        desc: 'Alert when a referral is sent to your department' },
                { key: 'systemAlerts',  label: 'System & Admin Alerts',       desc: 'Critical system notifications and admin announcements' },
                { key: 'emailDigest',   label: 'Daily Email Digest',          desc: 'Receive a daily summary of activity to your email' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-4 border-b border-outline-variant/10 last:border-0">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">{n.label}</p>
                    <p className="text-xs text-on-surface-variant">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifSettings(p => ({ ...p, [n.key]: !(p as any)[n.key] }))}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${(notifSettings as any)[n.key] ? 'bg-primary' : 'bg-outline/30'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${(notifSettings as any)[n.key] ? 'translate-x-6' : ''}`} />
                  </button>
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <SignatureButton onClick={() => notify('Notification preferences saved.', 'success', 'Preferences Saved')} icon="save">Save Preferences</SignatureButton>
              </div>
            </DashboardCard>
          )}

          {/* Duty Roster Tab */}
          {activeTab === 'roster' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-on-surface">Staff Duty Roster</h3>
                  <p className="text-sm text-on-surface-variant">Upcoming shifts and on-call schedule</p>
                </div>
                <SignatureButton icon="add" onClick={() => setShowAddShift(true)}>Add Shift</SignatureButton>
              </div>

              {/* Group roster by date */}
              {[today, nextDay, dayAfter].map(date => {
                const dayEntries = roster.filter(r => r.date === date);
                if (dayEntries.length === 0) return null;
                return (
                  <div key={date}>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-on-surface-variant mb-3 mt-5">
                      {date === today ? '📅 Today' : date === nextDay ? '📅 Tomorrow' : `📅 ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`}
                    </p>
                    <div className="space-y-2">
                      {dayEntries.map(entry => (
                        <DashboardCard key={entry.id} variant="low" className="p-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                            {entry.staff.split(' ').filter(n => !n.startsWith('Dr')).map(n => n[0]).join('').slice(0, 2) || entry.staff.slice(0, 2)}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-on-surface text-sm">{entry.staff}</p>
                            <p className="text-xs text-on-surface-variant">{entry.role} · {entry.department}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${SHIFT_COLORS[entry.shiftType] || 'bg-surface-container text-on-surface-variant'}`}>
                              {entry.shiftType}
                            </span>
                            <p className="text-xs text-on-surface-variant">{entry.start} – {entry.end}</p>
                          </div>
                          <button onClick={() => setRoster(p => p.filter(r => r.id !== entry.id))}
                            className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors ml-2">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </DashboardCard>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Add Shift Modal */}
              {showAddShift && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/20 backdrop-blur-sm">
                  <div className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-md border border-outline-variant/20 p-8 space-y-5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-primary">Add Shift</h3>
                      <button onClick={() => setShowAddShift(false)} className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Staff Name',   field: 'staff',      type: 'text',   placeholder: 'Dr. Full Name' },
                        { label: 'Department',   field: 'department', type: 'text',   placeholder: 'Clinical area' },
                        { label: 'Date',         field: 'date',       type: 'date',   placeholder: '' },
                      ].map(f => (
                        <div key={f.field}>
                          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">{f.label}</label>
                          <input type={f.type} placeholder={f.placeholder}
                            value={(shiftForm as any)[f.field]}
                            onChange={e => setShiftForm(p => ({ ...p, [f.field]: e.target.value }))}
                            className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                        </div>
                      ))}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Shift</label>
                          <select value={shiftForm.shiftType} onChange={e => setShiftForm(p => ({ ...p, shiftType: e.target.value }))}
                            className="w-full px-3 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-primary/20">
                            {['Morning', 'Afternoon', 'Night', 'On-Call'].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Start</label>
                          <input type="time" value={shiftForm.start} onChange={e => setShiftForm(p => ({ ...p, start: e.target.value }))}
                            className="w-full px-3 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">End</label>
                          <input type="time" value={shiftForm.end} onChange={e => setShiftForm(p => ({ ...p, end: e.target.value }))}
                            className="w-full px-3 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setShowAddShift(false)}
                        className="flex-1 py-3 border border-outline-variant text-on-surface font-semibold rounded-xl text-sm hover:bg-surface-container-low">
                        Cancel
                      </button>
                      <SignatureButton onClick={handleAddShift} className="flex-1">Add Shift</SignatureButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

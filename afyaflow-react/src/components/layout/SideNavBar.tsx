import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const allNavItems = [
  // Dashboards
  { icon: 'how_to_reg',         label: 'Reception',    path: '/',           roles: ['Receptionist'], exact: true },
  { icon: 'admin_panel_settings',label: 'Admin',        path: '/admin',      roles: ['Admin'] },
  { icon: 'stethoscope',        label: 'Doctor',       path: '/doctor',     roles: ['Doctor'] },

  // Clinical Management
  { icon: 'group',              label: 'Patients',     path: '/patients',   roles: ['Admin'] },
  { icon: 'folder_shared',      label: 'Patient EMR',  path: '/emr',        roles: ['Admin', 'Doctor'] },
  { icon: 'bed',                label: 'Wards',        path: '/wards',      roles: ['Admin'] },
  { icon: 'calendar_today',     label: 'Appointments', path: '/appointments',roles: ['Admin'] },
  { icon: 'badge',              label: 'Doctors',      path: '/doctors',    roles: ['Admin'] },
  { icon: 'inventory_2',        label: 'Inventory',    path: '/inventory',  roles: ['Admin'] },

  // Administration
  { icon: 'analytics',          label: 'Reports',      path: '/reports',    roles: ['Admin'] },
  { icon: 'receipt_long',       label: 'Audit Logs',   path: '/audit',      roles: ['Admin'] },

  // Universal
  { icon: 'settings',           label: 'Settings',     path: '/settings',   roles: ['Admin', 'Doctor', 'Receptionist'] },
];

const SideNavBar: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  const navItems = allNavItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-40 flex flex-col py-6 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-manrope antialiased tracking-tight text-sm font-medium">
      <div className="text-xl font-bold text-teal-900 dark:text-teal-100 px-4 mb-8 flex items-center gap-2">
        <span className="material-symbols-outlined fill-1 text-primary">local_hospital</span>
        Afyaflow
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-all duration-200 ${isActive
                ? 'text-teal-900 dark:text-teal-300 font-bold border-l-[3px] border-teal-700 dark:border-teal-500 bg-teal-50/50 dark:bg-teal-900/20 scale-[0.99]'
                : 'text-slate-600 dark:text-slate-400 hover:text-teal-800 dark:hover:text-teal-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <div className="bg-surface-container-high rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">SHA/NHIF Portal</span>
            <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(44,105,78,0.6)]" />
          </div>
          <div className="text-xs font-semibold text-primary">Connected & Active</div>
          <div className="text-[10px] text-on-surface-variant">Last sync: 2 mins ago</div>
        </div>
      </div>
    </aside>
  );
};

export default SideNavBar;
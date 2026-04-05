import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search, Bell, HelpCircle } from 'lucide-react';

const TopNavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayUser = user ? {
    name: user.username,
    role: user.role,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=0D9488&color=fff`
  } : {
    name: 'Guest User',
    role: 'Unauthorized',
    avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-64 h-16 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex justify-between items-center px-8">
      <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full w-96 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
        <Search className="w-5 h-5 text-outline" />
        <input 
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline" 
          placeholder="Search patients or tokens..." 
          type="text"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 transition-all relative p-1 rounded-lg hover:bg-surface-container-low">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-error rounded-full border-2 border-white"></span>
        </button>
        
        <button className="text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 transition-all p-1 rounded-lg hover:bg-surface-container-low">
          <HelpCircle className="w-5 h-5" />
        </button>
        
        <div className="h-8 w-[1px] bg-outline-variant/30 mx-2"></div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 group">
            <div className="text-right">
              <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">{displayUser.name}</p>
              <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{displayUser.role}</p>
            </div>
            <img 
              alt="User Avatar" 
              className="h-10 w-10 rounded-full border-2 border-primary-container/20 group-hover:border-primary transition-all object-cover" 
              src={displayUser.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
            />
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/5 rounded-xl transition-all border border-transparent hover:border-error/20 group"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;


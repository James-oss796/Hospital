import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';
import { useAuth } from '../../context/AuthContext';

const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased font-manrope">
      {isAuthenticated && <SideNavBar />}
      {isAuthenticated && <TopNavBar />}
      <main className={`min-h-screen transition-all duration-300 ${isAuthenticated ? 'pl-64 pt-16 p-8' : ''}`}>
        <div className={isAuthenticated ? 'max-w-[1600px] mx-auto' : ''}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;


import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

interface AppLayoutProps {
  children: ReactNode;
  onLogout?: () => void;
  onNavigate?: (menuId: string, subMenuId?: string) => void;
}

function AppLayout({ children, onLogout, onNavigate }: AppLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Sidebar onNavigate={onNavigate} />
      <div className="dashboard-main">
        <TopHeader onLogout={onLogout} />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;


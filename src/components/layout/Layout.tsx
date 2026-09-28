/**
 * Main Layout with Sidebar
 */

import { useState, type ReactElement } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useUI, useAuth, useConfig } from '../../store';
import { LogOut, ChevronLeft, ChevronRight, Menu as MenuIcon } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Painel', icon: 'LayoutDashboard' },
  { path: '/patients', label: 'Pacientes', icon: 'Users' },
  { path: '/agenda', label: 'Agenda', icon: 'Calendar' },
  { path: '/services', label: 'Serviços', icon: 'Stethoscope' },
  { path: '/lgpd', label: 'LGPD', icon: 'Shield' },
  { path: '/reports', label: 'Relatórios', icon: 'FileText' },
] as const;

const ADMIN_NAV = { path: '/admin', label: 'Configurações', icon: 'Settings' };

export function Layout() {
  const navigate = useNavigate();
  const { professional, logout, isAdmin } = useAuth();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUI();
  const { config, isDemo } = useConfig();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${!sidebarOpen ? 'hidden' : ''}`}
        role="navigation"
        aria-label="Menu principal"
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="64" height="64" rx="14" className="brand-bg"/>
                <text x="32" y="42" textAnchor="middle" className="brand-text">CP</text>
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-title">
                <strong>{config?.clinic?.name || 'Clínica Psi'}</strong>
                <span>{config?.clinic?.unit || 'Unidade'}</span>
              </div>
            )}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expandir menu' : 'Colapsar menu'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  title={item.label}
                >
                  <Icon name={item.icon} className="w-5 h-5" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          {isAdmin && (
            <ul>
              <li className="nav-divider" role="separator" />
              <li>
                <NavLink
                  to={ADMIN_NAV.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  title={ADMIN_NAV.label}
                >
                  <Icon name={ADMIN_NAV.icon} className="w-5 h-5" />
                  {!sidebarCollapsed && <span>{ADMIN_NAV.label}</span>}
                </NavLink>
              </li>
            </ul>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {professional?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <strong>{professional?.name}</strong>
                <span>{professional?.crp}</span>
              </div>
            )}
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Sair"
            aria-label="Sair do sistema"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Main content */}
      <main className="main-content" role="main">
        <header className="topbar">
          <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Abrir menu">
            <MenuIcon className="w-6 h-6" />
          </button>

          <div className="topbar-search">
            <input
              type="search"
              placeholder="Buscar paciente..."
              className="search-input"
              aria-label="Buscar paciente"
            />
          </div>

          <div className="topbar-actions">
            {isDemo && (
              <span className="demo-badge">Modo Demonstração</span>
            )}
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

// Dynamic icon component
function Icon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, ReactElement> = {
    LayoutDashboard: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    Users: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Calendar: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    Stethoscope: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 2v2"/><path d="M5.17 21 4 18"/><path d="M20 4 18.81 4.72"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36"/><path d="M10.37 20.63a9 9 0 0 1 0-12.54"/><path d="M18 10a4 4 0 0 1-4 4h-1"/></svg>,
    Shield: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    FileText: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2v6h6"/><path d="M16 22H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h11"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
    Settings: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 1 4.6 9a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 1 1.51-1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  };

  return icons[name] || <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>;
}

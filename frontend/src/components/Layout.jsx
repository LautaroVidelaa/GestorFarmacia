import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Pill, Tags, Users, Activity } from 'lucide-react';

export default function Layout() {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/medicamentos', label: 'Medicamentos', icon: Pill },
    { to: '/categorias', label: 'Categorías', icon: Tags },
    { to: '/empleados', label: 'Empleados', icon: Users },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        borderRight: '1px solid #1e293b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <Activity size={28} color="#38bdf8" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Gestión de Farmacia</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  color: isActive ? '#fff' : '#94a3b8',
                  backgroundColor: isActive ? '#0284c7' : 'transparent',
                })}
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* contenido principal */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
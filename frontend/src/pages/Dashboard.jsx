import { useState, useEffect } from 'react';
import api from '../services/api';
import { Pill, Tags, Users, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalCategories: 0,
    totalEmployees: 0,
    lowStockMeds: [],
    expiringMeds: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [medsRes, catsRes, empsRes] = await Promise.all([
          api.get('/medicines'),
          api.get('/categories'),
          api.get('/employees'),
        ]);

        const meds = medsRes.data;
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        // control de stock
        const lowStock = meds.filter((m) => m.stock <= 5);

        // alertas de vencimiento
        const expiring = meds.filter((m) => {
          const expDate = new Date(m.fechaVencimiento);
          return expDate <= thirtyDaysFromNow;
        });

        setStats({
          totalMedicines: meds.length,
          totalCategories: catsRes.data.length,
          totalEmployees: empsRes.data.length,
          lowStockMeds: lowStock,
          expiringMeds: expiring,
        });
      } catch (err) {
        console.error('Error al cargar datos del dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cardStyle = {
    background: '#fff',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  };

  if (loading) {
    return <div style={{ color: '#64748b', padding: '2rem' }}>Cargando resumen del sistema...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Panel de Control</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Visión general del inventario, personal y alertas críticas de la farmacia.</p>
      </div>

      {/* tarjetas de metricas principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={cardStyle}>
          <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.85rem', borderRadius: '10px' }}>
            <Pill size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Medicamentos</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a' }}>{stats.totalMedicines}</div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.85rem', borderRadius: '10px' }}>
            <Tags size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Categorías</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a' }}>{stats.totalCategories}</div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.85rem', borderRadius: '10px' }}>
            <Users size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Empleados</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a' }}>{stats.totalEmployees}</div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.85rem', borderRadius: '10px' }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Stock Crítico</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#dc2626' }}>{stats.lowStockMeds.length}</div>
          </div>
        </div>
      </div>

      {/* tablas de alertas y monitoreo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* alerta de stock */}
        <div style={{ background: '#fff', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="#dc2626" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Control de Stock Bajo</h3>
            </div>
            <Link to="/medicamentos" style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>
              Ver todos →
            </Link>
          </div>

          {stats.lowStockMeds.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No hay medicamentos con stock crítico en este momento.</p>
          ) : (
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Stock Actual</th>
                  <th>Laboratorio</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockMeds.slice(0, 5).map((med) => (
                  <tr key={med.id}>
                    <td style={{ fontWeight: 600 }}>{med.nombre}</td>
                    <td>
                      <span style={{ color: '#dc2626', fontWeight: 700 }}>{med.stock} un.</span>
                    </td>
                    <td style={{ color: '#64748b' }}>{med.laboratorio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* alerta de vencimiento próximo */}
        <div style={{ background: '#fff', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="#d97706" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Próximos a Vencer (30 días)</h3>
            </div>
            <Link to="/medicamentos" style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>
              Ver todos →
            </Link>
          </div>

          {stats.expiringMeds.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No hay medicamentos próximos a vencer.</p>
          ) : (
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Fecha de Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {stats.expiringMeds.slice(0, 5).map((med) => (
                  <tr key={med.id}>
                    <td style={{ fontWeight: 600 }}>{med.nombre}</td>
                    <td style={{ color: '#d97706', fontWeight: 600 }}>{med.fechaVencimiento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
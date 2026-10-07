import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // estados del formulario lateral
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
    cargo: '',
    fechaIngreso: '',
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employees');
      setEmployees(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la lista de empleados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (emp) => {
    setIsEditing(true);
    setSelectedId(emp.id);
    setFormData({
      nombre: emp.nombre,
      apellido: emp.apellido,
      dni: emp.dni,
      email: emp.email,
      telefono: emp.telefono,
      cargo: emp.cargo,
      fechaIngreso: emp.fechaIngreso?.split('T')[0] || '',
    });
    setFormError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedId(null);
    setFormData({
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      telefono: '',
      cargo: '',
      fechaIngreso: '',
    });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.patch(`/employees/${selectedId}`, formData);
      } else {
        await api.post('/employees', formData);
      }
      handleCancel();
      fetchEmployees();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar el empleado';
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar a este empleado?')) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar el empleado');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Gestión de Empleados</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Administración de personal de farmacia y roles asignados.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        {/* tabla de empleados */}
        <div>
          {error && (
            <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>DNI</th>
                  <th>Cargo</th>
                  <th>Contacto</th>
                  <th>Ingreso</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      Cargando personal...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      No hay empleados registrados todavía.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp.id}>
                      <td style={{ fontWeight: 600 }}>
                        {emp.nombre} {emp.apellido}
                      </td>
                      <td style={{ color: '#475569' }}>{emp.dni}</td>
                      <td>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          background: '#f1f5f9',
                          color: '#334155',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {emp.cargo}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                        <div>{emp.email}</div>
                        <div style={{ color: '#94a3b8' }}>{emp.telefono}</div>
                      </td>
                      <td style={{ color: '#475569', fontSize: '0.8rem' }}>{emp.fechaIngreso}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleEditClick(emp)}
                            style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.35rem 0.5rem' }}
                            title="Editar"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id)}
                            style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.35rem 0.5rem' }}
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* formulario lateral */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#0f172a' }}>
            {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h3>

          {formError && (
            <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Ana"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  required
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Ej. Gómez"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                  DNI *
                </label>
                <input
                  type="text"
                  name="dni"
                  required
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="Ej. 38123456"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                  Cargo *
                </label>
                <input
                  type="text"
                  name="cargo"
                  required
                  value={formData.cargo}
                  onChange={handleChange}
                  placeholder="Ej. Farmacéutico/a"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                  Teléfono *
                </label>
                <input
                  type="text"
                  name="telefono"
                  required
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="261..."
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                  Fecha Ingreso *
                </label>
                <input
                  type="date"
                  name="fechaIngreso"
                  required
                  value={formData.fechaIngreso}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                style={{ flex: 1, justifyContent: 'center', background: '#0284c7', color: '#fff' }}
              >
                {isEditing ? <Check size={16} /> : <Plus size={16} />}
                {isEditing ? 'Actualizar' : 'Guardar'}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{ background: '#e2e8f0', color: '#475569' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
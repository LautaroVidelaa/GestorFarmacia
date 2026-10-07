import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X, Check, AlertCircle } from 'lucide-react';

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // estados del formulario modal lateral
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    laboratorio: '',
    fechaVencimiento: '',
    categoriaId: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [medsRes, catsRes] = await Promise.all([
        api.get('/medicines'),
        api.get('/categories'),
      ]);
      setMedicines(medsRes.data);
      setCategories(catsRes.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la información. Verifica la conexión con el backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (med) => {
    setIsEditing(true);
    setSelectedId(med.id);
    setFormData({
      nombre: med.nombre,
      descripcion: med.descripcion || '',
      precio: med.precio,
      stock: med.stock,
      laboratorio: med.laboratorio,
      fechaVencimiento: med.fechaVencimiento?.split('T')[0] || '',
      categoriaId: med.categoria?.id || '',
    });
    setFormError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedId(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      laboratorio: '',
      fechaVencimiento: '',
      categoriaId: '',
    });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoriaId) {
      setFormError('Debes seleccionar una categoría obligatoriamente');
      return;
    }

    const payload = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
      categoriaId: parseInt(formData.categoriaId, 10),
    };

    try {
      if (isEditing) {
        await api.patch(`/medicines/${selectedId}`, payload);
      } else {
        await api.post('/medicines', payload);
      }
      handleCancel();
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar el medicamento';
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este medicamento?')) return;
    try {
      await api.delete(`/medicines/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar el medicamento');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Gestión de Medicamentos</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Control de inventario, precios, laboratorios y vencimientos.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        {/* tabla de medicamentos */}
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
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Laboratorio</th>
                  <th>Vencimiento</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      Cargando medicamentos...
                    </td>
                  </tr>
                ) : medicines.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      No hay medicamentos registrados aún.
                    </td>
                  </tr>
                ) : (
                  medicines.map((med) => (
                    <tr key={med.id}>
                      <td style={{ fontWeight: 600 }}>
                        {med.nombre}
                        {med.descripcion && (
                          <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>
                            {med.descripcion}
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          background: '#e0f2fe',
                          color: '#0369a1',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {med.categoria?.nombre || 'Sin categoría'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>${Number(med.precio).toFixed(2)}</td>
                      <td>
                        <span style={{
                          fontWeight: 600,
                          color: med.stock <= 5 ? '#dc2626' : '#16a34a'
                        }}>
                          {med.stock} un.
                        </span>
                      </td>
                      <td style={{ color: '#475569' }}>{med.laboratorio}</td>
                      <td style={{ color: '#475569', fontSize: '0.8rem' }}>{med.fechaVencimiento}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleEditClick(med)}
                            style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.35rem 0.5rem' }}
                            title="Editar"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(med.id)}
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
            {isEditing ? 'Editar Medicamento' : 'Nuevo Medicamento'}
          </h3>

          {categories.length === 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem', background: '#fef3c7', color: '#92400e', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
              <AlertCircle size={18} />
              <span>Debes crear al menos una categoría antes de registrar medicamentos.</span>
            </div>
          )}

          {formError && (
            <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
                placeholder="Ej. Paracetamol 500mg"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                Categoría *
              </label>
              <select
                name="categoriaId"
                required
                value={formData.categoriaId}
                onChange={handleChange}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                  Precio ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="precio"
                  required
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                  Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                  Laboratorio *
                </label>
                <input
                  type="text"
                  name="laboratorio"
                  required
                  value={formData.laboratorio}
                  onChange={handleChange}
                  placeholder="Ej. Roemmers"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                  Vencimiento *
                </label>
                <input
                  type="date"
                  name="fechaVencimiento"
                  required
                  value={formData.fechaVencimiento}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem', color: '#475569' }}>
                Descripción
              </label>
              <textarea
                name="descripcion"
                rows="2"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Presentación, dosis o notas..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={categories.length === 0}
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
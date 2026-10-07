import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // estado del formulario
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [formError, setFormError] = useState('');

  // obtener categorias desde el backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las categorías. Asegúrate de que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (cat) => {
    setIsEditing(true);
    setSelectedId(cat.id);
    setFormData({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
    setFormError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedId(null);
    setFormData({ nombre: '', descripcion: '' });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setFormError('El nombre es obligatorio');
      return;
    }

    try {
      if (isEditing) {
        await api.patch(`/categories/${selectedId}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      handleCancel();
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar los datos';
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta categoría?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo eliminar la categoría');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Gestión de Categorías</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Administra las familias y clasificaciones de medicamentos.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Tabla de Categorías */}
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
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      Cargando categorías...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      No hay categorías registradas todavía.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: 600, color: '#64748b' }}>#{cat.id}</td>
                      <td style={{ fontWeight: 600 }}>{cat.nombre}</td>
                      <td style={{ color: '#64748b' }}>{cat.descripcion || '-'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditClick(cat)}
                            style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.4rem 0.6rem' }}
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.4rem 0.6rem' }}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
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

        {/* formulario para crear y editar */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#0f172a' }}>
            {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
          </h3>

          {formError && (
            <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Analgésicos, Antibióticos"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>
                Descripción
              </label>
              <textarea
                name="descripcion"
                rows="3"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Breve detalle sobre la categoría..."
              />
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
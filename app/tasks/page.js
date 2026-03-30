'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    startDate: '',
    endDate: '',
    color: '#67b7dc',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingTask ? 'PUT' : 'POST';
    const url = editingTask ? `/api/tasks/${editingTask._id}` : '/api/tasks';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchTasks();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      startDate: '',
      endDate: '',
      color: '#67b7dc',
    });
    setEditingTask(null);
    setShowForm(false);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      startDate: new Date(task.startDate).toISOString().split('T')[0],
      endDate: new Date(task.endDate).toISOString().split('T')[0],
      color: task.color || '#67b7dc',
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-handlee text-4xl text-pink-bubblegum">Gestor de Tareas</h1>
          <p className="text-gray-500">Organiza tus proyectos paso a paso</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-pink-bubblegum text-white px-6 py-3 rounded-full font-bold hover:bg-pink-400 transition-all shadow-lg shadow-pink-bubblegum/20"
        >
          <Plus className="w-5 h-5" /> Nueva Tarea
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-pink-pastel shadow-2xl max-w-2xl w-full p-8 relative animate-in zoom-in duration-300">
            <button onClick={resetForm} className="absolute top-6 right-6 text-gray-400 hover:text-pink-bubblegum transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-handlee text-3xl text-gray-800 mb-6">{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Título</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-pink-pastel focus:ring-2 focus:ring-pink-bubblegum outline-none transition-all"
                  placeholder="Ej: Hornear cupcakes de vainilla"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-pink-pastel focus:ring-2 focus:ring-pink-bubblegum outline-none transition-all h-24"
                  placeholder="Detalles de la tarea..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Fecha Inicio</label>
                <input
                  required
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-3 rounded-xl border border-pink-pastel focus:ring-2 focus:ring-pink-bubblegum outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Fecha Fin</label>
                <input
                  required
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full p-3 rounded-xl border border-pink-pastel focus:ring-2 focus:ring-pink-bubblegum outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Prioridad</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full p-3 rounded-xl border border-pink-pastel focus:ring-2 focus:ring-pink-bubblegum outline-none"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Color (Grupo)</label>
                <div className="flex gap-2">
                  {['#67b7dc', '#6794dc', '#a367dc', '#dc6767'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-10 h-10 rounded-full transition-all border-2 ${formData.color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-pink-bubblegum text-white rounded-2xl font-bold hover:bg-pink-400 transition-all shadow-lg"
                >
                  {editingTask ? 'Guardar Cambios' : 'Crear Tarea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-bounce text-4xl">🧁</div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] border border-pink-pastel shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-pastel/30">
                <th className="p-6 font-handlee text-xl text-gray-700">Tarea</th>
                <th className="p-6 font-handlee text-xl text-gray-700">Fechas</th>
                <th className="p-6 font-handlee text-xl text-gray-700">Prioridad</th>
                <th className="p-6 font-handlee text-xl text-gray-700">Estado</th>
                <th className="p-6 font-handlee text-xl text-gray-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-400 font-medium">
                    No hay tareas creadas aún. ¡Empieza creando la primera!
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className="border-t border-pink-pastel/50 hover:bg-pink-pastel/10 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.color }}></div>
                        <div>
                          <p className="font-bold text-gray-800">{task.title}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{task.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm text-gray-600">
                        <p>{new Date(task.startDate).toLocaleDateString()}</p>
                        <p className="text-gray-400">hasta {new Date(task.endDate).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="p-6">
                      <select
                        value={task.status}
                        onChange={async (e) => {
                          const res = await fetch(`/api/tasks/${task._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: e.target.value }),
                          });
                          if (res.ok) fetchTasks();
                        }}
                        className="p-2 rounded-lg bg-gray-50 border border-pink-pastel text-xs font-bold text-gray-600 outline-none focus:ring-1 focus:ring-pink-bubblegum"
                      >
                        <option value="todo">Pendiente</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="done">Completada</option>
                      </select>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    high: 'bg-red-100 text-red-600 border-red-200',
    medium: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    low: 'bg-green-100 text-green-600 border-green-200',
  };
  const labels = { high: 'Alta', medium: 'Media', low: 'Baja' };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
}

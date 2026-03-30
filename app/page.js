'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Calendar, Flag, CheckCircle2, MoreVertical, Trash2, Edit2, AlertCircle } from 'lucide-react';

export default function GanttView() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [error, setError] = useState(null);
  
  const initialFormState = {
    title: '',
    startDate: '',
    endDate: '',
    priority: 'Medium',
    color: '#1E3A8A',
    subtasks: []
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenModal = (task = null) => {
    if (task) {
      setIsEditing(task._id);
      setFormData({
        title: task.title,
        startDate: new Date(task.startDate).toISOString().split('T')[0],
        endDate: new Date(task.endDate).toISOString().split('T')[0],
        priority: task.priority || 'Medium',
        color: task.color || '#1E3A8A',
        subtasks: task.subtasks || []
      });
    } else {
      setIsEditing(null);
      setFormData(initialFormState);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const url = isEditing ? `/api/tasks/${isEditing}` : '/api/tasks';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();
      
      if (res.ok && result.success) {
        await fetchTasks();
        setShowModal(false);
        setFormData(initialFormState);
      } else {
        setError(result.error || 'Error al guardar la tarea');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Error de conexión con el servidor');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de que desea eliminar esta tarea corporativa?')) return;
    
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchTasks();
      } else {
        alert('Error al eliminar la tarea');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="w-12 h-12 border-4 border-borcelle-blue-deep border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-borcelle-blue-deep font-semibold tracking-wide">Iniciando Panel Borcelle...</p>
    </div>
  );

  // Timeline logic
  const startDates = tasks.length > 0 ? tasks.map(t => new Date(t.startDate)) : [new Date()];
  const endDates = tasks.length > 0 ? tasks.map(t => new Date(t.endDate)) : [new Date(Date.now() + 86400000 * 30)];
  
  const minDate = new Date(Math.min(...startDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...endDates.map(d => d.getTime())));
  
  minDate.setDate(minDate.getDate() - 3);
  maxDate.setDate(maxDate.getDate() + 3);

  const totalTime = maxDate.getTime() - minDate.getTime();
  const days = Math.ceil(totalTime / (1000 * 60 * 60 * 24));

  const dateLabels = [];
  for (let i = 0; i <= days; i += 7) {
    const date = new Date(minDate);
    date.setDate(date.getDate() + i);
    dateLabels.push({
      label: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`,
      offset: (i / days) * 100,
    });
  }

  return (
    <div className="min-h-screen bg-borcelle-gray-light font-sans text-borcelle-dark">
      <header className="bg-white border-b border-borcelle-border px-8 py-5 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-borcelle-blue-deep rounded-sm flex items-center justify-center text-white font-bold text-xl">B</div>
          <h1 className="text-2xl font-bold text-borcelle-blue-deep tracking-tight">Gantt Manager</h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-borcelle-blue-deep text-white px-6 py-2.5 rounded-sm hover:bg-blue-900 transition-all flex items-center gap-2 font-semibold text-sm tracking-wide shadow-md active:scale-95"
        >
          <Plus size={18} /> NUEVA TAREA
        </button>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto">
        {tasks.length === 0 && !loading && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-sm text-borcelle-blue-deep flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">No hay tareas registradas. Comience agregando una nueva tarea o ejecutando el script de población.</p>
          </div>
        )}

        <div className="bg-white border border-borcelle-border rounded-sm shadow-sm overflow-hidden">
          <div className="relative flex min-h-[70vh]">
            
            {/* Lista de Tareas (Izquierda) */}
            <div className="w-80 flex-shrink-0 pt-14 bg-white border-r border-borcelle-border z-20">
              <div className="h-14 flex items-center px-6 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-borcelle-border absolute top-0 left-0 w-80 bg-white">
                Descripción de Tarea
              </div>
              <div className="divide-y divide-gray-50">
                {tasks.map((task) => (
                  <div key={task._id} className="h-12 flex items-center justify-between px-6 text-sm text-gray-600 font-medium hover:bg-borcelle-gray-light group transition-colors">
                    <span className="truncate flex-grow mr-2">{task.title}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(task)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm" title="Editar">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(task._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm" title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagrama Gantt (Derecha) */}
            <div className="flex-grow relative overflow-x-auto">
              <div className="h-14 border-b border-borcelle-border flex items-center bg-gray-50/50 sticky top-0 z-10">
                {dateLabels.map((date, idx) => (
                  <div
                    key={idx}
                    className="absolute text-[11px] font-semibold text-gray-500 -translate-x-1/2"
                    style={{ left: `${date.offset}%` }}
                  >
                    {date.label}
                  </div>
                ))}
              </div>

              <div className="absolute inset-0 pointer-events-none pt-14">
                {dateLabels.map((date, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 border-l border-borcelle-border/50"
                    style={{ left: `${date.offset}%` }}
                  />
                ))}
              </div>

              <div className="relative pt-0 divide-y divide-gray-50">
                {tasks.map((task) => {
                  const taskStart = new Date(task.startDate).getTime();
                  const taskEnd = new Date(task.endDate).getTime();
                  const left = ((taskStart - minDate.getTime()) / totalTime) * 100;
                  const width = ((taskEnd - taskStart) / totalTime) * 100;

                  return (
                    <div key={task._id} className="h-12 flex items-center relative group">
                      <div
                        className="h-6 rounded-sm absolute transition-all hover:brightness-110 cursor-pointer shadow-sm z-10"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          backgroundColor: task.color || '#3B82F6',
                        }}
                        onClick={() => handleOpenModal(task)}
                        title={`${task.title} | Prioridad: ${task.priority}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal CRUD Borcelle */}
      {showModal && (
        <div className="fixed inset-0 bg-borcelle-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl max-w-lg w-full p-0 overflow-hidden border border-borcelle-border animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-borcelle-blue-deep px-8 py-4 flex justify-between items-center text-white">
              <h2 className="text-lg font-bold tracking-tight uppercase">
                {isEditing ? 'Actualizar Registro' : 'Registrar Nueva Tarea'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-sm text-red-600 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Título de la Tarea</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Análisis de Mercado Q2"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-borcelle-border rounded-sm focus:outline-none focus:ring-1 focus:ring-borcelle-blue-sky text-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha de Inicio</label>
                  <input
                    required
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-borcelle-border rounded-sm focus:outline-none focus:ring-1 focus:ring-borcelle-blue-sky text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha Finalización</label>
                  <input
                    required
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-borcelle-border rounded-sm focus:outline-none focus:ring-1 focus:ring-borcelle-blue-sky text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Prioridad Ejecutiva</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-borcelle-border rounded-sm focus:outline-none focus:ring-1 focus:ring-borcelle-blue-sky text-sm appearance-none cursor-pointer"
                >
                  <option value="High">Crítica (Alta)</option>
                  <option value="Medium">Estándar (Media)</option>
                  <option value="Low">Informativa (Baja)</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Color de Identificación</label>
                <div className="flex gap-4 p-3 bg-borcelle-gray-light rounded-sm border border-borcelle-border">
                  {['#1E3A8A', '#3B82F6', '#8B5CF6', '#EF4444'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-8 h-8 rounded-sm border-2 transition-all ${formData.color === c ? 'border-borcelle-dark scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-borcelle-border text-gray-600 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-borcelle-blue-deep text-white py-3 font-bold text-xs uppercase tracking-widest hover:bg-blue-900 transition-all shadow-md active:scale-95"
                >
                  {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

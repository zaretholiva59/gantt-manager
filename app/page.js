'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Calendar, Flag, CheckCircle2, MoreVertical } from 'lucide-react';

export default function GanttView() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    priority: 'Medium',
    color: '#3B82F6',
    subtasks: []
  });

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

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchTasks();
        setShowModal(false);
        setFormData({ title: '', startDate: '', endDate: '', priority: 'Medium', color: '#3B82F6', subtasks: [] });
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="w-12 h-12 border-4 border-borcelle-blue-deep border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-borcelle-blue-deep font-semibold tracking-wide">Cargando Sistema de Gestión...</p>
    </div>
  );

  // Timeline logic
  const startDates = tasks.length > 0 ? tasks.map(t => new Date(t.startDate)) : [new Date()];
  const endDates = tasks.length > 0 ? tasks.map(t => new Date(t.endDate)) : [new Date(Date.now() + 86400000 * 30)];
  
  const minDate = new Date(Math.min(...startDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...endDates.map(d => d.getTime())));
  
  // Padding for visual comfort
  minDate.setDate(minDate.getDate() - 3);
  maxDate.setDate(maxDate.getDate() + 3);

  const totalTime = maxDate.getTime() - minDate.getTime();
  const days = Math.ceil(totalTime / (1000 * 60 * 60 * 24));

  const dateLabels = [];
  for (let i = 0; i <= days; i += 7) { // Weekly labels for cleaner UI
    const date = new Date(minDate);
    date.setDate(date.getDate() + i);
    dateLabels.push({
      label: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`,
      offset: (i / days) * 100,
    });
  }

  return (
    <div className="min-h-screen bg-borcelle-gray-light font-sans text-borcelle-dark">
      {/* Header Corporativo */}
      <header className="bg-white border-b border-borcelle-border px-8 py-5 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-borcelle-blue-deep rounded-sm flex items-center justify-center text-white font-bold text-xl">B</div>
          <h1 className="text-2xl font-bold text-borcelle-blue-deep tracking-tight">Gantt Manager</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-borcelle-blue-deep text-white px-6 py-2.5 rounded-sm hover:bg-blue-900 transition-all flex items-center gap-2 font-semibold text-sm tracking-wide shadow-md active:scale-95"
        >
          <Plus size={18} /> NUEVA TAREA
        </button>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto">
        <div className="bg-white border border-borcelle-border rounded-sm shadow-sm overflow-hidden">
          <div className="relative flex min-h-[70vh]">
            
            {/* Lista de Tareas (Izquierda) */}
            <div className="w-72 flex-shrink-0 pt-14 bg-white border-r border-borcelle-border z-20">
              <div className="h-14 flex items-center px-6 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-borcelle-border absolute top-0 left-0 w-72 bg-white">
                Descripción de Tarea
              </div>
              <div className="divide-y divide-gray-50">
                {tasks.map((task) => (
                  <div key={task._id} className="h-12 flex items-center px-6 text-sm text-gray-600 font-medium hover:bg-borcelle-gray-light transition-colors truncate">
                    {task.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Diagrama Gantt (Derecha) */}
            <div className="flex-grow relative overflow-x-auto">
              {/* Eje de Fechas */}
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

              {/* Grid Lines */}
              <div className="absolute inset-0 pointer-events-none pt-14">
                {dateLabels.map((date, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 border-l border-borcelle-border/50"
                    style={{ left: `${date.offset}%` }}
                  />
                ))}
              </div>

              {/* Barras de Tareas */}
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
                        title={`${task.title} (${new Date(task.startDate).toLocaleDateString()} - ${new Date(task.endDate).toLocaleDateString()})`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Corporativo de Nueva Tarea */}
      {showModal && (
        <div className="fixed inset-0 bg-borcelle-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl max-w-lg w-full p-0 overflow-hidden border border-borcelle-border animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-borcelle-blue-deep px-8 py-4 flex justify-between items-center text-white">
              <h2 className="text-lg font-bold tracking-tight uppercase">Registrar Nueva Tarea</h2>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Título de la Tarea</label>
                <input
                  required
                  type="text"
                  placeholder="Ingrese el nombre del proyecto o tarea"
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
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha de Finalización</label>
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
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Prioridad del Proyecto</label>
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
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Asignación de Color Corporativo</label>
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
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

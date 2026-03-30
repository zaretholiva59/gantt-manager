'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Calendar, Flag, CheckCircle2, Star } from 'lucide-react';

export default function GanttView() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    priority: 'Medium',
    color: '#67b7dc',
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
        fetchTasks();
        setShowModal(false);
        setFormData({ title: '', startDate: '', endDate: '', priority: 'Medium', color: '#67b7dc', subtasks: [] });
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-cream-soft gap-4">
      <div className="text-6xl animate-bounce">🧁</div>
      <p className="font-handlee text-2xl text-pink-bubblegum">Cocinando tu cronograma...</p>
    </div>
  );

  // Timeline logic
  const startDates = tasks.length > 0 ? tasks.map(t => new Date(t.startDate)) : [new Date()];
  const endDates = tasks.length > 0 ? tasks.map(t => new Date(t.endDate)) : [new Date(Date.now() + 86400000 * 7)];
  const minDate = new Date(Math.min(...startDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...endDates.map(d => d.getTime())));
  minDate.setDate(minDate.getDate() - 2);
  maxDate.setDate(maxDate.getDate() + 2);

  const totalTime = maxDate.getTime() - minDate.getTime();
  const days = Math.ceil(totalTime / (1000 * 60 * 60 * 24));

  const dateLabels = [];
  for (let i = 0; i <= days; i += 5) {
    const date = new Date(minDate);
    date.setDate(date.getDate() + i);
    dateLabels.push({
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      offset: (i / days) * 100,
    });
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen relative font-sans">
      {/* Decorative Elements */}
      <div className="bg-decor">
        <div className="decor-circle w-96 h-96 -top-20 -left-20" />
        <div className="decor-circle w-64 h-64 top-1/2 -right-20" />
        <Star className="decor-star top-20 right-40" size={24} />
        <Star className="decor-star bottom-40 left-20" size={32} />
        <Star className="decor-star top-1/2 left-1/3" size={16} />
      </div>

      <div className="flex justify-between items-end mb-12 relative z-10">
        <div>
          <h1 className="text-5xl font-handlee text-pink-bubblegum mb-2 drop-shadow-sm">Gantt Manager</h1>
          <p className="text-gray-500 font-medium">Visualiza tu éxito con un toque de dulzura 🧁</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-bubblegum text-white px-8 py-4 rounded-full hover:bg-pink-400 transition-all flex items-center gap-2 shadow-lg shadow-pink-bubblegum/20 font-bold active:scale-95"
        >
          <Plus size={20} /> Nueva Tarea
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-pink-pastel/50 shadow-xl relative z-10">
        <div className="relative flex min-h-[600px]">
          {/* Task Names (Left) */}
          <div className="w-64 flex-shrink-0 pt-16 bg-white/40 border-r border-pink-pastel/20 z-10">
            {tasks.map((task) => (
              <div key={task._id} className="h-12 flex items-center px-8 text-sm text-gray-700 font-semibold border-b border-pink-pastel/10 hover:bg-pink-pastel/10 transition-colors">
                {task.title}
              </div>
            ))}
          </div>

          {/* Timeline (Right) */}
          <div className="flex-grow relative pt-16 overflow-x-auto scrollbar-hide">
            {/* Header Dates */}
            <div className="absolute top-0 left-0 right-0 h-16 border-b border-pink-pastel/30 flex items-center">
              {dateLabels.map((date, idx) => (
                <div
                  key={idx}
                  className="absolute text-[10px] font-bold text-pink-400/80 -translate-x-1/2 uppercase tracking-widest"
                  style={{ left: `${date.offset}%` }}
                >
                  {date.label}
                </div>
              ))}
            </div>

            {/* Grid Lines */}
            <div className="absolute inset-0 pointer-events-none pt-16">
              {dateLabels.map((date, idx) => (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 border-l border-pink-pastel/20"
                  style={{ left: `${date.offset}%` }}
                />
              ))}
            </div>

            {/* Task Bars */}
            <div className="relative">
              {tasks.map((task) => {
                const taskStart = new Date(task.startDate).getTime();
                const taskEnd = new Date(task.endDate).getTime();
                const left = ((taskStart - minDate.getTime()) / totalTime) * 100;
                const width = ((taskEnd - taskStart) / totalTime) * 100;

                return (
                  <div key={task._id} className="h-12 flex items-center relative group border-b border-pink-pastel/5">
                    <div
                      className="h-6 rounded-full absolute transition-all hover:scale-[1.02] cursor-pointer shadow-md shadow-black/5 hover:brightness-105"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: task.color,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-pink-900/10 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 relative border border-pink-pastel/50 animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-pink-bubblegum hover:text-pink-600 bg-pink-pastel/20 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-3xl font-handlee mb-8 text-pink-bubblegum">Nueva Tarea 🧁</h2>
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest ml-2">Título de la Tarea</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Decorar pasteles"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-4 bg-pink-pastel/10 border border-pink-pastel/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-bubblegum/20 text-gray-700 placeholder:text-pink-300 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest ml-2">Fecha Inicio</label>
                  <input
                    required
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-4 bg-pink-pastel/10 border border-pink-pastel/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-bubblegum/20 text-gray-700 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest ml-2">Fecha Fin</label>
                  <input
                    required
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-4 bg-pink-pastel/10 border border-pink-pastel/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-bubblegum/20 text-gray-700 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest ml-2">Prioridad</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-6 py-4 bg-pink-pastel/10 border border-pink-pastel/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-bubblegum/20 text-gray-700 appearance-none transition-all cursor-pointer"
                >
                  <option value="High">🔥 Alta Prioridad</option>
                  <option value="Medium">✨ Media Prioridad</option>
                  <option value="Low">🍃 Baja Prioridad</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-pink-400 uppercase tracking-widest ml-2">Elige un sabor (Color)</label>
                <div className="flex justify-between mt-2 p-2 bg-pink-pastel/10 rounded-2xl border border-pink-pastel/20">
                  {['#67b7dc', '#6794dc', '#a367dc', '#dc6767'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${formData.color === c ? 'border-pink-bubblegum scale-110 shadow-lg' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-pink-bubblegum text-white py-5 rounded-2xl font-bold hover:bg-pink-400 transition-all mt-4 shadow-lg shadow-pink-bubblegum/30 active:scale-[0.98]"
              >
                ¡Crear Tarea Dulce! 🧁
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

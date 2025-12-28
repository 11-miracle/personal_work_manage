
import React from 'react';
import { Task, Category, Priority } from '../types';

interface Props {
  tasks: Task[];
  onAddTask: () => void;
  onToggleTask: (id: string) => void;
  onSelectTask: (id: string) => void;
  onViewCalendar: () => void;
  onOpenProfile: () => void;
  currentDate: string;
  onSetDate: (date: string) => void;
}

const Dashboard: React.FC<Props> = ({ 
  tasks, onAddTask, onToggleTask, onSelectTask, onViewCalendar, onOpenProfile, currentDate, onSetDate 
}) => {
  const dayTasks = tasks.filter(t => t.date === currentDate);
  const scheduledTasks = dayTasks.filter(t => t.isScheduled && !t.completed).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const otherTasks = dayTasks.filter(t => !t.isScheduled || t.completed);

  const getDatesRange = () => {
    const today = new Date();
    const range = [];
    for (let i = -2; i <= 2; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      range.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        day: d.getDate(),
        full: d.toISOString().split('T')[0]
      });
    }
    return range;
  };

  const dateRange = getDatesRange();

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div className="px-6 pt-4 pb-2 flex justify-between items-center">
        <div>
          <p className="text-primary text-[10px] font-extrabold uppercase tracking-[0.2em] mb-0.5">Focus Mode</p>
          <h2 className="text-2xl font-extrabold text-blue-900 flex items-center gap-2">
            Today <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(19,127,236,0.6)]"></span>
          </h2>
        </div>
        <button 
          onClick={onOpenProfile}
          className="group relative transition-all active:scale-90"
        >
          <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-blue-300 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="relative w-11 h-11 rounded-2xl bg-white border-1.5 border-blue-100 shadow-sm object-cover" alt="User" />
        </button>
      </div>

      {/* Date Selector */}
      <div className="px-6 py-3">
        <div className="flex justify-between items-center gap-3">
          {dateRange.map((d) => {
            const isActive = d.full === currentDate;
            return (
              <button 
                key={d.full}
                onClick={() => onSetDate(d.full)}
                className={`flex flex-col items-center justify-center flex-1 h-20 rounded-3xl transition-all duration-300 border ${
                  isActive ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105' : 'bg-white text-blue-400 border-blue-100'
                }`}
              >
                <span className={`text-[10px] font-bold mb-1 uppercase ${isActive ? 'text-white/80' : 'text-primary/60'}`}>{d.label}</span>
                <span className="text-lg font-extrabold">{d.day}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4 grid grid-cols-2 gap-4">
        <div className="bg-primary p-5 rounded-4xl text-white shadow-2xl shadow-primary/20 relative overflow-hidden group cursor-pointer border border-primary/50" onClick={onViewCalendar}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-xs font-bold opacity-70 uppercase tracking-wider">Completed</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold">{dayTasks.filter(t => t.completed).length}</span>
            <span className="text-[10px] font-bold opacity-60 text-white">Tasks</span>
          </div>
        </div>
        <div className="bg-white border-1.5 border-blue-100 p-5 rounded-4xl text-blue-900 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Pending</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-primary">{dayTasks.filter(t => !t.completed).length}</span>
            <span className="text-[10px] font-bold text-blue-300">Items</span>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
        <div className="flex items-center justify-between mt-6 mb-6">
          <h3 className="text-base font-extrabold text-blue-900">Timeline</h3>
          <button onClick={onViewCalendar} className="bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-full text-[10px] font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5">
            Full Schedule <span className="material-symbols-outlined text-[14px]">calendar_month</span>
          </button>
        </div>

        <div className="relative">
          {scheduledTasks.length > 0 ? (
            <div className="space-y-0 relative">
              <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-blue-100"></div>
              
              {scheduledTasks.map((task, idx) => (
                <div 
                  key={task.id} 
                  className="flex items-start gap-5 mb-6 last:mb-0 group cursor-pointer relative"
                  onClick={() => onSelectTask(task.id)}
                >
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm border-2 border-white transition-all group-hover:scale-110 ${idx === 0 ? 'bg-primary text-white' : 'bg-blue-50 text-primary border-blue-100'}`}>
                      <span className="text-[10px] font-black leading-none">{task.time?.split(':')[0]}<br/>{task.time?.split(':')[1]}</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-white p-5 rounded-3xl shadow-sm border-1.5 border-blue-100 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-1 group-hover:border-primary/30 transition-all duration-300">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-blue-900 text-sm">{task.title}</h4>
                      <div className={`w-1.5 h-1.5 rounded-full ${task.priority === Priority.HIGH ? 'bg-red-500 shadow-[0_0_8px_red]' : task.priority === Priority.MEDIUM ? 'bg-orange-500 shadow-[0_0_8px_orange]' : 'bg-green-500 shadow-[0_0_8px_green]'}`}></div>
                    </div>
                    <p className="text-xs text-blue-400 line-clamp-1 mb-3">{task.description || 'Focusing on this next'}</p>
                    <div className="flex items-center gap-2">
                       <span className="bg-blue-50 text-primary text-[9px] px-2 py-0.5 rounded-md font-bold uppercase border border-blue-100 tracking-tighter">{task.category}</span>
                       <span className="text-[9px] text-blue-300 font-bold">• {task.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-blue-100 rounded-4xl p-10 text-center">
               <div className="w-16 h-16 bg-blue-50/50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <span className="material-symbols-outlined text-primary/40 text-3xl animate-float">auto_awesome</span>
               </div>
               <p className="text-blue-900/60 text-sm font-bold tracking-tight">Your day is crystal clear.</p>
               <p className="text-blue-300 text-[10px] mt-1 font-medium">Add a task using AI magic below!</p>
            </div>
          )}
        </div>

        {/* Todo List */}
        {otherTasks.length > 0 && (
          <>
            <div className="mt-10 mb-4 flex items-center gap-3">
              <h3 className="text-base font-extrabold text-blue-900">Remaining Tasks</h3>
              <div className="flex-1 h-px bg-blue-100"></div>
            </div>
            <div className="space-y-3 pb-4">
              {otherTasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => onSelectTask(task.id)}
                  className={`flex items-center gap-4 p-5 rounded-3xl transition-all duration-300 group cursor-pointer border-1.5 ${task.completed ? 'bg-blue-50/50 border-blue-100 opacity-60 grayscale' : 'bg-white shadow-sm border-blue-100 hover:shadow-lg hover:border-primary/20'}`}
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${task.completed ? 'bg-primary border-primary rotate-[360deg]' : 'bg-blue-50 border-blue-100 group-hover:border-primary'}`}
                  >
                    {task.completed && <span className="material-symbols-outlined text-white text-[18px]">check</span>}
                  </button>
                  <div className="flex-1">
                    <p className={`font-bold text-blue-900 text-sm ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                  </div>
                  <span className="material-symbols-outlined text-blue-200 group-hover:text-primary transition-colors">arrow_forward_ios</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto flex items-center gap-3 glass border-1.5 border-blue-100 rounded-5xl p-2 shadow-2xl">
          <button 
            onClick={onAddTask}
            className="flex-1 h-14 bg-primary text-white rounded-4xl flex items-center justify-between px-6 shadow-xl shadow-primary/30 active:scale-[0.98] transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="font-bold relative flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-[20px]">magic_button</span>
              Ask AI to Create...
            </span>
            <span className="material-symbols-outlined bg-white/20 p-1.5 rounded-xl text-[18px] relative">bolt</span>
          </button>
          <button onClick={onViewCalendar} className="w-14 h-14 bg-white border-1.5 border-blue-100 rounded-4xl flex items-center justify-center text-primary shadow-lg active:scale-90 transition-all hover:bg-primary hover:text-white group">
            <span className="material-symbols-outlined transition-transform group-hover:rotate-12">calendar_today</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

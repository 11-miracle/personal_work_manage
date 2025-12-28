
import React, { useState } from 'react';
import { Task } from '../types';

interface Props {
  tasks: Task[];
  onBack: () => void;
  onToggleTask: (id: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const CalendarView: React.FC<Props> = ({ tasks, onBack, onToggleTask, selectedDate, onSelectDate }) => {
  const [viewMonth, setViewMonth] = useState(new Date());

  // Logic to generate actual month days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    
    // Padding for previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, current: false, dateStr: null });
    }

    const lastDate = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDate; i++) {
      const d = new Date(year, month, i);
      days.push({ 
        day: i, 
        current: true, 
        dateStr: d.toISOString().split('T')[0] 
      });
    }
    return days;
  };

  const monthDays = getDaysInMonth(viewMonth);
  const dayTasks = tasks.filter(t => t.date === selectedDate);

  const changeMonth = (offset: number) => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + offset, 1));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] animate-in slide-in-from-right-10 duration-300">
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-50">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-600">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-black text-lg">My Schedule</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-6 py-6">
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 border border-slate-50">
          <div className="flex items-center justify-between mb-8">
             <button onClick={() => changeMonth(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50">
               <span className="material-symbols-outlined text-slate-300">chevron_left</span>
             </button>
             <h3 className="font-black text-slate-800">
               {viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
             </h3>
             <button onClick={() => changeMonth(1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50">
               <span className="material-symbols-outlined text-slate-300">chevron_right</span>
             </button>
          </div>
          <div className="grid grid-cols-7 gap-y-4 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <span key={d} className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{d}</span>
            ))}
            {monthDays.map((d, idx) => {
              const isSelected = d.dateStr === selectedDate;
              const hasTasks = d.dateStr && tasks.some(t => t.date === d.dateStr);
              return (
                <div key={idx} className="flex flex-col items-center">
                  <button 
                    disabled={!d.current}
                    onClick={() => d.dateStr && onSelectDate(d.dateStr)}
                    className={`w-10 h-10 flex items-center justify-center rounded-2xl text-sm font-black transition-all ${
                      isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' : 
                      (d.current ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-200')
                    }`}
                  >
                    {d.day}
                  </button>
                  {hasTasks && (
                    <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-primary/40'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-6">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 space-y-4 overflow-y-auto no-scrollbar pb-8">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Date</p>
            <h2 className="text-xl font-black text-slate-900">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h2>
          </div>
          <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{dayTasks.length} Tasks</span>
        </div>

        <div className="space-y-3">
          {dayTasks.length > 0 ? dayTasks.map(task => (
            <div 
              key={task.id} 
              className={`p-4 rounded-[2rem] border transition-all flex items-start gap-4 ${task.completed ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-100 shadow-sm'}`}
            >
               <button className="pt-0.5" onClick={() => onToggleTask(task.id)}>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-primary border-primary' : 'border-slate-200'}`}>
                  {task.completed && <span className="material-symbols-outlined text-white text-[18px]">check</span>}
                </div>
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h4 className={`font-black text-slate-800 text-sm truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.title}</h4>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${task.completed ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-primary'}`}>
                    {task.time || 'Anytime'}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-slate-400">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span className="text-xs font-medium">{task.category}</span>
                </div>
              </div>
            </div>
          )) : (
             <div className="py-12 text-center">
                <span className="material-symbols-outlined text-slate-200 text-6xl">event_busy</span>
                <p className="text-slate-400 text-sm font-medium mt-2">No appointments for this date.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;


import React from 'react';
import { Task, Category, Priority } from '../types';

interface Props {
  task: Task;
  onBack: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

const TaskDetail: React.FC<Props> = ({ task, onBack, onToggle, onDelete, onEdit }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="px-6 py-4 flex items-center justify-between border-b border-blue-100">
        <button onClick={onBack} className="w-10 h-10 rounded-2xl flex items-center justify-center bg-blue-50 border border-blue-200 text-primary active:scale-90 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex gap-2">
           <button onClick={() => onToggle(task.id)} className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-blue-300 border-blue-100'}`}>
              <span className="material-symbols-outlined">{task.completed ? 'check' : 'radio_button_unchecked'}</span>
           </button>
           <button onClick={() => { if(confirm('确定要删除这个任务吗？')) onDelete(task.id); }} className="w-10 h-10 rounded-2xl border-2 flex items-center justify-center bg-red-50 border-red-100 text-red-500 hover:bg-red-100 transition-colors">
              <span className="material-symbols-outlined">delete</span>
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 no-scrollbar">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border inline-block ${task.priority === Priority.HIGH ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-primary border-blue-200'}`}>
              {task.priority} Priority
            </span>
            <button onClick={onEdit} className="text-primary font-extrabold text-sm hover:underline decoration-2">Edit</button>
          </div>
          <h1 className={`text-4xl font-black text-blue-900 leading-tight ${task.completed ? 'line-through opacity-40' : ''}`}>
            {task.title}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-wider">Date</p>
              <p className="text-sm font-bold text-blue-900">{task.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-wider">Time</p>
              <p className="text-sm font-bold text-blue-900">{task.time || 'Anytime'}</p>
            </div>
          </div>
        </div>

        {task.description && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-blue-300 uppercase tracking-widest flex items-center gap-2">
               Description <div className="h-px flex-1 bg-blue-50"></div>
            </h3>
            <p className="text-lg text-blue-800/80 leading-relaxed font-medium bg-blue-50/30 p-5 rounded-4xl border border-blue-50">
              {task.description}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-blue-50 space-y-4">
           <h3 className="text-xs font-black text-blue-300 uppercase tracking-widest">Quick Actions</h3>
           <div className="grid grid-cols-2 gap-4">
              <button className="h-14 bg-blue-50/50 border border-blue-100 rounded-3xl flex items-center justify-center gap-2 font-black text-primary hover:bg-blue-50 transition-all active:scale-95">
                 <span className="material-symbols-outlined text-[20px]">share</span> Share
              </button>
              <button onClick={onEdit} className="h-14 bg-blue-50/50 border border-blue-100 rounded-3xl flex items-center justify-center gap-2 font-black text-primary hover:bg-blue-50 transition-all active:scale-95">
                 <span className="material-symbols-outlined text-[20px]">edit</span> Edit
              </button>
           </div>
        </div>
      </div>

      <div className="p-8 border-t border-blue-50">
        <button 
          onClick={() => onToggle(task.id)}
          className={`w-full h-18 rounded-4xl font-black text-lg transition-all shadow-xl active:scale-[0.98] border ${task.completed ? 'bg-blue-50 text-blue-400 border-blue-100' : 'bg-primary text-white shadow-primary/30 border-primary-dark/20'}`}
        >
          {task.completed ? 'Mark as Active' : 'Complete Task'}
        </button>
      </div>
    </div>
  );
};

export default TaskDetail;

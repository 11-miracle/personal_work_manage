
import React from 'react';
import { Task } from '../types';

interface Props {
  tasks: Task[];
  onBack: () => void;
  onReset: () => void;
}

const Profile: React.FC<Props> = ({ tasks, onBack, onReset }) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-background animate-in slide-in-from-bottom-full duration-500 ease-out">
      <header className="px-6 py-4 flex items-center justify-between glass sticky top-0 z-10 border-b border-blue-100">
        <button onClick={onBack} className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-blue-200 text-primary active:scale-90 transition-all hover:border-primary/40">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="font-extrabold text-blue-900 tracking-tight">Identity</h2>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {/* User Card */}
        <div className="bg-white p-10 rounded-5xl shadow-xl shadow-primary/5 border-1.5 border-blue-100 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-blue-300"></div>
          <div className="relative mb-6">
            <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-blue-300 rounded-[2.5rem] opacity-20 blur-lg animate-pulse"></div>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="relative w-28 h-28 rounded-4xl bg-blue-50 border-4 border-white shadow-2xl" alt="User" />
            <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
          </div>
          <h3 className="text-3xl font-black text-blue-900 tracking-tight">Felix Zhang</h3>
          <p className="text-xs text-primary font-extrabold uppercase tracking-widest mt-1">Prime Explorer</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary p-7 rounded-4xl text-white shadow-2xl shadow-primary/20 relative overflow-hidden border border-primary/50">
            <div className="absolute right-0 bottom-0 opacity-10">
                <span className="material-symbols-outlined text-[80px]">auto_graph</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">Success Rate</p>
            <p className="text-4xl font-black">{completionRate}%</p>
          </div>
          <div className="bg-white border-1.5 border-blue-100 p-7 rounded-4xl shadow-sm">
            <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-1">Total Effort</p>
            <p className="text-4xl font-black text-blue-900">{totalCount}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-5xl shadow-sm border-1.5 border-blue-100 overflow-hidden divide-y divide-blue-50">
          {[
            { icon: 'settings', color: 'text-blue-500', label: 'App Preferences' },
            { icon: 'smart_toy', color: 'text-primary', label: 'AI Model (Gemini Pro)' },
            { icon: 'shield', color: 'text-blue-700', label: 'Privacy & Cloud' },
            { icon: 'help', color: 'text-blue-400', label: 'Support & Docs' },
          ].map((item, idx) => (
            <button key={idx} className="w-full p-6 flex items-center justify-between hover:bg-blue-50/50 transition-colors group">
              <div className="flex items-center gap-5">
                <div className={`w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                </div>
                <span className="font-extrabold text-blue-800 text-sm">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-blue-200 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          ))}
        </div>

        <button 
          onClick={onReset}
          className="w-full h-16 bg-red-50 text-red-500 font-black rounded-4xl flex items-center justify-center gap-3 border border-red-100 active:bg-red-100 transition-all hover:shadow-lg hover:shadow-red-200/20"
        >
          <span className="material-symbols-outlined text-[20px]">restart_alt</span>
          Reset App Data
        </button>
      </div>

      <div className="p-8 text-center bg-white border-t-1.5 border-blue-50">
        <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.4em]">AI TASK ENGINE V1.1.2</p>
      </div>
    </div>
  );
};

export default Profile;


import React, { useState, useRef } from 'react';
import { Task, Priority, Category } from '../types';
import { parseTaskFromSentence } from '../services/geminiService';

interface Props {
  onBack: () => void;
  onSave: (task: Task) => void;
  initialTask?: Task;
}

const CreateTask: React.FC<Props> = ({ onBack, onSave, initialTask }) => {
  const [aiInput, setAiInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAiMode, setIsAiMode] = useState(!initialTask);
  
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [time, setTime] = useState(initialTask?.time || '09:00');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority || Priority.MEDIUM);
  const [category, setCategory] = useState<Category>(initialTask?.category || Category.PERSONAL);
  const [isScheduled, setIsScheduled] = useState(initialTask?.isScheduled ?? true);

  const timeInputRef = useRef<HTMLInputElement>(null);

  const handleAISubmit = async () => {
    if (!aiInput.trim()) return;
    setLoading(true);
    const result = await parseTaskFromSentence(aiInput);
    if (result) {
      setTitle(result.title);
      if (result.description) setDescription(result.description);
      if (result.time) setTime(result.time);
      setPriority(result.priority);
      setCategory(result.category);
      setIsAiMode(false);
    }
    setLoading(false);
  };

  const handleSave = () => {
    if (!title) return;
    const taskData: Task = {
      id: initialTask?.id || Date.now().toString(),
      title,
      description,
      time: isScheduled ? time : undefined,
      date: initialTask?.date || new Date().toISOString().split('T')[0],
      priority,
      category,
      completed: initialTask?.completed || false,
      isScheduled
    };
    onSave(taskData);
  };

  const triggerTimePicker = () => {
    if (timeInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try { (timeInputRef.current as any).showPicker(); } catch (e) { timeInputRef.current.focus(); }
      } else { timeInputRef.current.focus(); }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background animate-in slide-in-from-bottom-10 duration-500 ease-out">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between glass sticky top-0 z-20 border-b border-blue-100">
        <button onClick={onBack} className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-blue-200 text-blue-400 active:scale-90 transition-all hover:border-primary/40">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="font-extrabold text-blue-900 tracking-tight">{initialTask ? 'Refine Task' : 'New Adventure'}</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 no-scrollbar">
        {isAiMode ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-primary to-blue-400 rounded-5xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/30 relative">
                 <div className="absolute inset-0 bg-white/20 animate-pulse rounded-5xl"></div>
                 <span className="material-symbols-outlined text-white text-4xl relative">magic_button</span>
              </div>
              <h3 className="text-2xl font-black text-blue-900 mb-2 tracking-tight">AI Assistant</h3>
              <p className="text-sm text-blue-400 font-medium px-8">One sentence is all I need to organize your life.</p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary/30 to-blue-400/30 rounded-5xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <textarea 
                className="relative w-full h-48 bg-white rounded-5xl border-1.5 border-blue-100 shadow-xl p-8 text-xl font-bold text-blue-900 placeholder:text-blue-100 resize-none focus:ring-4 focus:ring-primary/5 transition-all outline-none focus:border-primary/40"
                placeholder="What's on your mind? e.g. Book a table at Oishi tonight at 8..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                autoFocus
              />
              <button 
                onClick={handleAISubmit}
                disabled={loading || !aiInput.trim()}
                className={`absolute bottom-6 right-6 h-14 px-8 rounded-3xl flex items-center gap-2 font-black tracking-tight transition-all active:scale-95 ${loading ? 'bg-blue-50 text-blue-300' : 'bg-primary text-white shadow-2xl shadow-primary/30'}`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-white text-[20px]">auto_awesome</span>
                    Magicize
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col items-center">
                <button 
                  onClick={() => setIsAiMode(false)}
                  className="px-6 py-2 rounded-full text-[10px] font-extrabold text-blue-300 uppercase tracking-widest hover:text-primary transition-colors border border-blue-100"
                >
                  Build manually
                </button>
            </div>
          </div>
        ) : (
          /* Manual Mode */
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4 pt-4">
              <input 
                className="w-full bg-transparent text-3xl font-black text-blue-900 placeholder:text-blue-100 border-0 focus:ring-0 p-0 tracking-tight outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title..."
              />
              <textarea 
                className="w-full bg-transparent text-blue-600/70 placeholder:text-blue-100 border-0 focus:ring-0 p-0 resize-none min-h-[80px] text-lg font-medium leading-relaxed outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details here..."
              />
            </div>

            {/* Panels */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-4xl shadow-sm border-1.5 border-blue-100">
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3">Priority</p>
                <div className="flex gap-2">
                  {Object.values(Priority).map(p => (
                    <button 
                      key={p} 
                      onClick={() => setPriority(p)}
                      className={`flex-1 h-10 rounded-2xl text-[10px] font-extrabold transition-all duration-300 border ${priority === p ? 'bg-primary text-white border-primary shadow-lg' : 'bg-blue-50 text-blue-400 border-blue-50'}`}
                    >
                      {p.charAt(0)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white p-5 rounded-4xl shadow-sm border-1.5 border-blue-100">
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3">Tag</p>
                <select 
                  className="w-full bg-blue-50 border border-blue-100 rounded-2xl py-2 px-3 text-[11px] font-extrabold text-primary focus:ring-2 focus:ring-primary/10 outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                >
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white p-7 rounded-5xl shadow-sm border-1.5 border-blue-100 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">schedule</span>
                    </div>
                    <div>
                        <span className="block font-extrabold text-blue-900 text-sm">Schedule Time</span>
                        <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">{isScheduled ? 'Alert On' : 'No Alert'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsScheduled(!isScheduled)}
                    className={`w-14 h-8 rounded-full transition-all relative border-2 ${isScheduled ? 'bg-primary border-primary' : 'bg-blue-100 border-blue-200'}`}
                  >
                    <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all shadow-md ${isScheduled ? 'left-6.5' : 'left-0.5'}`}></div>
                  </button>
               </div>

               {isScheduled && (
                 <div className="pt-2 animate-in fade-in zoom-in-95 duration-300">
                    <div 
                      className="relative w-full h-18 bg-blue-50/50 rounded-3xl flex items-center justify-center cursor-pointer group hover:bg-primary/5 border-1.5 border-blue-100 hover:border-primary/40 transition-all"
                      onClick={triggerTimePicker}
                    >
                      <input 
                        ref={timeInputRef}
                        type="time" 
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                      <span className="text-3xl font-black text-blue-900 tracking-wider">{time}</span>
                      <span className="material-symbols-outlined absolute right-6 text-primary animate-pulse">edit_notifications</span>
                    </div>
                 </div>
               )}
            </div>

            {!initialTask && (
              <button 
                onClick={() => setIsAiMode(true)}
                className="w-full text-center text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] flex items-center justify-center gap-3 py-6 hover:text-primary-dark transition-colors border border-blue-50 rounded-4xl"
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
                Re-open AI Engine
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-8 bg-white/95 backdrop-blur-xl border-t-1.5 border-blue-100">
        <button 
          onClick={handleSave}
          disabled={!title}
          className={`w-full h-18 rounded-4xl font-black text-lg shadow-2xl transition-all active:scale-[0.98] ${!title ? 'bg-blue-50 text-blue-200 cursor-not-allowed border border-blue-100' : 'bg-primary text-white shadow-primary/30 border border-primary-dark/20'}`}
        >
          {initialTask ? 'Save Changes' : 'Ignite Task'}
        </button>
      </div>
    </div>
  );
};

export default CreateTask;

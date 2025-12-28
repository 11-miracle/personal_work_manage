
import React, { useState, useEffect } from 'react';
import { Task, ViewType, Priority, Category } from './types';
import Dashboard from './components/Dashboard';
import CreateTask from './components/CreateTask';
import TaskDetail from './components/TaskDetail';
import CalendarView from './components/CalendarView';
import Profile from './components/Profile';

const STORAGE_KEY = 'ai_task_dash_tasks';

const getTodayStr = () => new Date().toISOString().split('T')[0];

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review Q3 Report',
    description: 'Quarterly business review for the sales team.',
    date: getTodayStr(),
    priority: Priority.MEDIUM,
    category: Category.WORK,
    completed: false,
    isScheduled: true,
    time: '09:00'
  },
  {
    id: '2',
    title: 'Buy Groceries',
    description: 'Milk, Eggs, Avocado, and Bread.',
    date: getTodayStr(),
    priority: Priority.LOW,
    category: Category.PERSONAL,
    completed: false,
    isScheduled: false,
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('DASHBOARD');
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>(getTodayStr());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
    setView('DASHBOARD');
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setView('DASHBOARD');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setView('DASHBOARD');
  };

  const resetData = () => {
    if(confirm('确定要重置所有数据吗？')) {
      setTasks(INITIAL_TASKS);
      setView('DASHBOARD');
    }
  };

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="flex justify-center bg-slate-100 min-h-screen sm:py-8">
      {/* 这里的 app-container 类配合 CSS 媒体查询，在真机全屏时自动撑满 */}
      <div className="app-container w-full max-w-md bg-white sm:rounded-[3rem] shadow-2xl relative h-screen sm:h-[844px] overflow-hidden flex flex-col border-0 sm:border-[8px] border-slate-900 sm:border-slate-800">
        {/* 刘海屏装饰，仅在非全屏模式下显示 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 hidden sm:block"></div>
        
        <div className="flex-1 overflow-hidden flex flex-col relative pt-safe sm:pt-6">
          {view === 'DASHBOARD' && (
            <Dashboard 
              tasks={tasks} 
              onAddTask={() => setView('CREATE')} 
              onToggleTask={toggleTask}
              onSelectTask={(id) => { setSelectedTaskId(id); setView('DETAIL'); }}
              onViewCalendar={() => setView('CALENDAR')}
              onOpenProfile={() => setView('PROFILE')}
              currentDate={currentDate}
              onSetDate={setCurrentDate}
            />
          )}
          
          {(view === 'CREATE' || view === 'EDIT') && (
            <CreateTask 
              onBack={() => setView(view === 'EDIT' ? 'DETAIL' : 'DASHBOARD')} 
              onSave={view === 'EDIT' ? updateTask : addTask} 
              initialTask={view === 'EDIT' ? selectedTask : undefined}
            />
          )}

          {view === 'DETAIL' && selectedTask && (
            <TaskDetail 
              task={selectedTask} 
              onBack={() => setView('DASHBOARD')} 
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={() => setView('EDIT')}
            />
          )}

          {view === 'CALENDAR' && (
            <CalendarView 
              tasks={tasks}
              onBack={() => setView('DASHBOARD')}
              onToggleTask={toggleTask}
              selectedDate={currentDate}
              onSelectDate={setCurrentDate}
            />
          )}

          {view === 'PROFILE' && (
            <Profile 
              tasks={tasks}
              onBack={() => setView('DASHBOARD')}
              onReset={resetData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

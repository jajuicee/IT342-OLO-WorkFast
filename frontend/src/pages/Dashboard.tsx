import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Layers, 
  CheckSquare, 
  Settings, 
  LogOut, 
  Plus, 
  ChevronRight, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  Search,
  Bell,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiFacade, User, Project, Task } from '../services/apiFacade';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import OperationsCenter from '../components/dashboard/OperationsCenter';
import ProjectPipeline from '../components/dashboard/ProjectPipeline';
import TaskQueue from '../components/dashboard/TaskQueue';
import CollaboratorsAdmin from '../components/dashboard/CollaboratorsAdmin';
import SystemConfig from '../components/dashboard/SystemConfig';

// --- Components ---


const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

// StatCard moved to OperationsCenter.tsx

// --- Main Dashboard ---

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [departmentTasks, setDepartmentTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(savedUser));

    // Initial fetch
    fetchData();

    // WebSocket setup
    const socket = new SockJS('http://localhost:8080/ws-workfast');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/tasks', (message: Message) => {
          const updatedTask: Task = JSON.parse(message.body);
          console.log('WebSocket Task Update:', updatedTask);
          
          // Update department tasks if relevant
          setDepartmentTasks(prev => {
            const index = prev.findIndex(t => t.id === updatedTask.id);
            if (index !== -1) {
              const newTasks = [...prev];
              newTasks[index] = updatedTask;
              return newTasks;
            }
            // If it's a new task unlocked for this department, add it
            // (Assuming department filter logic works on client for demo)
            return [...prev, updatedTask];
          });

          // Refresh projects to show new progress
          fetchData();
        });
      },
      debug: (str) => console.log(str),
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);


  const fetchData = async () => {
    try {
      // In a real app, we'd fetch actual projects and tasks
      // For now, we'll use our apiFacade
      const projRes = await apiFacade.getProjects();
      setProjects(projRes.data);
      
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      // For demo purposes, we'll assume a department ID (should be in the user object)
      const tasksRes = await apiFacade.getDepartmentTasks(1); // Research department ID 1
      setDepartmentTasks(tasksRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    }
  };

  const handleLogout = () => {
    apiFacade.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 p-6 flex flex-col justify-between glass-morphism sticky top-0 h-screen">
        <div>
          <div className="flex items-center gap-3 mb-10 px-2 leading-none">
            <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center">
              <span className="text-white font-black text-xl leading-none">W</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">WorkFast</span>
          </div>

          <nav className="space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Operations Center" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={Layers} label="Project Pipeline" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
            <SidebarItem icon={CheckSquare} label="Task Queue" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
            <SidebarItem icon={Users} label="Collaborators" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            <div className="pt-4 mt-4 border-t border-white/5">
              <SidebarItem icon={Settings} label="System Config" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            </div>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-black text-white leading-none mb-1">{user?.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-black transition-colors"
            >
              <LogOut className="w-3 h-3" /> Execute Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-1 uppercase">Dashboard</h1>
            <p className="text-slate-400 font-medium italic">Status: <span className="text-indigo-400 font-black">All Systems Operational</span></p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Query system data..." 
                className="bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-white" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-950" />
            </button>
          </div>
        </header>

        {/* Dynamic Tab Content */}
        {activeTab === 'dashboard' && <OperationsCenter projects={projects} departmentTasks={departmentTasks} onTaskUpdated={fetchData} onInitiateProject={() => setActiveTab('projects')} />}
        {activeTab === 'projects' && <ProjectPipeline projects={projects} onProjectCreated={fetchData} />}
        {activeTab === 'tasks' && <TaskQueue departmentTasks={departmentTasks} onTaskUpdated={fetchData} />}
        {activeTab === 'users' && <CollaboratorsAdmin />}
        {activeTab === 'settings' && <SystemConfig />}

      </main>
    </div>
  );
};

export default Dashboard;

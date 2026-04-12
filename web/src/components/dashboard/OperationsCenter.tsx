import React from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckSquare, TrendingUp, Users, Plus, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { Project, Task, apiFacade } from '../../services/apiFacade';

// --- StatCard Component
export const StatCard = ({ label, value, trend, icon: Icon }: any) => (
  <div className="glass-morphism rounded-2xl p-6 relative overflow-hidden group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
      </div>
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-1 text-green-400 text-xs font-bold">
        <TrendingUp className="w-3 h-3" />
        <span>{trend} increase from last week</span>
      </div>
    )}
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-colors" />
  </div>
);

interface OperationsCenterProps {
  projects: Project[];
  departmentTasks: Task[];
  onTaskUpdated?: () => void;
  onInitiateProject?: () => void;
}

const OperationsCenter: React.FC<OperationsCenterProps> = ({ projects, departmentTasks, onTaskUpdated, onInitiateProject }) => {
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const handleUpdateTask = async (projectId: string, taskId: string, newStatus: string) => {
    try {
      setProcessingId(taskId);
      await apiFacade.updateTaskStatus(projectId, taskId, newStatus);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error("Failed to update task", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Active Nodes" value={projects.length} icon={Layers} />
        <StatCard label="Department Tasks" value={departmentTasks.length} icon={CheckSquare} />
        <StatCard label="Success Velocity" value="94%" trend="8.2%" icon={TrendingUp} />
        <StatCard label="Team Load" value="High" icon={Users} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Projects Pipeline */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
              <Layers className="text-indigo-500 w-5 h-5" /> 
              Active Pipeline
            </h2>
            <button 
              onClick={onInitiateProject}
              className="text-xs font-black text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 uppercase tracking-wider">
              <Plus className="w-3 h-3" /> Initiate Project
            </button>
          </div>

          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="glass-morphism rounded-3xl p-16 text-center border-dashed border-2 border-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="text-slate-600 w-8 h-8" />
                </div>
                <h3 className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-sm">No Active Projects</h3>
                <p className="text-slate-600 text-xs font-medium">Initiate a new multi-step workflow to begin.</p>
              </div>
            ) : (
              projects.map((proj) => (
                <motion.div 
                  layout
                  key={proj.id} 
                  className="glass-morphism rounded-2xl p-6 hover:bg-white/[0.07] transition-all cursor-pointer border-l-4 border-indigo-500"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-black text-white tracking-tight">{proj.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                          proj.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400'
                        }`}>
                          {proj.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium line-clamp-1">{proj.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                  </div>
                  
                  {/* Simplified Pipeline View */}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((step) => {
                      // Mocking the active step based on status for UI
                      const activeStep = proj.status === 'COMPLETED' ? 5 : 
                                       proj.status === 'IN_PROGRESS' ? 3 : 1;
                      const isActive = step <= activeStep;
                      
                      return (
                      <React.Fragment key={step}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                          isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-slate-700 border border-white/5'
                        }`}>
                          {step}
                        </div>
                        {step < 5 && <div className={`flex-1 h-[2px] transition-all duration-500 ${isActive ? 'bg-indigo-500/50' : 'bg-white/5'}`} />}
                      </React.Fragment>
                    )})}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-slate-600 font-black uppercase tracking-widest">
                    <span>Research</span>
                    <span>Design</span>
                    <span>Development</span>
                    <span>QA</span>
                    <span>Deployment</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Department Queue */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
            <CheckSquare className="text-indigo-500 w-5 h-5" /> 
            Your Queue
          </h2>

          <div className="space-y-4">
            {departmentTasks.length === 0 ? (
              <div className="glass-morphism rounded-3xl p-8 text-center bg-white/[0.02]">
                <p className="text-slate-600 text-sm font-bold italic tracking-tighter">Queue Empty</p>
              </div>
            ) : (
              departmentTasks.map((task) => (
                <div key={task.id} className="glass-morphism rounded-2xl p-5 border border-white/5 hover:border-indigo-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Project ID: {task.projectId.slice(0, 8)}</p>
                      <h4 className="text-white font-bold text-sm tracking-tight leading-tight">Review Phase: Stage {task.stepOrder}</h4>
                    </div>
                    <Clock className="w-4 h-4 text-slate-600" />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleUpdateTask(task.projectId, task.id, 'APPROVED')}
                      disabled={processingId === task.id}
                      className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-[10px] font-black uppercase rounded-lg transition-colors flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Approve
                    </button>
                    <button 
                      onClick={() => handleUpdateTask(task.projectId, task.id, 'REJECTED')}
                      disabled={processingId === task.id}
                      className="flex-1 py-2 bg-white/5 hover:bg-red-500/20 disabled:opacity-50 text-slate-400 hover:text-red-400 text-[10px] font-black uppercase rounded-lg transition-colors border border-white/5">
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Mock Tasks for Visual Variety if empty */}
            {departmentTasks.length === 0 && [1, 2].map(i => (
              <div key={i} className="glass-morphism rounded-2xl p-5 border border-white/5 opacity-40">
                 <div className="animate-pulse flex flex-col gap-3">
                   <div className="h-2 w-24 bg-white/10 rounded" />
                   <div className="h-4 w-40 bg-white/10 rounded" />
                   <div className="flex gap-2">
                     <div className="flex-1 h-8 bg-white/10 rounded" />
                     <div className="flex-1 h-8 bg-white/10 rounded" />
                   </div>
                 </div>
              </div>
            ))}
          </div>

          {/* Health Monitor */}
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
             <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Node Health</h4>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                  <span>MEMORY LOAD</span>
                  <span className="text-white">42%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[42%]" />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                  <span>IO THROUGHPUT</span>
                  <span className="text-white">88%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[88%]" />
                </div>
             </div>
             <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-[30px] -mr-12 -mt-12" />
          </div>
        </div>
      </div>
    </>
  );
};

export default OperationsCenter;

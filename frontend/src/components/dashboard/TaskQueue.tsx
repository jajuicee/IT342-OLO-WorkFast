import React from 'react';
import { CheckSquare, Clock, CheckCircle2 } from 'lucide-react';
import { Task, apiFacade } from '../../services/apiFacade';

interface TaskQueueProps {
  departmentTasks: Task[];
  onTaskUpdated?: () => void;
}

const TaskQueue: React.FC<TaskQueueProps> = ({ departmentTasks, onTaskUpdated }) => {
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <CheckSquare className="text-indigo-500 w-6 h-6" /> 
          Task Queue
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departmentTasks.length === 0 ? (
          <div className="col-span-full glass-morphism rounded-3xl p-16 text-center border-dashed border-2 border-white/5">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="text-slate-600 w-8 h-8" />
             </div>
             <h3 className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-sm">Queue Empty</h3>
             <p className="text-slate-600 text-xs font-medium">There are no tasks pending for your department.</p>
          </div>
        ) : (
          departmentTasks.map((task) => (
            <div key={task.id} className="glass-morphism rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-indigo-400 font-black uppercase tracking-widest mb-1">Project ID: {task.projectId.slice(0, 8)}</p>
                  <h4 className="text-white font-bold text-lg tracking-tight leading-tight">Stage {task.stepOrder} Review</h4>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              
              <div className="text-sm text-slate-400 mb-6 flex-grow">
                 Pending approval from the <span className="font-bold text-white uppercase">{task.departmentName || 'Department'}</span> module.
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <button 
                  onClick={() => handleUpdateTask(task.projectId, task.id, 'APPROVED')}
                  disabled={processingId === task.id}
                  className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-black uppercase rounded-xl transition-colors flex items-center justify-center gap-1 shadow-lg shadow-indigo-500/20">
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button 
                  onClick={() => handleUpdateTask(task.projectId, task.id, 'REJECTED')}
                  disabled={processingId === task.id}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-red-500/20 disabled:opacity-50 text-slate-400 hover:text-red-400 text-xs font-black uppercase rounded-xl transition-colors border border-white/5 hover:border-red-500/30">
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskQueue;

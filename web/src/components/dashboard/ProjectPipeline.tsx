import React, { useState } from 'react';
import { Layers, Plus, Search, ChevronRight, X, Clock, CheckCircle2, ArrowLeft, CircleDot, Lock, Unlock, CheckCheck } from 'lucide-react';
import { Project, Task, apiFacade } from '../../services/apiFacade';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectPipelineProps {
  projects: Project[];
  onProjectCreated?: () => void;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  PENDING:     { bg: 'bg-slate-500/20', text: 'text-slate-400', label: 'Pending' },
  UNLOCKED:    { bg: 'bg-blue-500/20',  text: 'text-blue-400',  label: 'Unlocked' },
  IN_PROGRESS: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'In Progress' },
  SUBMITTED:   { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Submitted' },
  APPROVED:    { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Approved' },
  REJECTED:    { bg: 'bg-red-500/20',   text: 'text-red-400',   label: 'Rejected' },
};

const statusIcon = (status: string) => {
  switch (status) {
    case 'PENDING': return <Lock className="w-4 h-4" />;
    case 'UNLOCKED': return <Unlock className="w-4 h-4" />;
    case 'APPROVED': return <CheckCheck className="w-4 h-4" />;
    default: return <CircleDot className="w-4 h-4" />;
  }
};

const ProjectPipeline: React.FC<ProjectPipelineProps> = ({ projects, onProjectCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [deposit, setDeposit] = useState('500.00');
  const [availableDepts, setAvailableDepts] = useState<any[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // Detail view state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  React.useEffect(() => {
    if (isModalOpen) {
      apiFacade.getDepartments().then(res => setAvailableDepts(res.data)).catch(() => setAvailableDepts([]));
    }
  }, [isModalOpen]);

  const filteredProjects = projects.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateProgress = (status: string) => {
    switch (status) {
      case 'INITIATED': return 20;
      case 'IN_PROGRESS': return 60;
      case 'COMPLETED': return 100;
      case 'CANCELLED': return 0;
      default: return 0;
    }
  };

  const toggleDept = (id: number) => {
    setSelectedSequence(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const resetModal = () => {
    setStep(1);
    setNewProjectName('');
    setNewProjectDesc('');
    setDeposit('500.00');
    setSelectedSequence([]);
    setError('');
    setIsModalOpen(false);
  };

  const openProjectDetail = async (proj: Project) => {
    setSelectedProject(proj);
    setLoadingTasks(true);
    try {
      const res = await apiFacade.getProjectTasks(proj.id);
      setProjectTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch project tasks", err);
      setProjectTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    if (!selectedProject) return;
    try {
      await apiFacade.updateTaskStatus(selectedProject.id, taskId, newStatus);
      // Refresh tasks
      const res = await apiFacade.getProjectTasks(selectedProject.id);
      setProjectTasks(res.data);
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step < 3) {
      setStep(prev => prev + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      await apiFacade.createProject({
        name: newProjectName,
        description: newProjectDesc,
        depositAmount: parseFloat(deposit),
        departmentSequence: selectedSequence
      });

      setStep(4);
      setTimeout(() => {
        resetModal();
        if (onProjectCreated) onProjectCreated();
      }, 2000);
    } catch (err: any) {
      console.error("Error creating project:", err);
      setError(err?.response?.data?.message || err?.message || 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== DETAIL VIEW ====================
  if (selectedProject) {
    const approvedCount = projectTasks.filter(t => t.status === 'APPROVED').length;
    const totalCount = projectTasks.length;
    const progressPct = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => { setSelectedProject(null); setProjectTasks([]); }}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">{selectedProject.name}</h2>
            <p className="text-sm text-slate-400 font-medium">{selectedProject.description}</p>
          </div>
          <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
            selectedProject.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400'
            : selectedProject.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-400'
            : 'bg-indigo-500/20 text-indigo-400'
          }`}>
            {selectedProject.status?.replace('_', ' ')}
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-morphism rounded-2xl p-5 border border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">Deposit</p>
            <p className="text-2xl font-black text-white">${selectedProject.depositAmount?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="glass-morphism rounded-2xl p-5 border border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">Workflow Steps</p>
            <p className="text-2xl font-black text-white">{totalCount}</p>
          </div>
          <div className="glass-morphism rounded-2xl p-5 border border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">Completion</p>
            <p className="text-2xl font-black text-indigo-400">{progressPct}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="glass-morphism rounded-2xl p-5 border border-white/5">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-3">
            <span>Overall Pipeline Progress</span>
            <span className="text-indigo-400">{approvedCount}/{totalCount} approved</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
        </div>

        {/* Task Workflow Timeline */}
        <div className="glass-morphism rounded-2xl p-6 border border-white/5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Workflow Sequence</h3>
          {loadingTasks ? (
            <div className="text-center text-slate-500 font-bold py-8 animate-pulse">Loading pipeline data...</div>
          ) : projectTasks.length === 0 ? (
            <div className="text-center text-slate-600 font-bold py-8">No workflow steps configured for this project.</div>
          ) : (
            <div className="space-y-4">
              {projectTasks.map((task, idx) => {
                const sc = statusColors[task.status] || statusColors['PENDING'];
                const isLast = idx === projectTasks.length - 1;
                return (
                  <div key={task.id} className="relative">
                    <div className="flex items-start gap-4">
                      {/* Timeline dot & line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${sc.bg} ${sc.text} font-black text-sm border-2 ${
                          task.status === 'APPROVED' ? 'border-green-500/50' : task.status === 'UNLOCKED' ? 'border-blue-500/50' : 'border-white/10'
                        }`}>
                          {statusIcon(task.status)}
                        </div>
                        {!isLast && <div className="w-0.5 h-8 bg-white/10 mt-1" />}
                      </div>

                      {/* Task Info */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-black text-sm uppercase tracking-wide">
                              Step {task.stepOrder}: {task.departmentName || 'Unknown Dept'}
                            </p>
                            <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${sc.bg} ${sc.text}`}>
                              {sc.label}
                            </span>
                          </div>
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {task.status === 'UNLOCKED' && (
                              <button
                                onClick={() => handleUpdateTaskStatus(task.id, 'APPROVED')}
                                className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            {(task.status === 'UNLOCKED' || task.status === 'IN_PROGRESS') && (
                              <button
                                onClick={() => handleUpdateTaskStatus(task.id, 'REJECTED')}
                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== LIST VIEW ====================
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <Layers className="text-indigo-500 w-6 h-6" />
          Project Pipeline
        </h2>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full glass-morphism rounded-3xl p-16 text-center border-dashed border-2 border-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="text-slate-600 w-8 h-8" />
            </div>
            <h3 className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-sm">No Projects Found</h3>
            <p className="text-slate-600 text-xs font-medium">Try a different search query or initiate a new workflow.</p>
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <motion.div
              layout
              key={proj.id}
              onClick={() => openProjectDetail(proj)}
              className="glass-morphism rounded-2xl p-6 hover:bg-white/[0.07] transition-all cursor-pointer border-t-4 border-indigo-500 flex flex-col h-full group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-black text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">{proj.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest whitespace-nowrap ${
                  proj.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400'
                }`}>
                  {proj.status?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-slate-400 font-medium line-clamp-3 mb-6 flex-grow">{proj.description}</p>

              <div className="mt-auto">
                 <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>Progress</span>
                    <span className="text-indigo-400">{calculateProgress(proj.status)}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000 ease-in-out" style={{ width: `${calculateProgress(proj.status)}%` }} />
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative"
            >
              <button onClick={resetModal} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                 {[1, 2, 3].map(i => (
                   <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-indigo-500' : 'bg-white/10'}`} />
                 ))}
              </div>
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">
                {step === 1 && '1. Project Parameters'}
                {step === 2 && '2. Workflow Sequence'}
                {step === 3 && '3. Sandbox Payment'}
                {step === 4 && '🚀 Finalizing Launch'}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold">{error}</div>
              )}

              <form onSubmit={handleCreateProject} className="space-y-6">
                {step === 1 && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Name</label>
                      <input type="text" required value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="e.g. Orbital Station Alpha" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Objective Description</label>
                      <textarea required value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors min-h-[100px] resize-none"
                        placeholder="Brief objective parameters..." />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400 font-bold mb-4">Select departments in the exact order of required execution:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {availableDepts.map(dept => (
                        <button key={dept.id} type="button" onClick={() => toggleDept(dept.id)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            selectedSequence.includes(dept.id)
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                              : 'bg-white/5 border-white/10 text-slate-500'
                          }`}>
                          <div className="flex justify-between items-center">
                            <span className="font-black text-xs uppercase">{dept.name}</span>
                            {selectedSequence.includes(dept.id) && (
                              <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">
                                {selectedSequence.indexOf(dept.id) + 1}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    {selectedSequence.length > 0 && (
                      <div className="mt-6 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/20">
                        <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Defined Sequence Path:</p>
                        <div className="flex flex-wrap items-center gap-2">
                           {selectedSequence.map((id, i) => (
                             <React.Fragment key={id}>
                               <span className="text-xs font-bold text-white">{availableDepts.find(d => d.id === id)?.name || 'Node'}</span>
                               {i < selectedSequence.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600" />}
                             </React.Fragment>
                           ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-indigo-600/20 to-slate-900 border border-indigo-500/30 rounded-2xl relative overflow-hidden">
                       <label className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Sandbox Payment Gateway</label>
                       <div className="flex items-center gap-4">
                          <span className="text-3xl font-black text-white">$</span>
                          <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)}
                            className="bg-transparent border-none text-4xl font-black text-white focus:outline-none w-full" />
                       </div>
                       <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                         <Clock className="w-3 h-3" /> Secure Transaction Mode (TEST)
                       </p>
                    </div>
                    <div className="glass-morphism p-4 rounded-xl space-y-2">
                       <div className="flex justify-between text-xs font-bold">
                         <span className="text-slate-500">Service Fee</span>
                         <span className="text-white">$12.00</span>
                       </div>
                       <div className="flex justify-between text-base font-black">
                         <span className="text-white">Total Due</span>
                         <span className="text-indigo-400">${(parseFloat(deposit || '0') + 12).toFixed(2)}</span>
                       </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="py-12 text-center space-y-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/30">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Mission Initiated</h3>
                    <p className="text-slate-400 text-sm font-medium">Project nodes established and workflow sequence synchronized.</p>
                  </div>
                )}

                {step < 4 && (
                  <div className="pt-4 flex gap-4">
                    {step > 1 && (
                      <button type="button" onClick={() => setStep(prev => prev - 1)}
                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all">
                        Back
                      </button>
                    )}
                    <button type="submit"
                      disabled={isSubmitting || (step === 2 && selectedSequence.length === 0)}
                      className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                      {isSubmitting ? 'Processing...' : step === 3 ? 'Finalize & Launch' : 'Continue'}
                    </button>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectPipeline;

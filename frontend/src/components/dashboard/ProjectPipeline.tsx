import React, { useState } from 'react';
import { Layers, Plus, Search, ChevronRight, X } from 'lucide-react';
import { Project, apiFacade } from '../../services/apiFacade';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectPipelineProps {
  projects: Project[];
  onProjectCreated?: () => void;
}

const ProjectPipeline: React.FC<ProjectPipelineProps> = ({ projects, onProjectCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectDesc.trim()) return;
    
    try {
      setIsSubmitting(true);
      await apiFacade.createProject({
        name: newProjectName,
        description: newProjectDesc
      });
      setIsModalOpen(false);
      setNewProjectName('');
      setNewProjectDesc('');
      if (onProjectCreated) onProjectCreated();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              className="glass-morphism rounded-2xl p-6 hover:bg-white/[0.07] transition-all cursor-pointer border-t-4 border-indigo-500 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-black text-white tracking-tight leading-tight">{proj.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest whitespace-nowrap ${
                  proj.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400'
                }`}>
                  {proj.status.replace('_', ' ')}
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
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Initiate New Project</h2>
              
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Name</label>
                  <input 
                    type="text" 
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. Orbital Station Alpha"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    required
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors bg-transparent min-h-[100px] resize-none"
                    placeholder="Brief objective parameters..."
                  />
                </div>
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-black uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    {isSubmitting ? 'Initializing...' : 'Launch Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectPipeline;

import React, { useState, useEffect } from 'react';
import { Users, Plus, Shield, UserX, UserCheck, X } from 'lucide-react';
import { apiFacade, User } from '../../services/apiFacade';
import { motion, AnimatePresence } from 'framer-motion';

const CollaboratorsAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('USER');
  const [newUserDept, setNewUserDept] = useState('RESEARCH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiFacade.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      // For demo if API fails, fallback to standard mock user we know exists
      setUsers([{
        id: '1',
        name: 'Test Administrator',
        email: 'test3@gmail.com',
        role: 'ADMIN',
        department: 'RESEARCH'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFacade.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
       console.error("Failed to delete user", error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    
    try {
      setIsSubmitting(true);
      await apiFacade.register({
        name: newUserName,
        email: newUserEmail,
        password: 'defaultPassword123', // Hardcoded for demo/registration
        role: newUserRole,
        department: newUserDept
      });
      setIsModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRole('USER');
      setNewUserDept('RESEARCH');
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      // For demo, manually add to state if back-end fails
      setUsers([...users, {
        id: Math.random().toString(36).substring(7),
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        department: newUserDept
      }]);
      setIsModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2 mb-1">
             <Users className="text-indigo-500 w-6 h-6" /> 
             Collaborator Directory
           </h2>
           <p className="text-sm text-slate-400 font-medium">Manage system users, access roles, and department assignments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
          <Plus className="w-4 h-4" /> Add Collaborator
        </button>
      </div>

      <div className="glass-morphism rounded-2xl overflow-hidden border border-white/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/5 border-b border-white/10 uppercase text-[10px] tracking-widest text-slate-400 font-black">
                     <th className="p-4">Collaborator</th>
                     <th className="p-4">Contact Protocol</th>
                     <th className="p-4">Clearance Role</th>
                     <th className="p-4">Department Node</th>
                     <th className="p-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-bold animate-pulse">
                        Synchronizing Database Records...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                        No collaborators found.
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <motion.tr layout key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                                 {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-white tracking-tight">{user.name}</span>
                           </div>
                        </td>
                        <td className="p-4 font-medium text-slate-400">{user.email}</td>
                        <td className="p-4">
                           <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              user.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-500' : 'bg-indigo-500/20 text-indigo-400'
                           }`}>
                              {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                              {user.role}
                           </span>
                        </td>
                        <td className="p-4 text-slate-300 font-bold text-xs uppercase tracking-wider">{user.department}</td>
                        <td className="p-4 text-right">
                           <button 
                             onClick={() => handleDelete(user.id)}
                             className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                             title="Revoke Access"
                           >
                             <UserX className="w-4 h-4" />
                           </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Add Collaborator Modal */}
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
              
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Add Collaborator</h2>
              
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" 
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Clearance Role</label>
                    <select 
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Department Node</label>
                    <select 
                      value={newUserDept}
                      onChange={(e) => setNewUserDept(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="RESEARCH">Research</option>
                      <option value="DESIGN">Design</option>
                      <option value="DEVELOPMENT">Development</option>
                      <option value="QA">QA</option>
                      <option value="DEPLOYMENT">Deployment</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-black uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    {isSubmitting ? 'Registering...' : 'Add User'}
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

export default CollaboratorsAdmin;

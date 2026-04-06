import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, User, Globe, AlertCircle, Loader2 } from 'lucide-react';

import { apiFacade } from '../services/apiFacade';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await apiFacade.login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 font-sans selection:bg-indigo-500/30">
      {/* Left Decoration / Hero */}
      <div className="hidden lg:flex lg:flex-[1.5] relative overflow-hidden bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.2)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2)_0%,transparent_50%)]">
        {/* Animated Background Blobs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="relative z-10 p-16 flex flex-col justify-between w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl premium-gradient flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4L12 12L20 4M12 12L4 20M12 12L20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-3xl font-black text-white tracking-tighter">WorkFast</span>
          </motion.div>

          <div className="space-y-8 max-w-xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-7xl font-black text-white leading-[1.05] tracking-tight"
            >
              Master Your<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Workflow</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-slate-400 font-light leading-relaxed"
            >
              The most powerful task orchestration engine designed for high-performing teams. 
              Efficiency rewritten in code.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-6"
          >
            {[
              { label: 'Latency', value: '4ms' },
              { label: 'Uptime', value: '99.9%' },
              { label: 'Users', value: '42k+' }
            ].map((stat, i) => (
              <div key={i} className="glass-morphism rounded-2xl p-6 text-center group hover:border-indigo-500/50 transition-colors">
                <div className="text-2xl font-mono font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 bg-white lg:rounded-l-[40px] shadow-2xl z-20 flex items-center justify-center p-8 lg:p-16">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-10"
        >
          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Access Portal</h2>
            <p className="text-slate-500 font-medium font-sans">Elevate your team's velocity starting today.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 text-red-600 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900 font-medium"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-800">Security Key</label>
                <Link to="/reset" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Restore</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 group transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Initialize</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-black text-slate-400">
              <span className="bg-white px-4">Authorized IDP</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700 text-sm">
              <User className="w-5 h-5" /> GitHub
            </button>

            <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700 text-sm">
              <Globe className="w-5 h-5 text-blue-500" /> Google
            </button>

          </div>

          <p className="text-center text-sm font-medium text-slate-500">
            Internal user? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Request access</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { Settings, ShieldAlert, Database, Network } from 'lucide-react';

const SystemConfig: React.FC = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('15 Minutes');
  const [aggressivePolling, setAggressivePolling] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2 mb-1">
             <Settings className="text-indigo-500 w-6 h-6" /> 
             System Configuration
           </h2>
           <p className="text-sm text-slate-400 font-medium">Core parameters, integrations, and security protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Security Settings */}
         <div className="glass-morphism rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
              <ShieldAlert className="text-indigo-400 w-4 h-4" /> Authentication & Security
            </h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-white font-bold text-sm">Two-Factor Authentication</h4>
                    <p className="text-slate-500 text-xs mt-1">Require 2FA for all administrator accounts.</p>
                  </div>
                  <div 
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${twoFactor ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`}>
                     <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${twoFactor ? 'right-1 bg-white' : 'left-1 bg-slate-400'}`}></div>
                  </div>
               </div>
               
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-white font-bold text-sm">Session Timeout</h4>
                    <p className="text-slate-500 text-xs mt-1">Maximum idle time before auto-logout.</p>
                  </div>
                  <select 
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="bg-slate-900 border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-lg outline-none focus:border-indigo-500">
                     <option value="15 Minutes">15 Minutes</option>
                     <option value="30 Minutes">30 Minutes</option>
                     <option value="1 Hour">1 Hour</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Network Settings */}
         <div className="glass-morphism rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
              <Network className="text-indigo-400 w-4 h-4" /> Node Network
            </h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-white font-bold text-sm">WebSocket Aggressive Polling</h4>
                    <p className="text-slate-500 text-xs mt-1">Optimize real-time traffic for low-latency updates.</p>
                  </div>
                  <div 
                    onClick={() => setAggressivePolling(!aggressivePolling)}
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${aggressivePolling ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`}>
                     <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${aggressivePolling ? 'right-1 bg-white' : 'left-1 bg-slate-400'}`}></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SystemConfig;

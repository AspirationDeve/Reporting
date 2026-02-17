
import React from 'react';
import { TechnicalTask } from '../types';
import { CheckCircle2, Circle, Target, Activity } from 'lucide-react';

interface OtherKpiTabProps {
  tasks: TechnicalTask[];
}

const OtherKpiTab: React.FC<OtherKpiTabProps> = ({ tasks }) => {
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl shadow-indigo-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="relative z-10 flex-1">
          <h2 className="text-2xl font-black mb-2">Other KPIs</h2>
          <p className="text-indigo-200 text-sm max-w-2xl font-medium">
            Monitor additional performance indicators and technical execution milestones specific to your business environment.
          </p>
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-4 min-w-[180px]">
           <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 overflow-visible">
                 <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-indigo-800"
                 />
                 <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={351.8}
                    strokeDashoffset={351.8 - (351.8 * completionPercentage) / 100}
                    className="text-emerald-400 transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                 />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-black">{completionPercentage}%</span>
                 <span className="text-[9px] font-black uppercase tracking-tighter opacity-50">Achieved</span>
              </div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Target Velocity</p>
        </div>

        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Definition</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance Goal</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Position</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${t.isCompleted ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                      <span className="font-bold text-slate-800">{t.task}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-tighter">
                      <Target size={14} />
                      {t.goal}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <Activity size={14} className="text-slate-400" />
                      {t.status}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    {t.isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-200">
                        <CheckCircle2 size={12} /> Achieved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-xl text-[9px] font-black uppercase tracking-widest border border-amber-200">
                        <Circle size={12} className="animate-pulse" /> In Progress
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OtherKpiTab;

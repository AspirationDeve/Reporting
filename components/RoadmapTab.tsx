
import React from 'react';
import { RoadmapItem } from '../types';
import { CheckCircle2, Clock, PlayCircle, Lightbulb, ArrowRight } from 'lucide-react';

interface RoadmapTabProps {
  items: RoadmapItem[];
}

const RoadmapTab: React.FC<RoadmapTabProps> = ({ items }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Strategic Roadmap</h2>
          <p className="text-slate-500 font-medium mt-1">Our projected growth path and historical milestones.</p>
        </div>

        <div className="relative space-y-12">
          {/* Timeline Line */}
          <div className="absolute left-6 top-4 bottom-4 w-1 bg-slate-100" />

          {items.map((item, idx) => (
            <div key={idx} className="relative pl-16 group">
              {/* Timeline Marker */}
              <div className={`absolute left-0 w-12 h-12 rounded-2xl flex items-center justify-center z-10 shadow-lg border-4 border-white transition-all ${
                item.status === 'completed' ? 'bg-emerald-500 text-white' : 
                item.status === 'current' ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-200 text-slate-400'
              }`}>
                {item.status === 'completed' ? <CheckCircle2 size={24} /> : 
                 item.status === 'current' ? <PlayCircle size={24} className="animate-pulse" /> : <Clock size={24} />}
              </div>

              <div className={`p-8 rounded-3xl border transition-all ${
                item.status === 'current' ? 'bg-indigo-50 border-indigo-200 shadow-xl shadow-indigo-50' : 
                item.status === 'completed' ? 'bg-white border-slate-100 opacity-75' : 'bg-slate-50/50 border-slate-100'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'current' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {item.phase}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-3">{item.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.date}</p>
                    <p className={`text-xs font-bold mt-1 ${
                      item.status === 'completed' ? 'text-emerald-500' : 
                      item.status === 'current' ? 'text-indigo-600' : 'text-slate-400'
                    }`}>
                      {item.status.toUpperCase()}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 font-medium text-sm leading-relaxed max-w-2xl">
                  {item.status === 'completed' ? 'Objectives successfully achieved and optimized.' : 
                   item.status === 'current' ? 'Currently executing technical requirements and initial scaling.' : 
                   'Scheduled for deployment following completion of previous phases.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
         <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
               <Lightbulb size={24} />
            </div>
            <div>
               <h3 className="text-2xl font-black tracking-tight">Recommendations from the strategist</h3>
               <p className="text-slate-400 text-sm font-medium">Data-driven initiatives for the next 30-day cycle</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecommendationCard 
               title="Enhance LSI Content" 
               description="Integrate Latent Semantic Indexing keywords into landing pages to broaden visibility for long-tail search queries." 
            />
            <RecommendationCard 
               title="Campaign Bid Optimization" 
               description="Shift 15% of meta budget towards high-converting late-night segments to improve CPL by an estimated 12%." 
            />
            <RecommendationCard 
               title="UX Friction Audit" 
               description="Perform a heat-map analysis on main lead forms to identify drop-off points and optimize field validation." 
            />
         </div>
      </div>
    </div>
  );
};

const RecommendationCard = ({ title, description }: { title: string, description: string }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group">
     <h4 className="text-lg font-black text-indigo-400 mb-3 flex items-center justify-between">
        {title}
        <ArrowRight size={16} className="text-white/20 group-hover:text-white transition-all" />
     </h4>
     <p className="text-slate-400 text-sm leading-relaxed font-medium">
        {description}
     </p>
  </div>
);

export default RoadmapTab;


import React, { useState, useMemo } from 'react';
import { SeoRanking } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RankingsTabProps {
  rankings: SeoRanking[];
  isComparing?: boolean;
}

const RankingsTab: React.FC<RankingsTabProps> = ({ rankings, isComparing = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  
  const totalPages = Math.ceil(rankings.length / itemsPerPage);
  const currentRankings = rankings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const chartData = useMemo(() => {
    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
    return months.map((month, i) => ({
      name: month,
      avgPos: 15 - Math.sin(i * 0.5) * 5 + (Math.random() * 2),
      prevAvgPos: isComparing ? 18 - Math.sin(i * 0.4) * 4 + (Math.random() * 2) : undefined
    }));
  }, [isComparing]);

  const avgCurrent = (rankings.reduce((acc, r) => acc + r.currentRank, 0) / rankings.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Ranking Position</p>
          <p className="text-3xl font-black text-slate-900 mt-2">#{avgCurrent}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Keywords</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{rankings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Impressions</p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {rankings.reduce((acc, r) => acc + r.volume, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* SEO Ranking History Graph */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
             <Search size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 uppercase tracking-tight">Ranking Performance</h3>
            <p className="text-xs text-slate-400 font-bold">12-Month Average Ranking Position</p>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} dy={10} />
              <YAxis reversed domain={[0, 'auto']} fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle"/>
              <Line 
                type="monotone" 
                dataKey="avgPos" 
                name="Current Analysis"
                stroke="#4f46e5" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} 
              />
              {isComparing && (
                <Line 
                  type="monotone" 
                  dataKey="prevAvgPos" 
                  name="Historical Benchmark"
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: '#94a3b8', strokeWidth: 2, stroke: '#fff' }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Keyword Visibility Report</h3>
            <p className="text-xs text-slate-400 font-bold mt-1">Real-time rank tracking</p>
          </div>
          
          <div className="flex items-center gap-2">
             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 disabled:opacity-20 transition-all">
               <ChevronLeft size={20} />
             </button>
             {pages.map(p => (
               <button key={p} onClick={() => setCurrentPage(p)} className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${currentPage === p ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>
                 {p}
               </button>
             ))}
             <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 disabled:opacity-20 transition-all">
               <ChevronRight size={20} />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Keyword</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Rank</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Previous</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentRankings.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-800 group-hover:text-indigo-600">{r.keyword}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-sm ${r.currentRank <= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      #{r.currentRank}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-slate-400 font-bold text-xs">#{r.previousRank}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    {r.previousRank - r.currentRank > 0 ? (
                      <span className="inline-flex items-center text-emerald-600 font-black">
                        <ArrowUpRight size={14} className="mr-1" /> {r.previousRank - r.currentRank}
                      </span>
                    ) : r.previousRank - r.currentRank < 0 ? (
                      <span className="inline-flex items-center text-rose-600 font-black">
                        <ArrowDownRight size={14} className="mr-1" /> {Math.abs(r.previousRank - r.currentRank)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-slate-300">
                        <Minus size={14} />
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

export default RankingsTab;

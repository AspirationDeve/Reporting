
import React from 'react';
import { KpiMetric } from '../types';
import { CheckCircle2, AlertCircle, Clock, TrendingUp, MousePointer2, Users, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

interface KpiTabProps {
  kpis: KpiMetric[];
}

const KpiTab: React.FC<KpiTabProps> = ({ kpis }) => {
  const COLORS = {
    'on-track': '#10b981',
    'at-risk': '#f59e0b',
    'behind': '#ef4444'
  };

  const statusCounts = [
    { name: 'Target Met', value: kpis.filter(k => k.status === 'on-track').length, color: COLORS['on-track'] },
    { name: 'Moderate', value: kpis.filter(k => k.status === 'at-risk').length, color: COLORS['at-risk'] },
    { name: 'Action Needed', value: kpis.filter(k => k.status === 'behind').length, color: COLORS['behind'] },
  ];

  const trendData = [
    { name: 'Jan', spend: 4000, clicks: 2400, impressions: 240000, leads: 40 },
    { name: 'Feb', spend: 3000, clicks: 1398, impressions: 221000, leads: 30 },
    { name: 'Mar', spend: 2000, clicks: 9800, impressions: 229000, leads: 20 },
    { name: 'Apr', spend: 2780, clicks: 3908, impressions: 200000, leads: 27 },
    { name: 'May', spend: 1890, clicks: 4800, impressions: 218100, leads: 18 },
    { name: 'Jun', spend: 2390, clicks: 3800, impressions: 250000, leads: 23 },
    { name: 'Jul', spend: 3490, clicks: 4300, impressions: 210000, leads: 34 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-black text-slate-800 mb-2 text-center w-full uppercase tracking-tight">Campaign Health</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusCounts} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusCounts.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2 w-full text-center">
            {statusCounts.map((s, idx) => (
              <div key={idx}>
                <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[9px] uppercase font-black text-slate-400">{s.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {kpis.map((k, idx) => {
            const progress = Math.min(100, (k.actual / k.target) * 100);
            return (
              <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-1 rounded tracking-wider">{k.category}</span>
                    <h4 className="text-base font-black text-slate-800 mt-2">{k.metric}</h4>
                  </div>
                  {k.status === 'on-track' ? <CheckCircle2 className="text-emerald-500" size={20} /> :
                   k.status === 'at-risk' ? <AlertCircle className="text-amber-500" size={20} /> :
                   <Clock className="text-rose-500" size={20} />}
                </div>
                <div className="flex items-end justify-between mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{k.actual.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-bold">/ {k.target.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${k.status === 'on-track' ? 'bg-emerald-500' : k.status === 'at-risk' ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrendChart title="Ad Spend" dataKey="spend" color="#4f46e5" icon={<TrendingUp size={16}/>} data={trendData} />
        <TrendChart title="Total Paid Clicks" dataKey="clicks" color="#10b981" icon={<MousePointer2 size={16}/>} data={trendData} />
        <TrendChart title="Impressions" dataKey="impressions" color="#f59e0b" icon={<Eye size={16}/>} data={trendData} />
        <TrendChart title="Leads Generated" dataKey="leads" color="#8b5cf6" icon={<Users size={16}/>} data={trendData} />
      </div>
    </div>
  );
};

const TrendChart = ({ title, dataKey, color, icon, data }: { title: string, dataKey: string, color: string, icon: any, data: any[] }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
    <div className="flex items-center gap-2 mb-6">
      <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15`, color: color }}>{icon}</div>
      <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">{title}</h4>
    </div>
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/><stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#color-${dataKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default KpiTab;

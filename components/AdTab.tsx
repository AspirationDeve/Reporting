
import React from 'react';
import { AdPerformance } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, MousePointer2, Percent, Users, Eye } from 'lucide-react';

interface AdTabProps {
  data: AdPerformance[];
  type: 'google' | 'meta';
  clientCurrency: string;
}

const AdTab: React.FC<AdTabProps> = ({ data, type, clientCurrency }) => {
  const totalSpend = data.reduce((acc, c) => acc + c.spend, 0);
  const totalLeads = data.reduce((acc, c) => acc + c.conversions, 0);
  const avgRoas = data.reduce((acc, c) => acc + c.roas, 0) / (data.length || 1);
  const avgCtr = data.reduce((acc, c) => acc + c.ctr, 0) / (data.length || 1);

  const primaryColor = type === 'google' ? '#4285F4' : '#1877F2';
  const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#8B5CF6', '#EC4899'];

  const BrandIcon = () => (
    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden p-2">
      {type === 'google' ? (
        <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="w-full h-full object-contain" />
      ) : (
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png" alt="Meta" className="w-full h-full object-contain" />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <BrandIcon />
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{type === 'google' ? 'Google Search & Display' : 'Meta Social Media'}</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Performance snapshot</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<DollarSign size={20}/>} label="Ad Spend" value={`${clientCurrency}${totalSpend.toLocaleString()}`} color={primaryColor} />
        <StatCard icon={<Users size={20}/>} label="Leads" value={totalLeads.toLocaleString()} color={primaryColor} />
        <StatCard icon={<Percent size={20}/>} label="Avg. ROAS" value={`${avgRoas.toFixed(2)}x`} color={primaryColor} />
        <StatCard icon={<MousePointer2 size={20}/>} label="Avg. CTR" value={`${avgCtr.toFixed(2)}%`} color={primaryColor} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Campaign ROAS</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" fontSize={10} fontWeight="bold" />
                <YAxis dataKey="campaign" type="category" width={100} fontSize={10} fontWeight="bold" />
                <Tooltip />
                <Bar dataKey="roas" fill={primaryColor} radius={[0, 8, 8, 0]} name="ROAS" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Spend Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs><linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={primaryColor} stopOpacity={0.1}/><stop offset="95%" stopColor={primaryColor} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip />
                <Area type="monotone" dataKey="spend" stroke={primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" name="Ad Spend" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4 group">
    <div className="p-3 rounded-2xl" style={{ backgroundColor: `${color}15`, color: color }}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-slate-900 mt-0.5">{value}</p>
    </div>
  </div>
);

export default AdTab;

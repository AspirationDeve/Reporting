
import React from 'react';
import { ClientProfile } from '../types';
import { TrendingUp, Target, Users, MousePointer2, Globe, ShieldCheck, Clock } from 'lucide-react';

interface OverviewTabProps {
  client: ClientProfile;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ client }) => {
  const { data, contentApprovals, kyc } = client;
  
  const totalAdsSpend = data.googleAds.reduce((a, b) => a + b.spend, 0) + data.metaAds.reduce((a, b) => a + b.spend, 0);
  const totalLeads = data.googleAds.reduce((a, b) => a + b.conversions, 0) + data.metaAds.reduce((a, b) => a + b.conversions, 0);
  const totalImpressions = data.googleAds.reduce((a, b) => a + b.impressions, 0) + data.metaAds.reduce((a, b) => a + b.impressions, 0);

  const pendingApprovals = contentApprovals.filter(a => a.status === 'pending').length;
  const completedTasks = data.otherKpis.filter(t => t.isCompleted).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard label="Total Ads Spend" value={`${kyc.currency}${totalAdsSpend.toLocaleString()}`} icon={<TrendingUp size={20}/>} color="bg-slate-900" />
        <SummaryCard label="Total Leads" value={totalLeads.toLocaleString()} icon={<Users size={20}/>} color="bg-indigo-600" />
        <SummaryCard label="Impressions" value={`${(totalImpressions / 1000).toFixed(0)}k`} icon={<Globe size={20}/>} color="bg-indigo-400" />
        <SummaryCard label="Site Visibility" value={`${data.visibility}%`} icon={<Target size={20}/>} color="bg-slate-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex justify-between items-center"><h3 className="text-xl font-black text-slate-800">SEO Infrastructure</h3><span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">Status : Active</span></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Search Visibility</p><p className="text-4xl font-black text-indigo-600">{data.visibility}%</p></div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Optimization Score</p><p className="text-4xl font-black text-emerald-500">{data.optimizationScore}%</p></div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Target size={120} /></div>
          <h3 className="text-xl font-black relative z-10">Performance Marketing</h3>
          <div className="space-y-6 relative z-10">
            <PlatformRow name="Google Ads" spend={data.googleAds.reduce((a,b)=>a+b.spend, 0)} leads={data.googleAds.reduce((a,b)=>a+b.conversions, 0)} currency={kyc.currency} logo="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" />
            <PlatformRow name="Meta Ads" spend={data.metaAds.reduce((a,b)=>a+b.spend, 0)} leads={data.metaAds.reduce((a,b)=>a+b.conversions, 0)} currency={kyc.currency} logo="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png" />
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) => (
  <div className={`${color} p-8 rounded-[2.5rem] text-white shadow-xl transform hover:-translate-y-1 transition-all`}>
    <div className="flex justify-between items-start mb-6"><div className="p-2.5 bg-white/10 rounded-xl">{icon}</div></div>
    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">{label}</p>
    <p className="text-2xl font-black mt-1 tracking-tight">{value}</p>
  </div>
);

const PlatformRow = ({ name, spend, leads, currency, logo }: { name: string, spend: number, leads: number, currency: string, logo: string }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <img src={logo} alt={name} className="w-8 h-8 object-contain rounded-lg bg-white p-1" />
      <div><h4 className="font-black text-indigo-400 text-sm tracking-tight">{name}</h4><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{currency}{spend.toLocaleString()} Spend</p></div>
    </div>
    <div className="text-right"><p className="font-black text-xl text-white">{leads} Leads</p></div>
  </div>
);

export default OverviewTab;


import React from 'react';
import { ClientProfile, AdminSettings } from '../types';
import { Printer, FileDown, CalendarRange, Target, ShieldCheck, TrendingUp, Search, Activity, Globe, UserCheck, LayoutDashboard } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line } from 'recharts';

interface ReportingTabProps {
  client: ClientProfile;
  settings: AdminSettings;
  period: string;
}

const ReportingTab: React.FC<ReportingTabProps> = ({ client, settings, period }) => {
  const { data, assignedServices } = client;
  const { reportSettings } = settings;
  
  const totalAdSpend = data.googleAds.reduce((a, b) => a + b.spend, 0) + data.metaAds.reduce((a, b) => a + b.spend, 0);
  const totalLeads = data.googleAds.reduce((a, b) => a + b.conversions, 0) + data.metaAds.reduce((a, b) => a + b.conversions, 0);

  const hasSeo = assignedServices.includes('rankings');
  const hasGoogle = assignedServices.includes('google');
  const hasMeta = assignedServices.includes('meta');
  const hasKpi = assignedServices.includes('kpis');

  // Mocked graph data for report richness
  const analyticsTrend = [
    { name: 'Week 1', current: 400, previous: 350 },
    { name: 'Week 2', current: 550, previous: 480 },
    { name: 'Week 3', current: 650, previous: 520 },
    { name: 'Week 4', current: 700, previous: 580 },
  ];

  return (
    <div className="space-y-12 pb-20 max-w-[1000px] mx-auto print:max-w-none print:space-y-0">
      
      {/* Page 1: Cover Page */}
      <section className="bg-white shadow-2xl rounded-[3rem] overflow-hidden min-h-[1100px] flex flex-col relative print:shadow-none print:rounded-none break-after-page">
        <div className="h-[500px] w-full relative">
           <img src={reportSettings.coverImage} alt="Cover" className="w-full h-full object-cover" />
           <div className="absolute top-8 right-12 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-white">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{client.kyc.companyName}</p>
           </div>
           <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="flex-1 p-20 flex flex-col justify-between">
           <div className="space-y-4">
              <p className="text-xl font-black text-slate-400 uppercase tracking-[0.3em]">{reportSettings.p1Heading}</p>
              <h1 className="text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">{reportSettings.p1SubHeading}</h1>
           </div>

           <div className="flex justify-between items-end border-t border-slate-100 pt-12">
              <div className="space-y-6">
                 <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">CAMPAIGN TIMELINE</p>
                    <p className="text-2xl font-black text-slate-800">{period}</p>
                 </div>
                 <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight">{reportSettings.mainTitle}</h2>
                 </div>
              </div>
              <div className="flex flex-col items-end gap-4">
                 <img src={settings.agencyLogo} alt="Agency" className="h-14 w-auto object-contain" />
                 {client.kyc.profilePhotoUrl && (
                    <img src={client.kyc.profilePhotoUrl} alt="Client" className="h-20 w-auto object-contain rounded-xl grayscale opacity-50" />
                 )}
              </div>
           </div>
        </div>
      </section>

      {/* Page 2: Security Page */}
      {reportSettings.showSecurityPage && (
        <section className="bg-white shadow-2xl rounded-[3rem] min-h-[1100px] p-24 flex flex-col justify-center items-center text-center print:shadow-none print:rounded-none break-after-page">
           <div className="max-w-xl space-y-12">
              <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mx-auto shadow-xl shadow-indigo-100/50">
                 <ShieldCheck size={48} />
              </div>
              <div className="space-y-6">
                 <h2 className="text-4xl font-black text-slate-900 leading-tight">{reportSettings.p2Heading}</h2>
                 <p className="text-xl text-slate-500 font-medium leading-relaxed">{reportSettings.p2Body}</p>
                 <div className="h-px w-20 bg-slate-200 mx-auto" />
                 <p className="text-2xl font-black text-slate-900 pt-4">{settings.footerCredit.split(' ©')[0]}</p>
              </div>
           </div>
        </section>
      )}

      {/* Page 3: Strategic Overview */}
      <section className="bg-white shadow-2xl rounded-[3rem] min-h-[1100px] p-24 print:shadow-none print:rounded-none break-after-page">
         <ReportHeader client={client} settings={settings} pageNum={reportSettings.showSecurityPage ? 3 : 2} />
         <div className="mt-20 space-y-16">
            <h2 className="text-5xl font-black text-slate-900 uppercase">OVERVIEW</h2>
            <div className="grid grid-cols-2 gap-12">
               <div className="bg-slate-50 p-10 rounded-[2.5rem] flex items-center gap-8 border">
                  <div className="p-5 bg-indigo-600 text-white rounded-3xl"><LayoutDashboard size={40}/></div>
                  <div><p className="text-sm font-black text-slate-400 uppercase">Status</p><p className="text-4xl font-black text-slate-900">Active</p></div>
               </div>
               <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex items-center gap-8 shadow-xl">
                  <div className="p-5 bg-white/10 text-white rounded-3xl"><Activity size={40}/></div>
                  <div><p className="text-sm font-black text-slate-500 uppercase">Total Ad Budget</p><p className="text-4xl font-black text-white">{client.kyc.currency}{totalAdSpend.toLocaleString()}</p></div>
               </div>
            </div>
            {hasKpi && (
               <div className="space-y-8">
                  <h3 className="text-2xl font-black uppercase border-b pb-4">Key Metrics</h3>
                  <div className="grid grid-cols-3 gap-6">
                     <ReportMetricBox label="Leads Generated" value={totalLeads.toLocaleString()} sub="Verified" color="text-emerald-600" />
                     <ReportMetricBox label="Site Visibility" value={`${data.visibility}%`} sub="Search Rank" color="text-indigo-600" />
                     <ReportMetricBox label="Target Keywords" value={data.rankings.length.toString()} sub="Monitoring" color="text-slate-500" />
                  </div>
               </div>
            )}
         </div>
      </section>

      {/* SEO & Rankings Detail (Active if SEO enabled) */}
      {hasSeo && (
        <section className="bg-white shadow-2xl rounded-[3rem] min-h-[1100px] p-24 print:shadow-none print:rounded-none break-after-page">
           <ReportHeader client={client} settings={settings} pageNum="SEO" />
           <div className="mt-12 space-y-12">
              <h2 className="text-5xl font-black text-slate-900 uppercase">ORGANIC GROWTH</h2>
              <div className="h-[450px] bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={analyticsTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="current" stroke="#4f46e5" fill="#4f46e520" strokeWidth={4} />
                   </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-hidden rounded-[2rem] border">
                 <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white"><tr><th className="p-6 text-[10px] font-black uppercase">Keyword</th><th className="p-6 text-[10px] font-black uppercase">Current</th><th className="p-6 text-[10px] font-black uppercase">History</th></tr></thead>
                    <tbody>
                      {data.rankings.slice(0, 15).map((r, i) => (
                        <tr key={i} className="border-b"><td className="p-6 font-bold text-slate-800">{r.keyword}</td><td className="p-6 font-black text-indigo-600">#{r.currentRank}</td><td className="p-6 text-slate-400 font-bold">#{r.previousRank}</td></tr>
                      ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </section>
      )}

      {/* Paid Ads Detail (Active if Ads enabled) */}
      {(hasGoogle || hasMeta) && (
        <section className="bg-white shadow-2xl rounded-[3rem] min-h-[1100px] p-24 print:shadow-none print:rounded-none break-after-page">
           <ReportHeader client={client} settings={settings} pageNum="ADS" />
           <div className="mt-12 space-y-12">
              <h2 className="text-5xl font-black text-slate-900 uppercase">PERFORMANCE ADS</h2>
              <div className="grid grid-cols-2 gap-8">
                 {hasGoogle && (
                    <div className="p-10 border-2 border-slate-100 rounded-[2.5rem] space-y-4">
                       <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="h-10 w-auto mb-4" />
                       <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Google Spend</p>
                       <p className="text-4xl font-black text-slate-900">{client.kyc.currency}{data.googleAds.reduce((a,b)=>a+b.spend, 0).toLocaleString()}</p>
                    </div>
                 )}
                 {hasMeta && (
                    <div className="p-10 border-2 border-slate-100 rounded-[2.5rem] space-y-4">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png" alt="Meta" className="h-10 w-auto mb-4" />
                       <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Meta Spend</p>
                       <p className="text-4xl font-black text-slate-900">{client.kyc.currency}{data.metaAds.reduce((a,b)=>a+b.spend, 0).toLocaleString()}</p>
                    </div>
                 )}
              </div>
              <div className="h-[400px] bg-slate-900 rounded-[2.5rem] p-10">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...data.googleAds, ...data.metaAds].slice(0, 5)}>
                       <XAxis dataKey="campaign" stroke="#ffffff50" fontSize={10} />
                       <Tooltip />
                       <Bar dataKey="conversions" fill="#4f46e5" radius={[5,5,0,0]} name="Leads" />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </section>
      )}

      {/* Floating Controls */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 print:hidden z-50">
        <button onClick={() => window.print()} className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black flex items-center gap-3 shadow-2xl hover:scale-105 transition-all">
          <Printer size={20} /> Print Report PDF
        </button>
      </div>
    </div>
  );
};

const ReportHeader = ({ client, settings, pageNum }: { client: ClientProfile, settings: AdminSettings, pageNum: any }) => (
  <div className="flex justify-between items-center border-b-2 border-slate-900 pb-8">
     <div className="flex items-center gap-4">
        <img src={settings.agencyLogo} alt="Logo" className="h-8 w-auto object-contain" />
        <div className="w-px h-8 bg-slate-200" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{settings.reportSettings.mainTitle}</p>
     </div>
     <div className="flex items-center gap-6">
        <div className="text-right"><p className="text-xs font-black text-slate-900">{client.kyc.companyName}</p></div>
        <div className="w-12 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black">{pageNum}</div>
     </div>
  </div>
);

const ReportMetricBox = ({ label, value, sub, color }: { label: string, value: string, sub: string, color: string }) => (
  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-center">
     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{label}</p>
     <p className={`text-4xl font-black text-slate-900`}>{value}</p>
     <p className={`text-[10px] font-black mt-1 uppercase ${color}`}>{sub}</p>
  </div>
);

export default ReportingTab;

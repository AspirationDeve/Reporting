
import React, { useState, useEffect } from 'react';
import { DashboardData, SeoRanking, KpiMetric, AdPerformance } from '../types';
import { ClipboardPaste, Save, RefreshCcw, Info } from 'lucide-react';

interface ImportTabProps {
  onDataImport: (data: DashboardData) => void;
  currentData: DashboardData;
  activeTab?: 'rankings' | 'kpis' | 'google' | 'meta';
}

const ImportTab: React.FC<ImportTabProps> = ({ onDataImport, currentData, activeTab: initialTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<'rankings' | 'kpis' | 'google' | 'meta'>(initialTab || 'rankings');
  const [pasteContent, setPasteContent] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  const handleImport = () => {
    try {
      const rows = pasteContent.trim().split('\n');
      const parsedData = rows.map(row => row.split('\t'));
      
      const newData = { ...currentData };

      if (activeSubTab === 'rankings') {
        const rankings: SeoRanking[] = parsedData.map(cols => ({
          keyword: cols[0] || '',
          currentRank: parseInt(cols[1]) || 0,
          previousRank: parseInt(cols[2]) || 0,
          change: (parseInt(cols[2]) || 0) - (parseInt(cols[1]) || 0),
          volume: parseInt(cols[3]) || 0,
          url: cols[4] || ''
        }));
        newData.rankings = rankings;
      } else if (activeSubTab === 'kpis') {
        const kpis: KpiMetric[] = parsedData.map(cols => ({
          category: cols[0] || '',
          metric: cols[1] || '',
          target: parseFloat(cols[2]) || 0,
          actual: parseFloat(cols[3]) || 0,
          status: (parseFloat(cols[3]) >= parseFloat(cols[2])) ? 'on-track' : (parseFloat(cols[3]) > parseFloat(cols[2]) * 0.8 ? 'at-risk' : 'behind')
        }));
        newData.kpis = kpis;
      } else if (activeSubTab === 'google' || activeSubTab === 'meta') {
        const ads: AdPerformance[] = parsedData.map(cols => ({
          campaign: cols[0] || '',
          impressions: parseInt(cols[1]) || 0,
          clicks: parseInt(cols[2]) || 0,
          ctr: parseFloat(cols[3]) || 0,
          cpc: parseFloat(cols[4]) || 0,
          spend: parseFloat(cols[5]) || 0,
          conversions: parseInt(cols[6]) || 0,
          roas: parseFloat(cols[7]) || 0
        }));
        if (activeSubTab === 'google') newData.googleAds = ads;
        else newData.metaAds = ads;
      }

      onDataImport(newData);
      setIsSuccess(true);
      setPasteContent('');
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (e) {
      alert("Error parsing data. Please ensure it is tab-separated (from Excel).");
    }
  };

  const getPlaceholder = () => {
    switch(activeSubTab) {
      case 'rankings': return "Example Shadow Format:\nKeyword Target\t#Current\t#Previous\tVolume\tURL\nReal Estate Dubai\t1\t3\t5000\t/landing-page";
      case 'kpis': return "Example Shadow Format:\nCategory\tMetric Name\tTarget Value\tActual Value\nLeads\tQualified Monthly Leads\t100\t75";
      case 'google':
      case 'meta': return "Example Shadow Format:\nCampaign Name\tImpressions\tClicks\tCTR\tCPC\tSpend\tConversions\tROAS\nBranded Search\t10000\t500\t0.05\t1.2\t600\t20\t4.5";
    }
  };

  return (
    <div className="space-y-6">
      {!initialTab && (
        <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100 w-fit gap-2">
          {(['rankings', 'kpis', 'google', 'meta'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                activeSubTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'kpis' ? 'Performance KPIs' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
        <Info className="text-indigo-500 mt-0.5 shrink-0" size={18} />
        <div className="text-[11px] text-slate-600 leading-relaxed font-bold">
          <p className="text-slate-900 mb-1 uppercase tracking-tight">Sync Guidelines:</p>
          <ul className="list-disc ml-4 space-y-1 opacity-75">
            <li>Open Excel or Sheets and select your rows (excluding headers).</li>
            <li>Copy and paste directly into the box.</li>
            <li>Ensure the column sequence matches the example shown below.</li>
          </ul>
        </div>
      </div>

      <div className="relative group">
        <textarea
          value={pasteContent}
          onChange={(e) => setPasteContent(e.target.value)}
          placeholder={getPlaceholder()}
          className="w-full h-80 p-6 font-mono text-xs bg-slate-50 border-2 border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all resize-none text-slate-900 shadow-inner group-hover:border-slate-300"
        />
        {pasteContent && (
          <button 
            onClick={() => setPasteContent('')}
            className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors bg-white p-2 rounded-xl shadow-sm"
          >
            <RefreshCcw size={16} />
          </button>
        )}
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div className="space-y-1">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Sync Status</p>
           <p className="text-xs font-bold text-slate-600">{activeSubTab.toUpperCase()} Module Ready</p>
         </div>
         <button
          onClick={handleImport}
          disabled={!pasteContent}
          className={`px-10 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl transition-all ${
            isSuccess 
              ? 'bg-emerald-500 text-white' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale'
          }`}
        >
          {isSuccess ? <Save size={20} /> : <ClipboardPaste size={20} />}
          {isSuccess ? 'Sync Completed' : 'Apply Sync Data'}
        </button>
      </div>
    </div>
  );
};

export default ImportTab;

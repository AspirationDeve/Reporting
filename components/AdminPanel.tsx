
import React, { useState } from 'react';
import { ClientProfile, DashboardTab, DashboardData, TechnicalTask, AdminSettings } from '../types';
import { 
  Users, Plus, CheckCircle2, Trash2, Edit3, 
  Save, X, Search, ListTodo, Building2, User, 
  ShieldCheck, ToggleLeft, ToggleRight, Command, 
  Palette, Globe, CreditCard, Layout as LayoutIcon,
  RefreshCcw, Activity, MousePointer2, BarChart3
} from 'lucide-react';
import ImportTab from './ImportTab';
import { INITIAL_CLIENTS, CURRENCIES } from '../constants';

interface AdminPanelProps {
  clients: ClientProfile[];
  onUpdateClientData: (clientId: string, data: DashboardData) => void;
  onUpdateClientProfile: (clientId: string, updates: Partial<ClientProfile>) => void;
  onAddClient: (client: ClientProfile) => void;
  activeTab: DashboardTab;
  settings: AdminSettings;
  onUpdateSettings: (s: AdminSettings) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  clients, onUpdateClientData, onUpdateClientProfile, onAddClient, activeTab, settings, onUpdateSettings 
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [dataSubTab, setDataSubTab] = useState<'rankings' | 'kpis' | 'google' | 'meta' | 'other_kpis'>('rankings');
  const [showModal, setShowModal] = useState<'add' | 'edit' | 'task_form' | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editingTaskIdx, setEditingTaskIdx] = useState<number | null>(null);

  // Client Form State
  const [formState, setFormState] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    startDate: '',
    expiryDate: '',
    currency: settings.defaultCurrency,
    services: ['rankings', 'kpis', 'google', 'meta', 'other_kpis', 'roadmap', 'approvals']
  });

  // Task Form State
  const [taskState, setTaskState] = useState<TechnicalTask>({
    task: '',
    goal: '',
    status: '',
    isCompleted: false
  });

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const resetForm = () => {
    setFormState({ 
      companyName: '', contactPerson: '', email: '', startDate: '', expiryDate: '', 
      currency: settings.defaultCurrency, 
      services: ['rankings', 'kpis', 'google', 'meta', 'other_kpis', 'roadmap', 'approvals']
    });
    setEditingClientId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal('add');
  };

  const handleOpenEdit = (client: ClientProfile) => {
    setFormState({
      companyName: client.kyc.companyName,
      contactPerson: client.kyc.contactPerson,
      email: client.kyc.email,
      startDate: client.kyc.contractStartDate,
      expiryDate: client.kyc.contractExpiryDate,
      currency: client.kyc.currency,
      services: client.assignedServices
    });
    setEditingClientId(client.id);
    setShowModal('edit');
  };

  const handleOpenTaskForm = (task?: TechnicalTask, idx?: number) => {
    if (task) {
      setTaskState({ ...task });
      setEditingTaskIdx(idx ?? null);
    } else {
      setTaskState({ task: '', goal: '', status: '', isCompleted: false });
      setEditingTaskIdx(null);
    }
    setShowModal('task_form');
  };

  const toggleService = (serviceId: string) => {
    setFormState(prev => ({
      ...prev,
      services: prev.services.includes(serviceId) 
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showModal === 'edit' && editingClientId) {
      onUpdateClientProfile(editingClientId, {
        kyc: {
          ...clients.find(c => c.id === editingClientId)!.kyc,
          companyName: formState.companyName,
          contactPerson: formState.contactPerson,
          email: formState.email,
          contractStartDate: formState.startDate,
          contractExpiryDate: formState.expiryDate,
          currency: formState.currency,
        },
        assignedServices: formState.services
      });
    } else {
      const id = `client-${Date.now()}`;
      const newProfile: ClientProfile = {
        id,
        kyc: {
          companyName: formState.companyName,
          contactPerson: formState.contactPerson,
          email: formState.email,
          phone: '',
          contractSigned: true,
          registrationDate: new Date().toISOString().split('T')[0],
          contractStartDate: formState.startDate,
          contractExpiryDate: formState.expiryDate,
          currency: formState.currency,
          status: 'approved'
        },
        assignedServices: formState.services,
        data: {
          rankings: [],
          kpis: [],
          googleAds: [],
          metaAds: [],
          otherKpis: [],
          roadmap: [{ phase: "Phase 1", title: "Strategy Setup", status: "current", date: "Month 1" }],
          visibility: 0,
          optimizationScore: 0
        },
        contentApprovals: []
      };
      onAddClient(newProfile);
    }
    setShowModal(null);
    resetForm();
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    
    let updatedTasks = [...selectedClient.data.otherKpis];
    if (editingTaskIdx !== null) {
      updatedTasks[editingTaskIdx] = taskState;
    } else {
      updatedTasks.push(taskState);
    }
    
    onUpdateClientData(selectedClient.id, {
      ...selectedClient.data,
      otherKpis: updatedTasks
    });
    setShowModal(null);
  };

  const handleDeleteTask = (idx: number) => {
    if (!selectedClient) return;
    const updatedTasks = selectedClient.data.otherKpis.filter((_, i) => i !== idx);
    onUpdateClientData(selectedClient.id, {
      ...selectedClient.data,
      otherKpis: updatedTasks
    });
  };

  if (activeTab === DashboardTab.ADMIN_REPORT_SETUP) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Report PDF Customization</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h4 className="font-black text-slate-800 flex items-center gap-2"><LayoutIcon size={20} className="text-indigo-600"/> Cover Page Branding</h4>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Main Report Title</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                       value={settings.reportSettings.mainTitle}
                       onChange={e => onUpdateSettings({...settings, reportSettings: {...settings.reportSettings, mainTitle: e.target.value}})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Cover Image URL</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                       value={settings.reportSettings.coverImage}
                       onChange={e => onUpdateSettings({...settings, reportSettings: {...settings.reportSettings, coverImage: e.target.value}})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Heading Line 1 (P1)</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                       value={settings.reportSettings.p1Heading}
                       onChange={e => onUpdateSettings({...settings, reportSettings: {...settings.reportSettings, p1Heading: e.target.value.toUpperCase()}})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Heading Line 2 (P1)</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                       value={settings.reportSettings.p1SubHeading}
                       onChange={e => onUpdateSettings({...settings, reportSettings: {...settings.reportSettings, p1SubHeading: e.target.value.toUpperCase()}})}
                    />
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h4 className="font-black text-slate-800 flex items-center gap-2"><ShieldCheck size={20} className="text-indigo-600"/> Security & Intro Page (P2)</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-black text-slate-700">Show Intro Page</span>
                    <button onClick={() => onUpdateSettings({...settings, reportSettings: {...settings.reportSettings, showSecurityPage: !settings.reportSettings.showSecurityPage}})}
                       className={`w-12 h-6 rounded-full transition-colors relative ${settings.reportSettings.showSecurityPage ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                       <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.reportSettings.showSecurityPage ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Intro Heading</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                       value={settings.reportSettings.p2Heading}
                       onChange={e => onUpdateSettings({...settings, reportSettings: {...settings.reportSettings, p2Heading: e.target.value}})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Intro Body Text</label>
                    <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                       value={settings.reportSettings.p2Body}
                       onChange={e => onUpdateSettings({...settings, reportSettings: {...settings.reportSettings, p2Body: e.target.value}})}
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (activeTab === DashboardTab.ADMIN_SETUP) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Platform Configuration</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h4 className="font-black text-slate-800 flex items-center gap-2"><Palette size={20} className="text-indigo-600"/> Agency Branding</h4>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Agency Logo URL</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                       value={settings.agencyLogo}
                       onChange={e => onUpdateSettings({...settings, agencyLogo: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Footer Credit Line</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                       value={settings.footerCredit}
                       onChange={e => onUpdateSettings({...settings, footerCredit: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Default Currency</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                       value={settings.defaultCurrency}
                       onChange={e => onUpdateSettings({...settings, defaultCurrency: e.target.value})}
                    >
                       {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (activeTab === DashboardTab.ADMIN_CLIENTS) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Clients & KYC</h3>
          <button onClick={handleOpenAdd} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <Plus size={18} /> Add New Client
          </button>
        </div>

        {showModal === 'add' || showModal === 'edit' ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h4 className="text-xl font-black text-slate-900">{showModal === 'edit' ? 'Edit Client' : 'New Client Onboarding'}</h4>
                <button onClick={() => setShowModal(null)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-1">Basic Information</p>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Company Name</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" value={formState.companyName} onChange={e => setFormState({...formState, companyName: e.target.value})} placeholder="Company Name" /></div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Local Currency</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" value={formState.currency} onChange={e => setFormState({...formState, currency: e.target.value})}>
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select></div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-1">Contract Dates</p>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Expiry Date</label>
                    <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" value={formState.expiryDate} onChange={e => setFormState({...formState, expiryDate: e.target.value})} /></div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-1">Service Modules (Full Portfolio Access)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <ServiceToggle label="SEO Rankings" active={formState.services.includes('rankings')} onClick={() => toggleService('rankings')} />
                    <ServiceToggle label="Google Ads" active={formState.services.includes('google')} onClick={() => toggleService('google')} />
                    <ServiceToggle label="Meta Ads" active={formState.services.includes('meta')} onClick={() => toggleService('meta')} />
                    <ServiceToggle label="Performance" active={formState.services.includes('kpis')} onClick={() => toggleService('kpis')} />
                    <ServiceToggle label="Other KPIs" active={formState.services.includes('other_kpis')} onClick={() => toggleService('other_kpis')} />
                    <ServiceToggle label="Strategic Roadmap" active={formState.services.includes('roadmap')} onClick={() => toggleService('roadmap')} />
                    <ServiceToggle label="Creative Approvals" active={formState.services.includes('approvals')} onClick={() => toggleService('approvals')} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  {showModal === 'edit' ? 'Update Client' : 'Initialize Portfolio'}
                </button>
              </form>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4">
          {clients.map(client => (
            <div key={client.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-indigo-600">{client.kyc.companyName.charAt(0)}</div>
                <div>
                  <h4 className="font-bold text-slate-800">{client.kyc.companyName}</h4>
                  <div className="flex gap-4 mt-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Exp: <span className="text-rose-500">{client.kyc.contractExpiryDate}</span></p>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase">{client.assignedServices.length} Modules Active</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEdit(client)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  <Edit3 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === DashboardTab.ADMIN_SYNC) {
    return (
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div><h3 className="text-xl font-black text-slate-900">Data Sync</h3><p className="text-slate-500 text-sm font-medium mt-1">Synchronize live performance data from Excel.</p></div>
          <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 min-w-[280px]">
            {clients.map(c => <option key={c.id} value={c.id}>{c.kyc.companyName}</option>)}
          </select>
        </div>

        <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit gap-2 flex-wrap">
          <button onClick={() => setDataSubTab('kpis')} className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dataSubTab === 'kpis' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>KPIs</button>
          <button onClick={() => setDataSubTab('rankings')} className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dataSubTab === 'rankings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>SEO Rankings</button>
          <button onClick={() => setDataSubTab('google')} className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dataSubTab === 'google' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Google Ads</button>
          <button onClick={() => setDataSubTab('meta')} className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dataSubTab === 'meta' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Meta Ads</button>
          <button onClick={() => setDataSubTab('other_kpis')} className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dataSubTab === 'other_kpis' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Other KPIs</button>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          {dataSubTab === 'other_kpis' ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-black text-slate-800">Other KPIs Management</h4>
                <button onClick={() => handleOpenTaskForm()} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
                  <Plus size={14} /> Add Task
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead><tr className="bg-slate-50 border-b"><th className="p-4 text-[10px] font-black text-slate-400 uppercase">Task</th><th className="p-4 text-[10px] font-black text-slate-400 uppercase">Goal</th><th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">Status</th><th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">Action</th></tr></thead>
                  <tbody className="divide-y">
                    {selectedClient?.data.otherKpis.map((t, idx) => (
                      <tr key={idx} className="group">
                        <td className="p-4 font-bold text-slate-800">{t.task}</td>
                        <td className="p-4 text-slate-500 font-medium">{t.goal}</td>
                        <td className="p-4 text-center"><span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${t.isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{t.isCompleted ? 'Done' : 'Active'}</span></td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleOpenTaskForm(t, idx)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Edit3 size={16} /></button>
                            <button onClick={() => handleDeleteTask(idx)} className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8"><ImportTab activeTab={dataSubTab as any} onDataImport={(data) => onUpdateClientData(selectedClientId, data)} currentData={selectedClient?.data || INITIAL_CLIENTS[0].data} /></div>
          )}
        </div>

        {showModal === 'task_form' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h4 className="text-xl font-black text-slate-900">{editingTaskIdx !== null ? 'Edit KPI' : 'Add KPI'}</h4>
                <button onClick={() => setShowModal(null)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400"><X size={20} /></button>
              </div>
              <form onSubmit={handleTaskSubmit} className="p-8 space-y-4">
                <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-1">Task Definition</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900" value={taskState.task} onChange={e => setTaskState({...taskState, task: e.target.value})} placeholder="e.g. Website Visibility" /></div>
                <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-1">Goal</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900" value={taskState.goal} onChange={e => setTaskState({...taskState, goal: e.target.value})} placeholder="e.g. 15% Visibility" /></div>
                <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-1">Current Status Text</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900" value={taskState.status} onChange={e => setTaskState({...taskState, status: e.target.value})} placeholder="e.g. 8.4% currently" /></div>
                <div className="flex items-center gap-2 pt-2"><input type="checkbox" id="taskComp" checked={taskState.isCompleted} onChange={e => setTaskState({...taskState, isCompleted: e.target.checked})} className="w-4 h-4 rounded" /><label htmlFor="taskComp" className="text-xs font-bold text-slate-600">Mark as Completed</label></div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl mt-4">Save Task</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

const ServiceToggle = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button type="button" onClick={onClick} className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${active ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 grayscale'}`}>
    <div className="text-xl">{active ? <ToggleRight size={24} className="text-indigo-600" /> : <ToggleLeft size={24} />}</div>
    <span className="text-[9px] font-black uppercase text-center leading-tight">{label}</span>
  </button>
);

export default AdminPanel;

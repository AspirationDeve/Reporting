
import React from 'react';
import { DashboardTab, UserRole, ClientProfile, AdminSettings } from '../types';
import { 
  LayoutDashboard, Search, BarChart3, Share2, 
  FileSpreadsheet, Users, ShieldCheck, Download, 
  LogOut, Settings, CheckSquare, Milestone, ClipboardCheck, 
  UserCircle, Globe, Aperture, Command, FileText
} from 'lucide-react';

interface LayoutProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  userRole: UserRole;
  currentClient?: ClientProfile;
  settings: AdminSettings;
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  activeTab, setActiveTab, userRole, currentClient, settings, children, onLogout 
}) => {
  
  const clientNav = [
    { id: DashboardTab.OVERVIEW, label: 'Overview', icon: LayoutDashboard },
    { id: DashboardTab.RANKINGS, label: 'SEO Rankings', icon: Search, service: 'rankings' },
    { id: DashboardTab.KPIS, label: 'Performance', icon: BarChart3, service: 'kpis' },
    { id: DashboardTab.GOOGLE, label: 'Google Ads', icon: Globe, service: 'google' },
    { id: DashboardTab.META, label: 'Meta Ads', icon: Aperture, service: 'meta' },
    { id: DashboardTab.OTHER_KPIS, label: 'Other KPIs', icon: ClipboardCheck, service: 'other_kpis' },
    { id: DashboardTab.APPROVALS, label: 'Creative Approvals', icon: CheckSquare, service: 'approvals' },
    { id: DashboardTab.ROADMAP, label: 'Roadmap', icon: Milestone, service: 'roadmap' },
    { id: DashboardTab.REPORTING, label: 'Download Report', icon: Download },
  ];

  const adminNav = [
    { id: DashboardTab.ADMIN_CLIENTS, label: 'Clients & KYC', icon: Users },
    { id: DashboardTab.ADMIN_SYNC, label: 'Data Sync', icon: FileSpreadsheet },
    { id: DashboardTab.ADMIN_SETUP, label: 'Platform Setup', icon: Command },
    { id: DashboardTab.ADMIN_REPORT_SETUP, label: 'Report Builder', icon: FileText },
  ];

  const navItems = userRole === 'admin' ? adminNav : clientNav.filter(item => 
    !item.service || currentClient?.assignedServices.includes(item.service)
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] text-slate-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col shadow-sm">
        <div className="p-6 flex-1">
          <div className="mb-8 group cursor-pointer" onClick={() => setActiveTab(userRole === 'admin' ? DashboardTab.ADMIN_CLIENTS : DashboardTab.OVERVIEW)}>
            <img 
              src={settings.agencyLogo} 
              alt="Agency Logo" 
              className="h-6 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          
          <nav className="space-y-1">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-4 opacity-50">Navigation</div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <item.icon size={16} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6 space-y-3 border-t border-slate-50 bg-slate-50/50">
          {userRole === 'client' && currentClient && (
            <>
              <button 
                onClick={() => setActiveTab(DashboardTab.PROFILE)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-sm ${
                  activeTab === DashboardTab.PROFILE
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-slate-500 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-100'
                }`}
              >
                <UserCircle size={16} /> Profile & KYC
              </button>
              
              <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[9px] text-slate-400 font-black mb-1 uppercase tracking-tighter">Connected Entity</p>
                <p className="text-xs font-black text-slate-800 truncate">{currentClient.kyc.companyName}</p>
                <div className="flex items-center gap-1 mt-1.5 text-[9px] text-emerald-600 font-black uppercase tracking-tighter">
                  <ShieldCheck size={10} /> Active Partner
                </div>
              </div>
            </>
          )}
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold text-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-md font-black text-slate-900 flex items-center gap-2">
              {userRole === 'admin' ? (
                <><Settings size={18} className="text-indigo-600" /> Agency Control</>
              ) : (
                <><ShieldCheck size={18} className="text-emerald-500" /> Performance Dashboard</>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right pr-4 border-r border-slate-100">
              <div className="flex flex-col items-end">
                <p className="text-[10px] font-black text-emerald-500 uppercase">Status : Active</p>
                {currentClient && (
                  <p className="text-[10px] font-black text-slate-500 mt-0.5">
                    EXP: <span className="text-rose-500 uppercase">{currentClient.kyc.contractExpiryDate}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shadow-inner">
              {currentClient?.kyc.profilePhotoUrl ? (
                <img src={currentClient.kyc.profilePhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle size={16} />
              )}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

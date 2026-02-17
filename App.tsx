
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import RankingsTab from './components/RankingsTab';
import KpiTab from './components/KpiTab';
import AdTab from './components/AdTab';
import AdminPanel from './components/AdminPanel';
import ReportingTab from './components/ReportingTab';
import ApprovalsTab from './components/ApprovalsTab';
import PeriodPicker from './components/PeriodPicker';
import RoadmapTab from './components/RoadmapTab';
import OtherKpiTab from './components/OtherKpiTab';
import OverviewTab from './components/OverviewTab';
import ProfileTab from './components/ProfileTab';
import { DashboardTab, UserRole, ClientProfile, DashboardData, AdminSettings } from './types';
import { INITIAL_CLIENTS } from './constants';
import { Key, ShieldCheck, ShieldAlert, RefreshCw, Lock, UserPlus, ArrowLeft, Eye, EyeOff, User as UserIcon } from 'lucide-react';

const DEFAULT_SETTINGS: AdminSettings = {
  agencyLogo: "https://aspirationworx.com/wp-content/uploads/2020/09/Aspiration-Worx-Logo.svg",
  urlSlug: "aspiration-worx",
  footerCredit: "Aspiration Worx © 2011-2026",
  primaryColor: "#4f46e5",
  defaultCurrency: "AED",
  reportSettings: {
    mainTitle: "Performance report",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80",
    p1Heading: "SEARCH ENGINE OPTIMISATION",
    p1SubHeading: "DIGITAL MARKETING",
    p2Heading: "Your website is secured by Godaddy Pro Partner Aspiration Worx",
    p2Body: "Strategic infrastructure ensures high availability and secure data distribution.",
    showSecurityPage: true
  }
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('client');
  const [isRegistering, setIsRegistering] = useState(false);
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.OVERVIEW);
  const [currentClientId, setCurrentClientId] = useState<string>(INITIAL_CLIENTS[0].id);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaChallenge, setCaptchaChallenge] = useState({ a: 0, b: 0 });
  const [isCaptchaSolved, setIsCaptchaSolved] = useState(false);

  const [period, setPeriod] = useState('May 2024');
  const [comparePeriod, setComparePeriod] = useState('Previous Month');

  const currentClient = clients.find(c => c.id === currentClientId);

  useEffect(() => {
    generateCaptcha();
    const savedUser = localStorage.getItem('aw_saved_username');
    if (savedUser) {
      setUsername(savedUser);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', adminSettings.primaryColor);
  }, [adminSettings.primaryColor]);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaChallenge({ a, b });
    setCaptchaAnswer('');
    setIsCaptchaSolved(false);
  };

  const resetToHome = () => {
    setIsRegistering(false);
    generateCaptcha();
  };

  useEffect(() => {
    if (parseInt(captchaAnswer) === (captchaChallenge.a + captchaChallenge.b)) {
      setIsCaptchaSolved(true);
    } else {
      setIsCaptchaSolved(false);
    }
  }, [captchaAnswer, captchaChallenge]);

  useEffect(() => {
    const saved = localStorage.getItem('aw_dashboard_state');
    const savedSettings = localStorage.getItem('aw_admin_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setClients(parsed.clients);
      setIsLoggedIn(parsed.isLoggedIn);
      setUserRole(parsed.userRole);
    }
    if (savedSettings) {
      setAdminSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aw_dashboard_state', JSON.stringify({ clients, isLoggedIn, userRole }));
    localStorage.setItem('aw_admin_settings', JSON.stringify(adminSettings));
  }, [clients, isLoggedIn, userRole, currentClientId, adminSettings]);

  const handleUpdateClientData = (clientId: string, data: DashboardData) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, data } : c));
  };

  const handleUpdateClientProfile = (clientId: string, updates: Partial<ClientProfile>) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updates } : c));
  };

  const handleLogin = (role: UserRole) => {
    if (!isCaptchaSolved) return;
    
    // Auth logic
    if (username.toLowerCase() === 'demo' && password.toLowerCase() === 'demo') {
      setUserRole(role);
      setIsLoggedIn(true);
      setActiveTab(role === 'admin' ? DashboardTab.ADMIN_CLIENTS : DashboardTab.OVERVIEW);
    } else if (password.length >= 4) {
      setUserRole(role);
      setIsLoggedIn(true);
      setActiveTab(role === 'admin' ? DashboardTab.ADMIN_CLIENTS : DashboardTab.OVERVIEW);
    } else {
      alert("Invalid credentials. Use demo/demo for testing.");
      return;
    }
    
    if (rememberMe) {
      localStorage.setItem('aw_saved_username', username);
    } else {
      localStorage.removeItem('aw_saved_username');
    }
  };

  const renderContent = () => {
    if (userRole === 'admin') {
      return (
        <AdminPanel 
          clients={clients} 
          activeTab={activeTab}
          settings={adminSettings}
          onUpdateSettings={setAdminSettings}
          onUpdateClientData={handleUpdateClientData}
          onUpdateClientProfile={handleUpdateClientProfile}
          onAddClient={(c) => {
            setClients([...clients, c]);
            setCurrentClientId(c.id);
          }}
        />
      );
    }

    if (!currentClient) return null;

    return (
      <div className="space-y-8">
        {activeTab !== DashboardTab.APPROVALS && 
         activeTab !== DashboardTab.REPORTING && 
         activeTab !== DashboardTab.ROADMAP && 
         activeTab !== DashboardTab.PROFILE && (
          <PeriodPicker 
            period={period} setPeriod={setPeriod} 
            comparePeriod={comparePeriod} setComparePeriod={setComparePeriod} 
          />
        )}

        {(() => {
          switch (activeTab) {
            case DashboardTab.OVERVIEW: return <OverviewTab client={currentClient} />;
            case DashboardTab.RANKINGS: return <RankingsTab rankings={currentClient.data.rankings} isComparing={!!comparePeriod} />;
            case DashboardTab.KPIS: return <KpiTab kpis={currentClient.data.kpis} />;
            case DashboardTab.GOOGLE: return <AdTab data={currentClient.data.googleAds} type="google" clientCurrency={currentClient.kyc.currency} />;
            case DashboardTab.META: return <AdTab data={currentClient.data.metaAds} type="meta" clientCurrency={currentClient.kyc.currency} />;
            case DashboardTab.OTHER_KPIS: return <OtherKpiTab tasks={currentClient.data.otherKpis} />;
            case DashboardTab.ROADMAP: return <RoadmapTab items={currentClient.data.roadmap} />;
            case DashboardTab.APPROVALS: return <ApprovalsTab approvals={currentClient.contentApprovals} onUpdateStatus={(id, status) => {
                const updated = currentClient.contentApprovals.map(a => a.id === id ? { ...a, status } : a);
                handleUpdateClientProfile(currentClient.id, { contentApprovals: updated });
              }} />;
            case DashboardTab.REPORTING: return <ReportingTab client={currentClient} settings={adminSettings} period={period} />;
            case DashboardTab.PROFILE: return <ProfileTab client={currentClient} onUpdateProfile={(updates) => handleUpdateClientProfile(currentClient.id, updates)} />;
            default: return <OverviewTab client={currentClient} />;
          }
        })()}
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(var(--primary-color) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="bg-white rounded-[2.5rem] p-10 md:p-14 max-w-md w-full shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-500 relative z-10 border border-slate-100 mb-8">
          <div className="flex flex-col items-center">
             <button onClick={resetToHome} className="transition-transform hover:scale-105 active:scale-95 mb-6 focus:outline-none">
                <img 
                  src={adminSettings.agencyLogo} 
                  alt="Agency Logo" 
                  className="h-10 md:h-12 w-auto object-contain"
                />
             </button>
             <h2 className="text-xl font-black text-slate-900 tracking-tight">Performance Dashboard</h2>
          </div>

          {!isRegistering ? (
            <div className="space-y-4 text-left">
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 px-1">Username / Email</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
                      placeholder="Username"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 px-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
                      placeholder="Password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer" 
                />
                <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer">remember</label>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <ShieldAlert size={14} className="text-indigo-500" /> Human Check
                  </label>
                  <button onClick={generateCaptcha} className="text-slate-400 hover:text-indigo-600 transition-colors"><RefreshCw size={14} /></button>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-inner">
                  <span className="text-xl font-black text-indigo-600 tracking-tight">{captchaChallenge.a} + {captchaChallenge.b} =</span>
                  <input type="number" value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)} className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-black w-12 text-slate-900" placeholder="?" />
                  {isCaptchaSolved && <div className="text-emerald-600 animate-bounce"><ShieldCheck size={20} /></div>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => handleLogin('client')} 
                  disabled={!isCaptchaSolved} 
                  className={`py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all border-b-4 ${isCaptchaSolved ? 'bg-emerald-600 text-white border-emerald-800 shadow-xl hover:bg-emerald-700' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'}`}
                >
                  <ShieldCheck size={18} /> Client Access
                </button>
                <button 
                  onClick={() => handleLogin('admin')} 
                  disabled={!isCaptchaSolved} 
                  className={`py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all border-b-4 ${isCaptchaSolved ? 'bg-indigo-600 text-white border-indigo-800 shadow-xl hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'}`}
                >
                  <Key size={18} /> Agency Access
                </button>
              </div>

              <div className="pt-2 text-center">
                <button 
                  onClick={() => setIsRegistering(true)}
                  className="text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-indigo-600 flex items-center justify-center gap-2 mx-auto"
                >
                  <UserPlus size={14} /> Request New Account
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4 text-left">
                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Company Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900" /></div>
                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Inquiry Email</label>
                <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900" /></div>
              </div>
              <button onClick={() => { alert('Inquiry Transmitted.'); resetToHome(); }} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700">Submit Request</button>
              <button onClick={resetToHome} className="text-slate-400 font-bold text-sm flex items-center justify-center gap-2 mx-auto hover:text-slate-600"><ArrowLeft size={16} /> Cancel</button>
            </div>
          )}
          
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4">
             <div className="flex items-center gap-1 text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase"><ShieldCheck size={10} /> AES-256</div>
          </div>
        </div>

        <button onClick={resetToHome} className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] z-10 hover:text-white transition-colors focus:outline-none">
           {adminSettings.footerCredit}
        </button>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} currentClient={currentClient} settings={adminSettings} onLogout={() => { setIsLoggedIn(false); generateCaptcha(); }}>
      <div className="animate-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </div>
      <footer className="pt-16 pb-8 border-t border-slate-200 mt-20 text-center">
         <button onClick={() => setActiveTab(userRole === 'admin' ? DashboardTab.ADMIN_CLIENTS : DashboardTab.OVERVIEW)} className="text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-indigo-600 transition-colors">
           {adminSettings.footerCredit}
         </button>
      </footer>
    </Layout>
  );
};

export default App;

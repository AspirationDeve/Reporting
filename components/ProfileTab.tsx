import React, { useState } from 'react';
import { ClientProfile } from '../types';
import { 
  Building2, User, Mail, Calendar, Paperclip, 
  FileText, ShieldCheck, Camera, Upload, CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface ProfileTabProps {
  client: ClientProfile;
  onUpdateProfile: (updates: Partial<ClientProfile>) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ client, onUpdateProfile }) => {
  const [uploading, setUploading] = useState<string | null>(null);

  const handleFileUpload = (type: string) => {
    setUploading(type);
    // Simulate upload
    setTimeout(() => {
      setUploading(null);
      alert(`${type.replace(/([A-Z])/g, ' $1').trim()} uploaded successfully!`);
    }, 1500);
  };

  const handlePhotoUpdate = () => {
    // Simulate photo update
    const mockUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
    onUpdateProfile({ kyc: { ...client.kyc, profilePhotoUrl: mockUrl } });
    alert("Profile photo updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Photo */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
              {client.kyc.profilePhotoUrl ? (
                <img src={client.kyc.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-slate-300" />
              )}
            </div>
            <button 
              onClick={handlePhotoUpdate}
              className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all border-4 border-white"
            >
              <Camera size={18} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{client.kyc.companyName}</h2>
            <p className="text-slate-500 font-bold flex items-center justify-center md:justify-start gap-2 mt-1">
              <Mail size={14} className="text-indigo-500" /> {client.kyc.email}
            </p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck size={12} /> KYC Verified
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                Priority Client
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contract & Dates */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Contract Lifecycle</h3>
            <Calendar size={20} className="text-slate-300" />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract Start</p>
              <p className="text-lg font-black text-slate-800">{client.kyc.contractStartDate || '01-01-2024'}</p>
            </div>
            <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100">
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Renewal Due</p>
              <p className="text-lg font-black text-rose-600">{client.kyc.contractExpiryDate || '12-31-2025'}</p>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3 text-xs font-bold text-slate-500">
            <CheckCircle2 size={16} className="text-emerald-500" /> All payments up to date
          </div>
        </div>

        {/* Documentation Hub */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black">Documentation Vault</h3>
            <FileText size={20} className="text-slate-600" />
          </div>

          <div className="space-y-3">
            <DocumentRow 
              label="Trade License" 
              uploaded={!!client.kyc.tradeLicenseUrl} 
              onUpload={() => handleFileUpload('Trade License')} 
              loading={uploading === 'Trade License'}
            />
            <DocumentRow 
              label="Brand Book" 
              uploaded={!!client.kyc.brandBookUrl} 
              onUpload={() => handleFileUpload('Brand Book')} 
              loading={uploading === 'Brand Book'}
            />
            <DocumentRow 
              label="VAT Certificate" 
              uploaded={!!client.kyc.vatCertificateUrl} 
              onUpload={() => handleFileUpload('VAT Certificate')} 
              loading={uploading === 'VAT Certificate'}
            />
          </div>

          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center pt-4 border-t border-slate-800">
            Secure Cloud Storage End-to-End Encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

const DocumentRow = ({ label, uploaded, onUpload, loading }: { label: string, uploaded: boolean, onUpload: () => void, loading: boolean }) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${uploaded ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
        <Paperclip size={16} />
      </div>
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {uploaded ? 'Verified' : 'Required'}
        </p>
      </div>
    </div>
    <button 
      onClick={onUpload}
      disabled={loading}
      className={`p-2.5 rounded-xl transition-all ${
        loading ? 'bg-indigo-600 animate-pulse' : 
        uploaded ? 'text-indigo-400 hover:bg-indigo-400/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      }`}
    >
      {loading ? <Upload size={18} /> : uploaded ? <ExternalLink size={18} /> : <Upload size={18} />}
    </button>
  </div>
);

export default ProfileTab;
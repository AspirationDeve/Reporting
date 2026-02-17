
import React from 'react';
import { ContentApproval } from '../types';
import { ExternalLink, CheckCircle2, XCircle, Clock, Info, ShieldCheck } from 'lucide-react';

interface ApprovalsTabProps {
  approvals: ContentApproval[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
}

const ApprovalsTab: React.FC<ApprovalsTabProps> = ({ approvals, onUpdateStatus }) => {
  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl shadow-indigo-100 border border-indigo-800 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-black">Creative Assets Approval</h2>
            {pendingCount > 0 && (
              <span className="px-3 py-1 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest animate-bounce">
                {pendingCount} Pending Tasks
              </span>
            )}
          </div>
          <p className="text-indigo-200 text-sm max-w-2xl font-medium">
            Review and approve marketing collateral, social media assets, and campaign designs. 
            Click on the "View Asset" button to open the Canva workspace.
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-3 bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-sm min-w-[200px]">
           <div className="text-4xl font-black">{pendingCount}</div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Awaiting Feedback</p>
           <ShieldCheck size={20} className="text-emerald-400 opacity-50" />
        </div>

        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {approvals.length === 0 ? (
          <div className="col-span-full bg-white p-24 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Clock size={32} />
            </div>
            <p className="text-slate-500 font-black">No assets currently pending review.</p>
          </div>
        ) : (
          approvals.map((item) => (
            <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h3 className="font-black text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    Created {new Date(item.dateCreated).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100 flex gap-3">
                 <Info size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                 <p className="text-xs text-slate-600 leading-relaxed italic font-medium">{item.notes || 'No designer notes provided.'}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href={item.canvaLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all text-sm shadow-sm"
                >
                  <ExternalLink size={16} /> View Asset
                </a>
                
                {item.status === 'pending' && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => onUpdateStatus(item.id, 'rejected')}
                      className="bg-rose-50 text-rose-600 font-bold p-3 rounded-xl hover:bg-rose-100 transition-all shadow-sm border border-rose-100"
                      title="Request Changes"
                    >
                      <XCircle size={20} />
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(item.id, 'approved')}
                      className="bg-emerald-500 text-white font-black px-6 py-3 rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
                    >
                      <CheckCircle2 size={18} /> Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: ContentApproval['status'] }) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  return (
    <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default ApprovalsTab;

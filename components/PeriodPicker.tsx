
import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface PeriodPickerProps {
  period: string;
  setPeriod: (p: string) => void;
  comparePeriod: string;
  setComparePeriod: (p: string) => void;
}

const PeriodPicker: React.FC<PeriodPickerProps> = ({ period, setPeriod, comparePeriod, setComparePeriod }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center bg-white border border-slate-200 rounded-3xl px-6 py-4 shadow-sm w-fit mb-8">
      <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
        <Calendar size={18} className="text-indigo-600" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Period</span>
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm font-black text-slate-800 bg-transparent outline-none cursor-pointer hover:text-indigo-600 transition-colors"
          >
            <option value="May 2024">May 2024</option>
            <option value="April 2024">April 2024</option>
            <option value="Q1 2024">Q1 2024</option>
            <option value="Year to Date">Year to Date</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
           <span className="text-[10px] font-black text-indigo-500 uppercase">VS</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compare To</span>
          <select 
            value={comparePeriod}
            onChange={(e) => setComparePeriod(e.target.value)}
            className="text-sm font-black text-slate-800 bg-transparent outline-none cursor-pointer hover:text-indigo-600 transition-colors"
          >
            <option value="Previous Month">Previous Month</option>
            <option value="Previous Quarter">Previous Quarter</option>
            <option value="Previous Year">Same Month Last Year</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PeriodPicker;

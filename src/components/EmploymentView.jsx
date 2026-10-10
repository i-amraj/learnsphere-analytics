import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Search, 
  Download, 
  ArrowUpRight, 
  BarChart3,
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export default function EmploymentView({ rawData, selectedYear }) {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    employment_rate_by_state = [],
    unemployment_rate_by_state = [],
    all_india_summary = []
  } = rawData.employment || {};

  // Filter current year
  const currentEmp = useMemo(() => employment_rate_by_state.filter(item => item.Year === selectedYear), [employment_rate_by_state, selectedYear]);
  const currentUnemp = useMemo(() => unemployment_rate_by_state.filter(item => item.Year === selectedYear), [unemployment_rate_by_state, selectedYear]);
  const currentSummary = useMemo(() => all_india_summary.find(item => item.Year === selectedYear) || {}, [all_india_summary, selectedYear]);

  // Combined State Data
  const combinedStateData = useMemo(() => {
    return currentEmp.map(emp => {
      const unemp = currentUnemp.find(u => u.State?.toLowerCase() === emp.State?.toLowerCase()) || {};

      return {
        State: emp.State,
        empTotal: emp['Total'] || 0,
        empMale: emp['Male'] || 0,
        empFemale: emp['Female'] || 0,
        unempTotal: unemp['Total'] || 0,
        unempMale: unemp['Male'] || 0,
        unempFemale: unemp['Female'] || 0,
      };
    }).sort((a, b) => b.empTotal - a.empTotal);
  }, [currentEmp, currentUnemp]);

  const filteredStates = useMemo(() => {
    if (!searchTerm) return combinedStateData;
    return combinedStateData.filter(s => s.State.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [combinedStateData, searchTerm]);

  // Top 10 Employment States
  const top10EmpData = useMemo(() => {
    return combinedStateData.slice(0, 10).map(s => ({
      name: s.State.length > 12 ? s.State.substring(0, 11) + '..' : s.State,
      'Total Employment %': s.empTotal,
      'Male Employment %': s.empMale,
      'Female Employment %': s.empFemale
    }));
  }, [combinedStateData]);

  // Multi-year All India Trend Data
  const trendData = useMemo(() => {
    return all_india_summary.map(item => ({
      year: item.Year,
      'National Employment %': item['Total Emp Rate'],
      'Male Employment %': item['Male Emp Rate'],
      'Female Employment %': item['Female Emp Rate'],
      'Unemployment %': item['Total Unemp Rate']
    }));
  }, [all_india_summary]);

  const exportCSV = () => {
    const headers = ['State', 'Total Employment %', 'Male Emp %', 'Female Emp %', 'Total Unemployment %', 'Male Unemp %', 'Female Unemp %'];
    const rows = combinedStateData.map(d => [
      `"${d.State}"`,
      d.empTotal,
      d.empMale,
      d.empFemale,
      d.unempTotal,
      d.unempMale,
      d.unempFemale
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LearnSphere_Employment_Data_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title & Stats Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-sky-700 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-3 border border-white/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>National Labor Market Dynamics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Employment & Unemployment Workforce Indicators
          </h2>
          <p className="mt-2 text-teal-100 text-xs sm:text-sm leading-relaxed">
            State-by-state labor participation, employment trends, and gender disparity ratios across India. Correlating higher education attainment with productive economic engagement.
          </p>
        </div>

        {/* National Employment Metrics */}
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-teal-200 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> National Employment
            </div>
            <div className="text-xl font-black mt-1">
              {currentSummary['Total Emp Rate'] || '58.2'}%
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-teal-200 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" /> Unemployment Rate
            </div>
            <div className="text-xl font-black mt-1">
              {currentSummary['Total Unemp Rate'] || '3.2'}%
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-teal-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Male Employment
            </div>
            <div className="text-xl font-black mt-1">
              {currentSummary['Male Emp Rate'] || '76.3'}%
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-teal-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Female Employment
            </div>
            <div className="text-xl font-black mt-1">
              {currentSummary['Female Emp Rate'] || '40.1'}%
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top 10 Employment States */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Top 10 States by Employment Rate ({selectedYear})
              </h3>
              <p className="text-xs text-slate-500">
                Comparing overall, male, and female participation
              </p>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
              Leaderboard
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10EmpData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  formatter={(val) => [`${val}%`, '']} 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Total Employment %" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Male Employment %" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Female Employment %" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* National 3-Year Trend */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                National Longitudinal Workforce Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Comparing 2021-22, 2022-23, and 2023-24 trends
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              3-Year Horizon
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  formatter={(val) => [`${val}%`, '']} 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="National Employment %" stroke="#0284c7" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="Male Employment %" stroke="#2563eb" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="Female Employment %" stroke="#0d9488" strokeWidth={2} />
                <Line type="monotone" dataKey="Unemployment %" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* State-Wise Detailed Searchable Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              State & UT Employment & Unemployment Table ({selectedYear})
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredStates.length} of 36 States/UTs. Sorted by Total Employment Rate.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-500 focus:bg-white transition-all w-48 sm:w-64"
              />
            </div>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-bold">State / UT</th>
                <th className="py-3 px-3 font-bold text-right">Total Emp Rate</th>
                <th className="py-3 px-3 font-bold text-right">Male Emp Rate</th>
                <th className="py-3 px-3 font-bold text-right">Female Emp Rate</th>
                <th className="py-3 px-3 font-bold text-right">Gender Gap</th>
                <th className="py-3 px-3 font-bold text-right">Unemp Rate</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStates.map((row, idx) => {
                const gap = (row.empMale - row.empFemale).toFixed(1);
                return (
                  <tr key={idx} className="hover:bg-teal-50/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.State}</td>
                    <td className="py-3 px-3 text-right font-black text-teal-700">{row.empTotal}%</td>
                    <td className="py-3 px-3 text-right text-slate-600">{row.empMale}%</td>
                    <td className="py-3 px-3 text-right text-slate-600">{row.empFemale}%</td>
                    <td className="py-3 px-3 text-right text-slate-500 font-medium">{gap}%</td>
                    <td className="py-3 px-3 text-right font-bold text-rose-600">{row.unempTotal}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.empTotal >= 60 ? 'bg-emerald-100 text-emerald-800' :
                        row.empTotal >= 50 ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {row.empTotal >= 60 ? 'High' : row.empTotal >= 50 ? 'Moderate' : 'Developing'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

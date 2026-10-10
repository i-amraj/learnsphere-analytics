import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Building2, 
  Users, 
  Award, 
  Search, 
  Download, 
  TrendingUp,
  PieChart as PieIcon,
  BookOpen
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function HigherEducationView({ rawData, selectedYear }) {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    institutions_by_state = [],
    enrollment_by_state = [],
    teachers_by_state = [],
    indicators_by_state = [],
    all_india_summary = []
  } = rawData.higher_ed || {};

  // Filter current year
  const currentInst = useMemo(() => institutions_by_state.filter(item => item.Year === selectedYear), [institutions_by_state, selectedYear]);
  const currentEnr = useMemo(() => enrollment_by_state.filter(item => item.Year === selectedYear), [enrollment_by_state, selectedYear]);
  const currentTea = useMemo(() => teachers_by_state.filter(item => item.Year === selectedYear), [teachers_by_state, selectedYear]);
  const currentInd = useMemo(() => indicators_by_state.filter(item => item.Year === selectedYear), [indicators_by_state, selectedYear]);
  const currentSummary = useMemo(() => all_india_summary.find(item => item.Year === selectedYear) || {}, [all_india_summary, selectedYear]);

  // Combined State Data
  const combinedStateData = useMemo(() => {
    return currentInst.map(inst => {
      const enr = currentEnr.find(e => e.State?.toLowerCase() === inst.State?.toLowerCase()) || {};
      const tea = currentTea.find(t => t.State?.toLowerCase() === inst.State?.toLowerCase()) || {};
      const ind = currentInd.find(k => k.State?.toLowerCase() === inst.State?.toLowerCase()) || {};

      return {
        State: inst.State,
        totalUni: inst['Total Uni'] || 0,
        govUni: inst['Gov. Uni'] || 0,
        privUni: inst['Private Uni'] || 0,
        totalClg: inst['Total Clg'] || 0,
        govClg: inst['Gov. Clg'] || 0,
        privClg: inst['Private  Clg'] || 0,
        totalInstitutions: (inst['Total Uni'] || 0) + (inst['Total Clg'] || 0),
        uniStudents: enr['Total Uni Students'] || 0,
        clgStudents: enr['Total Clg Students'] || 0,
        totalStudents: (enr['Total Uni Students'] || 0) + (enr['Total Clg Students'] || 0),
        totalFaculty: tea['Total Teachers'] || 0,
        maleFaculty: tea['Male Teachers'] || 0,
        femaleFaculty: tea['Female Teachers'] || 0,
        ger: ind['Total GER'] || 0,
        gpi: ind['GPI'] || 0,
        ptr: ind['PTR'] || 0,
      };
    }).sort((a, b) => b.totalClg - a.totalClg);
  }, [currentInst, currentEnr, currentTea, currentInd]);

  const filteredStates = useMemo(() => {
    if (!searchTerm) return combinedStateData;
    return combinedStateData.filter(s => s.State.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [combinedStateData, searchTerm]);

  // Top 10 States by College Count
  const top10CollegesData = useMemo(() => {
    return combinedStateData.slice(0, 10).map(s => ({
      name: s.State.length > 12 ? s.State.substring(0, 11) + '..' : s.State,
      'Private Colleges': s.privClg,
      'Government Colleges': s.govClg
    }));
  }, [combinedStateData]);

  // Institution Type Distribution
  const instPieData = [
    { name: 'Private Colleges', value: combinedStateData.reduce((acc, c) => acc + c.privClg, 0), color: '#0284c7' },
    { name: 'Government Colleges', value: combinedStateData.reduce((acc, c) => acc + c.govClg, 0), color: '#38bdf8' },
    { name: 'Government Universities', value: combinedStateData.reduce((acc, c) => acc + c.govUni, 0), color: '#4f46e5' },
    { name: 'Private Universities', value: combinedStateData.reduce((acc, c) => acc + c.privUni, 0), color: '#818cf8' },
  ];

  const exportCSV = () => {
    const headers = ['State', 'Total Colleges', 'Gov Colleges', 'Priv Colleges', 'Total Unis', 'Gov Unis', 'Priv Unis', 'Total Students', 'Uni Students', 'College Students', 'Total Faculty', 'GER', 'GPI', 'PTR'];
    const rows = combinedStateData.map(d => [
      `"${d.State}"`,
      d.totalClg,
      d.govClg,
      d.privClg,
      d.totalUni,
      d.govUni,
      d.privUni,
      d.totalStudents,
      d.uniStudents,
      d.clgStudents,
      d.totalFaculty,
      d.ger,
      d.gpi,
      d.ptr
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LearnSphere_HigherEd_Data_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title & Stats Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-3 border border-white/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>AISHE All India Higher Education Survey</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Higher Education Infrastructure & University Footprint
          </h2>
          <p className="mt-2 text-indigo-100 text-xs sm:text-sm leading-relaxed">
            Detailed analytics covering 47,000+ Colleges and 1,200+ Universities across India. Analyzing public vs private institutional concentration, gross enrollment ratio (GER), and academic faculty strength.
          </p>
        </div>

        {/* National AISHE Metrics */}
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-indigo-200 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Total Colleges & Unis
            </div>
            <div className="text-xl font-black mt-1">
              {Number(currentSummary['Total Uni/Clgs'] || 47757).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-indigo-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Higher Ed Students
            </div>
            <div className="text-xl font-black mt-1">
              {Number(currentSummary['Total_Students_Enrollment'] || 43268181).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-indigo-200 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> National GER
            </div>
            <div className="text-xl font-black mt-1">
              {currentSummary['Total GER'] || '28.4'}%
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-indigo-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Higher Ed PTR
            </div>
            <div className="text-xl font-black mt-1">
              {currentSummary['Total PTR'] || '26'} : 1
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top 10 States by College Density */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Top 10 States: College Density & Ownership Split
              </h3>
              <p className="text-xs text-slate-500">
                Private vs Government College distributions ({selectedYear})
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              AISHE Audited
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10CollegesData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`} />
                <Tooltip 
                  formatter={(val) => [Number(val).toLocaleString('en-IN'), '']} 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Private Colleges" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Government Colleges" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Institutional Breakdown Donut */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">
                Institutional Landscape
              </h3>
              <PieIcon className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-xs text-slate-500 mb-4">
              All India proportion of Colleges and Universities
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={instPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {instPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [Number(val).toLocaleString('en-IN'), 'Institutions']} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-900">
            <span className="font-semibold">Key Finding:</span> Over 78% of all colleges in India are operated in the private sector, serving as the main driver of undergraduate capacities.
          </div>
        </div>

      </div>

      {/* State-Wise Searchable Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              State & UT Higher Education Master Table ({selectedYear})
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredStates.length} of 36 States/UTs. Sorted by Total Colleges.
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
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all w-48 sm:w-64"
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
                <th className="py-3 px-3 font-bold text-right">Total Colleges</th>
                <th className="py-3 px-3 font-bold text-right">Gov. Colleges</th>
                <th className="py-3 px-3 font-bold text-right">Private Colleges</th>
                <th className="py-3 px-3 font-bold text-right">Total Unis</th>
                <th className="py-3 px-3 font-bold text-right">Total Students</th>
                <th className="py-3 px-3 font-bold text-right">Total Faculty</th>
                <th className="py-3 px-3 font-bold text-center">GER %</th>
                <th className="py-3 px-4 font-bold text-center">PTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStates.map((row, idx) => (
                <tr key={idx} className="hover:bg-indigo-50/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.State}</td>
                  <td className="py-3 px-3 text-right font-black text-indigo-700">{row.totalClg.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{row.govClg.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{row.privClg.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-800">{row.totalUni}</td>
                  <td className="py-3 px-3 text-right font-medium text-slate-700">{row.totalStudents.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{row.totalFaculty.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      {row.ger}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {row.ptr} : 1
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

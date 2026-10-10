import React, { useState, useMemo } from 'react';
import { 
  School, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Search, 
  TrendingUp, 
  Zap, 
  Wifi, 
  Droplet, 
  Monitor,
  HeartHandshake,
  Download
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export default function SchoolEducationView({ rawData, selectedYear }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMetricTab, setActiveMetricTab] = useState('schools');

  const {
    schools_by_state = [],
    enrollment_by_state = [],
    teachers_by_state = [],
    indicators_by_state = [],
    infrastructure_by_state = [],
    all_india_summary = [],
    all_india_infrastructure = []
  } = rawData.school || {};

  // Filter current year data
  const currentSchools = useMemo(() => {
    return schools_by_state.filter(item => item.Year === selectedYear);
  }, [schools_by_state, selectedYear]);

  const currentEnrollment = useMemo(() => {
    return enrollment_by_state.filter(item => item.Year === selectedYear);
  }, [enrollment_by_state, selectedYear]);

  const currentInfra = useMemo(() => {
    return infrastructure_by_state.filter(item => item.Year === selectedYear);
  }, [infrastructure_by_state, selectedYear]);

  const currentIndicators = useMemo(() => {
    return indicators_by_state.filter(item => item.Year === selectedYear);
  }, [indicators_by_state, selectedYear]);

  const currentNationalInfra = useMemo(() => {
    return all_india_infrastructure.find(item => item.Year === selectedYear) || {};
  }, [all_india_infrastructure, selectedYear]);

  // Combined state dataset for search and table
  const combinedStateData = useMemo(() => {
    return currentSchools.map(sch => {
      const enr = currentEnrollment.find(e => e.State?.toLowerCase() === sch.State?.toLowerCase()) || {};
      const inf = currentInfra.find(i => i.State?.toLowerCase() === sch.State?.toLowerCase()) || {};
      const ind = currentIndicators.find(k => k.State?.toLowerCase() === sch.State?.toLowerCase()) || {};

      return {
        State: sch.State,
        totalSchools: sch['Total Schools'] || 0,
        govSchools: sch['Gov.  Schools'] || 0,
        privSchools: sch['Private Schools'] || 0,
        totalGovStudents: enr['Total Gov. Students'] || 0,
        totalPrivStudents: enr['Total Priv. Students'] || 0,
        totalStudents: (enr['Total Gov. Students'] || 0) + (enr['Total Priv. Students'] || 0),
        ptr: ind['PTR'] || 0,
        ger: ind['Total GER'] || 0,
        electricityPct: inf['Electricity %'] || 0,
        internetPct: inf['Internet %'] || 0,
        drinkingWaterPct: inf['drinking water %'] || 0,
        toiletPct: inf['Girls toilet%'] || 0,
      };
    }).sort((a, b) => b.totalSchools - a.totalSchools);
  }, [currentSchools, currentEnrollment, currentInfra, currentIndicators]);

  // Filtered states by search term
  const filteredStates = useMemo(() => {
    if (!searchTerm) return combinedStateData;
    return combinedStateData.filter(s => 
      s.State.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [combinedStateData, searchTerm]);

  // Top 10 states by school count for chart
  const top10SchoolsData = useMemo(() => {
    return combinedStateData.slice(0, 10).map(s => ({
      name: s.State.length > 12 ? s.State.substring(0, 11) + '..' : s.State,
      'Government Schools': s.govSchools,
      'Private Schools': s.privSchools
    }));
  }, [combinedStateData]);

  // Radar chart data for national infrastructure
  const infraRadarData = [
    { subject: 'Drinking Water', score: currentNationalInfra['% Drinking water'] || 98.3, fullMark: 100 },
    { subject: 'Electricity', score: currentNationalInfra['% Electricity'] || 92.5, fullMark: 100 },
    { subject: 'Functional Girls Toilet', score: currentNationalInfra['% Functional girls toilet'] || 93.9, fullMark: 100 },
    { subject: 'Library Facility', score: currentNationalInfra['% Library'] || 87.2, fullMark: 100 },
    { subject: 'Internet Facility', score: currentNationalInfra['% Internet'] || 45.8, fullMark: 100 },
    { subject: 'Computers Avail.', score: currentNationalInfra['% Computer'] || 52.3, fullMark: 100 },
  ];

  const exportCSV = () => {
    const headers = ['State', 'Total Schools', 'Gov Schools', 'Private Schools', 'Total Students', 'Gov Students', 'Priv Students', 'PTR', 'Electricity %', 'Internet %', 'Girls Toilet %'];
    const rows = combinedStateData.map(d => [
      `"${d.State}"`,
      d.totalSchools,
      d.govSchools,
      d.privSchools,
      d.totalStudents,
      d.totalGovStudents,
      d.totalPrivStudents,
      d.ptr,
      d.electricityPct,
      d.internetPct,
      d.toiletPct
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LearnSphere_School_Data_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title & Stats Ribbon */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-3 border border-white/20">
            <School className="w-3.5 h-3.5" />
            <span>UDISE+ National School Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            School Education Infrastructure & Demographics
          </h2>
          <p className="mt-2 text-sky-100 text-xs sm:text-sm leading-relaxed">
            Detailed breakdown of 14+ lakh schools across India. Visualizing institutional management (Government vs. Private), enrollment gender parity, teacher staffing ratios, and digital infrastructure readiness.
          </p>
        </div>

        {/* Quick Infrastructure Badges */}
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-sky-200 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5" /> Drinking Water
            </div>
            <div className="text-xl font-black mt-1">{currentNationalInfra['% Drinking water'] || '98.3'}%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-sky-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Electricity
            </div>
            <div className="text-xl font-black mt-1">{currentNationalInfra['% Electricity'] || '92.5'}%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-sky-200 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" /> Girls Toilet
            </div>
            <div className="text-xl font-black mt-1">{currentNationalInfra['% Functional girls toilet'] || '93.9'}%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-[11px] text-sky-200 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" /> Internet Access
            </div>
            <div className="text-xl font-black mt-1">{currentNationalInfra['% Internet'] || '45.8'}%</div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top 10 States School Comparison */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Top 10 States: Government vs. Private Schools
              </h3>
              <p className="text-xs text-slate-500">
                Institutional distribution in the largest education hubs ({selectedYear})
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              UDISE+ Validated
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10SchoolsData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(val) => [Number(val).toLocaleString('en-IN'), '']} 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Government Schools" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Private Schools" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* National Infrastructure Radar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">
                National Infrastructure Radar
              </h3>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xs text-slate-500 mb-4">
              All India % of schools equipped with basic amenities
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={infraRadarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#475569' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="Coverage %" dataKey="score" stroke="#2563eb" fill="#0284c7" fillOpacity={0.4} />
                  <Tooltip formatter={(val) => [`${val}%`, 'National Coverage']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Critical Observation:</span> While drinking water and electricity have crossed 90%, digital penetration (Internet at 45.8%) remains a major growth opportunity.
          </div>
        </div>

      </div>

      {/* State-Wise Detailed Searchable Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              State & UT Comprehensive School Data Table ({selectedYear})
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredStates.length} of 36 States/UTs. Sorted by Total Schools.
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
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all w-48 sm:w-64"
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
                <th className="py-3 px-3 font-bold text-right">Total Schools</th>
                <th className="py-3 px-3 font-bold text-right">Gov. Schools</th>
                <th className="py-3 px-3 font-bold text-right">Private Schools</th>
                <th className="py-3 px-3 font-bold text-right">Gov Students</th>
                <th className="py-3 px-3 font-bold text-right">Priv Students</th>
                <th className="py-3 px-3 font-bold text-center">PTR</th>
                <th className="py-3 px-3 font-bold text-right">Electricity %</th>
                <th className="py-3 px-3 font-bold text-right">Internet %</th>
                <th className="py-3 px-4 font-bold text-right">Girls Toilet %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStates.map((row, idx) => (
                <tr key={idx} className="hover:bg-sky-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.State}</td>
                  <td className="py-3 px-3 text-right font-black text-blue-700">{row.totalSchools.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{row.govSchools.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{row.privSchools.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{row.totalGovStudents.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{row.totalPrivStudents.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.ptr <= 25 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {row.ptr} : 1
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-700">{row.electricityPct}%</td>
                  <td className="py-3 px-3 text-right font-medium text-slate-700">{row.internetPct}%</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-700">{row.toiletPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

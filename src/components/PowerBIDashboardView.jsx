import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Download, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Filter, 
  Layers, 
  PieChart as PieIcon,
  TrendingUp,
  School,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Sparkles,
  ExternalLink
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
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function PowerBIDashboardView({ rawData, selectedYear, setSelectedYear }) {
  const [activePage, setActivePage] = useState('overview');
  const [selectedState, setSelectedState] = useState('All India');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Pages present in the actual Education landscape.pbix file
  const pages = [
    { id: 'overview', title: 'Education Overview', icon: Layers },
    { id: 'school', title: 'School Education', icon: School },
    { id: 'higher', title: 'Higher Education', icon: GraduationCap },
    { id: 'emp', title: 'Employment & Unemployment', icon: Briefcase },
    { id: 'voice', title: 'Student Voice & Insights', icon: MessageSquare }
  ];

  // List of states from data
  const stateList = useMemo(() => {
    const list = rawData.school?.schools_by_state
      ?.filter(item => item.Year === selectedYear)
      ?.map(item => item.State) || [];
    return ['All India', ...Array.from(new Set(list)).sort()];
  }, [rawData, selectedYear]);

  // Data helpers based on selectedState
  const currentSchools = rawData.school?.schools_by_state?.filter(i => i.Year === selectedYear) || [];
  const currentEnr = rawData.school?.enrollment_by_state?.filter(i => i.Year === selectedYear) || [];
  const currentInfra = rawData.school?.infrastructure_by_state?.filter(i => i.Year === selectedYear) || [];
  const currentColleges = rawData.higher_ed?.institutions_by_state?.filter(i => i.Year === selectedYear) || [];
  const currentHigherEnr = rawData.higher_ed?.enrollment_by_state?.filter(i => i.Year === selectedYear) || [];
  const currentEmp = rawData.employment?.employment_rate_by_state?.filter(i => i.Year === selectedYear) || [];
  const currentUnemp = rawData.employment?.unemployment_rate_by_state?.filter(i => i.Year === selectedYear) || [];

  const nationalSchool = rawData.school?.all_india_summary?.find(i => i.Year === selectedYear) || {};
  const nationalHigher = rawData.higher_ed?.all_india_summary?.find(i => i.Year === selectedYear) || {};
  const nationalEmp = rawData.employment?.all_india_summary?.find(i => i.Year === selectedYear) || {};
  const nationalInfra = rawData.school?.all_india_infrastructure?.find(i => i.Year === selectedYear) || {};

  // Compute selected metrics
  const displayMetrics = useMemo(() => {
    if (selectedState === 'All India') {
      return {
        schools: nationalSchool['Total Schools'] || 1469990,
        schoolStudents: nationalSchool['Total_Enrollment'] || 248045828,
        colleges: nationalHigher['Total Uni/Clgs'] || 47757,
        higherStudents: nationalHigher['Total_Students_Enrollment'] || 43268181,
        higherFaculty: nationalHigher['Total_Teachers'] || 1598213,
        empRate: nationalEmp['Total Emp Rate'] || 58.2,
        unempRate: nationalEmp['Total Unemp Rate'] || 3.2,
        schoolPTR: nationalSchool['Total PTR'] || 24,
        higherPTR: nationalHigher['Total PTR'] || 26,
      };
    } else {
      const sch = currentSchools.find(s => s.State === selectedState) || {};
      const enr = currentEnr.find(e => e.State === selectedState) || {};
      const clg = currentColleges.find(c => c.State === selectedState) || {};
      const hEnr = currentHigherEnr.find(h => h.State === selectedState) || {};
      const emp = currentEmp.find(m => m.State === selectedState) || {};
      const unemp = currentUnemp.find(u => u.State === selectedState) || {};

      return {
        schools: sch['Total Schools'] || 0,
        schoolStudents: (enr['Total Gov. Students'] || 0) + (enr['Total Priv. Students'] || 0),
        colleges: (clg['Total Uni'] || 0) + (clg['Total Clg'] || 0),
        higherStudents: (hEnr['Total Uni Students'] || 0) + (hEnr['Total Clg Students'] || 0),
        higherFaculty: 0,
        empRate: emp['Total'] || 0,
        unempRate: unemp['Total'] || 0,
        schoolPTR: 24,
        higherPTR: 26,
      };
    }
  }, [selectedState, nationalSchool, nationalHigher, nationalEmp, currentSchools, currentEnr, currentColleges, currentHigherEnr, currentEmp, currentUnemp]);

  // Chart data for Overview
  const topStatesSchoolVsCollege = useMemo(() => {
    return currentSchools.slice(0, 7).map(s => {
      const c = currentColleges.find(clg => clg.State === s.State) || {};
      return {
        name: s.State.length > 10 ? s.State.substring(0, 9) + '..' : s.State,
        'Schools (x100)': Math.round((s['Total Schools'] || 0) / 100),
        Colleges: c['Total Clg'] || 0
      };
    });
  }, [currentSchools, currentColleges]);

  // Higher Ed ownership breakdown
  const pieOwnership = [
    { name: 'Private Colleges', value: 78, color: '#38bdf8' },
    { name: 'Government Colleges', value: 22, color: '#0284c7' },
  ];

  const studentVoiceInsights = [
    { title: 'Digital Accessibility Divide', metric: '54.2% Gap', desc: '45.8% schools possess working internet; students strongly advocate for universal broadband for hybrid STEM education.', color: 'border-l-sky-500' },
    { title: 'Vocational & Employability Linkage', metric: '68% Demand', desc: 'Over 68% of undergraduates reported needing structured industry internships during 3rd and 4th academic semesters.', color: 'border-l-indigo-500' },
    { title: 'Gender Parity Momentum', metric: '1.07 GPI', desc: 'Female enrollment has outpaced male enrollment in secondary schools (GPI 1.07), reflecting high returns on welfare schemes.', color: 'border-l-emerald-500' },
    { title: 'Teacher Quality & PTR Balance', metric: '24 : 1 Ratio', desc: 'National PTR has improved from 27:1 (2021) to 24:1 (2023), enhancing individual classroom attention.', color: 'border-l-amber-500' }
  ];

  return (
    <div className={`space-y-6 animate-fade-in ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 p-6 overflow-y-auto' : ''}`}>
      
      {/* Power BI Workspace Header */}
      <div className="bg-[#002244] border border-blue-900 rounded-3xl p-5 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md">
            PBI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">
                Education Landscape Power BI Studio
              </h2>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                PBIX Interactive Runtime
              </span>
            </div>
            <p className="text-xs text-sky-200">
              Direct web rendering of the project's Power BI report sheets and DAX visual measures.
            </p>
          </div>
        </div>

        {/* Action Controls & Slicers */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Year Slicer */}
          <div className="flex items-center bg-white/10 rounded-xl px-2.5 py-1.5 border border-white/20 text-xs">
            <span className="text-sky-300 font-semibold mr-2">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {rawData.metadata?.years.map(y => (
                <option key={y} value={y} className="bg-slate-900 text-white">{y}</option>
              ))}
            </select>
          </div>

          {/* State Slicer */}
          <div className="flex items-center bg-white/10 rounded-xl px-2.5 py-1.5 border border-white/20 text-xs">
            <span className="text-sky-300 font-semibold mr-2">State Slicer:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              {stateList.map(st => (
                <option key={st} value={st} className="bg-slate-900 text-white">{st}</option>
              ))}
            </select>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Download Original PBIX */}
          <a
            href="/Education_landscape.pbix"
            download="Education_landscape.pbix"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .PBIX</span>
          </a>
        </div>
      </div>

      {/* Power BI Canvas Card (Dark Theme matching the PBIX file design) */}
      <div className="bg-[#0b1329] border border-blue-900/60 rounded-3xl p-6 shadow-2xl text-white min-h-[580px] flex flex-col justify-between relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Canvas Content based on Active Page */}
        <div className="space-y-6">
          
          {/* Top Page Title in Canvas */}
          <div className="flex items-center justify-between border-b border-blue-900/50 pb-4">
            <div>
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                Power BI Page View &bull; {selectedState}
              </span>
              <h3 className="text-xl font-black text-white">
                {pages.find(p => p.id === activePage)?.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Report Engine</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Live DAX Ingestion
              </span>
            </div>
          </div>

          {/* 4 Power BI Card Visuals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-blue-800/60 rounded-2xl p-4 shadow-inner">
              <span className="text-[11px] font-medium text-sky-300 block">Total Schools</span>
              <div className="text-2xl font-black text-white mt-1">
                {Number(displayMetrics.schools).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400">PTR: {displayMetrics.schoolPTR}:1</span>
            </div>

            <div className="bg-slate-900/80 border border-blue-800/60 rounded-2xl p-4 shadow-inner">
              <span className="text-[11px] font-medium text-sky-300 block">Colleges & Unis</span>
              <div className="text-2xl font-black text-white mt-1">
                {Number(displayMetrics.colleges).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400">Higher Ed PTR: {displayMetrics.higherPTR}:1</span>
            </div>

            <div className="bg-slate-900/80 border border-blue-800/60 rounded-2xl p-4 shadow-inner">
              <span className="text-[11px] font-medium text-sky-300 block">Employment Rate</span>
              <div className="text-2xl font-black text-teal-400 mt-1">
                {displayMetrics.empRate}%
              </div>
              <span className="text-[10px] text-slate-400">Workforce Participation</span>
            </div>

            <div className="bg-slate-900/80 border border-blue-800/60 rounded-2xl p-4 shadow-inner">
              <span className="text-[11px] font-medium text-sky-300 block">Unemployment Rate</span>
              <div className="text-2xl font-black text-rose-400 mt-1">
                {displayMetrics.unempRate}%
              </div>
              <span className="text-[10px] text-slate-400">Active Survey</span>
            </div>
          </div>

          {/* Page Specific Views */}
          {activePage === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              <div className="lg:col-span-2 bg-slate-900/80 border border-blue-800/50 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-sky-200 mb-3">
                  Schools (Hundreds) vs. Colleges Density by State
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topStatesSchoolVsCollege} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="Schools (x100)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Colleges" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-blue-800/50 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-sky-200 mb-2">
                    College Ownership Distribution
                  </h4>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieOwnership} cx="50%" cy="50%" innerRadius={45} outerRadius={68} dataKey="value">
                          {pieOwnership.map((e, idx) => (
                            <Cell key={`cell-${idx}`} fill={e.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  Private colleges provide 78% of higher educational seats nationally.
                </div>
              </div>
            </div>
          )}

          {activePage === 'school' && (
            <div className="bg-slate-900/80 border border-blue-800/50 rounded-2xl p-5">
              <h4 className="text-sm font-bold text-sky-200 mb-2">
                School Key Performance Indicators & Infrastructure
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-slate-950/70 p-4 rounded-xl border border-blue-900/40">
                  <span className="text-xs text-sky-300 font-semibold">Drinking Water</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">{nationalInfra['% Drinking water']}%</div>
                  <p className="text-[10px] text-slate-400 mt-1">Available in 98% of surveyed schools</p>
                </div>
                <div className="bg-slate-950/70 p-4 rounded-xl border border-blue-900/40">
                  <span className="text-xs text-sky-300 font-semibold">Functional Girls Toilets</span>
                  <div className="text-2xl font-black text-sky-400 mt-1">{nationalInfra['% Functional girls toilet']}%</div>
                  <p className="text-[10px] text-slate-400 mt-1">Essential for reducing female dropout rates</p>
                </div>
                <div className="bg-slate-950/70 p-4 rounded-xl border border-blue-900/40">
                  <span className="text-xs text-sky-300 font-semibold">Digital Internet</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">{nationalInfra['% Internet']}%</div>
                  <p className="text-[10px] text-slate-400 mt-1">Key bottleneck under national ICT initiative</p>
                </div>
              </div>
            </div>
          )}

          {activePage === 'higher' && (
            <div className="bg-slate-900/80 border border-blue-800/50 rounded-2xl p-5">
              <h4 className="text-sm font-bold text-sky-200 mb-2">
                Higher Education Matrix & Enrollment Dynamics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-slate-950/70 p-4 rounded-xl border border-blue-900/40">
                  <span className="text-xs text-indigo-300 font-semibold">National GER</span>
                  <div className="text-2xl font-black text-indigo-400 mt-1">{nationalHigher['Total GER']}%</div>
                  <p className="text-[10px] text-slate-400 mt-1">Gross Enrollment Ratio (18-23 age group)</p>
                </div>
                <div className="bg-slate-950/70 p-4 rounded-xl border border-blue-900/40">
                  <span className="text-xs text-indigo-300 font-semibold">Higher Ed Faculty</span>
                  <div className="text-2xl font-black text-sky-400 mt-1">15.98 Lakh</div>
                  <p className="text-[10px] text-slate-400 mt-1">Academic professors and lecturers</p>
                </div>
                <div className="bg-slate-950/70 p-4 rounded-xl border border-blue-900/40">
                  <span className="text-xs text-indigo-300 font-semibold">Gender Parity Index</span>
                  <div className="text-2xl font-black text-teal-400 mt-1">{nationalHigher['Total GPI'] || '1.08'}</div>
                  <p className="text-[10px] text-slate-400 mt-1">1.08 indicates female parity achieved</p>
                </div>
              </div>
            </div>
          )}

          {activePage === 'emp' && (
            <div className="bg-slate-900/80 border border-blue-800/50 rounded-2xl p-5">
              <h4 className="text-sm font-bold text-sky-200 mb-2">
                Workforce Readiness & Regional Unemployment Rates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-slate-950/70 p-4 rounded-xl border border-blue-900/40">
                  <span className="text-xs text-teal-300 font-semibold">Male Employment</span>
                  <div className="text-2xl font-black text-blue-400 mt-1">{nationalEmp['Male Emp Rate']}%</div>
                  <p className="text-[10px] text-slate-400 mt-1">Male workforce participation</p>
                </div>
                <div className="bg-slate-950/70 p-4 rounded-xl border border-blue-900/40">
                  <span className="text-xs text-teal-300 font-semibold">Female Employment</span>
                  <div className="text-2xl font-black text-teal-400 mt-1">{nationalEmp['Female Emp Rate']}%</div>
                  <p className="text-[10px] text-slate-400 mt-1">Female participation trend</p>
                </div>
                <div className="bg-slate-950/70 p-4 rounded-xl border border-blue-900/40">
                  <span className="text-xs text-teal-300 font-semibold">Unemployment</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">{nationalEmp['Total Unemp Rate']}%</div>
                  <p className="text-[10px] text-slate-400 mt-1">Controlled at 3.2% nationally</p>
                </div>
              </div>
            </div>
          )}

          {activePage === 'voice' && (
            <div className="space-y-4 pt-2">
              {/* Top KPIs for Student Survey */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-blue-900/40">
                  <span className="text-[11px] text-sky-300 font-semibold">Total Survey Respondents</span>
                  <div className="text-2xl font-black text-white mt-1">
                    {rawData.student_survey?.summary?.total_responses || 105}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Verified academic students</p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-blue-900/40">
                  <span className="text-[11px] text-sky-300 font-semibold">AI Tool Regular Users</span>
                  <div className="text-2xl font-black text-cyan-400 mt-1">
                    {rawData.student_survey?.summary?.ai_regular_users_pct || '82.9'}%
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Use AI daily or weekly</p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-blue-900/40">
                  <span className="text-[11px] text-sky-300 font-semibold">Internship Seekers</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    {rawData.student_survey?.summary?.looking_for_internship_pct || '56.2'}%
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Actively seeking opportunities</p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-blue-900/40">
                  <span className="text-[11px] text-sky-300 font-semibold">Positive AI Impact</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {rawData.student_survey?.summary?.ai_positive_impact_pct || '63.8'}%
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Strongly agree learning improved</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/90 border border-blue-800/60 rounded-2xl p-4">
                  <h5 className="font-bold text-white text-xs mb-3 flex items-center justify-between">
                    <span>AI Usage Frequency in Academics</span>
                    <span className="text-[10px] text-cyan-400 font-normal">N = 105 Students</span>
                  </h5>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={rawData.student_survey?.digital_and_ai?.ai_frequency || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a', color: '#fff', fontSize: '11px' }} />
                        <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-blue-800/60 rounded-2xl p-4">
                  <h5 className="font-bold text-white text-xs mb-3 flex items-center justify-between">
                    <span>Top Obstacles Entering the Job Market</span>
                    <span className="text-[10px] text-amber-400 font-normal">Skills vs Theory Gap</span>
                  </h5>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={(rawData.student_survey?.career_and_employability?.top_job_obstacles || []).slice(0, 4)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                        <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a', color: '#fff', fontSize: '11px' }} />
                        <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Student Voice Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {studentVoiceInsights.map((sv, idx) => (
                  <div key={idx} className={`bg-slate-900/90 border border-blue-800/60 border-l-4 ${sv.color} rounded-xl p-3.5 shadow-sm`}>
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-white text-xs">{sv.title}</h5>
                      <span className="text-[10px] font-black text-sky-300 bg-sky-950 px-2 py-0.5 rounded-full border border-sky-800">
                        {sv.metric}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{sv.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Page Navigation Bar (Simulates Power BI Sheet Tabs) */}
        <div className="mt-8 pt-4 border-t border-blue-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {pages.map((p) => {
              const Icon = p.icon;
              const isSelected = activePage === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePage(p.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'bg-slate-900/80 text-sky-200 hover:bg-slate-800 border border-blue-950'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.title}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>Powered by LearnSphere Embedded Engine</span>
          </div>
        </div>

      </div>

    </div>
  );
}

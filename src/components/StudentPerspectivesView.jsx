import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Sparkles, 
  Briefcase, 
  BrainCircuit, 
  Search, 
  MessageSquare, 
  TrendingUp, 
  GraduationCap, 
  AlertCircle, 
  Lightbulb, 
  BookOpen, 
  PieChart as PieIcon,
  BarChart3,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

const COLORS = ['#0284c7', '#06b6d4', '#4f46e5', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'];

export default function StudentPerspectivesView({ rawData }) {
  const [activeSubTab, setActiveSubTab] = useState('insights');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStream, setFilterStream] = useState('All');

  const survey = rawData?.student_survey || {};
  const summary = survey.summary || {};
  const demographics = survey.demographics || {};
  const digitalAi = survey.digital_and_ai || {};
  const career = survey.career_and_employability || {};
  const records = survey.records || [];

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      const matchSearch = searchTerm === '' || 
        (rec.field_of_study && rec.field_of_study.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rec.preferred_career_path && rec.preferred_career_path.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rec.job_market_obstacle && rec.job_market_obstacle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rec.suggested_system_improvement && rec.suggested_system_improvement.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchStream = filterStream === 'All' || rec.field_of_study === filterStream;

      return matchSearch && matchStream;
    });
  }, [records, searchTerm, filterStream]);

  // Unique streams for filter
  const uniqueStreams = useMemo(() => {
    const list = Array.from(new Set(records.map(r => r.field_of_study).filter(Boolean)));
    return ['All', ...list];
  }, [records]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold mb-3 border border-white/20">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Primary Ground-Truth Research</span>
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span className="text-emerald-300">105 Verified Respondents</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Student Perspectives on the Changing Landscape of Education in India
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-sky-200 leading-relaxed max-w-3xl">
            Direct survey insights into student adoption of AI tools, digital learning devices, career preparedness, internship bottlenecks, and actionable recommendations for educational reform in India.
          </p>
        </div>

        {/* 6 Core Highlight KPI Cards */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-sky-200 block">Total Respondents</span>
            <div className="text-xl sm:text-2xl font-black mt-1 text-white">{summary.total_responses || 105}</div>
            <span className="text-[10px] text-sky-300">65.7% Female &bull; 33.3% Male</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-sky-200 block">AI Regular Users</span>
            <div className="text-xl sm:text-2xl font-black mt-1 text-cyan-300">{summary.ai_regular_users_pct}%</div>
            <span className="text-[10px] text-sky-300">Daily or weekly AI usage</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-sky-200 block">Positive AI Impact</span>
            <div className="text-xl sm:text-2xl font-black mt-1 text-emerald-300">{summary.ai_positive_impact_pct}%</div>
            <span className="text-[10px] text-sky-300">Agree AI improves learning</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-sky-200 block">Seeking Internships</span>
            <div className="text-xl sm:text-2xl font-black mt-1 text-amber-300">{summary.looking_for_internship_pct}%</div>
            <span className="text-[10px] text-sky-300">Actively seeking opportunities</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-sky-200 block">Top Job Obstacle</span>
            <div className="text-sm font-black mt-1 text-rose-300 truncate" title={summary.top_job_obstacle}>
              Practical Skills
            </div>
            <span className="text-[10px] text-rose-200">37.1% reported skills gap</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-sky-200 block">Top Career Choice</span>
            <div className="text-sm font-black mt-1 text-indigo-300 truncate" title={summary.top_career_path}>
              Govt & Private
            </div>
            <span className="text-[10px] text-indigo-200">29.5% Govt &bull; 26.7% Private</span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'insights', label: 'Executive Analytics & Visuals', icon: BarChart3 },
          { id: 'ai', label: 'AI & Digital Learning Adoption', icon: BrainCircuit },
          { id: 'career', label: 'Employability & Skills Gap', icon: Briefcase },
          { id: 'voices', label: 'Student Voices & Suggestions', icon: Lightbulb },
          { id: 'data', label: 'Browse Survey Dataset (105 Rows)', icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE ANALYTICS */}
      {activeSubTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Preferred Career Paths */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Preferred Career Path After Graduation</h3>
                  <p className="text-xs text-slate-500">Government employment vs Private vs Entrepreneurship</p>
                </div>
                <PieIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={career.preferred_career_paths || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percentage }) => `${name?.substring(0, 12)} (${percentage}%)`}
                      labelLine={false}
                    >
                      {(career.preferred_career_paths || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, item) => [`${value} students (${item.payload.percentage}%)`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Frequency */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Frequency of AI Usage in Academics</h3>
                  <p className="text-xs text-slate-500">Over 82.9% use AI daily or several times a week</p>
                </div>
                <BrainCircuit className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={digitalAi.ai_frequency || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value, name, item) => [`${value} students (${item.payload.percentage}%)`, 'Students']} />
                    <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Biggest Obstacles Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Biggest Obstacles Faced When Entering the Job Market
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Students identified a major deficit in practical real-world training compared to theory.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={career.top_job_obstacles || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value, name, item) => [`${value} responses (${item.payload.percentage}%)`, 'Count']} />
                  <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI & DIGITAL LEARNING */}
      {activeSubTab === 'ai' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AI Academic Purposes */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                For Which Academic Purposes Do Students Use AI?
              </h3>
              <p className="text-xs text-slate-500 mb-4">Multi-select question response counts</p>
              <div className="space-y-3">
                {(digitalAi.ai_academic_purposes || []).map((purpose, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{purpose.name}</span>
                      <span className="text-blue-600 font-bold">{purpose.count} ({purpose.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(purpose.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Concerns */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Concerns Regarding AI in Education
              </h3>
              <p className="text-xs text-slate-500 mb-4">Reduced critical thinking and over-dependence are top fears</p>
              <div className="space-y-3">
                {(digitalAi.ai_concerns || []).map((concern, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{concern.name}</span>
                      <span className="text-amber-600 font-bold">{concern.count} ({concern.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(concern.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Primary Devices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(digitalAi.device_usage || []).map((dev, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">{dev.name}</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{dev.percentage}%</div>
                <p className="text-[10px] text-slate-400 mt-0.5">{dev.count} students primarily use this</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CAREER & EMPLOYABILITY */}
      {activeSubTab === 'career' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Internship Status */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Internship Participation Status
              </h3>
              <p className="text-xs text-slate-500 mb-4">56.2% are actively looking but have not completed an internship</p>
              <div className="space-y-3">
                {(career.internship_status || []).map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                      {item.count} students ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Important Skills */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Skills Considered Most Critical for Future Careers
              </h3>
              <p className="text-xs text-slate-500 mb-4">Communication skills (74.3%) and AI/Problem solving lead</p>
              <div className="space-y-2.5">
                {(career.most_important_skills || []).slice(0, 6).map((skill, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{skill.name}</span>
                      <span className="font-bold text-indigo-600">{skill.count} ({skill.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${Math.min(skill.percentage, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: DIRECT STUDENT VOICES */}
      {activeSubTab === 'voices' && (
        <div className="space-y-6">
          <div className="bg-sky-50 border border-sky-200 p-5 rounded-2xl flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-sky-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-sky-900">Direct Qualitative Feedback from Surveyed Students</h4>
              <p className="text-xs text-sky-700">
                Responses to the open-ended question: <em>"What is one improvement you would suggest for India's education system?"</em>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(career.student_suggestions || []).map((quote, idx) => (
              <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="text-blue-500 text-lg font-serif">“</div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium -mt-2">
                    {quote}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Student Suggestion #{idx + 1}</span>
                  <span className="text-emerald-600 font-bold">Verified Response</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BROWSE RAW SURVEY DATA */}
      {activeSubTab === 'data' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Survey Response Explorer</h3>
              <p className="text-xs text-slate-500">Showing {filteredRecords.length} of {records.length} records</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Stream filter */}
              <select
                value={filterStream}
                onChange={(e) => setFilterStream(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none"
              >
                {uniqueStreams.map((s, idx) => (
                  <option key={idx} value={s}>{s}</option>
                ))}
              </select>

              {/* Search box */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search obstacle, career..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 w-full sm:w-56"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Stream / Study</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">AI Frequency</th>
                  <th className="p-3">Internship</th>
                  <th className="p-3">Preferred Career</th>
                  <th className="p-3">Top Obstacle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.slice(0, 20).map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-slate-400 font-mono text-[10px]">{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-800">{r.field_of_study || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{r.gender || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.ai_usage_frequency === 'Daily' ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {r.ai_usage_frequency || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{r.internship_status || 'N/A'}</td>
                    <td className="p-3 font-medium text-blue-700">{r.preferred_career_path || 'N/A'}</td>
                    <td className="p-3 text-rose-700 font-medium">{r.job_market_obstacle || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRecords.length > 20 && (
            <p className="text-center text-[11px] text-slate-400 pt-2">
              Showing first 20 records of {filteredRecords.length}. All 105 records are consolidated in <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">education_data.json</code>.
            </p>
          )}
        </div>
      )}

    </div>
  );
}

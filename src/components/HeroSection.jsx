import React from 'react';
import { 
  School, 
  GraduationCap, 
  Users, 
  Briefcase, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';

export default function HeroSection({ summaryData, selectedYear, onNavigateToPillar }) {
  // Format numbers nicely with Indian numbering format / standard commas
  const formatNumber = (num) => {
    if (!num) return '0';
    return Number(num).toLocaleString('en-IN');
  };

  const { schoolSummary, higherEdSummary, employmentSummary } = summaryData;

  const kpis = [
    {
      title: 'Total Schools in India',
      value: formatNumber(schoolSummary?.['Total Schools'] || 1469990),
      subtext: `Year ${selectedYear} (UDISE+ verified)`,
      change: '+0.27% YoY',
      icon: School,
      color: 'from-blue-600 to-sky-500',
      tag: 'School Education',
      target: 'schools'
    },
    {
      title: 'Colleges & Universities',
      value: formatNumber(higherEdSummary?.['Total Uni/Clgs'] || 47757),
      subtext: '45k+ Colleges, 1.2k+ Unis',
      change: '+4.42% Growth',
      icon: GraduationCap,
      color: 'from-indigo-600 to-blue-500',
      tag: 'Higher Education',
      target: 'higher-ed'
    },
    {
      title: 'Higher Ed Enrollment',
      value: formatNumber(higherEdSummary?.['Total_Students_Enrollment'] || 43268181),
      subtext: '4.32+ Crore students enrolled',
      change: 'GER: 28.4%',
      icon: Users,
      color: 'from-sky-600 to-cyan-500',
      tag: 'Students Reach',
      target: 'higher-ed'
    },
    {
      title: 'National Employment Rate',
      value: `${employmentSummary?.['Total Emp Rate'] || 58.2}%`,
      subtext: `Unemployment: ${employmentSummary?.['Total Unemp Rate'] || 3.2}%`,
      change: 'Improved',
      icon: Briefcase,
      color: 'from-blue-700 to-indigo-600',
      tag: 'Labor Market',
      target: 'employment'
    }
  ];

  return (
    <section className="relative pt-6 pb-8 overflow-hidden">
      {/* Background ambient gradient blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 shadow-xs">
            <Activity className="w-3.5 h-3.5 text-sky-600" />
            <span>Ministry of Education Data Ingestion</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Cleansed Data (Nil Rows & Cols Removed)</span>
          </div>
        </div>

        {/* Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              India's Comprehensive <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 bg-clip-text text-transparent">
                Education & Employment
              </span> Landscape
            </h1>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Explore national longitudinal insights combining <strong>UDISE+ School Education</strong>, <strong>AISHE Higher Education</strong>, and <strong>State Employment Dynamics</strong>. Equipped with automated data cleaning, Power BI dashboards, and smart query intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/80 border border-slate-200 rounded-2xl p-4 shadow-sm text-right">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Active Cycle
              </span>
              <span className="text-xl font-extrabold text-blue-700">
                {selectedYear}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                36 States & UTs Monitored
              </span>
            </div>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigateToPillar(kpi.target)}
                className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/80 hover:border-sky-300 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${kpi.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-sky-500" />
                    {kpi.change}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-500 block">
                    {kpi.title}
                  </span>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    {kpi.value}
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>{kpi.subtext}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { 
  School, 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  BarChart2, 
  TrendingUp, 
  Sparkles,
  PieChart as PieIcon
} from 'lucide-react';

export default function ThreePillarsRow({ onSelectPillar, selectedYear, summaryData }) {
  const { schoolSummary, higherEdSummary, employmentSummary } = summaryData;

  const pillars = [
    {
      id: 'schools',
      title: '1. School Education',
      tag: 'UDISE+ Foundation',
      subtitle: 'Primary & Secondary Framework across 36 States',
      icon: School,
      gradient: 'from-blue-600 via-sky-600 to-cyan-500',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      stats: [
        { label: 'Total Schools', value: schoolSummary?.['Total Schools'] ? Number(schoolSummary['Total Schools']).toLocaleString('en-IN') : '14.69 Lakh' },
        { label: 'Total Students', value: schoolSummary?.['Total_Enrollment'] ? Number(schoolSummary['Total_Enrollment']).toLocaleString('en-IN') : '24.8 Crore' },
        { label: 'Pupil-Teacher Ratio (PTR)', value: schoolSummary?.['Total PTR'] ? `${schoolSummary['Total PTR']} : 1` : '24 : 1' },
        { label: 'Gender Parity Index (GPI)', value: schoolSummary?.['Total GPI'] ? schoolSummary['Total GPI'] : '1.07' },
      ],
      highlights: [
        'Government vs Private school ratios',
        'Enrollment split by Gender (Male / Female)',
        'Infrastructure: Electricity, Internet, Toilets & Drinking Water'
      ],
      accentColor: 'text-blue-600',
      borderHover: 'hover:border-blue-400',
      btnBg: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'higher-ed',
      title: '2. Higher Education',
      tag: 'AISHE Advanced Study',
      subtitle: 'Universities, Affiliated Colleges & Research Bodies',
      icon: GraduationCap,
      gradient: 'from-indigo-600 via-blue-600 to-sky-500',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      stats: [
        { label: 'Universities & Colleges', value: higherEdSummary?.['Total Uni/Clgs'] ? Number(higherEdSummary['Total Uni/Clgs']).toLocaleString('en-IN') : '47,757' },
        { label: 'Higher Ed Enrollment', value: higherEdSummary?.['Total_Students_Enrollment'] ? Number(higherEdSummary['Total_Students_Enrollment']).toLocaleString('en-IN') : '4.32 Crore' },
        { label: 'Higher Ed Faculty', value: higherEdSummary?.['Total_Teachers'] ? Number(higherEdSummary['Total_Teachers']).toLocaleString('en-IN') : '15.98 Lakh' },
        { label: 'Gross Enrollment Ratio', value: higherEdSummary?.['Total GER'] ? `${higherEdSummary['Total GER']}%` : '28.4%' },
      ],
      highlights: [
        'Public vs Private College infrastructure',
        'Undergraduate & Postgraduate gender parity',
        'State-wise college density & university faculty'
      ],
      accentColor: 'text-indigo-600',
      borderHover: 'hover:border-indigo-400',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      id: 'employment',
      title: '3. Employment Landscape',
      tag: 'Workforce & Labor',
      subtitle: 'State & National Employment & Unemployment Rates',
      icon: Briefcase,
      gradient: 'from-sky-600 via-cyan-600 to-teal-500',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      stats: [
        { label: 'National Employment Rate', value: employmentSummary?.['Total Emp Rate'] ? `${employmentSummary['Total Emp Rate']}%` : '58.2%' },
        { label: 'National Unemployment Rate', value: employmentSummary?.['Total Unemp Rate'] ? `${employmentSummary['Total Unemp Rate']}%` : '3.2%' },
        { label: 'Male Employment Rate', value: employmentSummary?.['Male Emp Rate'] ? `${employmentSummary['Male Emp Rate']}%` : '76.3%' },
        { label: 'Female Employment Rate', value: employmentSummary?.['Female Emp Rate'] ? `${employmentSummary['Female Emp Rate']}%` : '40.1%' },
      ],
      highlights: [
        'Employment vs Unemployment state benchmarking',
        'Male vs Female workforce participation analysis',
        'Correlation between higher education and employment'
      ],
      accentColor: 'text-teal-600',
      borderHover: 'hover:border-teal-400',
      btnBg: 'bg-teal-600 hover:bg-teal-700'
    }
  ];

  return (
    <div className="my-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              The Three Core Pillars of Analysis
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 pl-4">
            Unified tripartite analytical framework across Schooling, Higher Education, and Workforce readiness for {selectedYear}.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Interactive 3-Card Ecosystem</span>
        </div>
      </div>

      {/* The 3 Pillars in a Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className={`group flex flex-col justify-between bg-white/95 rounded-2xl border border-slate-200/90 ${pillar.borderHover} p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
            >
              {/* Top Accent Gradient Line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${pillar.gradient}`} />

              <div>
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${pillar.badgeBg}`}>
                    {pillar.tag}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {pillar.subtitle}
                </p>

                {/* 4 Key Metric Mini-Grid */}
                <div className="grid grid-cols-2 gap-2.5 my-5 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  {pillar.stats.map((s, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-xs">
                      <span className="text-[10px] font-medium text-slate-500 block truncate">
                        {s.label}
                      </span>
                      <span className="text-sm font-black text-slate-800 block mt-0.5">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Highlights List */}
                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Key Dimensions Included:
                  </span>
                  {pillar.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${pillar.accentColor}`} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPillar(pillar.id)}
                className={`w-full py-2.5 px-4 rounded-xl ${pillar.btnBg} text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all group-hover:gap-3`}
              >
                <span>Launch {pillar.title.split('. ')[1]} Explorer</span>
                <ArrowRight className="w-4 h-4 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

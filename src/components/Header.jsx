import React from 'react';
import { 
  GraduationCap, 
  School, 
  Briefcase, 
  BarChart3, 
  GitCompare, 
  Sparkles, 
  Download, 
  Database,
  Calendar,
  MessageSquare
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  selectedYear, 
  setSelectedYear, 
  availableYears, 
  onOpenChat 
}) {
  const navItems = [
    { id: 'overview', label: 'Overview & 3 Pillars', icon: BarChart3 },
    { id: 'schools', label: 'School Education', icon: School },
    { id: 'higher-ed', label: 'Higher Education', icon: GraduationCap },
    { id: 'employment', label: 'Employment Landscape', icon: Briefcase },
    { id: 'students', label: 'Student Perspectives', icon: MessageSquare, badge: '105 Voices' },
    { id: 'powerbi', label: 'Power BI Studio', icon: BarChart3, badge: 'PBIX' },
    { id: 'compare', label: 'State Compare', icon: GitCompare },
    { id: 'clean-data', label: 'Data Cleaning Lab', icon: Database, badge: '100% Clean' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 sm:gap-3.5 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md border-2 border-sky-200 group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/logo.jpeg" 
                alt="LearnSphere Logo" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-2xl tracking-tight bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  LEARNSPHERE
                </span>
                <span className="hidden sm:inline bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-sky-200">
                  Analytics
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 font-medium">
                National Education & Employment Portal
              </p>
            </div>
          </div>

          {/* Right Controls: Year Selector, AI Chatbot Trigger & PBIX Download */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Year Selector - compact on mobile */}
            <div className="flex items-center bg-sky-50/80 border border-sky-200/80 rounded-xl p-0.5 sm:p-1 shadow-inner">
              <div className="hidden sm:flex items-center gap-1.5 px-2 text-xs font-semibold text-sky-700">
                <Calendar className="w-3.5 h-3.5" />
                <span>Year:</span>
              </div>
              <div className="flex gap-0.5 sm:gap-1">
                {availableYears.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${
                      selectedYear === year
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-white/60'
                    }`}
                  >
                    {year.replace('20', "'")}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant Button - icon only on mobile */}
            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold text-xs tracking-wide shadow-md hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5" style={{ animation: 'chatBounce 4s ease-in-out infinite' }} />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Download PBIX File Button - hidden on very small screens */}
            <a
              href="/Education_landscape.pbix"
              download="Education_landscape.pbix"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 text-xs font-semibold shadow-sm hover:shadow transition-all"
              title="Download original Power BI file"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden md:inline">Download .PBIX</span>
            </a>
          </div>
        </div>

        {/* Navigation Bar - horizontally scrollable on mobile */}
        <nav className="flex gap-0.5 sm:gap-1 overflow-x-auto py-2 sm:py-2.5 border-t border-slate-100 no-scrollbar -mx-3 sm:mx-0 px-3 sm:px-0">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`hidden sm:inline text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

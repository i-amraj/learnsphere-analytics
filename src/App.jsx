import React, { useState, useMemo } from 'react';
import educationData from './data/education_data.json';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ThreePillarsRow from './components/ThreePillarsRow';
import SchoolEducationView from './components/SchoolEducationView';
import HigherEducationView from './components/HigherEducationView';
import EmploymentView from './components/EmploymentView';
import PowerBIDashboardView from './components/PowerBIDashboardView';
import StateComparisonView from './components/StateComparisonView';
import DataCleaningLab from './components/DataCleaningLab';
import StudentPerspectivesView from './components/StudentPerspectivesView';
import ChatbotWidget from './components/ChatbotWidget';
import { 
  BarChart3, 
  School, 
  GraduationCap, 
  Briefcase, 
  Download, 
  ExternalLink, 
  Sparkles,
  Heart,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState('2023-24');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const availableYears = educationData.metadata?.years || ['2021-22', '2022-23', '2023-24'];

  // Current year summaries
  const currentSummaryData = useMemo(() => {
    const schoolSummary = educationData.school?.all_india_summary?.find(i => i.Year === selectedYear) || {};
    const higherEdSummary = educationData.higher_ed?.all_india_summary?.find(i => i.Year === selectedYear) || {};
    const employmentSummary = educationData.employment?.all_india_summary?.find(i => i.Year === selectedYear) || {};

    return { schoolSummary, higherEdSummary, employmentSummary };
  }, [selectedYear]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-200 selection:text-sky-900">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        availableYears={availableYears}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: OVERVIEW & 3 PILLARS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <HeroSection
              summaryData={currentSummaryData}
              selectedYear={selectedYear}
              onNavigateToPillar={(tabId) => setActiveTab(tabId)}
            />

            {/* The 3 Main Pillars in a Row (Critical Requirement) */}
            <ThreePillarsRow
              onSelectPillar={(pillarId) => setActiveTab(pillarId)}
              selectedYear={selectedYear}
              summaryData={currentSummaryData}
            />

            {/* Interactive Power BI Preview Teaser */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Power BI Desktop Integration</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black">
                  Interactive Power BI Studio Embedded
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  The website features an interactive simulation of the original <strong>Education landscape.pbix</strong> report, featuring all 5 analytical sheets: Overview, Schools, Higher Ed, Employment, and Student Voice.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('powerbi')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <span>Open Power BI Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <a
                  href="/Education_landscape.pbix"
                  download="Education_landscape.pbix"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Get .PBIX File</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHOOL EDUCATION (UDISE) */}
        {activeTab === 'schools' && (
          <SchoolEducationView
            rawData={educationData}
            selectedYear={selectedYear}
          />
        )}

        {/* TAB 3: HIGHER EDUCATION (AISHE) */}
        {activeTab === 'higher-ed' && (
          <HigherEducationView
            rawData={educationData}
            selectedYear={selectedYear}
          />
        )}

        {/* TAB 4: EMPLOYMENT LANDSCAPE */}
        {activeTab === 'employment' && (
          <EmploymentView
            rawData={educationData}
            selectedYear={selectedYear}
          />
        )}

        {/* TAB 5: STUDENT PERSPECTIVES & SURVEY VOICE */}
        {activeTab === 'students' && (
          <StudentPerspectivesView
            rawData={educationData}
          />
        )}

        {/* TAB 6: POWER BI DASHBOARDS */}
        {activeTab === 'powerbi' && (
          <PowerBIDashboardView
            rawData={educationData}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        )}

        {/* TAB 6: STATE COMPARISON */}
        {activeTab === 'compare' && (
          <StateComparisonView
            rawData={educationData}
            selectedYear={selectedYear}
          />
        )}

        {/* TAB 7: DATA CLEANING LAB */}
        {activeTab === 'clean-data' && (
          <DataCleaningLab
            cleaningReport={educationData.cleaning_report}
            rawData={educationData}
          />
        )}

      </main>

      {/* AI Chatbot Floating Drawer */}
      <ChatbotWidget
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
        rawData={educationData}
        currentYear={selectedYear}
      />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <span className="font-extrabold text-slate-900 text-sm">LEARNSPHERE</span>
              <p className="text-[11px] text-slate-400">National Educational & Employment Analytics Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <span className="text-slate-600">College Academic Project</span>
            <span>&bull;</span>
            <span className="text-blue-600 font-semibold">UDISE+ Data</span>
            <span>&bull;</span>
            <span className="text-indigo-600 font-semibold">AISHE Data</span>
            <span>&bull;</span>
            <span className="text-teal-600 font-semibold">Power BI Integrated</span>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            Automated Data Cleansing &bull; 1,200 Clean Records
          </div>
        </div>
      </footer>

    </div>
  );
}

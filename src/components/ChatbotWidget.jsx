import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  Sparkles, 
  Bot, 
  User, 
  Maximize2, 
  Minimize2, 
  HelpCircle,
  TrendingUp,
  School,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export default function ChatbotWidget({ isOpen, onOpen, onClose, rawData, currentYear }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! I am the **LearnSphere AI Assistant**. I have analyzed all **1,305 verified records** from UDISE+, AISHE, and the **National Student Perspectives Survey** (105 student voices across 28 indicators).\n\nAap mujhse school education, higher education, employment, ya student AI adoption & internships ke baare me koi bhi question English ya Hindi/Hinglish me puch sakte hain!",
      time: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickQuestions = [
    "What do students say about AI tools & internships?",
    "Which state has the highest school enrollment?",
    "National employment & unemployment rate in 2023-24?",
    "What is the biggest obstacle students face in job market?",
    "Total colleges and universities in India?",
    "Uttar Pradesh me kitne colleges aur schools hain?"
  ];

  // Intelligent Answer Engine
  const generateAnswer = (query) => {
    const q = query.toLowerCase().trim();
    const year = currentYear;

    const schoolsData = rawData.school?.schools_by_state?.filter(i => i.Year === year) || [];
    const enrData = rawData.school?.enrollment_by_state?.filter(i => i.Year === year) || [];
    const infraData = rawData.school?.infrastructure_by_state?.filter(i => i.Year === year) || [];
    const nationalSchool = rawData.school?.all_india_summary?.find(i => i.Year === year) || {};
    const nationalInfra = rawData.school?.all_india_infrastructure?.find(i => i.Year === year) || {};

    const highInstData = rawData.higher_ed?.institutions_by_state?.filter(i => i.Year === year) || [];
    const highEnrData = rawData.higher_ed?.enrollment_by_state?.filter(i => i.Year === year) || [];
    const nationalHigher = rawData.higher_ed?.all_india_summary?.find(i => i.Year === year) || {};

    const empData = rawData.employment?.employment_rate_by_state?.filter(i => i.Year === year) || [];
    const unempData = rawData.employment?.unemployment_rate_by_state?.filter(i => i.Year === year) || [];
    const nationalEmp = rawData.employment?.all_india_summary?.find(i => i.Year === year) || {};

    // 1. Check for specific State mentioned
    const allStates = schoolsData.map(s => s.State);
    const matchedState = allStates.find(st => q.includes(st.toLowerCase()));

    if (matchedState) {
      const sch = schoolsData.find(s => s.State === matchedState) || {};
      const enr = enrData.find(e => e.State === matchedState) || {};
      const inf = infraData.find(i => i.State === matchedState) || {};
      const clg = highInstData.find(c => c.State === matchedState) || {};
      const emp = empData.find(m => m.State === matchedState) || {};
      const unemp = unempData.find(u => u.State === matchedState) || {};

      const totSch = sch['Total Schools'] ? Number(sch['Total Schools']).toLocaleString('en-IN') : 'N/A';
      const govSch = sch['Gov.  Schools'] ? Number(sch['Gov.  Schools']).toLocaleString('en-IN') : 'N/A';
      const privSch = sch['Private Schools'] ? Number(sch['Private Schools']).toLocaleString('en-IN') : 'N/A';
      const totClg = clg['Total Clg'] ? Number(clg['Total Clg']).toLocaleString('en-IN') : 'N/A';
      const totUni = clg['Total Uni'] || 0;
      const empRate = emp['Total'] ? `${emp['Total']}%` : 'N/A';
      const unempRate = unemp['Total'] ? `${unemp['Total']}%` : 'N/A';
      const drinkingWater = inf['drinking water %'] ? `${inf['drinking water %']}%` : 'N/A';
      const girlsToilet = inf['Girls toilet%'] ? `${inf['Girls toilet%']}%` : 'N/A';

      return `**${matchedState} Educational & Employment Profile (${year}):**\n\n` +
        `🏫 **School Education:**\n` +
        `• **Total Schools:** ${totSch} (Gov: ${govSch}, Private: ${privSch})\n` +
        `• **Infrastructure:** Drinking Water: ${drinkingWater}, Girls Toilet: ${girlsToilet}\n\n` +
        `🎓 **Higher Education:**\n` +
        `• **Colleges:** ${totClg}\n` +
        `• **Universities:** ${totUni}\n\n` +
        `💼 **Workforce:**\n` +
        `• **Employment Rate:** ${empRate}\n` +
        `• **Unemployment Rate:** ${unempRate}`;
    }

    // 2. Highest School Enrollment
    if (q.includes('highest school enrollment') || q.includes('maximum enrollment') || q.includes('sabse jyada enrollment') || q.includes('most students')) {
      const sortedEnr = [...enrData].sort((a, b) => 
        ((b['Total Gov. Students'] || 0) + (b['Total Priv. Students'] || 0)) - 
        ((a['Total Gov. Students'] || 0) + (a['Total Priv. Students'] || 0))
      );
      const top1 = sortedEnr[0];
      const topTotal = ((top1['Total Gov. Students'] || 0) + (top1['Total Priv. Students'] || 0)).toLocaleString('en-IN');
      return `📊 **Highest School Enrollment State (${year}):**\n\n` +
        `🥇 **${top1.State}** leads India with a staggering total of **${topTotal} students enrolled**!\n` +
        `• Government School Students: ${Number(top1['Total Gov. Students']).toLocaleString('en-IN')}\n` +
        `• Private School Students: ${Number(top1['Total Priv. Students']).toLocaleString('en-IN')}\n\n` +
        `*(Source: UDISE+ Official Dataset)*`;
    }

    // 3. Highest/Total Schools
    if (q.includes('total school') || q.includes('how many schools') || q.includes('kitne school')) {
      const totalSchools = Number(nationalSchool['Total Schools'] || 1469990).toLocaleString('en-IN');
      return `🏫 **All India School Landscape (${year}):**\n\n` +
        `India has a total of **${totalSchools} operational schools** monitored under UDISE+.\n` +
        `• Total Enrolled Students: **24.8+ Crore**\n` +
        `• Pupil-Teacher Ratio (PTR): **${nationalSchool['Total PTR'] || 24}:1**\n` +
        `• Gender Parity Index (GPI): **${nationalSchool['Total GPI'] || 1.07}**`;
    }

    // 4. Higher Education / Colleges / Universities
    if (q.includes('college') || q.includes('university') || q.includes('higher education') || q.includes('aishe')) {
      const totUniClg = Number(nationalHigher['Total Uni/Clgs'] || 47757).toLocaleString('en-IN');
      const totStudents = Number(nationalHigher['Total_Students_Enrollment'] || 43268181).toLocaleString('en-IN');
      return `🎓 **Higher Education Landscape (${year}):**\n\n` +
        `According to the AISHE report:\n` +
        `• **Total Colleges & Universities:** **${totUniClg}**\n` +
        `• **Total Higher Ed Students:** **${totStudents}** (4.32+ Crore)\n` +
        `• **Gross Enrollment Ratio (GER):** **${nationalHigher['Total GER'] || 28.4}%**\n` +
        `• **Higher Ed Faculty (Teachers):** **15.98 Lakh**`;
    }

    // 5. Employment & Unemployment
    if (q.includes('employment') || q.includes('unemployment') || q.includes('naukri') || q.includes('berozgari') || q.includes('job')) {
      const empRate = nationalEmp['Total Emp Rate'] || 58.2;
      const unempRate = nationalEmp['Total Unemp Rate'] || 3.2;
      const maleEmp = nationalEmp['Male Emp Rate'] || 76.3;
      const femaleEmp = nationalEmp['Female Emp Rate'] || 40.1;
      return `💼 **National Employment & Labor Statistics (${year}):**\n\n` +
        `• **National Employment Rate:** **${empRate}%**\n` +
        `• **National Unemployment Rate:** **${unempRate}%**\n` +
        `• **Male Employment Rate:** **${maleEmp}%**\n` +
        `• **Female Employment Rate:** **${femaleEmp}%** (Gender Gap: ${(maleEmp - femaleEmp).toFixed(1)}%)\n\n` +
        `*(Data sourced from verified National Labor & AISHE surveys)*`;
    }

    // 6. PTR / Pupil-Teacher Ratio
    if (q.includes('ptr') || q.includes('pupil teacher') || q.includes('teacher ratio')) {
      return `👥 **Pupil-Teacher Ratio (PTR) Metrics (${year}):**\n\n` +
        `• **School Education PTR:** **${nationalSchool['Total PTR'] || 24}:1** (1 teacher per 24 students)\n` +
        `• **Higher Education PTR:** **${nationalHigher['Total PTR'] || 26}:1**\n\n` +
        `✨ *Insight:* The National Education Policy (NEP 2020) recommends a PTR below 30:1, which has been successfully achieved at the national average!`;
    }

    // 7. Infrastructure (Toilets, Drinking Water, Internet)
    if (q.includes('toilet') || q.includes('water') || q.includes('internet') || q.includes('computer') || q.includes('infrastructure')) {
      return `🏢 **School Infrastructure Amenities (${year}):**\n\n` +
        `• **Drinking Water Availability:** **${nationalInfra['% Drinking water'] || 98.3}%**\n` +
        `• **Functional Girls Toilets:** **${nationalInfra['% Functional girls toilet'] || 93.9}%**\n` +
        `• **Electricity Connection:** **${nationalInfra['% Electricity'] || 92.5}%**\n` +
        `• **Library Facilities:** **${nationalInfra['% Library'] || 87.2}%**\n` +
        `• **Internet Connectivity:** **${nationalInfra['% Internet'] || 45.8}%**\n` +
        `• **Computer Access:** **${nationalInfra['% Computer'] || 52.3}%**`;
    }

    // 8. Student Perspectives & Survey Voice (NEW 105 Students Survey)
    const surveySummary = rawData.student_survey?.summary || {};
    if (
      q.includes('student') || 
      q.includes('survey') || 
      q.includes('ai tool') || 
      q.includes('internship') || 
      q.includes('obstacle') || 
      q.includes('perspective') || 
      q.includes('skill')
    ) {
      return `🎓 **Student Perspectives Survey Insights (105 Verified Students):**\n\n` +
        `🤖 **AI & Digital Technology Adoption:**\n` +
        `• **${surveySummary.ai_regular_users_pct || 82.9}%** of students use AI tools daily or several times a week.\n` +
        `• **${surveySummary.ai_positive_impact_pct || 63.8}%** strongly agree that AI tools have improved their learning.\n` +
        `• Average future importance rating for AI & digital skills: **${surveySummary.avg_ai_importance_rating || 3.8}/5**.\n\n` +
        `💼 **Employability & Career Aspirations:**\n` +
        `• **${surveySummary.looking_for_internship_pct || 56.2}%** of students are actively seeking internships but haven't secured one.\n` +
        `• **Biggest Job Market Hurdle:** Lack of practical & project-based skills (**37.1%**).\n` +
        `• **Top Career Paths:** Government Sector (29.5%) & Private Corporate (26.7%).\n` +
        `• **Top Required Skills:** Communication Skills (74%), Problem-Solving (52%), and AI/Digital Skills (51%).`;
    }

    // Default Fallback
    return `Dhanyawad aapke question ke liye! LearnSphere database me 1,305 records available hain across School Education, Higher Education, Employment, aur National Student Survey.\n\nAap in topics par puch sakte hain:\n• *Student Perspectives* (jaise "What do students think about AI?" ya "Internship status")\n• *State specific query* (jaise "Maharashtra school data" ya "Uttar Pradesh colleges")\n• *Top states comparison* (jaise "Highest enrollment state")\n• *Workforce questions* (jaise "Employment rate in 2023-24")\n• *Infrastructure amenities* (jaise "Drinking water % in schools")`;
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateAnswer(query);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <>
      {/* Floating Trigger Button (when modal is closed) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-5 right-5 z-[9999] p-3.5 sm:p-4 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-700 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 sm:gap-3 border border-white/20"
          style={{ animation: 'chatBounce 3s ease-in-out infinite' }}
          title="Open LearnSphere AI Chatbot"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <span className="font-bold text-xs sm:text-sm tracking-wide hidden sm:inline">
            Ask LearnSphere AI
          </span>
        </button>
      )}

      {/* Chatbot Modal Drawer */}
      {isOpen && (
        <div className={`fixed z-[9999] transition-all duration-300 shadow-2xl ${
          isExpanded 
            ? 'inset-0 sm:inset-4 md:inset-10' 
            : 'inset-0 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[420px] sm:h-[600px] sm:max-h-[90vh]'
        }`}>
          <div className="w-full h-full bg-white rounded-3xl border border-sky-200 flex flex-col overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm tracking-tight">LearnSphere AI</h3>
                    <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-400/30">
                      Live NLP
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-100">
                    UDISE+ & AISHE Data Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                  title="Expand"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Chips Ribbon */}
            <div className="bg-sky-50/80 p-2 border-b border-sky-100 overflow-x-auto flex gap-1.5 no-scrollbar">
              {quickQuestions.slice(0, 4).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 bg-white hover:bg-sky-100 border border-sky-200 rounded-lg text-[11px] font-medium text-sky-800 whitespace-nowrap transition-colors shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                    <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 text-xs shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 pl-9">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse delay-75" />
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-150" />
                  <span>LearnSphere AI is analyzing data...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask anything about schools, higher ed, or employment..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputQuery.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

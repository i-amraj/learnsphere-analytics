import React, { useState, useMemo } from 'react';
import { 
  GitCompare, 
  School, 
  GraduationCap, 
  Briefcase, 
  Zap, 
  Droplet, 
  Wifi, 
  HeartHandshake,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function StateComparisonView({ rawData, selectedYear }) {
  const [stateA, setStateA] = useState('Uttar Pradesh');
  const [stateB, setStateB] = useState('Maharashtra');

  const {
    schools_by_state = [],
    enrollment_by_state = [],
    infrastructure_by_state = [],
    indicators_by_state = []
  } = rawData.school || {};

  const {
    institutions_by_state = [],
    enrollment_by_state: higher_enrollment = [],
    indicators_by_state: higher_indicators = []
  } = rawData.higher_ed || {};

  const {
    employment_rate_by_state = [],
    unemployment_rate_by_state = []
  } = rawData.employment || {};

  // List of states
  const stateOptions = useMemo(() => {
    const list = schools_by_state
      .filter(i => i.Year === selectedYear)
      .map(i => i.State);
    return Array.from(new Set(list)).sort();
  }, [schools_by_state, selectedYear]);

  // Helper to extract data for a state
  const getStateMetrics = (stName) => {
    const sch = schools_by_state.find(i => i.Year === selectedYear && i.State === stName) || {};
    const schEnr = enrollment_by_state.find(i => i.Year === selectedYear && i.State === stName) || {};
    const schInf = infrastructure_by_state.find(i => i.Year === selectedYear && i.State === stName) || {};
    const schInd = indicators_by_state.find(i => i.Year === selectedYear && i.State === stName) || {};

    const highInst = institutions_by_state.find(i => i.Year === selectedYear && i.State === stName) || {};
    const highEnr = higher_enrollment.find(i => i.Year === selectedYear && i.State === stName) || {};
    const highInd = higher_indicators.find(i => i.Year === selectedYear && i.State === stName) || {};

    const emp = employment_rate_by_state.find(i => i.Year === selectedYear && i.State === stName) || {};
    const unemp = unemployment_rate_by_state.find(i => i.Year === selectedYear && i.State === stName) || {};

    return {
      name: stName,
      totalSchools: sch['Total Schools'] || 0,
      govSchools: sch['Gov.  Schools'] || 0,
      privSchools: sch['Private Schools'] || 0,
      schoolStudents: (schEnr['Total Gov. Students'] || 0) + (schEnr['Total Priv. Students'] || 0),
      schoolPTR: schInd['PTR'] || 0,
      schoolGER: schInd['Total GER'] || 0,
      electricityPct: schInf['Electricity %'] || 0,
      internetPct: schInf['Internet %'] || 0,
      drinkingWaterPct: schInf['drinking water %'] || 0,
      toiletPct: schInf['Girls toilet%'] || 0,
      totalColleges: highInst['Total Clg'] || 0,
      totalUnis: highInst['Total Uni'] || 0,
      higherStudents: (highEnr['Total Uni Students'] || 0) + (highEnr['Total Clg Students'] || 0),
      higherGER: highInd['Total GER'] || 0,
      higherPTR: highInd['PTR'] || 0,
      empRate: emp['Total'] || 0,
      empMale: emp['Male'] || 0,
      empFemale: emp['Female'] || 0,
      unempRate: unemp['Total'] || 0,
    };
  };

  const dataA = useMemo(() => getStateMetrics(stateA), [stateA, selectedYear, rawData]);
  const dataB = useMemo(() => getStateMetrics(stateB), [stateB, selectedYear, rawData]);

  const comparisons = [
    { label: 'Total Schools', valA: dataA.totalSchools.toLocaleString('en-IN'), valB: dataB.totalSchools.toLocaleString('en-IN'), rawA: dataA.totalSchools, rawB: dataB.totalSchools },
    { label: 'School Students Enrolled', valA: dataA.schoolStudents.toLocaleString('en-IN'), valB: dataB.schoolStudents.toLocaleString('en-IN'), rawA: dataA.schoolStudents, rawB: dataB.schoolStudents },
    { label: 'School PTR (Pupil-Teacher)', valA: `${dataA.schoolPTR}:1`, valB: `${dataB.schoolPTR}:1`, rawA: -dataA.schoolPTR, rawB: -dataB.schoolPTR }, // lower PTR is better
    { label: 'School Internet Availability', valA: `${dataA.internetPct}%`, valB: `${dataB.internetPct}%`, rawA: dataA.internetPct, rawB: dataB.internetPct },
    { label: 'Girls Functional Toilet %', valA: `${dataA.toiletPct}%`, valB: `${dataB.toiletPct}%`, rawA: dataA.toiletPct, rawB: dataB.toiletPct },
    { label: 'Total Colleges (AISHE)', valA: dataA.totalColleges.toLocaleString('en-IN'), valB: dataB.totalColleges.toLocaleString('en-IN'), rawA: dataA.totalColleges, rawB: dataB.totalColleges },
    { label: 'Higher Education GER %', valA: `${dataA.higherGER}%`, valB: `${dataB.higherGER}%`, rawA: dataA.higherGER, rawB: dataB.higherGER },
    { label: 'Higher Ed Students Enrolled', valA: dataA.higherStudents.toLocaleString('en-IN'), valB: dataB.higherStudents.toLocaleString('en-IN'), rawA: dataA.higherStudents, rawB: dataB.higherStudents },
    { label: 'Workforce Employment Rate', valA: `${dataA.empRate}%`, valB: `${dataB.empRate}%`, rawA: dataA.empRate, rawB: dataB.empRate },
    { label: 'Workforce Unemployment Rate', valA: `${dataA.unempRate}%`, valB: `${dataB.unempRate}%`, rawA: -dataA.unempRate, rawB: -dataB.unempRate }, // lower is better
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-3 border border-white/20">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Comparative Analytics Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Bilateral State & Regional Benchmark
        </h2>
        <p className="mt-2 text-sky-100 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Select any two Indian States or Union Territories to perform head-to-head benchmarking across school infrastructure, university density, enrollment volumes, and labor indices for {selectedYear}.
        </p>

        {/* State Selectors */}
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <span className="text-xs font-bold text-sky-200 block mb-1">State A:</span>
            <select
              value={stateA}
              onChange={(e) => setStateA(e.target.value)}
              className="w-full bg-slate-900/90 text-white font-bold p-2.5 rounded-xl border border-sky-300/40 text-sm focus:outline-none cursor-pointer"
            >
              {stateOptions.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <span className="text-xs font-bold text-sky-200 block mb-1">State B:</span>
            <select
              value={stateB}
              onChange={(e) => setStateB(e.target.value)}
              className="w-full bg-slate-900/90 text-white font-bold p-2.5 rounded-xl border border-sky-300/40 text-sm focus:outline-none cursor-pointer"
            >
              {stateOptions.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="w-5/12 text-center">
            <span className="text-lg font-black text-blue-700 block">{dataA.name}</span>
            <span className="text-xs text-slate-400">Primary Benchmark</span>
          </div>
          <div className="w-2/12 text-center text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            VS
          </div>
          <div className="w-5/12 text-center">
            <span className="text-lg font-black text-sky-600 block">{dataB.name}</span>
            <span className="text-xs text-slate-400">Comparison Target</span>
          </div>
        </div>

        <div className="space-y-4">
          {comparisons.map((c, idx) => {
            const aWon = c.rawA > c.rawB;
            const bWon = c.rawB > c.rawA;

            return (
              <div key={idx} className="p-3.5 bg-slate-50/70 hover:bg-sky-50/50 rounded-xl border border-slate-100 transition-colors flex items-center justify-between gap-4">
                {/* State A Metric */}
                <div className="w-5/12 text-right">
                  <div className={`text-base font-black ${aWon ? 'text-blue-700 font-extrabold' : 'text-slate-700'}`}>
                    {c.valA}
                  </div>
                  {aWon && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Leading
                    </span>
                  )}
                </div>

                {/* Metric Label */}
                <div className="w-2/12 text-center">
                  <span className="text-xs font-bold text-slate-600 block text-center">
                    {c.label}
                  </span>
                </div>

                {/* State B Metric */}
                <div className="w-5/12 text-left">
                  <div className={`text-base font-black ${bWon ? 'text-sky-700 font-extrabold' : 'text-slate-700'}`}>
                    {c.valB}
                  </div>
                  {bWon && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Leading
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

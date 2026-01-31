import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, Moon, Sun, CheckCircle, Shield, Lock, Activity, User, 
  Target, Cpu, FileText, BarChart3, Skull, TrendingUp, AlertCircle, ChevronRight
} from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// ============================================================================
// DATABASE & AUTH CONFIG
// ============================================================================
const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGVjb3piYWZvemVoZWR0aGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzU2NDksImV4cCI6MjA4NTM1MTY0OX0.vMKJ-Kb5UqBO1OiokGsv2ayb51AXL79HCzcrUD7WZ0w';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ADMIN_PASS = 'MONCEF2006';

// ============================================================================
// FULL QUESTIONNAIRE SCHEMA (11 QUESTIONS)
// ============================================================================
const SURVEY_SCHEMA = [
  {
    id: 'SEC_1',
    title: 'Habitudes de Révision',
    questions: [
      { id: 'q1', label: 'Comment évaluez-vous votre organisation ?', type: 'select', options: ['Nulle', 'Moyenne', 'Bonne', 'Excellente'] },
      { id: 'q2', label: 'Heures de révision par jour ?', type: 'select', options: ['0-2h', '2-4h', '4-6h', '6h+'] },
      { id: 'q3', label: 'Utilisez-vous un planning fixe ?', type: 'select', options: ['Jamais', 'Parfois', 'Souvent', 'Toujours'] },
      { id: 'q4', label: 'Fixez-vous des objectifs par séance (1-5) ?', type: 'range', min: 1, max: 5 }
    ]
  },
  {
    id: 'SEC_2',
    title: 'Distractions & Sommeil',
    questions: [
      { id: 'q5', label: 'Heures de sommeil moyennes ?', type: 'select', options: ['-5h', '5-7h', '7-9h', '9h+'] },
      { id: 'q6', label: 'Réviser avec de la musique ?', type: 'select', options: ['Oui', 'Non'] },
      { id: 'q7', label: 'Niveau de dépendance au téléphone (1-5) ?', type: 'range', min: 1, max: 5 },
      { id: 'q8', label: 'Fréquence des pauses ?', type: 'select', options: ['Toutes les 30min', 'Toutes les 1h', 'Toutes les 2h', 'Rarement'] }
    ]
  },
  {
    id: 'SEC_3',
    title: 'Santé Mentale & Performance',
    questions: [
      { id: 'q9', label: 'Préférez-vous réviser seul ou en groupe ?', type: 'select', options: ['Seul', 'En groupe'] },
      { id: 'q10', label: 'Faites-vous du sport durant les examens ?', type: 'select', options: ['Oui', 'Non'] },
      { id: 'q11', label: 'Niveau de stress actuel (1-5) ?', type: 'range', min: 1, max: 5 }
    ]
  }
];

export default function MirToolFinal() {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('landing');
  const [currentModule, setCurrentModule] = useState(0);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState({ full_name: '', student_group: '', sexe: '', age: '', etablissement: '' });
  const [answers, setAnswers] = useState({});
  const [adminData, setAdminData] = useState([]);
  const [passAttempt, setPassAttempt] = useState('');

  // ============================================================================
  // ANALYTIC ENGINE (Full Weighted Algorithm)
  // ============================================================================
  const calculateSPI = (row) => {
    let score = 50; // Base score
    // Positive Factors
    if (row.q1 === 'Excellente') score += 15;
    if (row.q3 === 'Toujours') score += 10;
    if (row.q10 === 'Oui') score += 5;
    score += (parseInt(row.q4) || 3) * 3;

    // Negative Factors
    score -= (parseInt(row.q7) || 3) * 6;  // Phone impact
    score -= (parseInt(row.q11) || 3) * 4; // Stress impact
    if (row.q5 === '-5h') score -= 10;
    
    return Math.max(5, Math.min(99, score));
  };

  const getConsequences = (spi) => {
    if (spi < 40) return { label: "RISQUE CRITIQUE", color: "text-red-500", desc: "Attention aux l3awa9ib. Besoin urgent de discipline." };
    if (spi < 70) return { label: "ZONE DE VIGILANCE", color: "text-orange-400", desc: "Résultats moyens prévus. Éliminez les distractions." };
    return { label: "TRAJECTOIRE SUCCÈS", color: "text-emerald-500", desc: "Profil discipliné. Probabilité de mention élevée." };
  };

  const loadAdmin = async () => {
    if (passAttempt === ADMIN_PASS) {
      setLoading(true);
      const { data } = await supabase.from('student_surveys').select('*');
      setAdminData(data || []);
      setView('dashboard');
      setLoading(false);
    } else alert("Code Incorrect");
  };

  const submitSurvey = async () => {
    setLoading(true);
    await supabase.from('student_surveys').insert([{ ...student, ...answers }]);
    setLoading(false);
    setView('success');
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#050507] text-slate-900 dark:text-white transition-all font-sans">
        
        {/* NAV */}
        <nav className="fixed top-0 w-full z-[100] p-6 flex justify-between items-center backdrop-blur-xl border-b dark:border-white/5">
           <div className="flex items-center gap-2 font-black italic text-2xl tracking-tighter" onClick={() => setView('landing')}>
             MIR<span className="text-indigo-600">.TOOL</span>
           </div>
           <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 bg-white dark:bg-white/5 rounded-xl">
              {theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
           </button>
        </nav>

        <main className="pt-28 px-4 max-w-7xl mx-auto pb-20">
          
          {view === 'landing' && (
             <div className="text-center py-20 animate-in fade-in duration-700">
               <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter mb-8 uppercase">Impact<br/><span className="text-indigo-600">Study.</span></h1>
               <button onClick={() => setView('identity')} className="bg-indigo-600 text-white font-black py-6 px-16 rounded-2xl shadow-2xl hover:scale-105 transition-all uppercase">Démarrer</button>
               <button onClick={() => setView('admin-login')} className="block mx-auto mt-6 text-xs font-bold opacity-30 uppercase tracking-widest">Admin Access</button>
             </div>
          )}

          {view === 'identity' && (
            <div className="max-w-xl mx-auto bg-white dark:bg-[#0c0c0e] p-10 rounded-[3rem] shadow-2xl border dark:border-white/5">
               <h2 className="text-3xl font-black italic mb-8 uppercase text-center">Identification</h2>
               <div className="space-y-4">
                 <input className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl font-bold outline-none ring-indigo-500 focus:ring-2" placeholder="Nom Complet" onChange={e => setStudent({...student, full_name: e.target.value})}/>
                 <select className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl font-bold" onChange={e => setStudent({...student, etablissement: e.target.value})}>
                    <option value="">Établissement</option><option value="ENCG">ENCG</option><option value="ENSAM">ENSAM</option><option value="EST">EST</option><option value="FS">FS</option>
                 </select>
                 <button onClick={() => setView('survey')} className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl mt-4">Commencer le Test</button>
               </div>
            </div>
          )}

          {view === 'survey' && (
            <div className="max-w-2xl mx-auto space-y-6">
               <div className="flex justify-between items-end mb-4">
                 <h2 className="text-2xl font-black uppercase italic text-indigo-500">{SURVEY_SCHEMA[currentModule].title}</h2>
                 <span className="text-xs font-bold opacity-40">{currentModule + 1} / 3</span>
               </div>
               
               {SURVEY_SCHEMA[currentModule].questions.map(q => (
                 <div key={q.id} className="bg-white dark:bg-[#0c0c0e] p-8 rounded-3xl border dark:border-white/5 shadow-sm">
                    <label className="text-sm font-black uppercase opacity-60 block mb-4">{q.label}</label>
                    {q.type === 'range' ? (
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold">1</span>
                        <input type="range" min={q.min} max={q.max} className="w-full accent-indigo-500" onChange={e => setAnswers({...answers, [q.id]: e.target.value})}/>
                        <span className="text-xs font-bold">5</span>
                      </div>
                    ) : (
                      <select className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold" onChange={e => setAnswers({...answers, [q.id]: e.target.value})}>
                        <option value="">Choisir une option...</option>
                        {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    )}
                 </div>
               ))}
               <button onClick={() => currentModule < SURVEY_SCHEMA.length - 1 ? setCurrentModule(m => m + 1) : submitSurvey()} className="w-full bg-indigo-600 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-2 uppercase tracking-tighter">
                 {currentModule === SURVEY_SCHEMA.length - 1 ? 'Soumettre l\'analyse' : 'Suivant'} <ChevronRight size={20}/>
               </button>
            </div>
          )}

          {view === 'dashboard' && (
            <div className="space-y-10 animate-in fade-in">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                 <h2 className="text-4xl font-black italic tracking-tighter">ANALYTICS PANEL</h2>
                 <button onClick={() => setView('landing')} className="bg-red-500 text-white px-8 py-3 rounded-xl font-black text-xs uppercase">Logout</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adminData.map(row => {
                    const spi = calculateSPI(row);
                    const cons = getConsequences(spi);
                    return (
                      <div key={row.id} className="bg-white dark:bg-[#0c0c0e] p-8 rounded-[2.5rem] border dark:border-white/5 shadow-lg group">
                        <h4 className="font-black uppercase text-xl mb-1">{row.full_name}</h4>
                        <p className="text-[10px] font-black opacity-30 uppercase mb-6">{row.etablissement}</p>
                        
                        <div className="flex items-end justify-between mb-4">
                           <span className={`text-4xl font-black italic ${cons.color}`}>{spi}%</span>
                           <span className="text-[10px] font-bold opacity-40 uppercase">Success Prop.</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-2">
                           <div className={`text-[10px] font-black uppercase ${cons.color}`}>{cons.label}</div>
                           <p className="text-[11px] font-medium leading-relaxed opacity-70">{cons.desc}</p>
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}

          {view === 'admin-login' && (
             <div className="max-w-md mx-auto p-12 bg-white dark:bg-[#0c0c0e] rounded-[3rem] shadow-2xl text-center">
               <Lock size={40} className="mx-auto text-indigo-600 mb-6"/>
               <input type="password" autoFocus className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl text-center font-black outline-none mb-4" placeholder="PASSWORD" onChange={e => setPassAttempt(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadAdmin()}/>
               <button onClick={loadAdmin} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase">Login</button>
             </div>
          )}

          {view === 'success' && (
            <div className="text-center py-20 space-y-8 animate-in zoom-in">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={50}/>
              </div>
              <h2 className="text-5xl font-black italic uppercase">C'est fait.</h2>
              <p className="max-w-md mx-auto font-bold opacity-50">Tes réponses ont été envoyées au système central pour l'étude statistique.</p>
              <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white font-black py-5 px-12 rounded-2xl uppercase shadow-xl">Quitter</button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

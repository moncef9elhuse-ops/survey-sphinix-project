import React, { useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Moon, Sun, CheckCircle, Lock, Cpu, FileText, 
  Skull, ChevronRight, User, Shield 
} from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ============================================================================
// DATABASE CONFIG
// ============================================================================
const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGVjb3piYWZvemVoZWR0aGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzU2NDksImV4cCI6MjA4NTM1MTY0OX0.vMKJ-Kb5UqBO1OiokGsv2ayb51AXL79HCzcrUD7WZ0w';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ADMIN_PASS = 'MONCEF2006';

// ============================================================================
// FULL 11-QUESTION SCHEMA
// ============================================================================
const SURVEY_SCHEMA = [
  {
    id: 'SEC_1',
    title: 'Organisation & Rythme',
    questions: [
      { id: 'q1', label: 'Comment évaluez-vous votre organisation ?', type: 'select', options: ['Nulle', 'Moyenne', 'Bonne', 'Excellente'] },
      { id: 'q2', label: 'Heures de révision par jour ?', type: 'select', options: ['0-2h', '2-4h', '4-6h', '6h+'] },
      { id: 'q3', label: 'Utilisez-vous un planning fixe ?', type: 'select', options: ['Jamais', 'Parfois', 'Souvent', 'Toujours'] },
      { id: 'q4', label: 'Objectifs par séance (1-5) ?', type: 'range', min: 1, max: 5 }
    ]
  },
  {
    id: 'SEC_2',
    title: 'Environnement & Hygiène',
    questions: [
      { id: 'q5', label: 'Heures de sommeil moyennes ?', type: 'select', options: ['-5h', '5-7h', '7-9h', '9h+'] },
      { id: 'q6', label: 'Réviser avec de la musique ?', type: 'select', options: ['Oui', 'Non'] },
      { id: 'q7', label: 'Dépendance au téléphone (1-5) ?', type: 'range', min: 1, max: 5 },
      { id: 'q8', label: 'Fréquence des pauses ?', type: 'select', options: ['Toutes les 30min', 'Toutes les 1h', 'Toutes les 2h', 'Rarement'] }
    ]
  },
  {
    id: 'SEC_3',
    title: 'Psychologie & Santé',
    questions: [
      { id: 'q9', label: 'Préférez-vous réviser seul ou en groupe ?', type: 'select', options: ['Seul', 'En groupe'] },
      { id: 'q10', label: 'Faites-vous du sport durant les examens ?', type: 'select', options: ['Oui', 'Non'] },
      { id: 'q11', label: 'Niveau de stress actuel (1-5) ?', type: 'range', min: 1, max: 5 }
    ]
  }
];

export default function MirToolApp() {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('landing');
  const [currentModule, setCurrentModule] = useState(0);
  const [loading, setLoading] = useState(false);
  const [passAttempt, setPassAttempt] = useState('');
  const [adminData, setAdminData] = useState([]);
  
  const [student, setStudent] = useState({ full_name: '', etablissement: '', sexe: '' });
  const [answers, setAnswers] = useState({});

  // SPI CALCULATION ENGINE
  const calculateSPI = (row) => {
    let score = 50;
    if (row.q1 === 'Excellente') score += 15;
    if (row.q3 === 'Toujours') score += 10;
    if (row.q10 === 'Oui') score += 5;
    score += (parseInt(row.q4) || 3) * 3;
    score -= (parseInt(row.q7) || 3) * 6; // Phone penalty
    score -= (parseInt(row.q11) || 3) * 4; // Stress penalty
    return Math.max(5, Math.min(99, score));
  };

  const getStatus = (spi) => {
    if (spi < 45) return { label: "L3AWA9IB CRITIQUES", color: "text-red-500", bg: "bg-red-500/10" };
    if (spi < 75) return { label: "RISQUE MODÉRÉ", color: "text-orange-400", bg: "bg-orange-400/10" };
    return { label: "EXCELLENCE PRÉDITE", color: "text-emerald-500", bg: "bg-emerald-500/10" };
  };

  const submitSurvey = async () => {
    setLoading(true);
    try {
      await supabase.from('student_surveys').insert([{ ...student, ...answers }]);
      setView('success');
    } catch (e) { alert("Erreur de connexion"); }
    setLoading(false);
  };

  const loadAdmin = async () => {
    if (passAttempt === ADMIN_PASS) {
      setLoading(true);
      const { data } = await supabase.from('student_surveys').select('*');
      setAdminData(data || []);
      setView('dashboard');
      setLoading(false);
    } else { alert("Passcode Incorrect"); }
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#050507] text-slate-900 dark:text-white transition-colors font-sans overflow-x-hidden">
        
        {/* HEADER */}
        <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-md border-b dark:border-white/5">
          <div className="text-2xl font-black italic tracking-tighter cursor-pointer" onClick={() => setView('landing')}>
            MIR<span className="text-indigo-600">.TOOL</span>
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 bg-white dark:bg-white/5 rounded-full shadow-sm">
            {theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
          </button>
        </nav>

        <main className="pt-32 px-4 max-w-6xl mx-auto pb-20">
          
          {view === 'landing' && (
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8]">
                Student<br/><span className="text-indigo-600">Impact.</span>
              </h1>
              <p className="text-sm font-bold opacity-40 tracking-[0.3em] uppercase">Predicting Academic Consequences</p>
              <div className="flex flex-col items-center gap-4">
                <button onClick={() => setView('identity')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 px-16 rounded-2xl shadow-2xl transition-all scale-100 hover:scale-105 active:scale-95 uppercase">
                  Lancer l'Analyse
                </button>
                <button onClick={() => setView('admin-login')} className="text-[10px] font-black opacity-20 hover:opacity-100 transition-opacity uppercase tracking-widest flex items-center gap-2">
                  <Lock size={12}/> Admin Portal
                </button>
              </div>
            </div>
          )}

          {view === 'identity' && (
            <div className="max-w-lg mx-auto bg-white dark:bg-[#0c0c0e] p-10 rounded-[2.5rem] shadow-2xl border dark:border-white/5 animate-in zoom-in duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white"><User/></div>
                <h2 className="text-2xl font-black italic uppercase">Identification</h2>
              </div>
              <div className="space-y-4">
                <input className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all" placeholder="Nom Complet" onChange={e => setStudent({...student, full_name: e.target.value})}/>
                <select className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl font-bold outline-none" onChange={e => setStudent({...student, etablissement: e.target.value})}>
                  <option value="">Établissement</option>
                  <option value="ENCG">ENCG</option><option value="ENSAM">ENSAM</option><option value="EST">EST</option><option value="FS">FS</option>
                </select>
                <select className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl font-bold outline-none" onChange={e => setStudent({...student, sexe: e.target.value})}>
                  <option value="">Sexe</option>
                  <option value="Homme">Homme</option><option value="Femme">Femme</option>
                </select>
                <button onClick={() => setView('survey')} className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl mt-4 shadow-lg active:scale-95 transition-transform">Continuer</button>
              </div>
            </div>
          )}

          {view === 'survey' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right-10 duration-500">
              <div className="p-8 bg-indigo-600 text-white rounded-[2rem] shadow-xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black opacity-60 uppercase mb-1">Module {currentModule + 1} sur 3</p>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">{SURVEY_SCHEMA[currentModule].title}</h2>
                </div>
                <ChevronRight size={40} className="opacity-20"/>
              </div>

              {SURVEY_SCHEMA[currentModule].questions.map(q => (
                <div key={q.id} className="bg-white dark:bg-[#0c0c0e] p-8 rounded-[2rem] border dark:border-white/5 shadow-sm">
                  <label className="text-xs font-black uppercase opacity-40 mb-4 block tracking-widest">{q.label}</label>
                  {q.type === 'range' ? (
                    <div className="flex items-center gap-6 pt-2">
                      <span className="text-xs font-black">MIN</span>
                      <input type="range" min={q.min} max={q.max} className="w-full accent-indigo-600" onChange={e => setAnswers({...answers, [q.id]: e.target.value})}/>
                      <span className="text-xs font-black">MAX</span>
                    </div>
                  ) : (
                    <select className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-indigo-600" onChange={e => setAnswers({...answers, [q.id]: e.target.value})}>
                      <option value="">Choisir...</option>
                      {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  )}
                </div>
              ))}
              
              <button 
                onClick={() => currentModule < SURVEY_SCHEMA.length - 1 ? setCurrentModule(m => m + 1) : submitSurvey()} 
                className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] shadow-2xl uppercase tracking-tighter"
              >
                {currentModule === SURVEY_SCHEMA.length - 1 ? 'Finaliser l\'Analyse' : 'Module Suivant'}
              </button>
            </div>
          )}

          {view === 'admin-login' && (
            <div className="max-w-md mx-auto p-12 bg-white dark:bg-[#0c0c0e] rounded-[3rem] shadow-2xl text-center animate-in zoom-in">
              <Shield size={50} className="mx-auto text-indigo-600 mb-6"/>
              <input type="password" autoFocus className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl text-center font-black outline-none mb-4" placeholder="••••••••" onChange={e => setPassAttempt(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadAdmin()}/>
              <button onClick={loadAdmin} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest">Accéder au Cloud</button>
            </div>
          )}

          {view === 'dashboard' && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase underline decoration-indigo-600 underline-offset-8">Data Terminal</h2>
                <div className="flex gap-2">
                  <button onClick={() => setView('landing')} className="bg-red-500/10 text-red-500 px-6 py-3 rounded-xl font-black text-[10px] uppercase border border-red-500/20">Quitter</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminData.map(row => {
                  const spi = calculateSPI(row);
                  const status = getStatus(spi);
                  return (
                    <div key={row.id} className="bg-white dark:bg-[#0c0c0e] p-8 rounded-[2.5rem] border dark:border-white/5 shadow-lg group hover:border-indigo-600/50 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-black uppercase text-xl leading-none mb-1">{row.full_name}</h4>
                          <p className="text-[10px] font-black opacity-30 uppercase">{row.etablissement} • {row.sexe}</p>
                        </div>
                        <div className={`text-2xl font-black italic ${status.color}`}>{spi}%</div>
                      </div>
                      <div className={`p-4 rounded-2xl mb-4 ${status.bg}`}>
                        <div className={`text-[10px] font-black uppercase mb-1 ${status.color}`}>{status.label}</div>
                        <p className="text-[11px] font-medium opacity-70 leading-relaxed">Facteur de stress: {row.q11}/5. Addiction mobile: {row.q7}/5.</p>
                      </div>
                      <div className="h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${spi > 60 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{width: `${spi}%`}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'success' && (
            <div className="text-center py-20 space-y-6 animate-in zoom-in">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={48}/>
              </div>
              <h2 className="text-6xl font-black italic uppercase tracking-tighter">Analyse Terminée</h2>
              <p className="max-w-sm mx-auto font-bold opacity-40">Vos données ont été injectées dans le moteur statistique MIR.TOOL.</p>
              <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white font-black py-5 px-12 rounded-2xl shadow-xl hover:scale-105 transition-transform uppercase">Retour Accueil</button>
            </div>
          )}

        </main>

        {loading && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Cpu size={50} className="text-indigo-600 animate-spin mb-4"/>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Traitement des Données...</p>
          </div>
        )}

      </div>
    </div>
  );
}

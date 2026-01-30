import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, Moon, Sun, ChevronRight, ChevronLeft, CheckCircle, Shield, RefreshCcw, 
  Activity, Brain, User, Lock, Layers, Smartphone, Target, AlertTriangle, 
  Database, GraduationCap, Eye, Trash2, TrendingUp, Cpu, Globe, Search
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Radar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler);

// ============================================================================
// 1. CONFIGURATION
// ============================================================================
const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGVjb3piYWZvemVoZWR0aGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzU2NDksImV4cCI6MjA4NTM1MTY0OX0.vMKJ-Kb5UqBO1OiokGsv2ayb51AXL79HCzcrUD7WZ0w';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ADMIN_PASS = 'MONCEF';

// ============================================================================
// 2. SURVEY SCHEMA
// ============================================================================
const TITAN_SCHEMA = [
  {
    id: 'SEC_METHODS',
    title: 'Méthodologie',
    icon: <Layers size={22} />,
    color: 'from-blue-600 to-indigo-700',
    questions: [
      { id: 'm1', label: 'Support de planification', type: 'select', options: ['Numérique', 'Papier', 'Aucun'] },
      { id: 'm2', label: 'Technique de révision', type: 'select', options: ['Active Recall', 'Relecture', 'Fiches'] },
      { id: 'm3', label: 'Indice de Procrastination', type: 'range', minLabel: 'Faible', maxLabel: 'Élevé' },
      { id: 'm4', label: 'Anticipation Examens', type: 'select', options: ['1 mois', '1 semaine', 'Veille'] },
      { id: 'm5', label: 'Efficacité Focus', type: 'range', minLabel: 'Distrait', maxLabel: 'Profond' }
    ]
  },
  {
    id: 'SEC_DIGITAL',
    title: 'Empreinte Digitale',
    icon: <Smartphone size={22} />,
    color: 'from-purple-600 to-fuchsia-800',
    questions: [
      { id: 'd1', label: 'Ratio Écran Productif', type: 'range', minLabel: 'Loisir', maxLabel: 'Travail' },
      { id: 'd2', label: 'Utilisation de l’IA', type: 'select', options: ['Quotidienne', 'Rare', 'Jamais'] },
      { id: 'd3', label: 'Dépendance Mobile', type: 'range', minLabel: 'Basse', maxLabel: 'Totale' },
      { id: 'd4', label: 'Organisation Cloud', type: 'select', options: ['Structurée', 'Chaotique', 'Nulle'] },
      { id: 'd5', label: 'Distraction Sociale', type: 'range', minLabel: 'Bruit', maxLabel: 'Silence' }
    ]
  },
  {
    id: 'SEC_HEALTH',
    title: 'Santé & Mental',
    icon: <Activity size={22} />,
    color: 'from-emerald-500 to-teal-700',
    questions: [
      { id: 'h1', label: 'Qualité du Sommeil', type: 'range', minLabel: 'Mauvaise', maxLabel: 'Optimale' },
      { id: 'h2', label: 'Niveau de Stress', type: 'range', minLabel: 'Zen', maxLabel: 'Burnout' },
      { id: 'h3', label: 'Consommation Caféine', type: 'select', options: ['Nulle', 'Modérée', 'Élevée'] },
      { id: 'h4', label: 'Activité Physique', type: 'select', options: ['Régulière', 'Rare', 'Nulle'] },
      { id: 'h5', label: 'Moral Global', type: 'range', minLabel: 'Bas', maxLabel: 'Haut' }
    ]
  },
  {
    id: 'SEC_ACADEMIC',
    title: 'Performance',
    icon: <Brain size={22} />,
    color: 'from-orange-500 to-red-700',
    questions: [
      { id: 'a1', label: 'Assiduité', type: 'select', options: ['100%', '75%', '< 50%'] },
      { id: 'a2', label: 'Compréhension Directe', type: 'range', minLabel: 'Difficile', maxLabel: 'Fluide' },
      { id: 'a3', label: 'Qualité des Notes', type: 'range', minLabel: 'Brouillon', maxLabel: 'Expert' },
      { id: 'a4', label: 'Participation', type: 'select', options: ['Active', 'Passive', 'Nulle'] },
      { id: 'a5', label: 'Niveau Scolaire', type: 'select', options: ['Élite', 'Moyenne', 'Difficulté'] }
    ]
  },
  {
    id: 'SEC_FUTURE',
    title: 'Vision Pro',
    icon: <Target size={22} />,
    color: 'from-cyan-500 to-blue-700',
    questions: [
      { id: 'f1', label: 'Clarté du Projet', type: 'range', minLabel: 'Flou', maxLabel: 'Précis' },
      { id: 'f2', label: 'Confiance Avenir', type: 'range', minLabel: 'Inquiet', maxLabel: 'Serein' },
      { id: 'f3', label: 'Ambition Salaire', type: 'select', options: ['Élevée', 'Moyenne', 'Peu importe'] },
      { id: 'f4', label: 'Réseautage', type: 'select', options: ['Actif', 'Passif', 'Nul'] },
      { id: 'f5', label: 'Satisfaction Global', type: 'range', minLabel: 'Déçu', maxLabel: 'Épanoui' }
    ]
  }
];

export default function TitanApp() {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('landing');
  const [currentModule, setCurrentModule] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States for Profile & Survey
  const [student, setStudent] = useState({ full_name: '', student_group: '', sexe: '', age: '', cycle: '', etablissement: '' });
  const [answers, setAnswers] = useState({});
  const [adminData, setAdminData] = useState([]);
  const [authCode, setAuthCode] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const submitSurvey = async () => {
    setLoading(true);
    try {
      const { error: sbError } = await supabase.from('student_surveys').insert([{ ...student, ...answers }]);
      if (sbError) throw sbError;
      setView('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentModule < TITAN_SCHEMA.length - 1) {
      setCurrentModule(prev => prev + 1);
      window.scrollTo(0,0);
    } else {
      submitSurvey();
    }
  };

  const loadDashboard = async () => {
    if (authCode === ADMIN_PASS) {
      setLoading(true);
      const { data } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
      setAdminData(data || []);
      setLoading(false);
      setView('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050506] text-slate-900 dark:text-white font-sans transition-colors duration-500">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-xl border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
          <Zap className="text-indigo-600" fill="currentColor"/>
          <span className="font-black italic uppercase text-2xl tracking-tighter">Sphinx<span className="text-indigo-500">.V5</span></span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 bg-white dark:bg-white/5 rounded-xl shadow-lg transition-transform hover:scale-110">
            {theme === 'dark' ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-indigo-600"/>}
          </button>
          <button onClick={() => setView('admin-login')} className="p-3 bg-black/5 dark:bg-white/5 rounded-xl"><Lock size={20}/></button>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
        
        {/* LANDING VIEW */}
        {view === 'landing' && (
          <div className="text-center space-y-12 animate-in fade-in zoom-in duration-700">
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85]">Bilan<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Titan Alpha</span></h1>
            <p className="text-xl font-bold opacity-40 max-w-lg mx-auto leading-relaxed">Protocole standardisé d'audit académique. 25 indicateurs haute précision.</p>
            <button onClick={() => setView('identity')} className="bg-indigo-600 text-white font-black uppercase tracking-widest py-8 px-16 rounded-2xl shadow-2xl hover:scale-105 transition-transform">Initialiser l'Analyse</button>
          </div>
        )}

        {/* IDENTITY VIEW (NEW FIELDS) */}
        {view === 'identity' && (
          <div className="bg-white dark:bg-[#0c0c0e] p-8 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8 animate-in slide-in-from-bottom-10">
            <h2 className="text-4xl font-black italic uppercase text-center">Identification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold" placeholder="Nom Complet" onChange={e => setStudent({...student, full_name: e.target.value})}/>
              <input className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold" placeholder="Groupe / Promotion" onChange={e => setStudent({...student, student_group: e.target.value})}/>
              
              <select className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl font-bold text-black dark:text-white" onChange={e => setStudent({...student, sexe: e.target.value})}>
                <option value="">Sexe</option><option value="Homme">Homme</option><option value="Femme">Femme</option>
              </select>

              <select className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl font-bold text-black dark:text-white" onChange={e => setStudent({...student, age: e.target.value})}>
                <option value="">Âge</option><option value="Moins de 20 ans">Moins de 20 ans</option><option value="20 - 25 ans">20 - 25 ans</option><option value="25 - 30 ans">25 - 30 ans</option><option value="Plus de 30 ans">Plus de 30 ans</option>
              </select>

              <select className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl font-bold text-black dark:text-white" onChange={e => setStudent({...student, cycle: e.target.value})}>
                <option value="">Cycle d'étude</option><option value="Bac+2">Bac+2</option><option value="Bac+3">Bac+3</option><option value="Bac+4">Bac+4</option><option value="Bac+5">Bac+5</option><option value="Doctorat">Doctorat</option>
              </select>

              <select className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl font-bold text-black dark:text-white" onChange={e => setStudent({...student, etablissement: e.target.value})}>
                <option value="">Établissement</option><option value="ENCG">ENCG</option><option value="ENSAM">ENSAM</option><option value="EST">EST</option><option value="ENS">ENS</option><option value="FS">FS</option><option value="FSJES">FSJES</option><option value="FLSH">FLSH</option><option value="FPE">FPE</option><option value="FSTE">FSTE</option>
              </select>
            </div>
            <button disabled={!student.full_name || !student.sexe || !student.etablissement} onClick={() => setView('survey')} className="w-full bg-indigo-600 text-white font-black uppercase py-6 rounded-2xl shadow-xl disabled:opacity-50">Démarrer le Questionnaire</button>
          </div>
        )}

        {/* SURVEY VIEW */}
        {view === 'survey' && (
          <div className="space-y-10 animate-in fade-in">
            <div className={`p-10 md:p-14 rounded-[3rem] bg-gradient-to-br ${TITAN_SCHEMA[currentModule].color} text-white shadow-2xl relative overflow-hidden`}>
              <span className="text-[10px] font-black uppercase opacity-60">Module 0{currentModule + 1}</span>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase leading-none mt-2">{TITAN_SCHEMA[currentModule].title}</h2>
            </div>
            {TITAN_SCHEMA[currentModule].questions.map(q => (
              <div key={q.id} className="bg-white dark:bg-[#0c0c0e] p-8 md:p-10 rounded-[2.5rem] shadow-xl hover:border-indigo-500/30 border border-transparent transition-all">
                <label className="text-xl font-bold mb-6 block">{q.label}</label>
                {q.type === 'range' ? (
                  <div className="space-y-4">
                    <input type="range" min="1" max="5" defaultValue="3" className="w-full h-3 bg-slate-200 dark:bg-white/10 rounded-full appearance-none accent-indigo-600" onChange={e => setAnswers({...answers, [q.id]: e.target.value})}/>
                    <div className="flex justify-between text-[10px] font-black uppercase opacity-40"><span>{q.minLabel}</span><span className="text-indigo-500 text-lg">{answers[q.id] || 3}</span><span>{q.maxLabel}</span></div>
                  </div>
                ) : (
                  <select className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl font-bold text-black dark:text-white" onChange={e => setAnswers({...answers, [q.id]: e.target.value})}>
                    <option value="">Choisir...</option>
                    {q.options.map(opt => <option key={opt} value={opt} className="text-black">{opt}</option>)}
                  </select>
                )}
              </div>
            ))}
            <div className="flex gap-4 pb-20">
              <button disabled={currentModule === 0} onClick={() => setCurrentModule(m => m - 1)} className="flex-1 p-6 bg-white dark:bg-white/5 rounded-2xl font-black uppercase tracking-widest text-xs">Retour</button>
              <button onClick={handleNext} className="flex-[2] p-6 bg-indigo-600 text-white rounded-2xl font-black uppercase shadow-xl">{currentModule === 4 ? 'Terminer' : 'Suivant'}</button>
            </div>
          </div>
        )}

        {/* SUCCESS VIEW */}
        {view === 'success' && (
          <div className="text-center py-20 space-y-10 animate-in zoom-in">
            <div className="w-40 h-40 bg-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl rotate-12"><CheckCircle size={80} className="text-white"/></div>
            <h2 className="text-6xl font-black italic uppercase">Diagnostic <span className="text-emerald-500">Injecté</span></h2>
            <button onClick={() => window.location.reload()} className="p-6 bg-indigo-600 text-white rounded-2xl font-black px-16">Nouveau Profil</button>
          </div>
        )}

        {/* ADMIN LOGIN */}
        {view === 'admin-login' && (
          <div className="max-w-sm mx-auto bg-white dark:bg-[#0c0c0e] p-12 rounded-[2.5rem] shadow-2xl text-center space-y-8 animate-in fade-in">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto text-indigo-500"><Shield size={40}/></div>
            <input type="password" placeholder="CODE ADMIN" className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl text-center font-black tracking-[0.5em]" onChange={e => setAuthCode(e.target.value)}/>
            <button onClick={loadDashboard} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase">Déchiffrer</button>
          </div>
        )}
      </main>

      {/* DASHBOARD OVERLAY */}
      {view === 'dashboard' && (
        <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-[#050507] overflow-y-auto p-6 md:p-16">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-10">
              <h2 className="text-5xl font-black italic uppercase">Command <span className="text-indigo-500">Center</span></h2>
              <button onClick={() => setView('landing')} className="bg-red-500 text-white px-10 py-4 rounded-xl font-black uppercase text-xs">Fermer</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-[#0c0c0e] p-10 rounded-[2.5rem] shadow-xl border-l-8 border-indigo-600"><span className="text-[10px] font-black uppercase opacity-40">Total Dossiers</span><p className="text-7xl font-black italic mt-2">{adminData.length}</p></div>
              <div className="bg-white dark:bg-[#0c0c0e] p-10 rounded-[2.5rem] shadow-xl border-l-8 border-purple-600"><span className="text-[10px] font-black uppercase opacity-40">Groupes Actifs</span><p className="text-7xl font-black italic mt-2">{[...new Set(adminData.map(r => r.student_group))].length}</p></div>
              <div className="bg-white dark:bg-[#0c0c0e] p-10 rounded-[2.5rem] shadow-xl border-l-8 border-emerald-600"><span className="text-[10px] font-black uppercase opacity-40">Serveur Titan</span><p className="text-2xl font-black italic mt-6 text-emerald-500 uppercase flex items-center gap-2"><Globe size={24}/> Online</p></div>
            </div>
            <div className="bg-white dark:bg-[#0c0c0e] p-8 md:p-12 rounded-[3rem] shadow-xl">
              <table className="w-full text-left">
                <thead className="opacity-40 text-[10px] uppercase font-black tracking-widest"><tr><th className="p-6">Nom</th><th className="p-6">Etablissement</th><th className="p-6">Groupe</th><th className="p-6">Cycle</th></tr></thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                  {adminData.map(row => (
                    <tr key={row.id} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="p-6 text-lg italic uppercase">{row.full_name}</td>
                      <td className="p-6"><span className="px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-xl text-[10px] font-black uppercase">{row.etablissement}</span></td>
                      <td className="p-6 opacity-60 uppercase">{row.student_group}</td>
                      <td className="p-6 opacity-40">{row.cycle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center text-white">
          <Cpu size={50} className="animate-spin mb-4 text-indigo-500"/><p className="font-black uppercase tracking-widest">Sync In Progress...</p>
        </div>
      )}

      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[400] w-full max-w-sm bg-red-500 text-white p-6 rounded-[2rem] flex items-center gap-4 animate-bounce">
          <AlertTriangle size={30} /><p className="text-sm font-bold flex-1">{error}</p><button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 20px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 24px; width: 24px; border-radius: 50%; background: #6366f1; border: 4px solid #fff; box-shadow: 0 0 10px rgba(99,102,241,0.3); }
        .dark input[type=range]::-webkit-slider-thumb { border: 4px solid #050507; }
      `}</style>
    </div>
  );
}

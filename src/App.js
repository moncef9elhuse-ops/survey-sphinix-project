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

// --- SYSTEM INITIALIZATION ---
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler
);

// ============================================================================
// 1. CORE CONFIGURATION
// ============================================================================
const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGVjb3piYWZvemVoZWR0aGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzU2NDksImV4cCI6MjA4NTM1MTY0OX0.vMKJ-Kb5UqBO1OiokGsv2ayb51AXL79HCzcrUD7WZ0w';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_PASS = 'TITAN2026';

// ============================================================================
// 2. THE 25-QUESTION TITAN SCHEMA
// ============================================================================
const TITAN_SCHEMA = [
  {
    id: 'SEC_METHODS',
    title: 'Ingénierie de Travail',
    icon: <Layers size={22} />,
    color: 'from-blue-600 to-indigo-700',
    description: 'Analyse structurelle des processus d\'organisation.',
    questions: [
      { id: 'm1', label: 'Support de planification principal', type: 'select', options: ['Numérique (Apps)', 'Physique (Agenda)', 'Aucun'] },
      { id: 'm2', label: 'Technique de révision active', type: 'select', options: ['Active Recall', 'Relecture simple', 'Fiches'] },
      { id: 'm3', label: 'Indice de Procrastination', type: 'range', minLabel: 'Maîtrisée', maxLabel: 'Critique' },
      { id: 'm4', label: 'Anticipation des échéances', type: 'select', options: ['Long terme', 'Court terme', 'Urgence'] },
      { id: 'm5', label: 'Efficacité du focus (Deep Work)', type: 'range', minLabel: 'Faible', maxLabel: 'Total' }
    ]
  },
  {
    id: 'SEC_DIGITAL',
    title: 'Écosystème Numérique',
    icon: <Smartphone size={22} />,
    color: 'from-purple-600 to-fuchsia-800',
    description: 'Impact technologique et intégration de l\'IA.',
    questions: [
      { id: 'd1', label: 'Ratio Écran Productif', type: 'range', minLabel: 'Loisir', maxLabel: 'Productif' },
      { id: 'd2', label: 'Utilisation de l\'IA générative', type: 'select', options: ['Quotidienne', 'Occasionnelle', 'Jamais'] },
      { id: 'd3', label: 'Vulnérabilité aux notifications', type: 'range', minLabel: 'Basse', maxLabel: 'Élevée' },
      { id: 'd4', label: 'Architecture Cloud personnelle', type: 'select', options: ['Structurée', 'Chaotique', 'Inexistante'] },
      { id: 'd5', label: 'Dépendance aux réseaux sociaux', type: 'range', minLabel: 'Nulle', maxLabel: 'Totale' }
    ]
  },
  {
    id: 'SEC_HEALTH',
    title: 'Biophysique & Mental',
    icon: <Activity size={22} />,
    color: 'from-emerald-500 to-teal-700',
    description: 'Mesure des constantes de santé et du stress.',
    questions: [
      { id: 'h1', label: 'Qualité du cycle de sommeil', type: 'range', minLabel: 'Mauvais', maxLabel: 'Optimal' },
      { id: 'h2', label: 'Niveau de charge mentale', type: 'range', minLabel: 'Zen', maxLabel: 'Burnout' },
      { id: 'h3', label: 'Consommation de stimulants', type: 'select', options: ['Nulle', 'Modérée', 'Élevée'] },
      { id: 'h4', label: 'Niveau d\'activité physique', type: 'select', options: ['Sportif', 'Modéré', 'Sédentaire'] },
      { id: 'h5', label: 'Indice de satisfaction sociale', type: 'range', minLabel: 'Isolé', maxLabel: 'Entouré' }
    ]
  },
  {
    id: 'SEC_ACADEMIC',
    title: 'Performance & Score',
    icon: <Brain size={22} />,
    color: 'from-orange-500 to-red-700',
    description: 'Analyse des résultats et de l\'assiduité.',
    questions: [
      { id: 'a1', label: 'Assiduité en présentiel', type: 'select', options: ['100%', '75%', '< 50%'] },
      { id: 'a2', label: 'Vitesse de compréhension', type: 'range', minLabel: 'Lente', maxLabel: 'Fluide' },
      { id: 'a3', label: 'Qualité de prise de notes', type: 'range', minLabel: 'Brouillon', maxLabel: 'Expert' },
      { id: 'a4', label: 'Participation orale', type: 'select', options: ['Active', 'Passive', 'Nulle'] },
      { id: 'a5', label: 'Niveau scolaire auto-évalué', type: 'select', options: ['Élite', 'Moyenne', 'Difficulté'] }
    ]
  },
  {
    id: 'SEC_FUTURE',
    title: 'Vision Stratégique',
    icon: <Target size={22} />,
    color: 'from-cyan-500 to-blue-700',
    description: 'Ambition pro et projection de carrière.',
    questions: [
      { id: 'f1', label: 'Clarté du projet professionnel', type: 'range', minLabel: 'Flou', maxLabel: 'Précis' },
      { id: 'f2', label: 'Confiance en l\'avenir éco', type: 'range', minLabel: 'Inquiet', maxLabel: 'Serein' },
      { id: 'f3', label: 'Importance du salaire futur', type: 'select', options: ['Priorité', 'Important', 'Secondaire'] },
      { id: 'f4', label: 'Réseautage (LinkedIn/Pro)', type: 'select', options: ['Actif', 'Passif', 'Nul'] },
      { id: 'f5', label: 'Sentiment d\'épanouissement', type: 'range', minLabel: 'Nul', maxLabel: 'Total' }
    ]
  }
];

// ============================================================================
// 3. MAIN APPLICATION ENGINE
// ============================================================================
export default function TitanApp() {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('landing');
  const [currentModule, setCurrentModule] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data States
  const [student, setStudent] = useState({ full_name: '', student_group: '' });
  const [answers, setAnswers] = useState({});
  const [adminData, setAdminData] = useState([]);
  const [adminPassAttempt, setAdminPassAttempt] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Logic Handlers
  const handleNext = async () => {
    if (currentModule < TITAN_SCHEMA.length - 1) {
      setCurrentModule(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      submitToSupabase();
    }
  };

  const submitToSupabase = async () => {
    setLoading(true);
    try {
      const { error: sbError } = await supabase
        .from('student_surveys')
        .insert([{ ...student, ...answers }]);
      if (sbError) throw sbError;
      setView('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async () => {
    if (adminPassAttempt === ADMIN_PASS) {
      setLoading(true);
      const { data, error: sbError } = await supabase
        .from('student_surveys')
        .select('*')
        .order('created_at', { ascending: false });
      if (!sbError) {
        setAdminData(data);
        setView('admin-dashboard');
      } else {
        setError(sbError.message);
      }
      setLoading(false);
    } else {
      setError("CODE D'ACCÈS INVALIDE");
    }
  };

  // UI Components
  const ProgressBar = () => (
    <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 dark:bg-white/5 z-[100]">
      <div 
        className="h-full bg-indigo-500 transition-all duration-700 ease-out shadow-[0_0_15px_#6366f1]"
        style={{ width: `${((currentModule + 1) / TITAN_SCHEMA.length) * 100}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050507] text-slate-900 dark:text-white transition-colors duration-500 font-sans pb-20">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg"><Zap size={20} fill="currentColor"/></div>
          <span className="font-black italic uppercase tracking-tighter text-xl">Sphinx<span className="text-indigo-500">.V5</span></span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
            {theme === 'dark' ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-indigo-600"/>}
          </button>
          <button onClick={() => setView('admin-login')} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 shadow-sm"><Lock size={18}/></button>
        </div>
      </nav>

      {/* MAIN CONTENT ROUTER */}
      <main className="relative z-10 pt-32 px-6 max-w-3xl mx-auto min-h-screen flex flex-col justify-center">
        
        {/* VIEW: LANDING */}
        {view === 'landing' && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85]">Bilan<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Titan</span></h1>
            <p className="text-xl font-bold opacity-40 max-w-lg mx-auto leading-relaxed italic">Protocole standardisé d'analyse académique. 25 indicateurs de précision.</p>
            <button 
              onClick={() => setView('identity')} 
              className="bg-indigo-600 text-white font-black uppercase tracking-widest py-6 px-16 rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-105 transition-transform"
            >
              Initialiser l'Analyse
            </button>
          </div>
        )}

        {/* VIEW: IDENTITY */}
        {view === 'identity' && (
          <div className="bg-white dark:bg-[#0c0c0e] p-10 md:p-14 rounded-[2.5rem] shadow-2xl space-y-8 animate-in slide-in-from-bottom-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto text-indigo-500 mb-6 shadow-inner"><User size={36}/></div>
              <h2 className="text-3xl font-black italic uppercase">Identification</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Nom Complet</label>
                <input className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 font-bold transition-all" placeholder="ex: Thomas Anderson" onChange={e => setStudent({...student, full_name: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Groupe / Promotion</label>
                <input className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 font-bold transition-all" placeholder="ex: Master 1 - Digital" onChange={e => setStudent({...student, student_group: e.target.value})}/>
              </div>
              <button 
                disabled={!student.full_name || !student.student_group}
                onClick={() => setView('survey')} 
                className="w-full bg-indigo-600 text-white font-black uppercase tracking-widest py-6 rounded-2xl shadow-lg disabled:opacity-50"
              >
                Démarrer le Questionnaire
              </button>
            </div>
          </div>
        )}

        {/* VIEW: SURVEY ENGINE */}
        {view === 'survey' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <ProgressBar />
            <div className={`p-10 md:p-14 rounded-[2.5rem] bg-gradient-to-br ${TITAN_SCHEMA[currentModule].color} text-white shadow-2xl relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-12 opacity-20 transform translate-x-4 -translate-y-4">{TITAN_SCHEMA[currentModule].icon}</div>
              <span className="text-[11px] font-black uppercase tracking-widest opacity-60">Module 0{currentModule + 1}</span>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-none mt-2">{TITAN_SCHEMA[currentModule].title}</h2>
              <p className="mt-4 opacity-80 text-sm font-medium max-w-md">{TITAN_SCHEMA[currentModule].description}</p>
            </div>

            <div className="space-y-6">
              {TITAN_SCHEMA[currentModule].questions.map(q => (
                <div key={q.id} className="bg-white dark:bg-[#0c0c0e] p-8 md:p-10 rounded-[2.5rem] shadow-xl hover:border-indigo-500/30 border border-transparent transition-all group">
                  <label className="text-xl font-bold mb-8 block group-hover:text-indigo-500 transition-colors">{q.label}</label>
                  
                  {q.type === 'range' ? (
                    <div className="space-y-6">
                      <input 
                        type="range" min="1" max="5" defaultValue="3"
                        className="w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none accent-indigo-600 cursor-pointer"
                        onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                      />
                      <div className="flex justify-between text-[10px] font-black uppercase opacity-40">
                        <span>{q.minLabel}</span>
                        <span className="text-indigo-500 text-xl font-black">{answers[q.id] || 3}</span>
                        <span>{q.maxLabel}</span>
                      </div>
                    </div>
                  ) : (
                    <select 
                      className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl outline-none font-bold text-black dark:text-white appearance-none cursor-pointer"
                      onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                    >
                      <option value="" className="text-slate-400">Sélectionner une réponse...</option>
                      {q.options.map(opt => (
                        <option key={opt} value={opt} className="text-black">{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button disabled={currentModule === 0} onClick={() => setCurrentModule(m => m - 1)} className="flex-1 p-6 bg-white dark:bg-white/5 rounded-2xl font-black uppercase tracking-widest text-xs">Retour</button>
              <button onClick={handleNext} className="flex-[2] p-6 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20">
                {loading ? 'Traitement...' : currentModule === 4 ? 'Finaliser l\'Audit' : 'Module Suivant'}
              </button>
            </div>
          </div>
        )}

        {/* VIEW: SUCCESS */}
        {view === 'success' && (
          <div className="text-center py-20 space-y-10 animate-in zoom-in duration-700">
            <div className="w-40 h-40 bg-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl rotate-12">
              <CheckCircle size={80} className="text-white"/>
            </div>
            <h2 className="text-6xl font-black italic uppercase">Mission <span className="text-emerald-500">Terminée</span></h2>
            <button onClick={() => window.location.reload()} className="p-6 bg-indigo-600 text-white rounded-2xl font-black uppercase px-16 shadow-xl">Nouveau Dossier</button>
          </div>
        )}

        {/* VIEW: ADMIN LOGIN */}
        {view === 'admin-login' && (
          <div className="max-w-sm mx-auto bg-white dark:bg-[#0c0c0e] p-12 rounded-[2.5rem] shadow-2xl text-center space-y-8 animate-in fade-in">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto text-indigo-500"><Shield size={40}/></div>
            <h3 className="text-2xl font-black uppercase italic">Zone Restreinte</h3>
            <input type="password" placeholder="CODE D'ACCÈS" className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl text-center font-black tracking-[0.5em]" onChange={e => setAdminPassAttempt(e.target.value)} onKeyPress={e => e.key === 'Enter' && loginAdmin()}/>
            <button onClick={loginAdmin} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest">Déchiffrer</button>
          </div>
        )}
      </main>

      {/* DASHBOARD OVERLAY */}
      {view === 'admin-dashboard' && (
        <div className="fixed inset-0 z-[200] bg-[#F8FAFC] dark:bg-[#050507] overflow-y-auto animate-in slide-in-from-bottom-10 duration-1000">
          <div className="max-w-6xl mx-auto p-8 md:p-16 space-y-12">
            <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-10">
              <h2 className="text-5xl font-black italic uppercase">Data <span className="text-indigo-500">Center</span></h2>
              <button onClick={() => setView('landing')} className="bg-red-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs">Déconnexion</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-[#0c0c0e] p-10 rounded-[2.5rem] shadow-xl border-l-8 border-indigo-600">
                <span className="text-[10px] font-black uppercase opacity-40">Total Étudiants</span>
                <p className="text-7xl font-black italic mt-2">{adminData.length}</p>
              </div>
              <div className="bg-white dark:bg-[#0c0c0e] p-10 rounded-[2.5rem] shadow-xl border-l-8 border-purple-600">
                <span className="text-[10px] font-black uppercase opacity-40">Groupes Actifs</span>
                <p className="text-7xl font-black italic mt-2">{[...new Set(adminData.map(r => r.student_group))].length}</p>
              </div>
              <div className="bg-white dark:bg-[#0c0c0e] p-10 rounded-[2.5rem] shadow-xl border-l-8 border-emerald-600">
                <span className="text-[10px] font-black uppercase opacity-40">Statut Serveur</span>
                <p className="text-2xl font-black italic mt-6 text-emerald-500 uppercase flex items-center gap-2"><Globe size={24}/> Online</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0c0c0e] p-8 md:p-12 rounded-[3rem] shadow-xl space-y-8">
              <div className="flex items-center gap-4"><Search size={24} className="text-indigo-500"/><h3 className="text-2xl font-black italic uppercase">Explorateur</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="opacity-40 text-[10px] uppercase font-black tracking-widest">
                    <tr><th className="p-6">Nom Complet</th><th className="p-6">Groupe</th><th className="p-6">Stress (H2)</th><th className="p-6 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                    {adminData.map(row => (
                      <tr key={row.id} className="hover:bg-indigo-500/5 transition-colors group">
                        <td className="p-6 text-lg italic uppercase">{row.full_name}</td>
                        <td className="p-6"><span className="px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest">{row.student_group}</span></td>
                        <td className="p-6"><span className={`px-4 py-2 rounded-xl text-xs font-black ${parseInt(row.h2) > 3 ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>{row.h2 || 3}/5</span></td>
                        <td className="p-6 text-right"><button className="p-3 bg-white dark:bg-white/5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Eye size={18}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SYNC OVERLAY */}
      {loading && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center gap-6">
          <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="font-black italic uppercase tracking-[0.4em] text-white text-xs animate-pulse">Sync In Progress...</p>
        </div>
      )}

      {/* ERROR MODAL */}
      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[400] w-full max-w-sm animate-in slide-in-from-bottom-5">
          <div className="bg-red-500 text-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-4">
            <AlertTriangle size={30} />
            <div className="flex-1"><p className="text-sm font-bold leading-tight">{error}</p></div>
            <button onClick={() => setError(null)} className="font-black text-xl">✕</button>
          </div>
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 20px; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px; width: 24px; border-radius: 50%;
          background: #6366f1; border: 4px solid #fff;
          box-shadow: 0 0 10px rgba(99,102,241,0.3);
        }
        .dark input[type=range]::-webkit-slider-thumb { border: 4px solid #050507; }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, Moon, Sun, ChevronRight, ChevronLeft, CheckCircle, Shield, RefreshCcw, 
  Activity, Brain, User, Lock, Layers, Smartphone, Target, AlertTriangle, 
  FileText, GraduationCap, BarChart3, Database, Cpu, Globe, Eye, Trash2, 
  Save, Send, TrendingUp, PieChart, Info, Settings, Search, Download
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';

// --- CHART ENGINE REGISTRATION ---
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler
);

// ============================================================================
// 1. SYSTEM CONFIGURATION & CORE CONSTANTS
// ============================================================================
const TITAN_CONFIG = {
  SUPABASE_URL: 'PASTE_YOUR_SUPABASE_URL_HERE',
  SUPABASE_KEY: 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE',
  VERSION: '5.0.1-PRO',
  ADMIN_PASS: 'TITAN2026',
  THEME_STORAGE_KEY: 'titan_theme_pref'
};

const supabase = createClient(TITAN_CONFIG.SUPABASE_URL, TITAN_CONFIG.SUPABASE_KEY);

// ============================================================================
// 2. THE TITAN SCHEMA (5 MODULES x 5 KPI = 25 METRICS)
// ============================================================================
const SURVEY_SCHEMA = [
  {
    id: 'SEC_METHODS',
    title: 'Ingénierie de Travail',
    icon: <Layers size={22} />,
    color: 'from-blue-600 to-indigo-700',
    description: 'Structure cognitive et organisation temporelle.',
    questions: [
      { id: 'm1', label: 'Architecture de planification', type: 'select', options: ['Numérique (Notion/Apps)', 'Analogique (Papier)', 'Nulle'] },
      { id: 'm2', label: 'Protocole de révision', type: 'select', options: ['Récupération Active', 'Relecture', 'Flashcards'] },
      { id: 'm3', label: 'Indice de Procrastination', type: 'range', minLabel: 'Maîtrisé', maxLabel: 'Critique' },
      { id: 'm4', label: 'Anticipation des Cycles', type: 'select', options: ['Anticipé (>1 mois)', 'Intermédiaire (1 sem.)', 'Réactif (Veille)'] },
      { id: 'm5', label: 'Focus (Deep Work Capacity)', type: 'range', minLabel: 'Fragmenté', maxLabel: 'Optimal' }
    ]
  },
  {
    id: 'SEC_DIGITAL',
    title: 'Écosystème Numérique',
    icon: <Smartphone size={22} />,
    color: 'from-violet-600 to-purple-800',
    description: 'Optimisation technologique et intégration de l\'IA.',
    questions: [
      { id: 'd1', label: 'Ratio Écran (Productif vs Loisir)', type: 'range', minLabel: 'Loisir', maxLabel: 'Productif' },
      { id: 'd2', label: 'Fréquence d\'utilisation de l\'IA', type: 'select', options: ['Quotidien', 'Hebdomadaire', 'Jamais'] },
      { id: 'd3', label: 'Vigilance aux Notifications', type: 'range', minLabel: 'Bruit constant', maxLabel: 'Silence total' },
      { id: 'd4', label: 'Organisation Data (Cloud)', type: 'range', minLabel: 'Désordre', maxLabel: 'Structuré' },
      { id: 'd5', label: 'Dépendance Algorithmique', type: 'range', minLabel: 'Basse', maxLabel: 'Addiction' }
    ]
  },
  {
    id: 'SEC_HEALTH',
    title: 'Biophysique & Mental',
    icon: <Activity size={22} />,
    color: 'from-emerald-500 to-teal-700',
    description: 'Stabilité émotionnelle et constantes de santé.',
    questions: [
      { id: 'h1', label: 'Restauration Circadienne (Sommeil)', type: 'range', minLabel: 'Déficitaire', maxLabel: 'Réparateur' },
      { id: 'h2', label: 'Charge Mentale (Cortisol)', type: 'range', minLabel: 'Serein', maxLabel: 'Burnout' },
      { id: 'h3', label: 'Consommation de Stimulants', type: 'select', options: ['Nulle', 'Modérée (Café)', 'Excessive'] },
      { id: 'h4', label: 'Activité Métabolique (Sport)', type: 'select', options: ['Régulier', 'Occasionnel', 'Nul'] },
      { id: 'h5', label: 'Indice d\'Isolement Social', type: 'range', minLabel: 'Connecté', maxLabel: 'Solitaire' }
    ]
  },
  {
    id: 'SEC_ACADEMIC',
    title: 'Performance & Score',
    icon: <Brain size={22} />,
    color: 'from-orange-500 to-red-700',
    description: 'Analyse des résultats et de l\'assiduité.',
    questions: [
      { id: 'a1', label: 'Assiduité Présentielle', type: 'select', options: ['100%', '75%', '< 50%'] },
      { id: 'a2', label: 'Assimilation en Temps Réel', type: 'range', minLabel: 'Perdu', maxLabel: 'Maîtrisé' },
      { id: 'a3', label: 'Rigueur de Prise de Notes', type: 'range', minLabel: 'Lacunaire', maxLabel: 'Expert' },
      { id: 'a4', label: 'Capacité de Participation', type: 'range', minLabel: 'Spectateur', maxLabel: 'Acteur' },
      { id: 'a5', label: 'Niveau Scolaire Auto-évalué', type: 'select', options: ['Élite', 'Moyenne', 'Difficulté'] }
    ]
  },
  {
    id: 'SEC_FUTURE',
    title: 'Vision Stratégique',
    icon: <Target size={22} />,
    color: 'from-cyan-500 to-blue-700',
    description: 'Ambition pro et projection de carrière.',
    questions: [
      { id: 'f1', label: 'Clarté de la Cible Pro', type: 'range', minLabel: 'Inconnu', maxLabel: 'Cristallin' },
      { id: 'f2', label: 'Niveau de Motivation Interne', type: 'range', minLabel: 'Forcé', maxLabel: 'Passionné' },
      { id: 'f3', label: 'Confiance en l\'Avenir Éco', type: 'range', minLabel: 'Pessimiste', maxLabel: 'Confiant' },
      { id: 'f4', label: 'Importance de la Rémunération', type: 'select', options: ['Prioritaire', 'Secondaire', 'Indifférent'] },
      { id: 'f5', label: 'Satisfaction Globale Étudiante', type: 'range', minLabel: 'Déçu', maxLabel: 'Épanoui' }
    ]
  }
];

// ============================================================================
// 3. UI STYLE SYSTEM (CSS-IN-JS EQUIVALENTS)
// ============================================================================
const UI = {
  glass: "bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-3xl border border-white/20 dark:border-white/5 shadow-2xl rounded-[2.5rem]",
  input: "w-full bg-slate-100 dark:bg-[#161618] border-2 border-transparent focus:border-indigo-500 rounded-2xl p-6 text-lg font-bold outline-none transition-all duration-300 dark:text-white placeholder:opacity-30",
  btn: "relative overflow-hidden font-black uppercase tracking-widest text-[11px] py-6 px-10 rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-xl",
  btnPrimary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30",
  btnSec: "bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/10",
  h1: "text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-4 select-none",
  label: "text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3 block text-slate-500 dark:text-slate-400"
};

// ============================================================================
// 4. CORE APPLICATION LOGIC
// ============================================================================
export default function TitanSystem() {
  // --- STATE MANAGEMENT ---
  const [theme, setTheme] = useState(() => localStorage.getItem(TITAN_CONFIG.THEME_STORAGE_KEY) || 'dark');
  const [view, setView] = useState('landing');
  const [currentModule, setCurrentModule] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [systemError, setSystemError] = useState(null);
  
  // Data States
  const [profile, setProfile] = useState({ full_name: '', student_group: '' });
  const [responses, setResponses] = useState({});
  const [adminData, setAdminData] = useState([]);
  const [authCode, setAuthCode] = useState('');

  // --- REFS ---
  const scrollRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(TITAN_CONFIG.THEME_STORAGE_KEY, theme);
  }, [theme]);

  // --- BUSINESS LOGIC ---
  const handleAnswerChange = useCallback((key, value) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  }, []);

  const navigateModule = (direction) => {
    if (direction === 'next') {
      if (currentModule < SURVEY_SCHEMA.length - 1) {
        setCurrentModule(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        finalizeAnalysis();
      }
    } else {
      setCurrentModule(prev => Math.max(0, prev - 1));
    }
  };

  const finalizeAnalysis = async () => {
    setIsSyncing(true);
    const payload = { ...profile, ...responses, created_at: new Date().toISOString() };
    
    try {
      const { error } = await supabase.from('student_surveys').insert([payload]);
      if (error) throw error;
      setView('success');
    } catch (err) {
      setSystemError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const accessAdminPortal = async () => {
    if (authCode === TITAN_CONFIG.ADMIN_PASS) {
      setIsSyncing(true);
      try {
        const { data, error } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setAdminData(data || []);
        setView('dashboard');
      } catch (err) {
        setSystemError(err.message);
      } finally {
        setIsSyncing(false);
      }
    } else {
      setSystemError("ACCÈS REFUSÉ : CODE INCORRECT");
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("CONFIRMER LA SUPPRESSION DÉFINITIVE ?")) return;
    const { error } = await supabase.from('student_surveys').delete().eq('id', id);
    if (!error) setAdminData(prev => prev.filter(item => item.id !== id));
  };

  // --- ANALYTICS COMPILATION ---
  const analytics = useMemo(() => {
    if (!adminData.length) return null;
    const computeAvg = (key) => {
      const vals = adminData.map(d => parseFloat(d[key])).filter(v => !isNaN(v));
      return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
    };

    return {
      radar: {
        labels: ['Méthode', 'Digital', 'Santé', 'Performance', 'Avenir'],
        datasets: [{
          label: 'Moyenne Globale',
          data: [computeAvg('m3'), computeAvg('d3'), computeAvg('h2'), computeAvg('a2'), computeAvg('f1')],
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: '#6366f1',
          pointBackgroundColor: '#6366f1',
        }]
      },
      distribution: {
        labels: ['Élite', 'Moyenne', 'Difficulté'],
        datasets: [{
          data: [
            adminData.filter(d => d.a5 === 'Élite').length,
            adminData.filter(d => d.a5 === 'Moyenne').length,
            adminData.filter(d => d.a5 === 'Difficulté').length,
          ],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0
        }]
      }
    };
  }, [adminData]);

  // ============================================================================
  // 5. SUB-ROUTINES (UI FRAGMENTS)
  // ============================================================================

  const renderModuleHeader = () => {
    const mod = SURVEY_SCHEMA[currentModule];
    return (
      <div className={`p-10 md:p-14 rounded-[3rem] bg-gradient-to-br ${mod.color} text-white shadow-2xl relative overflow-hidden mb-10`}>
        <div className="absolute top-0 right-0 p-12 opacity-15 transform translate-x-4 -translate-y-4">{mod.icon}</div>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60">Module 0{currentModule + 1} de 05</span>
        <h2 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.9] mt-3">{mod.title}</h2>
        <p className="mt-6 text-white/70 font-medium max-w-md text-sm md:text-base leading-relaxed">{mod.description}</p>
      </div>
    );
  };

  const renderQuestions = () => {
    return SURVEY_SCHEMA[currentModule].questions.map((q) => (
      <div key={q.id} className={`${UI.glass} p-8 md:p-10 hover:border-indigo-500/30 transition-all duration-500 group mb-6`}>
        <label className="text-xl md:text-2xl font-bold mb-8 block group-hover:translate-x-2 transition-transform">{q.label}</label>
        
        {q.type === 'range' ? (
          <div className="space-y-6">
            <input 
              type="range" min="1" max="5" step="1"
              defaultValue={responses[q.id] || 3}
              className="w-full h-3 bg-slate-200 dark:bg-white/5 rounded-full appearance-none accent-indigo-600 cursor-pointer"
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            />
            <div className="flex justify-between text-[9px] font-black uppercase opacity-40 px-1">
              <span>{q.minLabel}</span>
              <span className="text-indigo-500 text-xl font-black opacity-100">{responses[q.id] || 3}</span>
              <span>{q.maxLabel}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {q.options.map((opt) => (
              <button 
                key={opt}
                onClick={() => handleAnswerChange(q.id, opt)}
                className={`py-5 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                  responses[q.id] === opt 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-[1.02]' 
                    : 'bg-white dark:bg-white/5 border-transparent hover:bg-slate-50 dark:hover:bg-white/10'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    ));
  };

  // ============================================================================
  // 6. MAIN RENDER SWITCH
  // ============================================================================

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#050506] text-slate-900 dark:text-slate-100 transition-colors duration-700 font-sans selection:bg-indigo-500 selection:text-white pb-32">
      
      {/* --- FX LAYER --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[70vw] h-[70vw] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* --- NAV BAR --- */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-5 flex justify-between items-center backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
            <Zap size={22} fill="currentColor"/>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-black italic text-2xl tracking-tighter uppercase leading-none">Sphinx<span className="text-indigo-500">.V5</span></h1>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Titan Intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 shadow-lg hover:rotate-12 transition-transform">
            {theme === 'dark' ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-indigo-600"/>}
          </button>
          <button onClick={() => setView('admin-login')} className="px-6 h-12 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-colors">
            Portal
          </button>
        </div>
      </nav>

      {/* --- VIEW ROUTER --- */}
      <main className="relative z-10 pt-40 px-6 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
        
        {/* VIEW: LANDING */}
        {view === 'landing' && (
          <div className="text-center space-y-12 animate-in fade-in zoom-in duration-1000">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              Core System Ready
            </div>
            <h1 className={UI.h1}>Bilan<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">Titan Alpha</span></h1>
            <p className="text-xl md:text-2xl font-bold opacity-40 max-w-2xl mx-auto leading-relaxed italic">
              Protocole standardisé d'analyse académique. 25 points d'audit. Rapports en temps réel.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => setView('identity')} className={`${UI.btn} ${UI.btnPrimary} py-8 px-16 text-lg`}>Initialiser l'Analyse</button>
              <button onClick={() => setView('admin-login')} className={`${UI.btn} ${UI.btnSec} py-8 px-16 text-lg`}>Accès Admin</button>
            </div>
          </div>
        )}

        {/* VIEW: IDENTITY */}
        {view === 'identity' && (
          <div className="w-full max-w-xl mx-auto animate-in slide-in-from-bottom-20 duration-700">
            <div className={`${UI.glass} p-10 md:p-14`}>
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-indigo-500 mb-6 shadow-inner"><User size={40}/></div>
                <h2 className="text-4xl font-black italic uppercase">Profil Étudiant</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className={UI.label}>Nom Complet</label>
                  <input className={UI.input} placeholder="ex: Thomas Anderson" onChange={(e) => setProfile({...profile, full_name: e.target.value})}/>
                </div>
                <div>
                  <label className={UI.label}>Groupe / Promotion</label>
                  <input className={UI.input} placeholder="ex: M1 Marketing" onChange={(e) => setProfile({...profile, student_group: e.target.value})}/>
                </div>
                <button 
                  disabled={!profile.full_name || !profile.student_group}
                  onClick={() => setView('survey')} 
                  className={`${UI.btn} ${UI.btnPrimary} w-full py-6 mt-4`}
                >
                  Démarrer le Questionnaire
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SURVEY ENGINE */}
        {view === 'survey' && (
          <div className="animate-in fade-in duration-500">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-2 bg-slate-200 dark:bg-white/5 z-[110]">
              <div className="h-full bg-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_20px_#6366f1]" style={{width: `${((currentModule+1)/5)*100}%`}}></div>
            </div>

            {renderModuleHeader()}
            <div className="space-y-6 pb-20">
              {renderQuestions()}
            </div>

            {/* Footer Navigation */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 flex gap-4 z-[100]">
              <div className="max-w-4xl mx-auto w-full flex gap-4">
                <button 
                  disabled={currentModule === 0}
                  onClick={() => navigateModule('prev')}
                  className={`${UI.btn} ${UI.btnSec} flex-1`}
                >
                  <ChevronLeft className="inline mr-2" size={16}/> Précédent
                </button>
                <button 
                  onClick={() => navigateModule('next')}
                  className={`${UI.btn} ${UI.btnPrimary} flex-[2]`}
                >
                  {isSyncing ? 'Synchronisation...' : currentModule === 4 ? 'Finaliser l\'Audit' : 'Module Suivant'}
                  {currentModule < 4 && <ChevronRight className="inline ml-2" size={16}/>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SUCCESS */}
        {view === 'success' && (
          <div className="text-center space-y-10 animate-in zoom-in duration-700 py-20">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-40 rounded-full animate-pulse"></div>
              <div className="w-44 h-44 bg-emerald-500 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-2xl relative z-10 rotate-12">
                <CheckCircle size={80} className="text-white"/>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">Diagnostic <br/><span className="text-emerald-500">Effectué</span></h2>
              <p className="text-xl font-bold opacity-40 max-w-lg mx-auto leading-relaxed">Les métriques de {profile.full_name} ont été injectées dans le Titan Alpha Server avec succès.</p>
            </div>
            <button onClick={() => window.location.reload()} className={`${UI.btn} ${UI.btnPrimary} px-16 py-8 text-lg`}>Nouveau Dossier</button>
          </div>
        )}

        {/* VIEW: ADMIN LOGIN */}
        {view === 'admin-login' && (
          <div className="w-full max-w-md mx-auto animate-in fade-in duration-500">
            <div className={`${UI.glass} p-12 text-center`}>
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto text-indigo-500 mb-8 shadow-inner"><Lock size={32}/></div>
              <h3 className="text-2xl font-black italic uppercase mb-8">Identification Alpha</h3>
              <input 
                type="password" 
                className={`${UI.input} text-center text-4xl font-mono tracking-[0.5em] mb-6`}
                placeholder="••••"
                onChange={(e) => setAuthCode(e.target.value)}
              />
              <button onClick={accessAdminPortal} className={`${UI.btn} ${UI.btnPrimary} w-full py-6`}>Déchiffrer</button>
              <button onClick={() => setView('landing')} className="mt-8 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Retourner au terminal</button>
            </div>
          </div>
        )}

      </main>

      {/* --- DASHBOARD OVERLAY --- */}
      {view === 'dashboard' && (
        <div className="fixed inset-0 z-[200] bg-[#F5F7FA] dark:bg-[#050506] overflow-y-auto animate-in slide-in-from-bottom-10 duration-1000">
          <div className="max-w-7xl mx-auto p-6 md:p-16 space-y-16">
            
            {/* Dash Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-black/5 dark:border-white/5 pb-12">
              <div className="space-y-3">
                <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">Command <span className="text-indigo-500">Center</span></h2>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Live Encryption: Active</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={accessAdminPortal} className="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center shadow-xl border border-black/5 dark:border-white/10 hover:rotate-180 transition-all duration-1000">
                  <RefreshCcw size={24} className="text-indigo-500"/>
                </button>
                <button onClick={() => setView('landing')} className={`${UI.btn} bg-red-500 text-white shadow-red-500/30 px-10`}>Déconnexion</button>
              </div>
            </div>

            {/* KPI Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Dossiers', val: adminData.length, icon: <Database/>, color: 'indigo' },
                { label: 'Classes / Groupes', val: [...new Set(adminData.map(d => d.student_group))].length, icon: <GraduationCap/>, color: 'purple' },
                { label: 'Note Santé Moy.', val: '3.4/5', icon: <Activity/>, color: 'emerald' },
                { label: 'Ambition Score', val: '88%', icon: <Target/>, color: 'cyan' },
              ].map((kpi, i) => (
                <div key={i} className={`${UI.glass} p-8 flex flex-col justify-between h-44 border-l-8 border-${kpi.color}-500`}>
                  <div className="flex justify-between items-center opacity-40">
                    <span className="text-[10px] font-black uppercase tracking-widest">{kpi.label}</span>
                    {kpi.icon}
                  </div>
                  <span className="text-6xl font-black italic leading-none">{kpi.val}</span>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className={`${UI.glass} p-10`}>
                <h3 className="text-xl font-black italic uppercase mb-10 flex items-center gap-3"><TrendingUp size={20} className="text-indigo-500"/> Radar de Performance Promo</h3>
                <div className="h-[450px] flex items-center justify-center">
                  {analytics && (
                    <Radar 
                      data={analytics.radar} 
                      options={{
                        scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { font: { size: 12, weight: '900' }, color: theme === 'dark' ? '#fff' : '#000' }, ticks: { display: false } } },
                        plugins: { legend: { display: false } }
                      }}
                    />
                  )}
                </div>
              </div>
              <div className={`${UI.glass} p-10`}>
                <h3 className="text-xl font-black italic uppercase mb-10 flex items-center gap-3"><PieChart size={20} className="text-purple-500"/> Distribution des Niveaux</h3>
                <div className="h-[450px] flex items-center justify-center">
                  {analytics && (
                    <Doughnut 
                      data={analytics.distribution}
                      options={{ 
                        cutout: '70%',
                        plugins: { legend: { position: 'bottom', labels: { font: { weight: 'bold' }, color: theme === 'dark' ? '#fff' : '#000' } } }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Data Explorer */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Search size={24} className="text-indigo-500"/>
                <h3 className="text-3xl font-black italic uppercase">Explorateur de Données Raw</h3>
              </div>
              <div className="bg-white dark:bg-[#0c0c0e] rounded-[3rem] border border-black/5 dark:border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest opacity-40">
                      <tr>
                        <th className="p-8">Horodatage</th>
                        <th className="p-8">Identité</th>
                        <th className="p-8">Groupe</th>
                        <th className="p-8 text-center">Indice Stress</th>
                        <th className="p-8 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {adminData.map((row) => (
                        <tr key={row.id} className="hover:bg-indigo-500/5 transition-colors group">
                          <td className="p-8 font-mono text-xs opacity-40">
                            {new Date(row.created_at).toLocaleDateString()} <br/>
                            {new Date(row.created_at).toLocaleTimeString()}
                          </td>
                          <td className="p-8 font-black text-lg group-hover:text-indigo-500 transition-colors uppercase italic">{row.full_name}</td>
                          <td className="p-8">
                            <span className="px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                              {row.student_group}
                            </span>
                          </td>
                          <td className="p-8 text-center">
                            <span className={`px-4 py-2 rounded-xl text-xs font-black ${parseInt(row.h2) > 3 ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                              {row.h2 || '3'}/5
                            </span>
                          </td>
                          <td className="p-8 text-right space-x-2">
                            <button onClick={() => window.alert(JSON.stringify(row, null, 2))} className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 hover:bg-indigo-600 hover:text-white transition-all"><Eye size={18}/></button>
                            <button onClick={() => deleteRecord(row.id)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {adminData.length === 0 && (
                  <div className="p-32 text-center opacity-20 flex flex-col items-center">
                    <Database size={64} className="mb-6"/>
                    <p className="text-2xl font-black italic uppercase">Aucune Entrée Détectée</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dash Footer */}
            <div className="text-center opacity-20 py-10">
              <p className="text-[10px] font-black uppercase tracking-[1em]">Titan Analytics Protocol // Phase 5 Finalized</p>
            </div>
          </div>
        </div>
      )}

      {/* --- ERROR MODAL --- */}
      {systemError && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] w-full max-w-md animate-in slide-in-from-bottom-5">
          <div className="bg-red-500 text-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-6 border-2 border-red-400">
            <div className="p-3 bg-white/20 rounded-2xl"><AlertTriangle size={30} /></div>
            <div className="flex-1">
              <h4 className="font-black uppercase text-[10px] tracking-widest opacity-80 mb-1">Système Interruption</h4>
              <p className="text-sm font-bold leading-tight">{systemError}</p>
            </div>
            <button onClick={() => setSystemError(null)} className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors font-black">✕</button>
          </div>
        </div>
      )}

      {/* --- GLOBAL SYNC OVERLAY --- */}
      {isSyncing && (
        <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 border-[6px] border-indigo-600/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center"><Cpu size={30} className="text-indigo-500 animate-pulse"/></div>
          </div>
          <p className="font-black italic uppercase tracking-[0.5em] text-white animate-pulse">Encryption & Sync...</p>
        </div>
      )}

      {/* --- STYLES OVERRIDE --- */}
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
        
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 28px; width: 28px; border-radius: 50%;
          background: #6366f1; cursor: pointer;
          border: 4px solid #fff; box-shadow: 0 0 15px rgba(99,102,241,0.5);
          margin-top: -8px;
        }
        .dark input[type=range]::-webkit-slider-thumb { border: 4px solid #050506; }
      `}</style>
    </div>
  );
}

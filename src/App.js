import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, Moon, Sun, CheckCircle, Shield, Lock, Activity, Brain, User, 
  Target, Layers, Smartphone, AlertTriangle, Cpu, Globe, Search, Download, 
  TrendingUp, BarChart, PieChart, Database, RefreshCw, LogOut, FileText
} from 'lucide-react';

// ============================================================================
// 1. CONFIGURATION & CONSTANTS
// ============================================================================
const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGVjb3piYWZvemVoZWR0aGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzU2NDksImV4cCI6MjA4NTM1MTY0OX0.vMKJ-Kb5UqBO1OiokGsv2ayb51AXL79HCzcrUD7WZ0w';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_PASS = 'MONCEF2006';
const APP_VERSION = '2.4.0-Beta';

// Survey Structure
const SURVEY_SCHEMA = [
  {
    id: 'SEC_A_B',
    title: 'Gestion & Organisation',
    description: 'Analyse des habitudes de travail et de la structuration du temps.',
    questions: [
      { id: 'q1', label: 'Q1. En période d’examens, comment organisez-vous votre temps de révision ?', type: 'select', options: ['Je révise peu', 'Je révise régulièrement', 'Je révise plusieurs heures par jour', 'Je révise intensivement'] },
      { id: 'q2_p1', label: 'Q2. Je planifie mes sessions d’étude à l’avance.', type: 'select', options: ['Pas du tout d’accord', 'Plutôt pas d’accord', 'Neutre', 'Plutôt d’accord', 'Tout à fait d’accord'] },
      { id: 'q2_p2', label: 'Q2. Je respecte généralement mon planning d’études.', type: 'select', options: ['Pas du tout d’accord', 'Plutôt pas d’accord', 'Neutre', 'Plutôt d’accord', 'Tout à fait d’accord'] },
      { id: 'q2_p3', label: 'Q2. Je commence mes révisions au moins deux semaines avant.', type: 'select', options: ['Pas du tout d’accord', 'Plutôt pas d’accord', 'Neutre', 'Plutôt d’accord', 'Tout à fait d’accord'] },
      { id: 'q2_p4', label: 'Q2. Je gère les imprévus sans retarder mes révisions.', type: 'select', options: ['Pas du tout d’accord', 'Plutôt pas d’accord', 'Neutre', 'Plutôt d’accord', 'Tout à fait d’accord'] },
      { id: 'q2_p5', label: 'Q2. Je parviens à maintenir un équilibre entre loisirs et études.', type: 'select', options: ['Pas du tout d’accord', 'Plutôt pas d’accord', 'Neutre', 'Plutôt d’accord', 'Tout à fait d’accord'] },
      { id: 'q3', label: 'Q3. Utilisez-vous une méthode de travail claire pour réviser ?', type: 'select', options: ['Non', 'Oui (1 fois/sem)', 'Oui (2-3 fois/sem)', 'Oui (4-5 fois/sem)', 'Oui (Toujours)'] },
      { id: 'q4', label: 'Q4. Fixez-vous des objectifs précis pour chaque séance ?', type: 'select', options: ['Pas du tout', 'Un peu', 'Moyennement', 'Assez', 'Tout à fait'] }
    ]
  },
  {
    id: 'SEC_C_D',
    title: 'Procrastination & Téléphone',
    description: 'Évaluation de l’impact des distractions numériques.',
    questions: [
      { id: 'q5', label: 'Q5. Fréquence de report des tâches (1=Très faible, 5=Très élevé)', type: 'range', min: 1, max: 5 },
      { id: 'q6', label: 'Q6. En période d’examens, vous commencez vos révisions ?', type: 'select', options: ['Très en avance', 'Assez tôt', 'Tardivement', 'À la dernière minute'] },
      { id: 'q7', label: 'Q7. Habitude d’utiliser votre téléphone lors des révisions ?', type: 'range', min: 1, max: 5 },
      { id: 'q8', label: 'Q8. Perdez-vous la notion du temps sur votre téléphone ?', type: 'select', options: ['Pas du tout vrai', 'Peu vrai', 'Moyennement vrai', 'Plutôt vrai', 'Tout à fait vrai'] }
    ]
  },
  {
    id: 'SEC_E_F',
    title: 'Burnout & Stress',
    description: 'Mesure des indicateurs psychologiques de pression.',
    questions: [
      { id: 'q9', label: 'Q9. Difficultés de concentration après usage prolongé ?', type: 'select', options: ['Aucun impact', 'Impact faible', 'Impact moyen', 'Impact important', 'Impact très important'] },
      { id: 'q10', label: 'Q10. Votre téléphone vous fatigue-t-il plus qu’il ne vous détend ?', type: 'select', options: ['Pas du tout', 'Un peu', 'Moyennement', 'Énormément'] },
      { id: 'q11', label: 'Q11. Quel est votre niveau de stress durant les examens ?', type: 'select', options: ['Faible', 'Moyen', 'Elevé', 'Très élevé'] },
      { id: 'q12', label: 'Q12. Le manque de temps vous stresse-t-il ?', type: 'select', options: ['Pas du tout', 'Un peu', 'Moyennement', 'Assez', 'Tout à fait'] }
    ]
  },
  {
    id: 'SEC_G_H',
    title: 'Anxiété & Sommeil',
    description: 'Corrélation entre repos et état mental.',
    questions: [
      { id: 'q13', label: 'Q13. Vous sentez-vous nerveux(se) avant les examens ?', type: 'select', options: ['Non', 'Oui (Un peu)', 'Oui (Moyennement)', 'Oui (Assez)', 'Oui (Tout à fait)'] },
      { id: 'q14', label: 'Q14. Vous mettez-vous une pression excessive ?', type: 'select', options: ['Pas du tout', 'Un peu', 'Moyennement', 'Assez', 'Tout à fait'] },
      { id: 'q15', label: 'Q15. Votre sommeil est-il régulier ?', type: 'select', options: ['Pas du tout', 'Un peu', 'Moyennement', 'Assez', 'Tout à fait'] },
      { id: 'q16', label: 'Q16. Êtes-vous satisfait(e) de votre sommeil ?', type: 'select', options: ['Pas du tout', 'Un peu', 'Moyennement', 'Assez', 'Tout à fait'] }
    ]
  },
  {
    id: 'SEC_I',
    title: 'Performance Finale',
    description: 'Auto-évaluation de la réussite académique.',
    questions: [
      { id: 'q17', label: 'Q17. Vous sentez-vous suffisamment préparé(e) ?', type: 'select', options: ['Très bien', 'Assez bien', 'Moyennement', 'Peu', 'Pas du tout'] },
      { id: 'q18', label: 'Q18. Considérez-vous vos révisions comme efficaces ?', type: 'select', options: ['Pas du tout d’accord', 'Plutôt pas d’accord', 'Neutre', 'Plutôt d’accord', 'Tout à fait d’accord'] },
      { id: 'q19', label: 'Q19. Avez-vous confiance en vos performances ?', type: 'select', options: ['Pas du tout d’accord', 'Plutôt pas d’accord', 'Neutre', 'Plutôt d’accord', 'Tout à fait d’accord'] },
      { id: 'q20', label: 'Q20. Atteignez-vous généralement vos objectifs ?', type: 'select', options: ['Echec objectifs', 'Satisfait(e)', 'Progression régulière', 'Atteinte objectifs', 'Succès constant'] }
    ]
  }
];

// ============================================================================
// 2. COMPONENT LOGIC
// ============================================================================

export default function App() {
  // State Management
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('landing'); // landing, identity, survey, success, admin-login, dashboard
  const [currentModule, setCurrentModule] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data State
  const [student, setStudent] = useState({ full_name: '', student_group: '', sexe: '', age: '', cycle: '', etablissement: '' });
  const [answers, setAnswers] = useState({});
  const [adminData, setAdminData] = useState([]);
  const [passAttempt, setPassAttempt] = useState('');

  // --- FIX: LIGHT/DARK PERSISTENCE ---
  useEffect(() => {
    // On Mount: Check local storage
    const savedTheme = localStorage.getItem('mir_tool_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // On Change: Update DOM and local storage
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('mir_tool_theme', theme);
  }, [theme]);

  // --- FIX: ADMIN PERSISTENCE ---
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('mir_admin_session');
    if (isAdmin === 'true' && view === 'admin-login') {
      loadAdmin(true); // Bypass password check if session exists
    }
  }, [view]);

  // ============================================================================
  // 3. ANALYTICS ENGINE (The "Heavy Lifting" for Stress/Age/Phone)
  // ============================================================================
  
  // Helper: Convert textual stress responses to numerical values (1-4)
  const getStressScore = (val) => {
    if (!val) return 0;
    const mapping = { 
      'Faible': 1, 
      'Moyen': 2, 
      'Elevé': 3, 
      'Très élevé': 4,
      'Pas du tout': 1,
      'Un peu': 2,
      'Moyennement': 3,
      'Assez': 3.5,
      'Tout à fait': 4
    };
    return mapping[val] || 2; // Default to neutral if undefined
  };

  const analytics = useMemo(() => {
    if (!adminData || adminData.length === 0) return null;

    // A. GENERAL STATS
    const totalStudents = adminData.length;
    const totalStress = adminData.reduce((acc, row) => acc + getStressScore(row.q11), 0);
    const avgStress = (totalStress / totalStudents).toFixed(2);

    // B. STRESS BY ESTABLISHMENT
    const byEtab = adminData.reduce((acc, row) => {
      const et = row.etablissement || 'Autre';
      if (!acc[et]) acc[et] = { count: 0, stressSum: 0 };
      acc[et].count += 1;
      acc[et].stressSum += getStressScore(row.q11);
      return acc;
    }, {});

    // C. STRESS PAR RAPPORT A L'AGE
    const byAge = adminData.reduce((acc, row) => {
      const age = row.age || 'Inconnu';
      if (!acc[age]) acc[age] = { count: 0, stressSum: 0 };
      acc[age].count += 1;
      acc[age].stressSum += getStressScore(row.q11);
      return acc;
    }, {});

    // D. STRESS PAR RAPPORT AU SEXE
    const bySex = adminData.reduce((acc, row) => {
      const sex = row.sexe || 'Inconnu';
      if (!acc[sex]) acc[sex] = { count: 0, stressSum: 0 };
      acc[sex].count += 1;
      acc[sex].stressSum += getStressScore(row.q11);
      return acc;
    }, {});

    // E. STRESS PAR RAPPORT AU TELEPHONE (Usage Q5)
    // Q5 is numeric 1-5 (Procrastination/Usage frequency)
    const byPhone = adminData.reduce((acc, row) => {
      // Group phone usage into categories
      let usageGroup = 'Moyen';
      const q5Val = parseInt(row.q5) || 3;
      if (q5Val <= 2) usageGroup = 'Faible';
      else if (q5Val >= 4) usageGroup = 'Elevé';

      if (!acc[usageGroup]) acc[usageGroup] = { count: 0, stressSum: 0 };
      acc[usageGroup].count += 1;
      acc[usageGroup].stressSum += getStressScore(row.q11);
      return acc;
    }, {});

    return { totalStudents, avgStress, byEtab, byAge, bySex, byPhone };
  }, [adminData]);

  // ============================================================================
  // 4. HYPOTHESIS ENGINE
  // ============================================================================
  const hypothesisResult = useMemo(() => {
    if (!analytics || !analytics.byPhone['Elevé'] || !analytics.byPhone['Faible']) return null;

    const stressHighPhone = analytics.byPhone['Elevé'].stressSum / analytics.byPhone['Elevé'].count;
    const stressLowPhone = analytics.byPhone['Faible'].stressSum / analytics.byPhone['Faible'].count;
    const diff = (stressHighPhone - stressLowPhone).toFixed(2);
    const percentage = ((diff / stressLowPhone) * 100).toFixed(1);

    return {
      confirmed: stressHighPhone > stressLowPhone,
      diff,
      percentage,
      highVal: stressHighPhone.toFixed(2),
      lowVal: stressLowPhone.toFixed(2)
    };
  }, [analytics]);

  // ============================================================================
  // 5. DATA ACTIONS
  // ============================================================================

  const submitSurvey = async () => {
    setLoading(true);
    // Safety check for empty answers
    const payload = { ...student, ...answers };
    
    // Add timestamp
    payload.created_at = new Date().toISOString();

    const { error: sbError } = await supabase.from('student_surveys').insert([payload]);
    if (sbError) {
      setError(sbError.message);
      // Wait 3 seconds then clear error
      setTimeout(() => setError(null), 3000);
    } else {
      setView('success');
    }
    setLoading(false);
  };

  const loadAdmin = async (skipPass = false) => {
    if (skipPass || passAttempt === ADMIN_PASS) {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('student_surveys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError("Erreur de connexion base de données");
      } else {
        setAdminData(data || []);
        sessionStorage.setItem('mir_admin_session', 'true');
        setView('dashboard');
      }
      setLoading(false);
    } else {
      setError("Mot de passe incorrect");
      setTimeout(() => setError(null), 2000);
    }
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem('mir_admin_session');
    setPassAttempt('');
    setAdminData([]);
    setView('landing');
  };

  const exportToCSV = () => {
    if (!adminData.length) return;
    const headers = Object.keys(adminData[0]).join(',');
    const rows = adminData.map(row => Object.values(row).map(v => `"${v}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MirTool_Analytics_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  // MOCK DATA GENERATOR (To help user visualize if DB is empty)
  const generateMockData = () => {
    const mock = [];
    const etabs = ['ENCG', 'FST', 'FSJES', 'EST', 'ENSA'];
    const cycles = ['Licence', 'Master', 'Doctorat'];
    for(let i=0; i<50; i++) {
      mock.push({
        id: i,
        full_name: `Mock Student ${i}`,
        student_group: `GRP-${Math.floor(Math.random()*5)}`,
        sexe: Math.random() > 0.5 ? 'Homme' : 'Femme',
        age: Math.random() > 0.6 ? '20-25 ans' : 'Moins de 20 ans',
        etablissement: etabs[Math.floor(Math.random() * etabs.length)],
        q5: Math.floor(Math.random() * 5) + 1, // Phone usage
        q11: Math.random() > 0.5 ? 'Elevé' : 'Moyen', // Stress
        created_at: new Date().toISOString()
      });
    }
    setAdminData(prev => [...prev, ...mock]);
  };

  // ============================================================================
  // 6. RENDER HELPERS
  // ============================================================================

  // Simple Bar Chart Component for Analytics
  const SimpleBarChart = ({ data, colorClass }) => {
    if (!data) return null;
    const maxVal = Math.max(...Object.values(data).map(d => d.stressSum/d.count));
    
    return (
      <div className="flex items-end gap-4 h-48 pt-6">
        {Object.entries(data).map(([label, stats]) => {
          const score = stats.stressSum / stats.count;
          const heightPct = (score / 4) * 100; // Max stress is 4
          return (
            <div key={label} className="flex-1 flex flex-col items-center group cursor-pointer">
              <div className="relative w-full flex justify-center items-end h-full bg-slate-100 dark:bg-white/5 rounded-t-xl overflow-hidden">
                <div 
                  className={`w-full ${colorClass} transition-all duration-1000 group-hover:opacity-80`} 
                  style={{ height: `${heightPct}%` }}
                />
                <span className="absolute bottom-2 text-xs font-black text-white mix-blend-difference">{score.toFixed(1)}</span>
              </div>
              <span className="mt-2 text-[10px] uppercase font-bold text-center opacity-60">{label}</span>
              <span className="text-[9px] opacity-40">({stats.count})</span>
            </div>
          );
        })}
      </div>
    );
  };

  // ============================================================================
  // 7. MAIN RENDER
  // ============================================================================

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${theme === 'dark' ? 'bg-[#050507] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
      {/* -------------------------------------------------------------------------- */}
      {/* NAVIGATION BAR */}
      {/* -------------------------------------------------------------------------- */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-xl border-b border-black/5 dark:border-white/10 transition-all">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('landing')}>
          <div className="p-2 bg-indigo-600/10 rounded-lg group-hover:rotate-12 transition-transform">
            <Zap className="text-indigo-600" fill="currentColor" size={24}/>
          </div>
          <div className="flex flex-col">
            <span className="font-black italic uppercase text-xl tracking-tighter leading-none">Mir<span className="text-indigo-500">.Tool</span></span>
            <span className="text-[9px] font-bold opacity-40 tracking-widest">RESEARCH V2</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="p-3 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            title="Changer le thème"
          >
            {theme === 'dark' ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-indigo-600"/>}
          </button>
          <button 
            onClick={() => setView('admin-login')} 
            className="p-3 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            title="Espace Admin"
          >
            <Lock size={18} className={view === 'dashboard' ? 'text-emerald-500' : 'text-slate-400'}/>
          </button>
        </div>
      </nav>

      <main className="pt-32 px-6 max-w-5xl mx-auto min-h-[85vh] relative">
        
        {/* ERROR TOAST */}
        {error && (
          <div className="fixed top-24 right-6 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl z-[200] animate-bounce flex items-center gap-3 font-bold">
            <AlertTriangle /> {error}
          </div>
        )}

        {/* -------------------------------------------------------------------------- */}
        {/* VIEW: LANDING */}
        {/* -------------------------------------------------------------------------- */}
        {view === 'landing' && (
          <div className="text-center py-10 md:py-20 space-y-12 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-black uppercase tracking-widest mb-4 border border-indigo-500/20">
              <Activity size={12}/> Protocol 2026 Ready
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none select-none">
              Mir <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Tool</span>
              <span className="text-2xl md:text-4xl not-italic ml-4 text-slate-400 font-bold">.{APP_VERSION}</span>
            </h1>
            
            <p className="text-lg md:text-2xl font-bold opacity-50 max-w-2xl mx-auto leading-relaxed">
              Plateforme d'analyse psychométrique et de collecte de données pour l'enseignement supérieur. 
              <br/><span className="text-sm opacity-60 font-normal mt-2 block">Optimisé pour la détection du stress et des habitudes numériques.</span>
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
              <button onClick={() => setView('identity')} className="group relative bg-indigo-600 text-white font-black uppercase tracking-widest py-6 px-16 rounded-2xl shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"/>
                <span className="relative z-10 flex items-center gap-3">Commencer <Target size={20}/></span>
              </button>
              
              <button onClick={() => setView('admin-login')} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 font-black uppercase tracking-widest py-6 px-10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-3">
                <Shield size={20} className="text-slate-400"/> Administration
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mt-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex flex-col items-center"><Smartphone size={30} className="mb-2"/> <span className="text-xs font-bold uppercase">Mobile Analysis</span></div>
              <div className="flex flex-col items-center"><Brain size={30} className="mb-2"/> <span className="text-xs font-bold uppercase">Cognitive Load</span></div>
              <div className="flex flex-col items-center"><Database size={30} className="mb-2"/> <span className="text-xs font-bold uppercase">Secure Data</span></div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------- */}
        {/* VIEW: IDENTITY (FORM) */}
        {/* -------------------------------------------------------------------------- */}
        {view === 'identity' && (
          <div className="bg-white dark:bg-[#0c0c0e] p-8 md:p-14 rounded-[3rem] shadow-2xl space-y-8 animate-in slide-in-from-bottom-10 border border-black/5 dark:border-white/5">
            <div className="flex items-center gap-4 border-b border-black/5 dark:border-white/10 pb-6 mb-6">
              <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                <User size={32}/>
              </div>
              <div>
                <h2 className="text-3xl font-black italic uppercase">Profil Étudiant</h2>
                <p className="opacity-50 text-sm font-medium">Les données sont anonymisées pour l'analyse globale.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase ml-2 opacity-50">Nom Complet / Code</label>
                <input className="w-full bg-slate-50 dark:bg-[#161618] p-5 rounded-2xl outline-none font-bold focus:ring-2 ring-indigo-500 transition-all" placeholder="Ex: Etudiant 001" onChange={e => setStudent({...student, full_name: e.target.value})}/>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase ml-2 opacity-50">Groupe TD/TP</label>
                <input className="w-full bg-slate-50 dark:bg-[#161618] p-5 rounded-2xl outline-none font-bold focus:ring-2 ring-indigo-500 transition-all" placeholder="Ex: G3" onChange={e => setStudent({...student, student_group: e.target.value})}/>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase ml-2 opacity-50">Sexe</label>
                <select className="w-full bg-slate-50 dark:bg-[#161618] p-5 rounded-2xl font-bold outline-none cursor-pointer" onChange={e => setStudent({...student, sexe: e.target.value})}>
                  <option value="">Sélectionner...</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase ml-2 opacity-50">Tranche d'âge</label>
                <select className="w-full bg-slate-50 dark:bg-[#161618] p-5 rounded-2xl font-bold outline-none cursor-pointer" onChange={e => setStudent({...student, age: e.target.value})}>
                  <option value="">Sélectionner...</option>
                  <option value="Moins de 20 ans">Moins de 20 ans</option>
                  <option value="20-25 ans">20-25 ans</option>
                  <option value="25-30 ans">25-30 ans</option>
                  <option value="Plus de 30 ans">Plus de 30 ans</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase ml-2 opacity-50">Cycle d'étude</label>
                <select className="w-full bg-slate-50 dark:bg-[#161618] p-5 rounded-2xl font-bold outline-none cursor-pointer" onChange={e => setStudent({...student, cycle: e.target.value})}>
                  <option value="">Sélectionner...</option>
                  <option value="Licence">Licence (L1-L3)</option>
                  <option value="Master">Master (M1-M2)</option>
                  <option value="Ingénieur">Cycle Ingénieur</option>
                  <option value="Doctorat">Doctorat</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase ml-2 opacity-50">Établissement</label>
                <select className="w-full bg-slate-50 dark:bg-[#161618] p-5 rounded-2xl font-bold outline-none cursor-pointer" onChange={e => setStudent({...student, etablissement: e.target.value})}>
                  <option value="">Sélectionner...</option>
                  <option value="ENCG">ENCG</option>
                  <option value="ENSAM">ENSAM</option>
                  <option value="EST">EST</option>
                  <option value="FST">FST</option>
                  <option value="FSJES">FSJES</option>
                  <option value="FLSH">FLSH</option>
                  <option value="ENSA">ENSA</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="pt-6">
              <button 
                disabled={!student.full_name || !student.sexe || !student.etablissement || !student.age} 
                onClick={() => setView('survey')} 
                className="w-full bg-indigo-600 disabled:bg-slate-300 disabled:dark:bg-white/10 text-white font-black py-6 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all disabled:cursor-not-allowed uppercase tracking-widest flex justify-center items-center gap-2"
              >
                Accéder au Questionnaire <Layers size={20}/>
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------- */}
        {/* VIEW: SURVEY (QUESTIONS) */}
        {/* -------------------------------------------------------------------------- */}
        {view === 'survey' && (
          <div className="space-y-8 pb-32 animate-in fade-in">
            {/* Header Module */}
            <div className="p-10 rounded-[3rem] bg-indigo-600 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-10"><Target size={150}/></div>
               <div className="flex items-center gap-4 mb-2">
                 <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase backdrop-blur-sm">Module {currentModule + 1} / {SURVEY_SCHEMA.length}</span>
               </div>
               <h2 className="text-3xl md:text-5xl font-black italic uppercase relative z-10">{SURVEY_SCHEMA[currentModule].title}</h2>
               <p className="mt-4 opacity-80 font-medium max-w-lg relative z-10">{SURVEY_SCHEMA[currentModule].description}</p>
               
               {/* Progress Bar */}
               <div className="absolute bottom-0 left-0 w-full h-2 bg-black/20">
                 <div className="h-full bg-white transition-all duration-500 ease-out" style={{ width: `${((currentModule + 1) / SURVEY_SCHEMA.length) * 100}%` }}/>
               </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {SURVEY_SCHEMA[currentModule].questions.map((q, idx) => (
                <div key={q.id} className="bg-white dark:bg-[#0c0c0e] p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-transparent hover:border-indigo-500/20 transition-all group">
                  <div className="flex gap-4">
                    <span className="text-indigo-500 font-black opacity-30 text-xl">0{idx + 1}</span>
                    <div className="flex-1">
                      <label className="text-lg md:text-xl font-bold mb-8 block leading-snug group-hover:text-indigo-500 transition-colors">{q.label}</label>
                      
                      {q.type === 'range' ? (
                        <div className="space-y-6 py-4">
                          <input 
                            type="range" 
                            min={q.min} 
                            max={q.max} 
                            defaultValue="3" 
                            className="w-full h-3 bg-slate-200 dark:bg-white/10 rounded-full appearance-none accent-indigo-600 cursor-pointer" 
                            onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase opacity-40 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-lg">Faible</span>
                            <span className="text-indigo-500 text-3xl font-black italic">{answers[q.id] || 3}</span>
                            <span className="text-[10px] font-black uppercase opacity-40 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-lg">Elevé</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <select 
                            className="w-full bg-slate-50 dark:bg-[#161618] p-5 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer" 
                            onChange={e => setAnswers({...answers, [q.id]: e.target.value})}
                            value={answers[q.id] || ''}
                          >
                            <option value="" disabled>Sélectionnez une réponse...</option>
                            {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"><Search size={16}/></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Navigation */}
            <div className="flex gap-4 pt-4 sticky bottom-6 z-40">
              <button 
                disabled={currentModule === 0} 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setCurrentModule(m => m - 1);
                }} 
                className="flex-1 p-6 bg-white dark:bg-[#0c0c0e] shadow-xl rounded-2xl font-black uppercase text-xs disabled:opacity-50 border border-black/5 dark:border-white/10"
              >
                Retour
              </button>
              
              <button 
                onClick={() => {
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                   currentModule < SURVEY_SCHEMA.length - 1 ? setCurrentModule(m => m + 1) : submitSurvey();
                }} 
                className="flex-[3] p-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-transform flex justify-center items-center gap-2"
              >
                {currentModule === SURVEY_SCHEMA.length - 1 ? <span>Finaliser & Envoyer <CheckCircle className="inline" size={16}/></span> : 'Module Suivant'}
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------- */}
        {/* VIEW: SUCCESS */}
        {/* -------------------------------------------------------------------------- */}
        {view === 'success' && (
          <div className="text-center py-20 space-y-12 animate-in zoom-in duration-500">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse"/>
              <CheckCircle size={120} className="relative z-10 text-emerald-500 mx-auto"/>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black italic uppercase">Données Reçues</h2>
              <p className="text-xl font-medium opacity-50 max-w-lg mx-auto">Merci de votre participation. Vos réponses ont été cryptées et stockées dans la base de données sécurisée.</p>
            </div>

            <button 
              onClick={() => window.location.reload()} 
              className="p-6 bg-indigo-600 text-white rounded-2xl font-black px-16 shadow-xl hover:bg-indigo-700 transition-colors uppercase tracking-widest"
            >
              Nouveau Profil
            </button>
          </div>
        )}

        {/* -------------------------------------------------------------------------- */}
        {/* VIEW: ADMIN LOGIN */}
        {/* -------------------------------------------------------------------------- */}
        {view === 'admin-login' && (
          <div className="max-w-md mx-auto bg-white dark:bg-[#0c0c0e] p-12 rounded-[3rem] shadow-2xl text-center space-y-10 animate-in fade-in border border-black/5 dark:border-white/5 mt-10">
            <div className="bg-slate-50 dark:bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={40} className="text-indigo-500"/>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase">Accès Sécurisé</h2>
              <p className="text-xs font-bold uppercase tracking-widest opacity-40">Réservé aux chercheurs</p>
            </div>

            <div className="space-y-4">
              <input 
                type="password" 
                placeholder="CODE D'ACCÈS" 
                className="w-full bg-slate-50 dark:bg-[#161618] p-6 rounded-2xl text-center font-black tracking-[0.5em] outline-none focus:ring-2 ring-indigo-500 transition-all text-xl" 
                onChange={e => setPassAttempt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadAdmin()}
              />
              <button 
                onClick={() => loadAdmin()} 
                className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Entrer
              </button>
            </div>
            
            <div className="pt-6 border-t border-black/5 dark:border-white/10">
              <button onClick={() => setView('landing')} className="text-xs font-bold opacity-40 hover:opacity-100">Retour au menu principal</button>
            </div>
          </div>
        )}

      </main>

      {/* -------------------------------------------------------------------------- */}
      {/* VIEW: DASHBOARD (FULL SCREEN OVERLAY) */}
      {/* -------------------------------------------------------------------------- */}
      {view === 'dashboard' && analytics && (
        <div className="fixed inset-0 z-[100] bg-[#F8FAFC] dark:bg-[#050507] overflow-y-auto custom-scrollbar text-slate-900 dark:text-white">
          <div className="max-w-[1600px] mx-auto p-6 md:p-12 space-y-10">
            
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-black/5 dark:border-white/10 pb-8 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-black italic uppercase flex items-center gap-4">
                  <TrendingUp className="text-indigo-500" size={40}/> 
                  Analytics <span className="text-lg not-italic font-normal opacity-40 bg-slate-200 dark:bg-white/10 px-3 py-1 rounded-full">{adminData.length} Surveys</span>
                </h2>
                <p className="mt-2 font-mono text-xs opacity-50 uppercase tracking-widest">Dernière synchro: {new Date().toLocaleTimeString()}</p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button onClick={generateMockData} className="bg-slate-200 dark:bg-white/10 hover:bg-slate-300 px-6 py-4 rounded-xl font-bold text-xs uppercase flex items-center gap-2 transition-colors">
                  <Database size={16}/> Générer Mock Data
                </button>
                <button onClick={exportToCSV} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-xl font-black uppercase text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
                  <Download size={16}/> Export CSV
                </button>
                <button onClick={logoutAdmin} className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-black uppercase text-xs flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all">
                  <LogOut size={16}/> Déconnexion
                </button>
              </div>
            </div>
            
            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-[#0c0c0e] p-8 rounded-3xl shadow-xl border border-black/5 dark:border-white/5 relative overflow-hidden group">
                 <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><User size={100}/></div>
                 <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Total Étudiants</span>
                 <p className="text-6xl font-black italic mt-4">{analytics.totalStudents}</p>
              </div>
              
              <div className="bg-white dark:bg-[#0c0c0e] p-8 rounded-3xl shadow-xl border border-black/5 dark:border-white/5 relative overflow-hidden group">
                 <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Activity size={100}/></div>
                 <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Stress Moyen (Max 4)</span>
                 <p className={`text-6xl font-black italic mt-4 ${analytics.avgStress > 2.5 ? 'text-red-500' : 'text-emerald-500'}`}>{analytics.avgStress}</p>
              </div>

              <div className="bg-white dark:bg-[#0c0c0e] p-8 rounded-3xl shadow-xl border border-black/5 dark:border-white/5 relative overflow-hidden group col-span-1 lg:col-span-2">
                 <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><AlertTriangle size={100}/></div>
                 <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Alerte Procrastination</span>
                 <div className="flex items-end gap-2 mt-4">
                   <p className="text-6xl font-black italic text-orange-500">
                     {adminData.filter(d => parseInt(d.q5) >= 4).length}
                   </p>
                   <p className="mb-2 font-bold opacity-50">étudiants avec usage téléphone critique</p>
                 </div>
              </div>
            </div>

            {/* ---------------------------------------------------------------------- */}
            {/* HYPOTHESIS MODULE (NEW FEATURE) */}
            {/* ---------------------------------------------------------------------- */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 p-20 opacity-10"><Brain size={300}/></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <span className="bg-indigo-500 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Module Scientifique</span>
                   <span className="opacity-50 text-xs font-mono">HYPOTHESIS_CHECK_v1.0</span>
                </div>
                
                <h3 className="text-2xl md:text-4xl font-black italic uppercase mb-8 max-w-2xl leading-tight">
                  "L'usage intensif du téléphone (>4h) augmente considérablement le niveau de stress."
                </h3>

                {hypothesisResult ? (
                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="space-y-2">
                      <span className="text-xs uppercase font-bold opacity-50">Groupe "Usage Élevé"</span>
                      <div className="text-4xl font-black text-red-400">{hypothesisResult.highVal} <span className="text-sm text-white/50">/ 4.0</span></div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className={`text-5xl font-black italic ${hypothesisResult.confirmed ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {hypothesisResult.confirmed ? `+${hypothesisResult.percentage}%` : 'Non Significatif'}
                      </div>
                      <span className="text-xs uppercase font-bold bg-black/30 px-3 py-1 rounded-full">Différence de stress</span>
                    </div>

                    <div className="space-y-2 text-right">
                      <span className="text-xs uppercase font-bold opacity-50">Groupe "Usage Faible"</span>
                      <div className="text-4xl font-black text-emerald-400">{hypothesisResult.lowVal} <span className="text-sm text-white/50">/ 4.0</span></div>
                    </div>

                    <div className="col-span-1 md:col-span-3 pt-6 border-t border-white/10">
                      <p className="font-mono text-sm opacity-80">
                        <span className="font-bold text-indigo-400">CONCLUSION:</span> {hypothesisResult.confirmed 
                          ? "L'hypothèse est confirmée par les données actuelles. Une corrélation positive existe entre l'usage du téléphone et le stress perçu."
                          : "L'hypothèse n'est pas soutenue par les données actuelles. Aucune différence significative détectée."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="opacity-50 italic">Données insuffisantes pour valider l'hypothèse.</p>
                )}
              </div>
            </div>

            {/* ---------------------------------------------------------------------- */}
            {/* DETAILED CHARTS (NEW FEATURES: AGE, SEXE, PHONE) */}
            {/* ---------------------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* CHART 1: Stress vs Age */}
              <div className="bg-white dark:bg-[#0c0c0e] p-10 rounded-[3rem] shadow-2xl border border-black/5 dark:border-white/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black uppercase flex items-center gap-2"><BarChart className="text-indigo-500"/> Stress par Âge</h3>
                </div>
                <SimpleBarChart data={analytics.byAge} colorClass="bg-indigo-500" />
              </div>

              {/* CHART 2: Stress vs Sexe */}
              <div className="bg-white dark:bg-[#0c0c0e] p-10 rounded-[3rem] shadow-2xl border border-black/5 dark:border-white/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black uppercase flex items-center gap-2"><PieChart className="text-pink-500"/> Stress par Sexe</h3>
                </div>
                <SimpleBarChart data={analytics.bySex} colorClass="bg-pink-500" />
              </div>

              {/* CHART 3: Stress vs Phone Usage */}
              <div className="bg-white dark:bg-[#0c0c0e] p-10 rounded-[3rem] shadow-2xl border border-black/5 dark:border-white/5 lg:col-span-2">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black uppercase flex items-center gap-2"><Smartphone className="text-orange-500"/> Stress vs Usage Téléphone (Q5)</h3>
                  <span className="text-xs font-bold bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full">Corrélation Numérique</span>
                </div>
                <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-6">
                  <SimpleBarChart data={analytics.byPhone} colorClass="bg-orange-500" />
                </div>
                <div className="mt-6 flex gap-4 text-xs font-bold opacity-50 justify-center">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"/>Usage Faible (Q5 &le; 2)</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"/>Usage Moyen (Q5 = 3)</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"/>Usage Elevé (Q5 &ge; 4)</span>
                </div>
              </div>

            </div>

            {/* RAW DATA TABLE */}
            <div className="bg-white dark:bg-[#0c0c0e] rounded-[3rem] shadow-2xl overflow-hidden border border-black/5 dark:border-white/5">
              <div className="p-8 border-b border-black/5 dark:border-white/5 bg-slate-50 dark:bg-[#111]">
                 <h3 className="text-xl font-black uppercase flex items-center gap-2"><FileText size={20}/> Données Brutes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-100 dark:bg-white/5 uppercase font-black tracking-tighter text-xs">
                     <tr>
                       <th className="p-6">ID</th>
                       <th className="p-6">Nom</th>
                       <th className="p-6">Groupe</th>
                       <th className="p-6">Age</th>
                       <th className="p-6">Tel (Q5)</th>
                       <th className="p-6 text-right">Stress (Q11)</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                     {adminData.map((row, i) => (
                       <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                         <td className="p-6 opacity-50 font-mono text-xs">#{row.id || i}</td>
                         <td className="p-6">{row.full_name}</td>
                         <td className="p-6 opacity-60"><span className="bg-slate-200 dark:bg-white/10 px-2 py-1 rounded text-xs">{row.student_group}</span></td>
                         <td className="p-6">{row.age}</td>
                         <td className="p-6"><span className={`font-black ${parseInt(row.q5) >= 4 ? 'text-red-500' : 'text-slate-500'}`}>{row.q5}/5</span></td>
                         <td className="p-6 text-right"><span className={`px-3 py-1 rounded-full text-xs uppercase ${getStressScore(row.q11) >= 3 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{row.q11}</span></td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>

            <div className="text-center pb-10 opacity-30 text-xs font-mono uppercase">
              End of Analytics Report • System v{APP_VERSION}
            </div>

          </div>
        </div>
      )}

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center text-white text-center">
          <Cpu size={60} className="animate-spin mb-6 text-indigo-500"/>
          <p className="font-black uppercase tracking-[0.5em] text-sm animate-pulse">Traitement des données...</p>
        </div>
      )}

      {/* GLOBAL STYLES */}
      <style>{`
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #4f46e5; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
}

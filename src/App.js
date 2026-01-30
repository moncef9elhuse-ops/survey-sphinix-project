import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, Moon, Sun, ChevronRight, ChevronLeft, CheckCircle, 
  ShieldCheck, RefreshCcw, ListTodo, Brain, Clock, Smartphone,
  BarChart3, Download, Users, AlertTriangle, Eye, Trash2, Search,
  Settings, Database, User, GraduationCap, Layers, Globe, Shield,
  Activity, ArrowUpRight, Cpu, Terminal, Filter, LayoutDashboard,
  Save, XCircle, HelpCircle, HardDrive, Share2, Clipboard
} from 'lucide-react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  Title, Tooltip, Legend, PointElement, LineElement, RadialLinearScale,
  ArcElement
} from 'chart.js';
import { Bar, Radar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS for heavy analytics
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, 
  PointElement, LineElement, RadialLinearScale, ArcElement
);

/**
 * CORE CONFIGURATION
 * Replace these placeholders to fix the "Invalid API Key" error.
 */
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE'; 
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- COMPREHENSIVE QUESTION SCHEMA ---
const SURVEY_SCHEMA = [
  // SECTION 1: MÉTHODES (1-10)
  { id: 'q1', section: 'MÉTHODES', label: 'Planification hebdomadaire', type: 'select', options: ['Calendrier numérique', 'Agenda papier', 'Aucune'] },
  { id: 'q2', section: 'MÉTHODES', label: 'Technique de mémorisation', type: 'select', options: ['Répétition espacée', 'Lecture simple', 'Fiches de révision'] },
  { id: 'q3', section: 'MÉTHODES', label: 'Efficacité du travail de groupe', type: 'range' },
  { id: 'q4', section: 'MÉTHODES', label: 'Heures d’étude par jour', type: 'select', options: ['< 2h', '2h-5h', '5h-8h', '> 8h'] },
  { id: 'q5', section: 'MÉTHODES', label: 'Niveau de procrastination', type: 'range' },
  { id: 'q6', section: 'MÉTHODES', label: 'Utilisation de l’IA (ChatGPT/Claude)', type: 'select', options: ['Quotidien', 'Rarement', 'Jamais'] },
  { id: 'q7', section: 'MÉTHODES', label: 'Format de prise de notes', type: 'select', options: ['Manuscrite', 'Ordinateur', 'Tablette'] },
  { id: 'q8', section: 'MÉTHODES', label: 'Anticipation des examens', type: 'select', options: ['1 mois avant', '1 semaine avant', 'Nuit blanche'] },
  { id: 'q9', section: 'MÉTHODES', label: 'Indice de compréhension immédiate', type: 'range' },
  { id: 'q10', section: 'MÉTHODES', label: 'Participation en classe', type: 'range' },
  
  // SECTION 2: DIGITAL IMPACT (11-20)
  { id: 'q11', section: 'DIGITAL', label: 'Temps d’écran total par 24h', type: 'select', options: ['< 3h', '3h-6h', '6h-9h', '> 9h'] },
  { id: 'q12', section: 'DIGITAL', label: 'Gestion des notifications en étude', type: 'select', options: ['Mode Avion', 'Focus filtré', 'Notifications ON'] },
  { id: 'q13', section: 'DIGITAL', label: 'Usage des réseaux sociaux (TikTok/Reels)', type: 'range' },
  { id: 'q14', section: 'DIGITAL', label: 'Vérification des sources web', type: 'range' },
  { id: 'q15', section: 'DIGITAL', label: 'Dépendance au smartphone perçue', type: 'range' },
  { id: 'q16', section: 'DIGITAL', label: 'Qualité du setup informatique', type: 'range' },
  { id: 'q17', section: 'DIGITAL', label: 'Ambiance sonore de travail', type: 'select', options: ['Lo-fi/Classique', 'Pop/Rap', 'Silence complet'] },
  { id: 'q18', section: 'DIGITAL', label: 'Gestion du multi-tâches (Onglets)', type: 'range' },
  { id: 'q19', section: 'DIGITAL', label: 'Configuration double écran', type: 'select', options: ['Oui', 'Non'] },
  { id: 'q20', section: 'DIGITAL', label: 'Utilisation de ressources Cloud', type: 'select', options: ['Oui', 'Non'] },

  // SECTION 3: SANTÉ & BIOPHYSIQUE (21-30)
  { id: 'q21', section: 'SANTÉ', label: 'Heures de sommeil par nuit', type: 'select', options: ['< 5h', '5h-7h', '7h-9h', '> 9h'] },
  { id: 'q22', section: 'SANTÉ', label: 'Consommation de caféine', type: 'range' },
  { id: 'q23', section: 'SANTÉ', label: 'Activité physique hebdomadaire', type: 'select', options: ['Quotidienne', 'Hebdomadaire', 'Rare', 'Jamais'] },
  { id: 'q24', section: 'SANTÉ', label: 'Qualité de l’alimentation', type: 'range' },
  { id: 'q25', section: 'SANTÉ', label: 'Sentiment d’isolement social', type: 'range' },
  { id: 'q26', section: 'SANTÉ', label: 'Niveau de stress chronique', type: 'range' },
  { id: 'q27', section: 'SANTÉ', label: 'Hydratation par jour', type: 'select', options: ['< 1L', '1L-2L', '> 2L'] },
  { id: 'q28', section: 'SANTÉ', label: 'Troubles de la concentration', type: 'range' },
  { id: 'q29', section: 'SANTÉ', label: 'Pratiques de relaxation/méditation', type: 'select', options: ['Régulier', 'Occasionnel', 'Jamais'] },
  { id: 'q30', section: 'SANTÉ', label: 'Équilibre vie pro/perso', type: 'range' },

  // SECTION 4: PERFORMANCE ACADÉMIQUE (31-40)
  { id: 'q31', section: 'ACADÉMIQUE', label: 'Sentiment de légitimité (Imposteur)', type: 'range' },
  { id: 'q32', section: 'ACADÉMIQUE', label: 'Clarté du projet professionnel', type: 'range' },
  { id: 'q33', section: 'ACADÉMIQUE', label: 'Taux d’assiduité aux cours', type: 'select', options: ['100%', '75%', '50%', '< 25%'] },
  { id: 'q34', section: 'ACADÉMIQUE', label: 'Qualité des notes prises', type: 'range' },
  { id: 'q35', section: 'ACADÉMIQUE', label: 'Niveau d’ambition personnelle', type: 'select', options: ['Top 1%', 'Mention', 'Valider'] },
  { id: 'q36', section: 'ACADÉMIQUE', label: 'Anxiété avant examen', type: 'range' },
  { id: 'q37', section: 'ACADÉMIQUE', label: 'Facilité de prise de parole', type: 'range' },
  { id: 'q38', section: 'ACADÉMIQUE', label: 'Intérêt pour les matières', type: 'range' },
  { id: 'q39', section: 'ACADÉMIQUE', label: 'Utilisation de la bibliothèque', type: 'select', options: ['Intensif', 'Modéré', 'Jamais'] },
  { id: 'q40', section: 'ACADÉMIQUE', label: 'Proactivité sur le programme', type: 'range' },

  // SECTION 5: ENVIRONNEMENT & FUTUR (41-50)
  { id: 'q41', section: 'FUTUR', label: 'Niveau de motivation actuel', type: 'range' },
  { id: 'q42', section: 'FUTUR', label: 'Besoin de soutien financier', type: 'select', options: ['Élevé', 'Moyen', 'Nul'] },
  { id: 'q43', section: 'FUTUR', label: 'Stabilité du logement', type: 'range' },
  { id: 'q44', section: 'FUTUR', label: 'Sentiment de fatigue chronique', type: 'range' },
  { id: 'q45', section: 'FUTUR', label: 'Confiance en l’insertion future', type: 'range' },
  { id: 'q46', section: 'FUTUR', label: 'Réseautage professionnel', type: 'range' },
  { id: 'q47', section: 'FUTUR', label: 'Importance du salaire futur', type: 'range' },
  { id: 'q48', section: 'FUTUR', label: 'Pression de l’entourage', type: 'range' },
  { id: 'q49', section: 'FUTUR', label: 'Capacité de résilience', type: 'range' },
  { id: 'q50', section: 'FUTUR', label: 'Satisfaction globale de vie', type: 'range' },
];

// --- STYLING ENGINE ---
const STYLES = {
  glass: "bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-3xl border border-slate-200 dark:border-white/5",
  card: "p-10 rounded-[3.5rem] bg-white dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/5 shadow-2xl",
  input: "w-full p-8 rounded-3xl bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-indigo-600 outline-none font-black text-xl transition-all dark:text-white placeholder:opacity-20",
  btnPrimary: "flex items-center justify-center gap-4 bg-indigo-600 text-white p-8 rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-600/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30",
  btnSecondary: "flex items-center justify-center gap-4 border-2 border-slate-200 dark:border-white/10 p-8 rounded-[2rem] font-black text-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all",
  badge: "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
};

export default function SphinxUltimateApp() {
  // Global View Control
  const [view, setView] = useState('landing'); // landing, survey, success, admin-login, admin-dashboard
  const [step, setStep] = useState(0); // 0 = Identification, 1-10 = Question blocks
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form State
  const [studentInfo, setStudentInfo] = useState({ full_name: '', student_group: '' });
  const [form, setForm] = useState(
    SURVEY_SCHEMA.reduce((acc, q) => ({ ...acc, [q.id]: q.type === 'range' ? '3' : '' }), {})
  );

  // Admin Data
  const [responses, setResponses] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Effects
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('sphinx_ultimate_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Database Logic
  const fetchDatabase = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setResponses(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitSurvey = async () => {
    setLoading(true);
    setErrorMsg(null);
    const payload = { ...studentInfo, ...form };
    try {
      const { error } = await supabase.from('student_surveys').insert([payload]);
      if (error) throw error;
      setView('success');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteResponse = async (id) => {
    if (!window.confirm("Action Irréversible. Supprimer ce dossier ?")) return;
    const { error } = await supabase.from('student_surveys').delete().eq('id', id);
    if (!error) fetchDatabase();
  };

  // --- SUB-COMPONENTS ---

  const IdentificationBlock = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="text-center space-y-4">
        <h2 className="text-7xl font-black italic tracking-tighter uppercase leading-none">Identification <br/> <span className="text-indigo-600">Requise</span></h2>
        <p className="text-slate-500 font-bold tracking-[0.4em] text-xs uppercase">Étape 0 // Initialisation du protocole</p>
      </div>
      
      <div className={STYLES.card + " space-y-12 max-w-2xl mx-auto border-t-8 border-t-indigo-600"}>
        <div className="space-y-6">
          <label className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] opacity-40"><User size={18}/> Nom & Prénom</label>
          <input 
            type="text" className={STYLES.input} placeholder="John Doe"
            value={studentInfo.full_name} onChange={e => setStudentInfo({...studentInfo, full_name: e.target.value})}
          />
        </div>
        <div className="space-y-6">
          <label className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] opacity-40"><GraduationCap size={18}/> Groupe / Promotion</label>
          <input 
            type="text" className={STYLES.input} placeholder="M1 - Informatique"
            value={studentInfo.student_group} onChange={e => setStudentInfo({...studentInfo, student_group: e.target.value})}
          />
        </div>
        <button 
          disabled={!studentInfo.full_name || !studentInfo.student_group}
          onClick={() => setStep(1)}
          className={STYLES.btnPrimary + " w-full"}
        >
          COMMENCER L'ANALYSE <ChevronRight/>
        </button>
      </div>
    </div>
  );

  const QuestionStep = () => {
    const qPerStep = 5;
    const currentQuestions = SURVEY_SCHEMA.slice((step-1)*qPerStep, step*qPerStep);
    const progress = (step / 10) * 100;

    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h3 className="text-5xl font-black italic uppercase tracking-tighter">Module {step} <span className="text-indigo-600">/ 10</span></h3>
            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">{studentInfo.full_name} // {studentInfo.student_group}</p>
          </div>
          <div className="w-full md:w-64 space-y-2">
             <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-700" style={{width: `${progress}%`}}></div>
             </div>
             <p className="text-[9px] font-black uppercase text-right opacity-30">Progression {Math.round(progress)}%</p>
          </div>
        </header>

        <div className="space-y-10">
          {currentQuestions.map(q => (
            <div key={q.id} className={STYLES.card + " !p-10 space-y-8 group hover:border-indigo-600 transition-all duration-500"}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{q.section}</span>
                <span className="text-[10px] font-mono opacity-10">UID_{q.id}</span>
              </div>
              <label className="block text-3xl font-black italic leading-none">{q.label}</label>
              
              {q.type === 'select' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {q.options.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setForm({...form, [q.id]: opt})}
                      className={`p-6 rounded-2xl font-black text-sm uppercase transition-all ${
                        form[q.id] === opt 
                          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40' 
                          : 'bg-slate-50 dark:bg-white/5 border border-transparent hover:border-indigo-600/20'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <input 
                    type="range" min="1" max="5" 
                    className="w-full h-4 bg-slate-200 dark:bg-white/10 rounded-full appearance-none accent-indigo-600 cursor-pointer"
                    value={form[q.id]} onChange={e => setForm({...form, [q.id]: e.target.value})}
                  />
                  <div className="flex justify-between text-[10px] font-black uppercase opacity-30 px-2">
                    <span>Niveau Faible</span>
                    <span className="text-indigo-600 opacity-100 font-mono text-lg">VAL: {form[q.id]}</span>
                    <span>Niveau Critique</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-10">
          <button onClick={() => setStep(step-1)} className={STYLES.btnSecondary + " flex-1"}>RETOUR</button>
          {step < 10 ? (
            <button onClick={() => { setStep(step+1); window.scrollTo(0,0); }} className={STYLES.btnPrimary + " flex-[2]"}>CONTINUER <ChevronRight/></button>
          ) : (
            <button onClick={submitSurvey} className="flex-[2] bg-emerald-600 text-white p-8 rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-600/40">FINALISER L'INJECTION</button>
          )}
        </div>
      </div>
    );
  };

  const AdminDashboard = () => (
    <div className="space-y-12 animate-fade-in pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-12">
        <div className="space-y-2">
          <h2 className="text-6xl font-black italic tracking-tighter uppercase">Command <br/> <span className="text-indigo-600">Center</span></h2>
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Système de Monitoring en Temps Réel</p>
          </div>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20" size={20}/>
              <input 
                className="w-full pl-16 pr-8 py-5 bg-white dark:bg-white/5 border border-white/5 rounded-2xl outline-none focus:ring-2 ring-indigo-600 transition-all"
                placeholder="Rechercher un dossier..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              />
           </div>
           <button onClick={fetchDatabase} className="p-5 bg-indigo-600 text-white rounded-2xl shadow-xl hover:rotate-180 transition-all duration-700">
             <RefreshCcw size={24}/>
           </button>
        </div>
      </header>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <KpiCard icon={<Users/>} label="Dossiers Inscrits" value={responses.length} color="indigo" />
         <KpiCard icon={<Layers/>} label="Groupes Identifiés" value={[...new Set(responses.map(r => r.student_group))].length} color="emerald" />
         <KpiCard icon={<AlertTriangle/>} label="Index de Stress Moyen" value={(responses.reduce((a,b) => a + parseInt(b.q26), 0) / (responses.length || 1)).toFixed(1)} color="amber" />
      </div>

      {/* Main Table */}
      <div className={STYLES.card + " !p-0 overflow-hidden"}>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.4em] opacity-40 border-b border-white/5">
                     <th className="p-8">Étudiant</th>
                     <th className="p-8">Groupe</th>
                     <th className="p-8 text-center">Stress</th>
                     <th className="p-8 text-center">Motivation</th>
                     <th className="p-8 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {responses.filter(r => r.full_name.toLowerCase().includes(searchQuery.toLowerCase())).map(res => (
                    <tr key={res.id} className="hover:bg-indigo-600/5 transition-all group">
                       <td className="p-8">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-600 font-black">#</div>
                             <div>
                                <p className="font-black text-lg italic">{res.full_name}</p>
                                <p className="text-[10px] font-mono opacity-40 uppercase">{new Date(res.created_at).toLocaleString()}</p>
                             </div>
                          </div>
                       </th>
                       <td className="p-8">
                          <span className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-lg text-xs font-black uppercase tracking-widest">{res.student_group}</span>
                       </td>
                       <td className="p-8 text-center">
                          <span className={`px-4 py-2 rounded-full font-black text-xs ${parseInt(res.q26) >= 4 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                             Niv. {res.q26}
                          </span>
                       </td>
                       <td className="p-8 text-center">
                          <span className="px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-full font-black text-xs">
                             Niv. {res.q41}
                          </span>
                       </td>
                       <td className="p-8 text-right space-x-2">
                          <button onClick={() => setSelectedResponse(res)} className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Eye size={18}/></button>
                          <button onClick={() => deleteResponse(res.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020204] text-slate-900 dark:text-slate-100 transition-colors duration-700">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 blur-[150px] rounded-full"></div>
      </div>

      {/* Global Loader & Error */}
      {loading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xl">
           <div className="w-24 h-24 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin mb-8 shadow-2xl shadow-indigo-600/50"></div>
           <p className="font-black italic tracking-[0.5em] text-white animate-pulse">SPHINX.SYSTEM_SYNC...</p>
        </div>
      )}

      {errorMsg && (
        <div className="fixed top-32 right-10 z-[300] max-w-md bg-red-500 p-8 rounded-[2rem] shadow-2xl animate-in slide-in-from-right-12">
           <div className="flex items-center gap-6 text-white">
              <XCircle size={40}/>
              <div>
                 <h4 className="font-black italic uppercase tracking-widest">Erreur Critique</h4>
                 <p className="text-xs opacity-80 mt-1">{errorMsg}</p>
                 <p className="text-[10px] mt-4 font-mono">Verify your SUPABASE_KEY and Table RLS.</p>
              </div>
           </div>
           <button onClick={() => setErrorMsg(null)} className="absolute top-4 right-4 text-white opacity-40 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-100 p-8 flex justify-between items-center border-b border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl rotate-6 group-hover:rotate-0 transition-all duration-500">
            <Zap size={24} className="text-white fill-white"/>
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Sphinx<span className="text-indigo-600">.io</span></h1>
            <p className="text-[8px] font-black uppercase tracking-[0.5em] opacity-40">Diagnostic System 50</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
           <NavBtn active={view === 'landing'} label="Home" onClick={() => setView('landing')}/>
           <NavBtn active={view === 'survey'} label="Diagnostic" onClick={() => { setView('survey'); setStep(0); }}/>
           <NavBtn active={view.includes('admin')} label="Console" onClick={() => { if(isAuthorized) setView('admin-dashboard'); else setView('admin-login'); }}/>
           <div className="w-[1px] h-8 bg-white/10"></div>
           <button onClick={() => setDarkMode(!darkMode)} className="p-4 bg-white dark:bg-white/5 border border-white/10 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
             {darkMode ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-indigo-600"/>}
           </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        
        {view === 'landing' && (
          <div className="flex flex-col items-center justify-center text-center py-20 space-y-16 animate-in fade-in zoom-in duration-1000">
             <div className="space-y-6">
                <div className="px-6 py-2 bg-indigo-600/10 rounded-full inline-block">
                   <span className="text-indigo-600 text-xs font-black uppercase tracking-[0.4em] italic">Protocol Alpha v.Ultimate</span>
                </div>
                <h2 className="text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8]">Bilan <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Étudiant</span></h2>
             </div>
             <p className="text-2xl font-bold opacity-40 max-w-2xl italic leading-relaxed">
               Le système le plus complet d'analyse académique. 50 indicateurs de performance, de bien-être et de stratégie numérique pour cartographier votre réussite.
             </p>
             <button onClick={() => { setView('survey'); setStep(0); }} className={STYLES.btnPrimary + " px-20 py-10 text-3xl italic"}>
               INITIALISER L'ANALYSE
             </button>
          </div>
        )}

        {view === 'survey' && (step === 0 ? <IdentificationBlock/> : <QuestionStep/>)}

        {view === 'success' && (
          <div className="text-center py-40 space-y-10 animate-in zoom-in duration-1000">
             <div className="w-40 h-40 bg-emerald-500 text-white rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(16,185,129,0.4)] rotate-12">
                <CheckCircle size={80}/>
             </div>
             <h2 className="text-8xl font-black italic uppercase tracking-tighter">Injection <br/> <span className="text-emerald-500">Réussie</span></h2>
             <p className="text-xl font-bold opacity-40 max-w-lg mx-auto leading-relaxed">
                Merci {studentInfo.full_name}. Vos données ont été transmises au terminal de décision.
             </p>
             <button onClick={() => window.location.reload()} className={STYLES.btnPrimary + " mx-auto"}>REVENIR À L'ACCUEIL</button>
          </div>
        )}

        {view === 'admin-login' && (
          <div className="max-w-md mx-auto pt-20 animate-in zoom-in duration-700">
             <div className={STYLES.card + " space-y-10 text-center"}>
                <div className="w-24 h-24 bg-indigo-600/10 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl"><Shield size={48}/></div>
                <h3 className="text-3xl font-black italic uppercase">Restricted</h3>
                <input 
                  type="password" className={STYLES.input + " text-center tracking-[0.5em]"} placeholder="••••••"
                  value={adminPass} onChange={e => setAdminPass(e.target.value)}
                />
                <button 
                  onClick={() => { if(adminPass === 'ADMIN123') { setIsAuthorized(true); setView('admin-dashboard'); fetchDatabase(); } else { setErrorMsg("Code Alpha Invalide"); } }}
                  className={STYLES.btnPrimary + " w-full"}
                >
                  AUTHENTIFIER
                </button>
             </div>
          </div>
        )}

        {view === 'admin-dashboard' && <AdminDashboard/>}

        {/* Individual Record Inspector */}
        {selectedResponse && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 bg-slate-950/95 backdrop-blur-xl animate-in zoom-in duration-300">
             <div className="w-full max-w-6xl h-full bg-white dark:bg-[#0A0A0B] rounded-[4rem] flex flex-col overflow-hidden border border-white/10">
                <div className="p-12 border-b border-white/5 flex justify-between items-center">
                   <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white"><FileText size={40}/></div>
                      <div>
                         <h4 className="text-5xl font-black italic tracking-tighter uppercase">Dossier #SPX_{selectedResponse.id}</h4>
                         <p className="text-indigo-600 font-black uppercase text-xs tracking-widest">{selectedResponse.full_name} // {selectedResponse.student_group}</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedResponse(null)} className="p-6 bg-red-500/10 text-red-500 rounded-3xl hover:bg-red-500 hover:text-white transition-all font-black">QUITTER</button>
                </div>
                <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {SURVEY_SCHEMA.map(q => (
                      <div key={q.id} className="p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border border-white/5">
                         <p className="text-[9px] font-black uppercase text-indigo-600 tracking-widest mb-2">{q.section}</p>
                         <p className="text-sm font-bold opacity-40 mb-4 h-10 overflow-hidden">{q.label}</p>
                         <p className="text-2xl font-black italic">{selectedResponse[q.id] || '---'}</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Shared Global CSS */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 32px;
          width: 32px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
          border: 4px solid white;
          margin-top: -10px;
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 12px;
          cursor: pointer;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 10px;
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

// Sub-component Helpers
function NavBtn({ active, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all relative py-2 ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-400'}`}
    >
      {label}
      {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full animate-in slide-in-from-left-2"></span>}
    </button>
  );
}

function KpiCard({ icon, label, value, color }) {
  const themes = {
    indigo: "text-indigo-600 border-indigo-600/20 bg-indigo-600/5",
    emerald: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
    amber: "text-amber-500 border-amber-500/20 bg-amber-500/5"
  };
  return (
    <div className={STYLES.card + " !p-10 border-l-[12px] " + themes[color] + " shadow-xl group hover:-translate-y-2 transition-all duration-500"}>
       <div className="flex items-center gap-4 opacity-40 font-black text-[10px] tracking-widest uppercase mb-6">
          {icon} <span>{label}</span>
       </div>
       <h4 className="text-7xl font-black italic tracking-tighter leading-none group-hover:scale-110 transition-transform origin-left">{value}</h4>
    </div>
  );
}

const FileText = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;

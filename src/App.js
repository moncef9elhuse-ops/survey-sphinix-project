import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, Moon, Sun, ChevronRight, ChevronLeft, CheckCircle, 
  Shield, RefreshCcw, Activity, Brain, User, GraduationCap, 
  LayoutDashboard, Search, XCircle, BarChart3, Lock,
  FileText, Layers, Smartphone, Coffee, Target, AlertTriangle
} from 'lucide-react';

// ============================================================================
// 1. CONFIGURATION (PASTE YOUR KEYS HERE)
// ============================================================================
const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_URL_HERE';
const SUPABASE_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize Client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================================
// 2. THE TITAN SCHEMA (5 SECTIONS x 5 QUESTIONS)
// ============================================================================
const TITAN_SCHEMA = [
  {
    id: 'SEC_METHODS',
    title: 'Méthodologie & Organisation',
    icon: <Layers size={24} />,
    color: 'from-blue-600 to-indigo-600',
    description: 'Structure de travail et efficacité personnelle',
    questions: [
      { id: 'm1', label: 'Support de planification principal', type: 'select', options: ['App/Numérique', 'Agenda Papier', 'Aucun'] },
      { id: 'm2', label: 'Technique de révision active', type: 'select', options: ['Fiches', 'Quiz/Flashcards', 'Relire le cours'] },
      { id: 'm3', label: 'Gestion de la procrastination', type: 'range', minLabel: 'Critique', maxLabel: 'Maîtrisée' },
      { id: 'm4', label: 'Anticipation des partiels', type: 'select', options: ['1 mois avant', '1 semaine avant', 'Veille'] },
      { id: 'm5', label: 'Efficacité du travail personnel', type: 'range', minLabel: 'Faible', maxLabel: 'Optimale' }
    ]
  },
  {
    id: 'SEC_DIGITAL',
    title: 'Empreinte Numérique',
    icon: <Smartphone size={24} />,
    color: 'from-violet-600 to-purple-600',
    description: 'Impact des écrans et de l\'IA',
    questions: [
      { id: 'd1', label: 'Temps d’écran moyen (24h)', type: 'select', options: ['< 4h', '4h-7h', '> 7h'] },
      { id: 'd2', label: 'Usage IA (ChatGPT/Claude)', type: 'select', options: ['Quotidien', 'Hebdomadaire', 'Jamais'] },
      { id: 'd3', label: 'Distraction par notifications', type: 'range', minLabel: 'Nulle', maxLabel: 'Constante' },
      { id: 'd4', label: 'Organisation des fichiers (Cloud)', type: 'range', minLabel: 'Chaos', maxLabel: 'Structure' },
      { id: 'd5', label: 'Dépendance réseaux sociaux', type: 'range', minLabel: 'Faible', maxLabel: 'Addiction' }
    ]
  },
  {
    id: 'SEC_HEALTH',
    title: 'Biophysique & Mental',
    icon: <Activity size={24} />,
    color: 'from-emerald-500 to-teal-600',
    description: 'Santé, sommeil et niveau de stress',
    questions: [
      { id: 'h1', label: 'Qualité du sommeil', type: 'range', minLabel: 'Insomnie', maxLabel: 'Réparateur' },
      { id: 'h2', label: 'Niveau de stress actuel', type: 'range', minLabel: 'Zen', maxLabel: 'Burnout' },
      { id: 'h3', label: 'Consommation énergisants/café', type: 'select', options: ['Nulle', 'Modérée', 'Excessive'] },
      { id: 'h4', label: 'Activité physique', type: 'select', options: ['Régulière', 'Occasionnelle', 'Sédentaire'] },
      { id: 'h5', label: 'Sentiment d’isolement', type: 'range', minLabel: 'Connecté', maxLabel: 'Seul' }
    ]
  },
  {
    id: 'SEC_ACADEMIC',
    title: 'Performance Académique',
    icon: <Brain size={24} />,
    color: 'from-amber-500 to-orange-600',
    description: 'Résultats, compréhension et assiduité',
    questions: [
      { id: 'a1', label: 'Assiduité aux cours', type: 'select', options: ['100%', '75%', '< 50%'] },
      { id: 'a2', label: 'Compréhension en amphi', type: 'range', minLabel: 'Perdu', maxLabel: 'Claire' },
      { id: 'a3', label: 'Qualité de la prise de notes', type: 'range', minLabel: 'Brouillon', maxLabel: 'Expert' },
      { id: 'a4', label: 'Participation orale', type: 'range', minLabel: 'Silencieux', maxLabel: 'Actif' },
      { id: 'a5', label: 'Niveau scolaire perçu', type: 'select', options: ['Tête de promo', 'Moyenne', 'Difficulté'] }
    ]
  },
  {
    id: 'SEC_FUTURE',
    title: 'Projection & Avenir',
    icon: <Target size={24} />,
    color: 'from-rose-500 to-pink-600',
    description: 'Ambition et vision professionnelle',
    questions: [
      { id: 'f1', label: 'Clarté du projet pro', type: 'range', minLabel: 'Flou', maxLabel: 'Cristallin' },
      { id: 'f2', label: 'Motivation intrinsèque', type: 'range', minLabel: 'Nulle', maxLabel: 'Passion' },
      { id: 'f3', label: 'Confiance en l’avenir', type: 'range', minLabel: 'Pessimiste', maxLabel: 'Confiant' },
      { id: 'f4', label: 'Ambition financière', type: 'select', options: ['Priorité', 'Secondaire', 'Indifférent'] },
      { id: 'f5', label: 'Satisfaction globale vie étudiante', type: 'range', minLabel: 'Déçu', maxLabel: 'Comblé' }
    ]
  }
];

// ============================================================================
// 3. STYLING ENGINE (The "Awesome" Look)
// ============================================================================
const STYLES = {
  // Glassmorphism Containers
  glassCard: "bg-white/80 dark:bg-[#121214]/80 backdrop-blur-2xl border border-white/20 dark:border-white/5 shadow-2xl rounded-[2.5rem]",
  glassPanel: "bg-slate-100/50 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl",
  
  // Inputs & Interactive
  input: "w-full bg-white dark:bg-black/40 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-6 text-lg font-bold outline-none transition-all placeholder:text-slate-400 dark:text-white shadow-inner",
  range: "w-full h-4 bg-slate-200 dark:bg-white/10 rounded-full appearance-none accent-indigo-600 cursor-pointer hover:accent-indigo-500 transition-all",
  
  // Buttons
  btnBase: "relative overflow-hidden font-black uppercase tracking-widest text-sm py-6 px-10 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none hover:shadow-lg",
  btnPrimary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30",
  btnSecondary: "bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/10",
  
  // Typography
  label: "text-xs font-black uppercase tracking-[0.2em] opacity-50 mb-3 block text-slate-500 dark:text-slate-400",
  heading: "text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]",
  neonText: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400"
};

export default function TitanApp() {
  // --- STATE ---
  const [darkMode, setDarkMode] = useState(true);
  const [view, setView] = useState('landing'); // landing, identity, survey, success, admin-login, admin-dashboard
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Identity
  const [student, setStudent] = useState({ full_name: '', student_group: '' });

  // Survey
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Admin
  const [adminPass, setAdminPass] = useState('');
  const [dbData, setDbData] = useState([]);

  // --- EFFECTS ---
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // --- HANDLERS ---

  const handleStart = () => {
    if (SUPABASE_URL.includes('PASTE_YOUR')) {
      alert("⚠️ CONFIG ERROR: You haven't pasted your Supabase URL in the code yet!");
      return;
    }
    setView('identity');
  };

  const handleIdentitySubmit = () => {
    if (student.full_name.length < 2 || student.student_group.length < 2) return;
    setView('survey');
    window.scrollTo(0,0);
  };

  const handleAnswer = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleNextSection = () => {
    if (currentSectionIndex < TITAN_SCHEMA.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo(0,0);
    } else {
      submitSurvey();
    }
  };

  const submitSurvey = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('student_surveys').insert([{
        full_name: student.full_name,
        student_group: student.student_group,
        ...answers,
        created_at: new Date().toISOString()
      }]);
      if (error) throw error;
      setView('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setDbData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const attemptLogin = () => {
    if (adminPass === 'TITAN2026') {
      setView('admin-dashboard');
      fetchAdminData();
    } else {
      setError('Code d’accès invalide');
    }
  };

  // --- UI COMPONENTS ---

  const ProgressBar = () => {
    const total = TITAN_SCHEMA.length;
    const progress = ((currentSectionIndex + 1) / total) * 100;
    return (
      <div className="fixed top-0 left-0 w-full h-2 bg-slate-200 dark:bg-white/5 z-50">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-700 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#050507] text-slate-800 dark:text-slate-100 transition-colors duration-500 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* 1. BACKGROUND FX */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-500/10 rounded-full blur-[150px]"></div>
      </div>

      {/* 2. NAVBAR */}
      <nav className="fixed top-0 w-full z-40 p-6 flex justify-between items-center bg-white/70 dark:bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('landing')}>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
            <Zap size={24} fill="currentColor"/>
          </div>
          <div>
            <h1 className="font-black italic text-2xl tracking-tighter uppercase leading-none">Sphinx<span className="text-indigo-500">.50</span></h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Titan System v3.0</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setDarkMode(!darkMode)} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 hover:scale-110 transition-transform shadow-lg">
            {darkMode ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-indigo-600"/>}
          </button>
          <button onClick={() => setView('admin-login')} className="w-12 h-12 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors">
            <Lock size={20}/>
          </button>
        </div>
      </nav>

      {/* 3. ERROR & LOADING OVERLAYS */}
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in slide-in-from-top-4">
          <div className="bg-red-500 text-white p-6 rounded-3xl shadow-2xl flex items-center gap-4 border-2 border-red-400">
            <AlertTriangle size={32} />
            <div>
              <h4 className="font-black uppercase text-xs tracking-widest mb-1">Erreur Critique</h4>
              <p className="text-sm font-medium opacity-90">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto p-2 hover:bg-white/20 rounded-full">✕</button>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          <div className="w-20 h-20 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black uppercase tracking-[0.5em] text-white animate-pulse">Traitement des données...</p>
        </div>
      )}

      {/* 4. MAIN CONTENT AREA */}
      <main className="relative z-10 pt-40 px-6 max-w-4xl mx-auto flex flex-col">
        
        {/* VIEW: LANDING */}
        {view === 'landing' && (
          <div className="flex flex-col items-center text-center space-y-12 animate-in fade-in zoom-in duration-700 py-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-black uppercase tracking-[0.3em]">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Serveur Prêt
            </div>
            
            <h1 className={STYLES.heading}>
              Bilan <br/><span className={STYLES.neonText}>Académique</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-medium opacity-60 max-w-2xl mx-auto leading-relaxed">
              Le protocole standardisé d'évaluation de la performance étudiante. 
              <br/><span className="text-indigo-500 font-bold">5 Sections. 25 Indicateurs Clés.</span>
            </p>

            <button onClick={handleStart} className={`${STYLES.btnBase} ${STYLES.btnPrimary} text-xl py-8 px-16 shadow-indigo-500/50 mt-8`}>
              Lancer le Diagnostic
            </button>
          </div>
        )}

        {/* VIEW: IDENTITY */}
        {view === 'identity' && (
          <div className="w-full max-w-xl mx-auto animate-in slide-in-from-bottom-12 duration-700">
            <div className={STYLES.glassCard + " p-10 md:p-14 space-y-10"}>
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-indigo-500 shadow-inner">
                  <User size={40}/>
                </div>
                <h2 className="text-4xl font-black italic uppercase">Identification</h2>
                <p className="opacity-50 font-medium">Création du dossier étudiant</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={STYLES.label}>Nom Complet</label>
                  <input 
                    className={STYLES.input} 
                    placeholder="ex: Sarah Connor"
                    value={student.full_name}
                    onChange={(e) => setStudent({...student, full_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className={STYLES.label}>Groupe / Promotion</label>
                  <input 
                    className={STYLES.input} 
                    placeholder="ex: M2 - Marketing"
                    value={student.student_group}
                    onChange={(e) => setStudent({...student, student_group: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={handleIdentitySubmit}
                disabled={!student.full_name || !student.student_group}
                className={`${STYLES.btnBase} ${STYLES.btnPrimary} w-full py-6 text-lg`}
              >
                Accéder au Questionnaire
              </button>
            </div>
          </div>
        )}

        {/* VIEW: SURVEY ENGINE (5 Questions per Section) */}
        {view === 'survey' && (
          <div className="animate-in fade-in duration-500">
            <ProgressBar />
            
            {/* Header Section */}
            <div className={`p-10 rounded-[2.5rem] bg-gradient-to-br ${TITAN_SCHEMA[currentSectionIndex].color} text-white shadow-2xl mb-8 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-8 opacity-20">
                {TITAN_SCHEMA[currentSectionIndex].icon}
              </div>
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-3 opacity-80 mb-4">
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-black uppercase tracking-widest">Section {currentSectionIndex + 1} / 5</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black italic uppercase leading-none">{TITAN_SCHEMA[currentSectionIndex].title}</h2>
                <p className="opacity-80 font-medium max-w-lg">{TITAN_SCHEMA[currentSectionIndex].description}</p>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {TITAN_SCHEMA[currentSectionIndex].questions.map((q) => (
                <div key={q.id} className={`${STYLES.glassCard} p-8 hover:border-indigo-500/40 transition-all group`}>
                  <div className="space-y-6">
                    <label className="text-xl font-bold dark:text-slate-100 block group-hover:text-indigo-500 transition-colors">
                      {q.label}
                    </label>
                    
                    {q.type === 'range' ? (
                      <div className="space-y-4 px-2">
                        <input 
                          type="range" min="1" max="5" defaultValue="3"
                          className={STYLES.range}
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                        />
                        <div className="flex justify-between text-[10px] font-black uppercase opacity-40">
                          <span>{q.minLabel}</span>
                          <span className="text-base font-black text-indigo-500 opacity-100">{answers[q.id] || 3}</span>
                          <span>{q.maxLabel}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {q.options.map((opt) => (
                          <button 
                            key={opt}
                            onClick={() => handleAnswer(q.id, opt)}
                            className={`py-4 px-4 rounded-xl text-xs font-black uppercase transition-all border-2 ${
                              answers[q.id] === opt 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-[1.02]' 
                                : 'bg-slate-50 dark:bg-white/5 border-transparent hover:bg-slate-100 dark:hover:bg-white/10'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-8 pb-20">
              <button 
                onClick={() => {
                  setCurrentSectionIndex(prev => Math.max(0, prev - 1));
                  window.scrollTo(0,0);
                }}
                disabled={currentSectionIndex === 0}
                className={`${STYLES.btnBase} ${STYLES.btnSecondary} flex-1`}
              >
                <ChevronLeft className="inline mr-2" size={18}/> Retour
              </button>
              
              <button 
                onClick={handleNextSection}
                className={`${STYLES.btnBase} ${STYLES.btnPrimary} flex-[2]`}
              >
                {currentSectionIndex === TITAN_SCHEMA.length - 1 ? 'Terminer & Envoyer' : 'Section Suivante'}
                <ChevronRight className="inline ml-2" size={18}/>
              </button>
            </div>
          </div>
        )}

        {/* VIEW: SUCCESS */}
        {view === 'success' && (
          <div className="flex flex-col items-center justify-center text-center animate-in zoom-in duration-700 py-20 space-y-12">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-[60px] opacity-40 rounded-full"></div>
              <div className="w-40 h-40 bg-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl relative z-10 rotate-12">
                <CheckCircle size={80} className="text-white"/>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-6xl font-black italic uppercase tracking-tighter">Mission <br/> <span className="text-emerald-500">Accomplie</span></h2>
              <p className="text-xl font-medium opacity-50 max-w-lg mx-auto">Toutes les données ont été synchronisées avec la base de données centrale.</p>
            </div>

            <div className={`${STYLES.glassCard} p-8 w-full max-w-md`}>
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4 mb-4">
                <span className="text-xs font-black uppercase opacity-40">Identité</span>
                <span className="text-xs font-black uppercase opacity-40">Statut</span>
              </div>
              <div className="text-left space-y-1">
                <p className="text-2xl font-black italic">{student.full_name}</p>
                <p className="text-indigo-500 font-bold uppercase text-xs tracking-widest">{student.student_group}</p>
              </div>
            </div>

            <button onClick={() => window.location.reload()} className={`${STYLES.btnBase} ${STYLES.btnSecondary} px-12`}>
              Nouveau Dossier
            </button>
          </div>
        )}

        {/* VIEW: ADMIN LOGIN */}
        {view === 'admin-login' && (
          <div className="w-full max-w-sm mx-auto animate-in fade-in duration-500 mt-20">
            <div className={`${STYLES.glassCard} p-10 text-center space-y-8`}>
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-indigo-500">
                <Shield size={32}/>
              </div>
              
              <div>
                <h3 className="text-2xl font-black uppercase italic">Zone Admin</h3>
                <p className="text-xs font-bold uppercase opacity-40 tracking-widest mt-2">Accès Sécurisé</p>
              </div>

              <input 
                type="password" 
                className={`${STYLES.input} text-center tracking-[0.5em] text-2xl font-mono`}
                placeholder="••••"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
              />
              
              <button onClick={attemptLogin} className={`${STYLES.btnBase} ${STYLES.btnPrimary} w-full`}>
                Déverrouiller
              </button>
            </div>
          </div>
        )}
      </main>

      {/* VIEW: ADMIN DASHBOARD (FULL OVERLAY) */}
      {view === 'admin-dashboard' && (
        <div className="fixed inset-0 z-50 bg-[#F0F2F5] dark:bg-[#050507] overflow-y-auto animate-in slide-in-from-bottom-10">
          <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
            
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-black/5 dark:border-white/5 pb-8">
              <div className="space-y-2">
                <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
                  Data <span className="text-indigo-500">Center</span>
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-40">Connexion Live Établie</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                 <button onClick={fetchAdminData} className="px-6 py-4 bg-white dark:bg-white/5 rounded-2xl flex items-center gap-3 font-bold shadow-lg hover:rotate-180 transition-all duration-500">
                    <RefreshCcw size={20} className="text-indigo-500"/>
                 </button>
                 <button onClick={() => setView('landing')} className="px-6 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-colors">
                    Fermer
                 </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className={`${STYLES.glassCard} !p-8 border-l-8 border-indigo-500 flex flex-col justify-between h-40`}>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black uppercase opacity-40 tracking-widest">Total Dossiers</span>
                    <FileText className="opacity-20"/>
                  </div>
                  <span className="text-6xl font-black italic">{dbData.length}</span>
               </div>
               <div className={`${STYLES.glassCard} !p-8 border-l-8 border-purple-500 flex flex-col justify-between h-40`}>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black uppercase opacity-40 tracking-widest">Groupes Actifs</span>
                    <GraduationCap className="opacity-20"/>
                  </div>
                  <span className="text-6xl font-black italic">{[...new Set(dbData.map(d => d.student_group))].length}</span>
               </div>
               <div className={`${STYLES.glassCard} !p-8 border-l-8 border-emerald-500 flex flex-col justify-between h-40`}>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black uppercase opacity-40 tracking-widest">Dernier Ajout</span>
                    <Activity className="opacity-20"/>
                  </div>
                  <span className="text-xl font-black italic truncate">{dbData[0]?.full_name || '---'}</span>
               </div>
            </div>

            {/* Data Table */}
            <div className={`${STYLES.glassCard} !p-0 overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-white/5 text-[10px] uppercase tracking-widest font-black opacity-60">
                    <tr>
                      <th className="p-6">Horodatage</th>
                      <th className="p-6">Identité</th>
                      <th className="p-6">Groupe</th>
                      <th className="p-6 text-center">Stress (1-5)</th>
                      <th className="p-6 text-center">Motivation (1-5)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold text-sm">
                    {dbData.map((row) => (
                      <tr key={row.id} className="hover:bg-indigo-500/5 transition-colors group">
                        <td className="p-6 opacity-40 font-mono text-xs whitespace-nowrap">
                          {new Date(row.created_at).toLocaleDateString()} <br/>
                          {new Date(row.created_at).toLocaleTimeString()}
                        </td>
                        <td className="p-6 text-lg group-hover:text-indigo-500 transition-colors">
                          {row.full_name}
                        </td>
                        <td className="p-6">
                          <span className="px-3 py-1 bg-white dark:bg-white/10 rounded-lg text-xs font-black uppercase tracking-widest border border-black/5 dark:border-white/5">
                            {row.student_group}
                          </span>
                        </td>
                        <td className="p-6 text-center">
                           {/* Stress is h2 in schema */}
                           <span className={`px-3 py-1 rounded-md ${parseInt(row.h2) > 3 ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                             {row.h2 || '-'}
                           </span>
                        </td>
                        <td className="p-6 text-center">
                           {/* Motivation is f2 in schema */}
                           <span className="opacity-60">{row.f2 || '-'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {dbData.length === 0 && (
                <div className="p-20 text-center opacity-30 font-black uppercase tracking-widest text-xl">
                  En attente de données...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

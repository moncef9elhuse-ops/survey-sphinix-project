import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, Moon, Sun, ChevronRight, ChevronLeft, CheckCircle, 
  Shield, RefreshCcw, Activity, Brain, User, Lock,
  Layers, Smartphone, Target, AlertTriangle, FileText, GraduationCap
} from 'lucide-react';

// ============================================================================
// 1. DATABASE CONFIGURATION
// ============================================================================
const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_URL_HERE';
const SUPABASE_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================================
// 2. THE TITAN SCHEMA (5 SECTIONS x 5 QUESTIONS = 25 TOTAL)
// ============================================================================
const TITAN_SCHEMA = [
  {
    id: 'SEC_METHODS',
    title: 'Méthodologie',
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
    title: 'Performance',
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
    title: 'Avenir',
    icon: <Target size={24} />,
    color: 'from-rose-500 to-pink-600',
    description: 'Ambition et vision professionnelle',
    questions: [
      { id: 'f1', label: 'Clarté du projet pro', type: 'range', minLabel: 'Flou', maxLabel: 'Cristallin' },
      { id: 'f2', label: 'Motivation intrinsèque', type: 'range', minLabel: 'Nulle', maxLabel: 'Passion' },
      { id: 'f3', label: 'Confiance en l’avenir', type: 'range', minLabel: 'Pessimiste', maxLabel: 'Confiant' },
      { id: 'f4', label: 'Ambition financière', type: 'select', options: ['Priorité', 'Secondaire', 'Indifférent'] },
      { id: 'f5', label: 'Satisfaction globale', type: 'range', minLabel: 'Déçu', maxLabel: 'Comblé' }
    ]
  }
];

// ============================================================================
// 3. UI STYLE SYSTEM
// ============================================================================
const STYLES = {
  glassCard: "bg-white/90 dark:bg-[#121214]/90 backdrop-blur-2xl border border-white/20 dark:border-white/5 shadow-2xl rounded-[2.5rem]",
  input: "w-full bg-slate-100 dark:bg-black/40 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-6 text-lg font-bold outline-none transition-all dark:text-white",
  btnBase: "relative overflow-hidden font-black uppercase tracking-widest text-sm py-6 px-10 rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-xl",
  btnPrimary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30",
  btnSecondary: "bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-300",
  heading: "text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6",
  neonGradient: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-cyan-400"
};

export default function TitanSphinx() {
  const [darkMode, setDarkMode] = useState(true);
  const [view, setView] = useState('landing'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [student, setStudent] = useState({ full_name: '', student_group: '' });
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [adminPass, setAdminPass] = useState('');
  const [dbData, setDbData] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Handlers
  const handleAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));

  const nextStep = async () => {
    if (currentSection < TITAN_SCHEMA.length - 1) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo(0,0);
    } else {
      setLoading(true);
      const { error } = await supabase.from('student_surveys').insert([{ ...student, ...answers }]);
      setLoading(false);
      if (error) setError(error.message);
      else setView('success');
    }
  };

  const loginAdmin = async () => {
    if (adminPass === 'TITAN2026') {
      setLoading(true);
      const { data } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
      setDbData(data || []);
      setLoading(false);
      setView('admin-dashboard');
    } else {
      setError("Code Invalide");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050507] text-slate-900 dark:text-white transition-all font-sans">
      
      {/* Background Neon Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg rotate-3"><Zap size={24} fill="white"/></div>
          <span className="font-black italic uppercase tracking-tighter text-2xl">Sphinx<span className="text-indigo-500">.50</span></span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-xl bg-white dark:bg-white/5 border border-white/10 shadow-lg">
            {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
          </button>
          <button onClick={() => setView('admin-login')} className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10">
            <Lock size={20}/>
          </button>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
        
        {/* LANDING */}
        {view === 'landing' && (
          <div className="text-center animate-in fade-in zoom-in duration-700">
            <h1 className={STYLES.heading}>Bilan <br/><span className={STYLES.neonGradient}>Étudiant</span></h1>
            <p className="text-xl md:text-2xl font-bold opacity-60 mb-10 max-w-xl mx-auto">
              Protocole d'analyse Titan : 5 sections, 25 points de contrôle.
            </p>
            <button onClick={() => setView('identity')} className={`${STYLES.btnBase} ${STYLES.btnPrimary} py-8 px-16 text-xl`}>
              Démarrer le Test
            </button>
          </div>
        )}

        {/* IDENTITY */}
        {view === 'identity' && (
          <div className={`${STYLES.glassCard} p-10 md:p-16 animate-in slide-in-from-bottom-10`}>
            <h2 className="text-4xl font-black italic uppercase mb-8">Identification</h2>
            <div className="space-y-6">
              <input className={STYLES.input} placeholder="Nom Complet" onChange={e => setStudent({...student, full_name: e.target.value})}/>
              <input className={STYLES.input} placeholder="Groupe / Promo" onChange={e => setStudent({...student, student_group: e.target.value})}/>
              <button 
                disabled={!student.full_name || !student.student_group}
                onClick={() => setView('survey')} 
                className={`${STYLES.btnBase} ${STYLES.btnPrimary} w-full`}
              >
                Accéder au Questionnaire
              </button>
            </div>
          </div>
        )}

        {/* SURVEY ENGINE */}
        {view === 'survey' && (
          <div className="animate-in fade-in duration-500">
            {/* Progress */}
            <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 z-[60]">
               <div className="h-full bg-indigo-500 transition-all duration-700 shadow-[0_0_15px_#6366f1]" style={{width: `${((currentSection+1)/5)*100}%`}}></div>
            </div>

            <div className={`p-8 rounded-[2.5rem] bg-gradient-to-br ${TITAN_SCHEMA[currentSection].color} text-white mb-8 shadow-2xl`}>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Module {currentSection + 1} / 5</span>
              <h2 className="text-4xl font-black italic uppercase leading-tight mt-1">{TITAN_SCHEMA[currentSection].title}</h2>
            </div>

            <div className="space-y-6">
              {TITAN_SCHEMA[currentSection].questions.map(q => (
                <div key={q.id} className={`${STYLES.glassCard} p-8 hover:border-indigo-500/30 transition-all`}>
                  <label className="text-xl font-bold mb-6 block">{q.label}</label>
                  {q.type === 'range' ? (
                    <div className="space-y-4">
                      <input type="range" min="1" max="5" defaultValue="3" className="w-full h-3 bg-slate-200 dark:bg-white/10 rounded-full appearance-none accent-indigo-600" onChange={e => handleAnswer(q.id, e.target.value)}/>
                      <div className="flex justify-between text-[10px] font-black uppercase opacity-40">
                        <span>{q.minLabel}</span>
                        <span className="text-indigo-500 text-lg opacity-100">{answers[q.id] || 3}</span>
                        <span>{q.maxLabel}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {q.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(q.id, opt)} className={`p-4 rounded-xl text-xs font-black uppercase border-2 transition-all ${answers[q.id] === opt ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 dark:bg-white/5 border-transparent'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-10">
              <button disabled={currentSection === 0} onClick={() => setCurrentSection(prev => prev - 1)} className={`${STYLES.btnBase} ${STYLES.btnSecondary} flex-1`}>Retour</button>
              <button onClick={nextStep} className={`${STYLES.btnBase} ${STYLES.btnPrimary} flex-[2]`}>
                {currentSection === 4 ? (loading ? 'Envoi...' : 'Finaliser') : 'Suivant'}
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {view === 'success' && (
          <div className="text-center animate-in zoom-in space-y-8">
            <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40">
              <CheckCircle size={64} className="text-white"/>
            </div>
            <h2 className="text-6xl font-black italic uppercase tracking-tighter">Données <br/> <span className="text-emerald-500">Synchronisées</span></h2>
            <button onClick={() => window.location.reload()} className={`${STYLES.btnBase} ${STYLES.btnPrimary}`}>Nouveau Diagnostic</button>
          </div>
        )}

        {/* ADMIN LOGIN */}
        {view === 'admin-login' && (
          <div className={`${STYLES.glassCard} p-10 max-w-md mx-auto w-full animate-in fade-in`}>
            <h3 className="text-2xl font-black uppercase italic mb-6">Zone Sécurisée</h3>
            <input type="password" className={`${STYLES.input} text-center tracking-[0.5em]`} placeholder="••••" onChange={e => setAdminPass(e.target.value)}/>
            <button onClick={loginAdmin} className={`${STYLES.btnBase} ${STYLES.btnPrimary} w-full mt-4`}>Entrer</button>
          </div>
        )}

      </main>

      {/* ADMIN DASHBOARD OVERLAY */}
      {view === 'admin-dashboard' && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-[#050507] overflow-y-auto p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">Command <span className="text-indigo-500">Center</span></h2>
              <button onClick={() => setView('landing')} className="px-6 py-3 bg-red-500 text-white font-black uppercase text-xs rounded-xl">Fermer</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className={`${STYLES.glassCard} p-8 border-l-8 border-indigo-600`}>
                <p className="text-xs font-black uppercase opacity-40">Total Dossiers</p>
                <p className="text-6xl font-black italic">{dbData.length}</p>
              </div>
              <div className={`${STYLES.glassCard} p-8 border-l-8 border-purple-600`}>
                <p className="text-xs font-black uppercase opacity-40">Groupes</p>
                <p className="text-6xl font-black italic">{[...new Set(dbData.map(d => d.student_group))].length}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0A0A0B] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase opacity-50">
                  <tr>
                    <th className="p-6">Nom</th>
                    <th className="p-6">Groupe</th>
                    <th className="p-6">Stress (H2)</th>
                    <th className="p-6">Motivation (F2)</th>
                    <th className="p-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dbData.map(row => (
                    <tr key={row.id} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="p-6 font-bold">{row.full_name}</td>
                      <td className="p-6"><span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg text-[10px] font-black uppercase">{row.student_group}</span></td>
                      <td className="p-6 text-center font-bold">{row.h2}</td>
                      <td className="p-6 text-center font-bold">{row.f2}</td>
                      <td className="p-6 opacity-40 text-xs">{new Date(row.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Global Errors */}
      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-red-500 text-white px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl animate-bounce">
          <AlertTriangle/> <span className="font-bold">{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}
    </div>
  );
}

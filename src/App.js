import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, Moon, Sun, ChevronRight, ChevronLeft, CheckCircle, 
  ShieldCheck, RefreshCcw, ListTodo, Brain, Clock, Smartphone,
  BarChart3, Download, Users, AlertTriangle, Eye, Trash2, Search
} from 'lucide-react';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import 'chart.js/auto';

// --- DATABASE CONFIGURATION ---
const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Kc9W9PuMbUoFg31Y7BdKcA_11Fveyve'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- THE MASSIVE 50-QUESTION SCHEMA ---
const surveySchema = [
  // SECTION 1: HABITS
  { id: 'q1', section: 'MÉTHODES', label: 'Planification hebdomadaire', type: 'select', options: ['Calendrier numérique', 'Agenda papier', 'Aucune'] },
  { id: 'q2', section: 'MÉTHODES', label: 'Technique de mémorisation', type: 'select', options: ['Répétition espacée', 'Lecture simple', 'Fiches de révision'] },
  { id: 'q3', section: 'MÉTHODES', label: 'Efficacité du travail de groupe', type: 'range' },
  { id: 'q4', section: 'MÉTHODES', label: 'Nombre d’heures d’étude / jour', type: 'select', options: ['< 2h', '2h-5h', '5h-8h', '> 8h'] },
  { id: 'q5', section: 'MÉTHODES', label: 'Niveau de procrastination', type: 'range' },
  { id: 'q6', section: 'MÉTHODES', label: 'Utilisation de l’IA (ChatGPT, etc.)', type: 'select', options: ['Quotidien', 'Rarement', 'Jamais'] },
  { id: 'q7', section: 'MÉTHODES', label: 'Prise de notes', type: 'select', options: ['Manuscrite', 'Ordinateur', 'Dictaphone'] },
  { id: 'q8', section: 'MÉTHODES', label: 'Révision avant examen', type: 'select', options: ['1 mois avant', '1 semaine avant', 'Nuit blanche'] },
  { id: 'q9', section: 'MÉTHODES', label: 'Compréhension immédiate en cours', type: 'range' },
  { id: 'q10', section: 'MÉTHODES', label: 'Participation active en classe', type: 'range' },

  // SECTION 2: DIGITAL
  { id: 'q11', section: 'DIGITAL', label: 'Temps d’écran total par jour', type: 'select', options: ['< 3h', '3h-6h', '6h-9h', '> 9h'] },
  { id: 'q12', section: 'DIGITAL', label: 'Notifications activées en étude', type: 'select', options: ['Oui', 'Seulement appels', 'Non, mode avion'] },
  { id: 'q13', section: 'DIGITAL', label: 'Utilisation de TikTok/Reels', type: 'range' },
  { id: 'q14', section: 'DIGITAL', label: 'Recherche de sources fiables en ligne', type: 'range' },
  { id: 'q15', section: 'DIGITAL', label: 'Sentiment de dépendance numérique', type: 'range' },
  { id: 'q16', section: 'DIGITAL', label: 'Qualité du setup informatique', type: 'range' },
  { id: 'q17', section: 'DIGITAL', label: 'Écoute de musique en révisant', type: 'select', options: ['Lo-fi/Classique', 'Pop/Rap', 'Silence complet'] },
  { id: 'q18', section: 'DIGITAL', label: 'Nombre d’onglets ouverts', type: 'range' },
  { id: 'q19', section: 'DIGITAL', label: 'Usage de deux écrans', type: 'select', options: ['Oui', 'Non'] },
  { id: 'q20', section: 'DIGITAL', label: 'Achat de cours en ligne', type: 'select', options: ['Oui', 'Non'] },

  // SECTION 3: SANTÉ & BIEN-ÊTRE
  { id: 'q21', section: 'SANTÉ', label: 'Heures de sommeil par nuit', type: 'select', options: ['< 5h', '5h-7h', '7h-9h', '> 9h'] },
  { id: 'q22', section: 'SANTÉ', label: 'Consommation de caféine', type: 'range' },
  { id: 'q23', section: 'SANTÉ', label: 'Pratique d’une activité physique', type: 'select', options: ['Quotidienne', 'Hebdomadaire', 'Rare', 'Jamais'] },
  { id: 'q24', section: 'SANTÉ', label: 'Qualité de l’alimentation', type: 'range' },
  { id: 'q25', section: 'SANTÉ', label: 'Sentiment d’isolement social', type: 'range' },
  { id: 'q26', section: 'SANTÉ', label: 'Niveau de stress global', type: 'range' },
  { id: 'q27', section: 'SANTÉ', label: 'Consommation d’eau par jour', type: 'select', options: ['< 1L', '1L-2L', '> 2L'] },
  { id: 'q28', section: 'SANTÉ', label: 'Fréquence des maux de tête', type: 'range' },
  { id: 'q29', section: 'SANTÉ', label: 'Méditation ou respiration', type: 'select', options: ['Oui', 'Non'] },
  { id: 'q30', section: 'SANTÉ', label: 'Sorties entre amis', type: 'select', options: ['Trop souvent', 'Assez', 'Pas assez'] },

  // SECTION 4: ACADÉMIQUE
  { id: 'q31', section: 'ACADÉMIQUE', label: 'Confiance en la réussite', type: 'range' },
  { id: 'q32', section: 'ACADÉMIQUE', label: 'Clarté du projet professionnel', type: 'range' },
  { id: 'q33', section: 'ACADÉMIQUE', label: 'Assiduité aux cours', type: 'select', options: ['100%', '75%', '50%', '< 25%'] },
  { id: 'q34', section: 'ACADÉMIQUE', label: 'Relation avec les professeurs', type: 'range' },
  { id: 'q35', section: 'ACADÉMIQUE', label: 'Moyenne générale souhaitée', type: 'select', options: ['Top 10%', 'Moyenne', 'Juste valider'] },
  { id: 'q36', section: 'ACADÉMIQUE', label: 'Peur de l’échec', type: 'range' },
  { id: 'q37', section: 'ACADÉMIQUE', label: 'Facilité à s’exprimer à l’oral', type: 'range' },
  { id: 'q38', section: 'ACADÉMIQUE', label: 'Intérêt pour les matières', type: 'range' },
  { id: 'q39', section: 'ACADÉMIQUE', label: 'Utilisation de la bibliothèque', type: 'select', options: ['Tous les jours', 'Parfois', 'Jamais'] },
  { id: 'q40', section: 'ACADÉMIQUE', label: 'Travail en avance sur le programme', type: 'range' },

  // SECTION 5: ENVIRONNEMENT & FUTUR
  { id: 'q41', section: 'FUTUR', label: 'Niveau de motivation actuel', type: 'range' },
  { id: 'q42', section: 'FUTUR', label: 'Besoin de soutien financier', type: 'select', options: ['Élevé', 'Moyen', 'Nul'] },
  { id: 'q43', section: 'FUTUR', label: 'Stabilité du logement', type: 'range' },
  { id: 'q44', section: 'FUTUR', label: 'Sentiment de fatigue chronique', type: 'range' },
  { id: 'q45', section: 'FUTUR', label: 'Ambition de carrière', type: 'range' },
  { id: 'q46', section: 'FUTUR', label: 'Connaissance du marché du travail', type: 'range' },
  { id: 'q47', section: 'FUTUR', label: 'Importance du salaire futur', type: 'range' },
  { id: 'q48', section: 'FUTUR', label: 'Pression familiale', type: 'range' },
  { id: 'q49', section: 'FUTUR', label: 'Capacité de résilience', type: 'range' },
  { id: 'q50', section: 'FUTUR', label: 'Satisfaction globale de la vie', type: 'range' },
];

export default function SphinxApp() {
  // --- STATES ---
  const [view, setView] = useState('survey');
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [adminPass, setAdminPass] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResponse, setSelectedResponse] = useState(null);

  const [form, setForm] = useState(
    surveySchema.reduce((acc, q) => ({ ...acc, [q.id]: q.type === 'range' ? '3' : '' }), {})
  );

  // --- EFFECTS ---
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('sphinx_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // --- PAGINATION LOGIC ---
  const qPerStep = 5;
  const totalSteps = Math.ceil(surveySchema.length / qPerStep);
  const currentQuestions = surveySchema.slice((step - 1) * qPerStep, step * qPerStep);

  // --- DATABASE ACTIONS ---
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
    if (!error) setResponses(data);
    setLoading(false);
  };

  const submitSurvey = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('student_surveys').insert([form]);
    if (!error) setView('success');
    else alert("Erreur réseau: " + error.message);
    setLoading(false);
  };

  // --- ANALYTICS ENGINE ---
  const stats = useMemo(() => {
    if (!responses.length) return { avgStress: 0, avgMotivation: 0, riskRatio: 0 };
    const stress = responses.reduce((a, b) => a + parseInt(b.q26 || 0), 0) / responses.length;
    const motivation = responses.reduce((a, b) => a + parseInt(b.q41 || 0), 0) / responses.length;
    const highStress = responses.filter(r => parseInt(r.q26) >= 4).length;
    return {
      avgStress: stress.toFixed(1),
      avgMotivation: motivation.toFixed(1),
      riskRatio: ((highStress / responses.length) * 100).toFixed(0)
    };
  }, [responses]);

  // --- RENDERERS ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-all duration-700 selection:bg-indigo-500 selection:text-white">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* HEADER */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/5 bg-white/60 dark:bg-[#020617]/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView('survey')}>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 rotate-6 group-hover:rotate-0 transition-all duration-500">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter italic leading-none">SPHINX<span className="text-indigo-600">.CORE</span></h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">System Diagnostic 50</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <NavButton active={view === 'survey'} label="Diagnostic" onClick={() => setView('survey')} />
            <NavButton active={view === 'dashboard' || view === 'admin-login'} label="Command Center" onClick={() => setView(isAuthorized ? 'dashboard' : 'admin-login')} />
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10"></div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:scale-110 active:scale-90 transition-all shadow-xl">
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative z-10">
        
        {/* 1. SURVEY VIEW */}
        {view === 'survey' && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-indigo-600/10 rounded-full">
                  <span className="text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest italic">Phase {step} // 0{totalSteps}</span>
                </div>
                <h2 className="text-7xl font-black tracking-tighter uppercase italic leading-[0.8]">Analyse <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Académique</span></h2>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-mono text-6xl opacity-5 italic">{step < 10 ? `0${step}` : step}</span>
                <div className="flex gap-1.5">
                  {Array.from({length: totalSteps}).map((_, i) => (
                    <div key={i} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${step > i ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/10'}`}></div>
                  ))}
                </div>
              </div>
            </header>

            <form onSubmit={submitSurvey} className="space-y-12">
              <Card className="p-12 space-y-16">
                <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-8 opacity-40 uppercase font-black text-xs tracking-[0.5em]">
                  <ListTodo size={20}/> <span>Catégorie: {currentQuestions[0]?.section}</span>
                </div>

                {currentQuestions.map((q) => (
                  <div key={q.id} className="group space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                    <label className="block text-4xl font-black tracking-tighter italic leading-none group-hover:text-indigo-500 transition-colors">
                      {q.label}
                    </label>
                    
                    {q.type === 'select' ? (
                      <div className="relative">
                        <select 
                          className="w-full p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-transparent focus:border-indigo-600 outline-none font-black text-xl transition-all appearance-none cursor-pointer"
                          value={form[q.id]}
                          onChange={(e) => setForm({...form, [q.id]: e.target.value})}
                        >
                          <option value="">Sélectionner une réponse...</option>
                          {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 rotate-90" />
                      </div>
                    ) : (
                      <div className="space-y-6 px-4">
                        <input 
                          type="range" min="1" max="5" step="1"
                          className="w-full h-4 bg-slate-100 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-600"
                          value={form[q.id]}
                          onChange={(e) => setForm({...form, [q.id]: e.target.value})}
                        />
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] opacity-30 italic">
                          <span>Niveau Faible</span>
                          <span className="text-indigo-500 opacity-100">Valeur: {form[q.id]}</span>
                          <span>Niveau Critique</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </Card>

              <div className="flex flex-col md:flex-row gap-6">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step-1)} className="btn-secondary flex-1">
                    <ChevronLeft size={24}/> RETOUR
                  </button>
                )}
                
                {step < totalSteps ? (
                  <button type="button" onClick={() => setStep(step+1)} className="btn-primary flex-[2]">
                    CONTINUER <ChevronRight size={24}/>
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="btn-success flex-[2]">
                    {loading ? <RefreshCcw className="animate-spin" /> : 'FINALISER L\'INJECTION'}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* 2. SUCCESS VIEW */}
        {view === 'success' && (
          <div className="text-center py-40 animate-in zoom-in duration-1000">
            <div className="relative inline-block mb-12">
              <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative w-32 h-32 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-12">
                <CheckCircle size={64} />
              </div>
            </div>
            <h2 className="text-8xl font-black italic uppercase tracking-tighter mb-6">Traitement <br/> <span className="text-emerald-500">Réussi</span></h2>
            <p className="text-slate-500 dark:text-slate-400 text-2xl font-medium max-w-xl mx-auto mb-16 leading-relaxed">
              Les 50 paramètres de votre profil ont été cryptés et injectés dans le terminal de décision.
            </p>
            <button onClick={() => window.location.reload()} className="btn-primary max-w-xs mx-auto italic uppercase tracking-[0.2em]">Nouveau Dossier</button>
          </div>
        )}

        {/* 3. ADMIN LOGIN */}
        {view === 'admin-login' && (
          <div className="max-w-md mx-auto animate-in zoom-in duration-700 pt-10">
            <Card className="p-12 text-center space-y-10">
              <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center mx-auto">
                <ShieldCheck size={40} className="text-indigo-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">Terminal Admin</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Identification requise</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="password" placeholder="Passcode" 
                  className="w-full p-6 bg-slate-50 dark:bg-white/5 rounded-2xl text-center font-black text-2xl tracking-[0.5em] focus:ring-2 ring-indigo-600 outline-none transition-all"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                />
                <button 
                  onClick={() => { if(adminPass === 'ADMIN123'){ setIsAuthorized(true); setView('dashboard'); fetchData(); } else alert('Accès Refusé'); }}
                  className="btn-primary w-full py-6"
                >
                  DÉVERROUILLER
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* 4. DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-slate-200 dark:border-white/5 pb-10">
              <div className="space-y-2">
                <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Command <br/> <span className="text-indigo-600">Center</span></h2>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Données en temps réel</p>
                </div>
              </div>
              
              <div className="flex gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30" />
                  <input 
                    type="text" placeholder="Rechercher un ID..." 
                    className="w-full pl-14 pr-6 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-bold focus:ring-2 ring-indigo-600 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button onClick={fetchData} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/30 hover:rotate-180 transition-all duration-700 active:scale-90">
                  <RefreshCcw size={24} />
                </button>
              </div>
            </header>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <KpiCard icon={<Users size={20}/>} label="Dossiers Totaux" value={responses.length} color="indigo" />
              <KpiCard icon={<Brain size={20}/>} label="Stress Moyen" value={stats.avgStress} color="emerald" sub="/ 5" />
              <KpiCard icon={<AlertTriangle size={20}/>} label="Index Risque" value={`${stats.riskRatio}%`} color="red" />
            </div>

            {/* DATA TABLE */}
            <Card className="overflow-hidden border-none shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 uppercase text-[10px] font-black tracking-widest opacity-60 border-b border-slate-200 dark:border-white/5">
                      <th className="p-8">ID Dossier</th>
                      <th className="p-8">Date d'Injection</th>
                      <th className="p-8 text-center">Score Stress</th>
                      <th className="p-8 text-center">Score Motivation</th>
                      <th className="p-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {responses.filter(r => r.id.toString().includes(searchQuery)).map((res) => (
                      <tr key={res.id} className="hover:bg-indigo-600/5 transition-all group">
                        <td className="p-8 font-black font-mono text-indigo-600">#SPX-{res.id}</td>
                        <td className="p-8 font-bold opacity-60 text-sm">{new Date(res.created_at).toLocaleDateString('fr-FR')}</td>
                        <td className="p-8 text-center">
                          <span className={`px-4 py-2 rounded-full font-black text-xs ${parseInt(res.q26) >= 4 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {res.q26}/5
                          </span>
                        </td>
                        <td className="p-8 text-center">
                          <span className="px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-full font-black text-xs">
                            {res.q41}/5
                          </span>
                        </td>
                        <td className="p-8 text-right space-x-3">
                          <button onClick={() => setSelectedResponse(res)} className="p-3 bg-slate-100 dark:bg-white/10 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                            <Eye size={18}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* RESPONSE MODAL */}
        {selectedResponse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
            <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto p-12 relative animate-in zoom-in duration-300">
              <button onClick={() => setSelectedResponse(null)} className="absolute top-10 right-10 p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                FErmer
              </button>
              <h2 className="text-4xl font-black italic mb-10 border-b border-white/5 pb-6">Dossier #SPX-{selectedResponse.id}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {surveySchema.map(q => (
                  <div key={q.id} className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">{q.section}</p>
                    <p className="font-bold text-sm mb-3">{q.label}</p>
                    <p className="text-xl font-black text-indigo-500 italic">{selectedResponse[q.id] || '---'}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* --- SHARED STYLES --- */}
      <style>{`
        .input-style { @apply w-full p-8 bg-slate-50 dark:bg-[#0A0A0A] rounded-3xl border-2 border-transparent focus:border-indigo-600 outline-none font-black text-xl transition-all appearance-none cursor-pointer; }
        .range-style { @apply w-full h-4 bg-slate-200 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-600; }
        .btn-primary { @apply flex items-center justify-center gap-4 bg-indigo-600 text-white p-8 rounded-[2rem] font-black text-2xl shadow-2xl shadow-indigo-600/40 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95; }
        .btn-secondary { @apply flex items-center justify-center gap-4 border-2 border-slate-200 dark:border-white/10 p-8 rounded-[2rem] font-black text-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all; }
        .btn-success { @apply flex items-center justify-center gap-4 bg-emerald-600 text-white p-8 rounded-[2rem] font-black text-2xl shadow-2xl shadow-emerald-600/40 hover:bg-emerald-700 transition-all active:scale-95 italic uppercase tracking-widest; }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[3.5rem] shadow-2xl ${className}`}>
      {children}
    </div>
  );
}

function NavButton({ active, label, onClick }) {
  return (
    <button onClick={onClick} className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all relative py-2 ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-400'}`}>
      {label}
      {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full animate-in slide-in-from-left-2"></span>}
    </button>
  );
}

function KpiCard({ icon, label, value, color, sub }) {
  const colors = {
    indigo: "text-indigo-600 border-indigo-600/20 shadow-indigo-600/10",
    emerald: "text-emerald-500 border-emerald-500/20 shadow-emerald-500/10",
    red: "text-red-500 border-red-500/20 shadow-red-500/10"
  };
  return (
    <Card className={`p-10 border-l-[10px] ${colors[color]} shadow-xl group hover:-translate-y-2 transition-all`}>
      <div className="flex items-center gap-3 opacity-40 font-black text-[10px] tracking-widest uppercase mb-4">
        {icon} <span>{label}</span>
      </div>
      <h4 className="text-7xl font-black italic tracking-tighter leading-none group-hover:scale-110 transition-transform origin-left">
        {value} <span className="text-xl not-italic opacity-30 font-medium">{sub}</span>
      </h4>
    </Card>
  );
}

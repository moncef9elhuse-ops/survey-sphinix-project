import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, Moon, Sun, CheckCircle, Shield, Lock, Activity, Brain, User, 
  Target, Layers, Smartphone, AlertTriangle, Cpu, Globe, Search, Download, TrendingUp,
  Skull, GraduationCap, BarChart3
} from 'lucide-react';

// ============================================================================
// 1. CONFIGURATION & DATABASE
// ============================================================================
const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGVjb3piYWZvemVoZWR0aGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzU2NDksImV4cCI6MjA4NTM1MTY0OX0.vMKJ-Kb5UqBO1OiokGsv2ayb51AXL79HCzcrUD7WZ0w';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ADMIN_PASS = 'MONCEF2006';

const SURVEY_SCHEMA = [
  {
    id: 'SEC_A_B',
    title: 'Gestion & Organisation',
    questions: [
      { id: 'q1', label: 'Q1. En période d’examens, comment organisez-vous votre temps de révision ?', type: 'select', options: ['Je révise peu', 'Je révise régulièrement', 'Je révise plusieurs heures par jour', 'Je révise intensivement'] },
      { id: 'q2_p1', label: 'Q2. Je planifie mes sessions d’étude à l’avance.', type: 'select', options: ['Pas du tout d’accord', 'Plutôt pas d’accord', 'Neutre', 'Plutôt d’accord', 'Tout à fait d’accord'] },
      { id: 'q3', label: 'Q3. Utilisez-vous une méthode de travail claire pour réviser ?', type: 'select', options: ['Non', 'Oui (1 fois/sem)', 'Oui (2-3 fois/sem)', 'Oui (4-5 fois/sem)', 'Oui (Toujours)'] },
      { id: 'q4', label: 'Q4. Fixez-vous des objectifs précis pour chaque séance ?', type: 'select', options: ['Pas du tout', 'Un peu', 'Moyennement', 'Assez', 'Tout à fait'] }
    ]
  },
  {
    id: 'SEC_C_D',
    title: 'Procrastination & Téléphone',
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
    questions: [
      { id: 'q11', label: 'Q11. Quel est votre niveau de stress durant les examens ?', type: 'select', options: ['Faible', 'Moyen', 'Elevé', 'Très élevé'] },
      { id: 'q12', label: 'Q12. Le manque de temps vous stresse-t-il ?', type: 'select', options: ['Pas du tout', 'Un peu', 'Moyennement', 'Assez', 'Tout à fait'] }
    ]
  }
];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('landing');
  const [currentModule, setCurrentModule] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState({ full_name: '', student_group: '', sexe: '', age: '', cycle: '', etablissement: '' });
  const [answers, setAnswers] = useState({});
  const [adminData, setAdminData] = useState([]);
  const [passAttempt, setPassAttempt] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // ============================================================================
  // LOGIC: SCORING & CONSEQUENCES (L3AWA9IB)
  // ============================================================================
  const getScore = (val) => {
    const mapping = { 
      'Faible': 1, 'Moyen': 2, 'Elevé': 3, 'Très élevé': 4,
      'Pas du tout': 1, 'Un peu': 2, 'Moyennement': 3, 'Assez': 4, 'Tout à fait': 5,
      'À la dernière minute': 5, 'Tardivement': 4, 'Assez tôt': 2, 'Très en avance': 1
    };
    return mapping[val] || parseInt(val) || 0;
  };

  const analyzeProfile = (row) => {
    const stress = getScore(row.q11);
    const phone = parseInt(row.q7) || 0;
    const procras = getScore(row.q6);

    if (stress >= 3 && phone >= 4) {
      return {
        class: "A Risque Élevé",
        color: "text-red-500",
        consequences: "Risque de décrochage, dégradation des notes, et épuisement mental imminent."
      };
    } else if (procras >= 4) {
      return {
        class: "Procrastinateur Chronique",
        color: "text-orange-500",
        consequences: "Rattrapages probables, accumulation de lacunes techniques, instabilité du parcours."
      };
    }
    return {
      class: "Stable / Équilibré",
      color: "text-emerald-500",
      consequences: "Validation normale, progression académique saine."
    };
  };

  const stats = useMemo(() => {
    if (!adminData.length) return null;
    const data = { gender: { Homme: { s: 0, c: 0 }, Femme: { s: 0, c: 0 } }, age: {} };
    adminData.forEach(r => {
      if (data.gender[r.sexe]) { data.gender[r.sexe].s += getScore(r.q11); data.gender[r.sexe].c += 1; }
      if (!data.age[r.age]) data.age[r.age] = { s: 0, c: 0 };
      data.age[r.age].s += getScore(r.q11); data.age[r.age].c += 1;
    });
    return data;
  }, [adminData]);

  // ============================================================================
  // ACTIONS
  // ============================================================================
  const loadAdmin = async () => {
    if (passAttempt === ADMIN_PASS) {
      setLoading(true);
      const { data } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
      setAdminData(data || []);
      setView('dashboard');
      setLoading(false);
    } else alert("Code Incorrect");
  };

  const submitSurvey = async () => {
    setLoading(true);
    const { error: sbError } = await supabase.from('student_surveys').insert([{ ...student, ...answers }]);
    if (sbError) alert(sbError.message); else setView('success');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050507] text-slate-900 dark:text-white transition-colors duration-500 font-sans">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-xl border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
          <Zap className="text-indigo-600" fill="currentColor"/>
          <span className="font-black italic uppercase text-xl tracking-tighter">Mir<span className="text-indigo-500">.Tool</span></span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10">
            {theme === 'dark' ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-indigo-600"/>}
          </button>
          <button onClick={() => setView('admin-login')} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10"><Lock size={18}/></button>
        </div>
      </nav>

      <main className="pt-32 px-6 max-w-4xl mx-auto pb-20">
        
        {view === 'landing' && (
          <div className="text-center py-20 animate-in fade-in zoom-in">
            <h1 className="text-8xl md:text-9xl font-black italic uppercase tracking-tighter">Mir <br/><span className="text-indigo-500">Tool</span></h1>
            <p className="mt-6 text-xl font-bold opacity-40">Analyse de l'impact numérique sur le parcours académique.</p>
            <button onClick={() => setView('identity')} className="mt-12 bg-indigo-600 text-white font-black uppercase py-6 px-16 rounded-2xl hover:scale-105 transition-transform shadow-2xl">Lancer l'étude</button>
          </div>
        )}

        {view === 'identity' && (
          <div className="bg-white dark:bg-[#0c0c0e] p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-6 animate-in slide-in-from-bottom-10">
            <h2 className="text-3xl font-black italic uppercase text-center"><User className="inline mr-2 text-indigo-500"/> Identification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500" placeholder="Nom Complet" onChange={e => setStudent({...student, full_name: e.target.value})}/>
              <input className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500" placeholder="Groupe" onChange={e => setStudent({...student, student_group: e.target.value})}/>
              <select className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold" onChange={e => setStudent({...student, sexe: e.target.value})}>
                <option value="">Sexe</option><option value="Homme">Homme</option><option value="Femme">Femme</option>
              </select>
              <select className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold" onChange={e => setStudent({...student, age: e.target.value})}>
                <option value="">Âge</option><option value="18-20">18-20 ans</option><option value="21-23">21-23 ans</option><option value="24+">24+ ans</option>
              </select>
              <select className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold" onChange={e => setStudent({...student, etablissement: e.target.value})}>
                <option value="">Établissement</option><option value="ENCG">ENCG</option><option value="ENSAM">ENSAM</option><option value="EST">EST</option><option value="FS">FS</option>
              </select>
            </div>
            <button disabled={!student.full_name || !student.sexe} onClick={() => setView('survey')} className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl">Continuer</button>
          </div>
        )}

        {view === 'survey' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="p-10 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl">
               <h2 className="text-4xl font-black italic uppercase">{SURVEY_SCHEMA[currentModule].title}</h2>
            </div>
            {SURVEY_SCHEMA[currentModule].questions.map(q => (
              <div key={q.id} className="bg-white dark:bg-[#0c0c0e] p-8 rounded-[2rem] shadow-lg border border-transparent hover:border-indigo-500/20 transition-all">
                <label className="text-lg font-bold mb-6 block">{q.label}</label>
                {q.type === 'range' ? (
                  <div className="space-y-4">
                    <input type="range" min={q.min} max={q.max} className="w-full accent-indigo-600" onChange={e => setAnswers({...answers, [q.id]: e.target.value})}/>
                    <div className="flex justify-between text-[10px] font-black uppercase opacity-40"><span>Faible</span><span>Elevé</span></div>
                  </div>
                ) : (
                  <select className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold text-black dark:text-white" onChange={e => setAnswers({...answers, [q.id]: e.target.value})}>
                    <option value="">Sélectionner...</option>
                    {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}
              </div>
            ))}
            <div className="flex gap-4">
              <button onClick={() => currentModule < SURVEY_SCHEMA.length - 1 ? setCurrentModule(m => m + 1) : submitSurvey()} className="w-full p-6 bg-indigo-600 text-white rounded-2xl font-black uppercase shadow-xl">
                {currentModule === SURVEY_SCHEMA.length - 1 ? 'Soumettre' : 'Suivant'}
              </button>
            </div>
          </div>
        )}

        {view === 'admin-login' && (
          <div className="max-w-md mx-auto bg-white dark:bg-[#0c0c0e] p-12 rounded-[2.5rem] shadow-2xl text-center space-y-8 animate-in zoom-in">
            <Shield size={60} className="mx-auto text-indigo-500"/>
            <h3 className="text-xl font-black uppercase">Administration</h3>
            <input 
              type="password" 
              autoFocus
              placeholder="CODE D'ACCÈS" 
              className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl text-center font-black tracking-[0.5em] focus:ring-2 ring-indigo-500 outline-none" 
              onChange={e => setPassAttempt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadAdmin()} 
            />
            <button onClick={loadAdmin} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase shadow-lg">Entrer</button>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="fixed inset-0 z-[100] bg-[#F8FAFC] dark:bg-[#050507] overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-10">
              <div className="flex justify-between items-center border-b border-black/5 dark:border-white/10 pb-8">
                <h2 className="text-4xl font-black italic uppercase flex items-center gap-4"><TrendingUp className="text-indigo-500"/> Rapport Scientifique 2026</h2>
                <button onClick={() => setView('landing')} className="bg-red-500 text-white px-8 py-3 rounded-xl font-black uppercase text-xs">Fermer</button>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#0c0c0e] p-8 rounded-3xl shadow-xl border-l-8 border-indigo-500">
                  <span className="text-[10px] font-black uppercase opacity-40">Hypothèse</span>
                  <p className="text-sm font-bold mt-2 italic">"Le smartphone altère directement la capacité de mémorisation en période d'examen."</p>
                </div>
                <div className="bg-white dark:bg-[#0c0c0e] p-8 rounded-3xl shadow-xl border-l-8 border-pink-500">
                  <span className="text-[10px] font-black uppercase opacity-40">Moyenne Stress (Femmes)</span>
                  <p className="text-4xl font-black mt-2">{(stats.gender.Femme.s / (stats.gender.Femme.c || 1)).toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-[#0c0c0e] p-8 rounded-3xl shadow-xl border-l-8 border-blue-500">
                  <span className="text-[10px] font-black uppercase opacity-40">Moyenne Stress (Hommes)</span>
                  <p className="text-4xl font-black mt-2">{(stats.gender.Homme.s / (stats.gender.Homme.c || 1)).toFixed(2)}</p>
                </div>
              </div>

              {/* TABLE DES CONSÉQUENCES */}
              <div className="bg-white dark:bg-[#0c0c0e] rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
                  <h3 className="font-black uppercase flex items-center gap-2"><Skull size={20}/> Classification & Conséquences Académiques</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase">
                      <tr>
                        <th className="p-6">Étudiant / Âge</th>
                        <th className="p-6">Classification</th>
                        <th className="p-6">L3awa9ib (Conséquences)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      {adminData.map(row => {
                        const analysis = analyzeProfile(row);
                        return (
                          <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <td className="p-6">
                              <span className="uppercase italic block">{row.full_name}</span>
                              <span className="text-[10px] opacity-40">{row.age} ans | {row.etablissement}</span>
                            </td>
                            <td className={`p-6 uppercase text-xs ${analysis.color}`}>
                              <span className="bg-current/10 px-3 py-1 rounded-full">{analysis.class}</span>
                            </td>
                            <td className="p-6 text-xs max-w-xs leading-relaxed opacity-80">
                              {analysis.consequences}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'success' && (
          <div className="text-center py-20 space-y-10">
            <CheckCircle size={100} className="mx-auto text-emerald-500 animate-bounce"/>
            <h2 className="text-6xl font-black italic uppercase">Données Enregistrées</h2>
            <button onClick={() => window.location.reload()} className="p-6 bg-indigo-600 text-white rounded-2xl font-black px-16 shadow-xl">Nouveau Sondage</button>
          </div>
        )}

      </main>

      {loading && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center text-white">
          <Cpu size={50} className="animate-spin mb-4 text-indigo-500"/>
          <p className="font-black uppercase tracking-widest text-xs">Traitement des Données...</p>
        </div>
      )}
    </div>
  );
}

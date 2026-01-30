import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Zap, Moon, Sun, CheckCircle, Shield, Lock, Activity, Brain, User, 
  Target, Layers, Smartphone, AlertTriangle, Cpu, Globe, Search, Download, TrendingUp 
} from 'lucide-react';

// ============================================================================
// 1. CONFIGURATION
// ============================================================================
const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGVjb3piYWZvemVoZWR0aGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzU2NDksImV4cCI6MjA4NTM1MTY0OX0.vMKJ-Kb5UqBO1OiokGsv2ayb51AXL79HCzcrUD7WZ0w';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ADMIN_PASS = 'TITAN2026';

const SURVEY_SCHEMA = [
  {
    id: 'SEC_A_B',
    title: 'Gestion & Organisation',
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
      { id: 'q9', label: 'Q9. Difficultés de concentration après usage prolongé ?', type: 'select', options: ['Aucun impact', 'Impact faible', 'Impact moyen', 'Impact important', 'Impact très important'] },
      { id: 'q10', label: 'Q10. Votre téléphone vous fatigue-t-il plus qu’il ne vous détend ?', type: 'select', options: ['Pas du tout', 'Un peu', 'Moyennement', 'Énormément'] },
      { id: 'q11', label: 'Q11. Quel est votre niveau de stress durant les examens ?', type: 'select', options: ['Faible', 'Moyen', 'Elevé', 'Très élevé'] },
      { id: 'q12', label: 'Q12. Le manque de temps vous stresse-t-il ?', type: 'select', options: ['Pas du tout', 'Un peu', 'Moyennement', 'Assez', 'Tout à fait'] }
    ]
  },
  {
    id: 'SEC_G_H',
    title: 'Anxiété & Sommeil',
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
    questions: [
      { id: 'q17', label: 'Q17. Vous sentez-vous suffisamment préparé(e) ?', type: 'select', options: ['Très bien', 'Assez bien', 'Moyennement', 'Peu', 'Pas du tout'] },
      { id: 'q18', label: 'Q18. Considérez-vous vos révisions comme efficaces ?', type: 'select', options: ['Pas du tout d’accord', 'Plutôt pas d’accord', 'Neutre', 'Plutôt d’accord', 'Tout à fait d’accord'] },
      { id: 'q19', label: 'Q19. Avez-vous confiance en vos performances ?', type: 'select', options: ['Pas du tout d’accord', 'Plutôt pas d’accord', 'Neutre', 'Plutôt d’accord', 'Tout à fait d’accord'] },
      { id: 'q20', label: 'Q20. Atteignez-vous généralement vos objectifs ?', type: 'select', options: ['Echec objectifs', 'Satisfait(e)', 'Progression régulière', 'Atteinte objectifs', 'Succès constant'] }
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

  // Analytics Helpers
  const getStressScore = (val) => {
    const mapping = { 'Faible': 1, 'Moyen': 2, 'Elevé': 3, 'Très élevé': 4 };
    return mapping[val] || 0;
  };

  const analytics = useMemo(() => {
    if (!adminData.length) return {};
    return adminData.reduce((acc, row) => {
      const etab = row.etablissement || 'Inconnu';
      if (!acc[etab]) acc[etab] = { count: 0, stressTotal: 0 };
      acc[etab].count += 1;
      acc[etab].stressTotal += getStressScore(row.q11);
      return acc;
    }, {});
  }, [adminData]);

  // Export Logic
  const exportToCSV = () => {
    if (!adminData.length) return;
    const headers = Object.keys(adminData[0]).join(',');
    const rows = adminData.map(row => Object.values(row).map(v => `"${v}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Survey_Export_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const submitSurvey = async () => {
    setLoading(true);
    const { error: sbError } = await supabase.from('student_surveys').insert([{ ...student, ...answers }]);
    if (sbError) setError(sbError.message); else setView('success');
    setLoading(false);
  };

  const loadAdmin = async () => {
    if (passAttempt === ADMIN_PASS) {
      setLoading(true);
      const { data } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
      setAdminData(data || []);
      setView('dashboard');
      setLoading(false);
    } else setError("Accès Refusé");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050507] text-slate-900 dark:text-white transition-colors duration-500 font-sans">
      
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-xl border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
          <Zap className="text-indigo-600" fill="currentColor"/>
          <span className="font-black italic uppercase text-xl tracking-tighter">Sphinx<span className="text-indigo-500">.V5</span></span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10">
            {theme === 'dark' ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-indigo-600"/>}
          </button>
          <button onClick={() => setView('admin-login')} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10"><Lock size={18}/></button>
        </div>
      </nav>

      <main className="pt-32 px-6 max-w-3xl mx-auto min-h-[80vh]">
        
        {view === 'landing' && (
          <div className="text-center py-20 space-y-10 animate-in fade-in zoom-in">
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">Audit<br/><span className="text-indigo-500 text-6xl md:text-8xl">Académique</span></h1>
            <p className="text-xl font-bold opacity-40 max-w-lg mx-auto leading-relaxed">Protocole de recherche standardisé 2026.</p>
            <button onClick={() => setView('identity')} className="bg-indigo-600 text-white font-black uppercase tracking-widest py-6 px-16 rounded-2xl shadow-xl hover:scale-105 transition-transform">Initialiser</button>
          </div>
        )}

        {view === 'identity' && (
          <div className="bg-white dark:bg-[#0c0c0e] p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-6">
            <h2 className="text-3xl font-black italic uppercase text-center"><User className="inline mr-2"/>Profil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl outline-none font-bold focus:ring-2 ring-indigo-500" placeholder="Nom Complet" onChange={e => setStudent({...student, full_name: e.target.value})}/>
              <input className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl outline-none font-bold focus:ring-2 ring-indigo-500" placeholder="Groupe" onChange={e => setStudent({...student, student_group: e.target.value})}/>
              <select className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold" onChange={e => setStudent({...student, sexe: e.target.value})}>
                <option value="">Sexe</option><option value="Homme">Homme</option><option value="Femme">Femme</option>
              </select>
              <select className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold" onChange={e => setStudent({...student, age: e.target.value})}>
                <option value="">Âge</option><option value="Moins de 20 ans">Moins de 20 ans</option><option value="20-25 ans">20-25 ans</option><option value="25-30 ans">25-30 ans</option><option value="Plus de 30 ans">Plus de 30 ans</option>
              </select>
              <select className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold" onChange={e => setStudent({...student, cycle: e.target.value})}>
                <option value="">Cycle</option><option value="Bac+2">Bac+2</option><option value="Bac+3">Bac+3</option><option value="Bac+4">Bac+4</option><option value="Bac+5">Bac+5</option><option value="Doctorat">Doctorat</option>
              </select>
              <select className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold" onChange={e => setStudent({...student, etablissement: e.target.value})}>
                <option value="">Établissement</option><option value="ENCG">ENCG</option><option value="ENSAM">ENSAM</option><option value="EST">EST</option><option value="ENS">ENS</option><option value="FS">FS</option><option value="FSJES">FSJES</option><option value="FLSH">FLSH</option><option value="FPE">FPE</option><option value="FSTE">FSTE</option>
              </select>
            </div>
            <button disabled={!student.full_name || !student.sexe || !student.etablissement} onClick={() => setView('survey')} className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-lg">Continuer</button>
          </div>
        )}

        {view === 'survey' && (
          <div className="space-y-8 pb-20">
            <div className="p-10 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl">
               <span className="text-[10px] font-black uppercase opacity-60">Module 0{currentModule + 1}</span>
               <h2 className="text-4xl font-black italic uppercase mt-2">{SURVEY_SCHEMA[currentModule].title}</h2>
            </div>
            {SURVEY_SCHEMA[currentModule].questions.map(q => (
              <div key={q.id} className="bg-white dark:bg-[#0c0c0e] p-8 rounded-[2rem] shadow-xl border border-transparent hover:border-indigo-500/20 transition-all">
                <label className="text-lg font-bold mb-6 block leading-snug">{q.label}</label>
                {q.type === 'range' ? (
                  <div className="space-y-4">
                    <input type="range" min={q.min} max={q.max} defaultValue="3" className="w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none accent-indigo-600" onChange={e => setAnswers({...answers, [q.id]: e.target.value})}/>
                    <div className="flex justify-between text-[10px] font-black uppercase opacity-40"><span>Faible</span><span className="text-indigo-500 text-lg">{answers[q.id] || 3}</span><span>Elevé</span></div>
                  </div>
                ) : (
                  <select className="w-full bg-slate-100 dark:bg-white/5 p-4 rounded-xl font-bold text-black dark:text-white" onChange={e => setAnswers({...answers, [q.id]: e.target.value})}>
                    <option value="">Répondre ici...</option>
                    {q.options.map(opt => <option key={opt} value={opt} className="text-black">{opt}</option>)}
                  </select>
                )}
              </div>
            ))}
            <div className="flex gap-4">
              <button disabled={currentModule === 0} onClick={() => setCurrentModule(m => m - 1)} className="flex-1 p-5 bg-white dark:bg-white/5 rounded-2xl font-black uppercase text-xs">Retour</button>
              <button onClick={() => currentModule < 4 ? setCurrentModule(m => m + 1) : submitSurvey()} className="flex-[2] p-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl">
                {currentModule === 4 ? 'Finaliser' : 'Suivant'}
              </button>
            </div>
          </div>
        )}

        {view === 'success' && (
          <div className="text-center py-20 space-y-10 animate-in zoom-in">
            <CheckCircle size={100} className="mx-auto text-emerald-500"/>
            <h2 className="text-6xl font-black italic uppercase">Terminé</h2>
            <button onClick={() => window.location.reload()} className="p-6 bg-indigo-600 text-white rounded-2xl font-black px-16 shadow-xl">Nouveau Profil</button>
          </div>
        )}

        {view === 'admin-login' && (
          <div className="max-w-sm mx-auto bg-white dark:bg-[#0c0c0e] p-12 rounded-[2.5rem] shadow-2xl text-center space-y-8 animate-in fade-in">
            <Shield size={50} className="mx-auto text-indigo-500"/>
            <input type="password" placeholder="CODE ADMIN" className="w-full bg-slate-100 dark:bg-white/5 p-5 rounded-2xl text-center font-black tracking-widest" onChange={e => setPassAttempt(e.target.value)}/>
            <button onClick={loadAdmin} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase">Entrer</button>
          </div>
        )}
      </main>

      {/* ADMIN DASHBOARD */}
      {view === 'dashboard' && (
        <div className="fixed inset-0 z-[100] bg-[#F8FAFC] dark:bg-[#050507] overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center border-b border-black/5 dark:border-white/10 pb-8">
              <h2 className="text-4xl font-black italic uppercase flex items-center gap-3"><TrendingUp className="text-indigo-500"/> Analytics</h2>
              <div className="flex gap-4">
                <button onClick={exportToCSV} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2"><Download size={16}/> CSV Export</button>
                <button onClick={() => setView('landing')} className="bg-red-500 text-white px-6 py-3 rounded-xl font-black uppercase text-xs">Quitter</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#0c0c0e] p-8 rounded-3xl shadow-xl border-l-8 border-indigo-500"><span className="text-[10px] font-black uppercase opacity-40">Réponses</span><p className="text-5xl font-black italic mt-2">{adminData.length}</p></div>
              <div className="bg-white dark:bg-[#0c0c0e] p-8 rounded-3xl shadow-xl border-l-8 border-red-500"><span className="text-[10px] font-black uppercase opacity-40">Stress Global</span><p className="text-5xl font-black italic mt-2 text-red-500">{(adminData.reduce((a, b) => a + getStressScore(b.q11), 0) / adminData.length).toFixed(2)}</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white dark:bg-[#0c0c0e] p-10 rounded-[2.5rem] shadow-2xl">
                 <h3 className="text-xl font-black uppercase mb-6">Par Établissement (Stress Q11)</h3>
                 <div className="space-y-4">
                    {Object.entries(analytics).map(([name, data]) => (
                      <div key={name} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-black"><span>{name}</span><span>{data.count} Étudiants</span></div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500" style={{ width: `${(data.stressTotal / (data.count * 4)) * 100}%` }}/>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
               
               <div className="bg-white dark:bg-[#0c0c0e] rounded-[2.5rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[400px]">
                 <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-[#161618] uppercase font-black p-4 tracking-tighter">
                      <tr><th className="p-4">Nom</th><th className="p-4">Groupe</th><th className="p-4">Stress</th></tr>
                    </thead>
                    <tbody className="font-bold divide-y divide-black/5 dark:divide-white/5">
                      {adminData.map(row => (
                        <tr key={row.id}>
                          <td className="p-4 italic uppercase">{row.full_name}</td>
                          <td className="p-4 opacity-50">{row.student_group}</td>
                          <td className="p-4"><span className="text-red-500">{row.q11}</span></td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center text-white text-center">
          <Cpu size={50} className="animate-spin mb-4 text-indigo-500"/>
          <p className="font-black uppercase tracking-[0.4em] text-xs">Synchronisation...</p>
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 20px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 24px; width: 24px; border-radius: 50%; background: #6366f1; border: 4px solid #fff; }
      `}</style>
    </div>
  );
}

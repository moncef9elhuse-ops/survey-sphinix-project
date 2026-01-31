import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Moon, Sun, CheckCircle, Lock, Cpu, 
  ChevronRight, User, Shield, BarChart3, AlertTriangle 
} from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- DATABASE SETUP ---
const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGVjb3piYWZvemVoZWR0aGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzU2NDksImV4cCI6MjA4NTM1MTY0OX0.vMKJ-Kb5UqBO1OiokGsv2ayb51AXL79HCzcrUD7WZ0w';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ADMIN_PASS = 'MONCEF2006';

// --- 11 QUESTION SCHEMA ---
const SURVEY_SCHEMA = [
  {
    title: 'Organisation & Rythme',
    questions: [
      { id: 'q1', label: 'Comment évaluez-vous votre organisation ?', type: 'select', options: ['Nulle', 'Moyenne', 'Bonne', 'Excellente'] },
      { id: 'q2', label: 'Heures de révision par jour ?', type: 'select', options: ['0-2h', '2-4h', '4-6h', '6h+'] },
      { id: 'q3', label: 'Utilisez-vous un planning fixe ?', type: 'select', options: ['Jamais', 'Parfois', 'Souvent', 'Toujours'] },
      { id: 'q4', label: 'Objectifs par séance (1-5) ?', type: 'range', min: 1, max: 5 }
    ]
  },
  {
    title: 'Environnement & Hygiène',
    questions: [
      { id: 'q5', label: 'Heures de sommeil moyennes ?', type: 'select', options: ['-5h', '5-7h', '7-9h', '9h+'] },
      { id: 'q6', label: 'Réviser avec de la musique ?', type: 'select', options: ['Oui', 'Non'] },
      { id: 'q7', label: 'Dépendance au téléphone (1-5) ?', type: 'range', min: 1, max: 5 },
      { id: 'q8', label: 'Fréquence des pauses ?', type: 'select', options: ['Toutes les 30min', 'Toutes les 1h', 'Toutes les 2h', 'Rarement'] }
    ]
  },
  {
    title: 'Psychologie & Santé',
    questions: [
      { id: 'q9', label: 'Révision : Seul ou en groupe ?', type: 'select', options: ['Seul', 'En groupe'] },
      { id: 'q10', label: 'Sport durant les examens ?', type: 'select', options: ['Oui', 'Non'] },
      { id: 'q11', label: 'Niveau de stress actuel (1-5) ?', type: 'range', min: 1, max: 5 }
    ]
  }
];

export default function MirToolApp() {
  const [view, setView] = useState('landing');
  const [theme, setTheme] = useState('dark');
  const [currentMod, setCurrentMod] = useState(0);
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [pass, setPass] = useState('');
  
  const [student, setStudent] = useState({ full_name: '', etablissement: '', sexe: '' });
  const [answers, setAnswers] = useState({});

  // SPI ALGORITHM
  const calculateSPI = (data) => {
    let score = 55; 
    if (data.q1 === 'Excellente') score += 12;
    if (data.q3 === 'Toujours') score += 10;
    if (data.q10 === 'Oui') score += 5;
    if (data.q2 === '6h+') score += 8;
    score += (parseInt(data.q4) || 3) * 2;
    score -= (parseInt(data.q7) || 3) * 6; // Phone Impact
    score -= (parseInt(data.q11) || 3) * 4; // Stress Impact
    return Math.max(5, Math.min(98, score));
  };

  const submitFinal = async () => {
    setLoading(true);
    try {
      await supabase.from('student_surveys').insert([{ ...student, ...answers }]);
      setView('success');
    } catch (err) { alert("Database Connection Error"); }
    setLoading(false);
  };

  const loginAdmin = async () => {
    if (pass === ADMIN_PASS) {
      setLoading(true);
      const { data } = await supabase.from('student_surveys').select('*');
      setAdminData(data || []);
      setView('admin');
      setLoading(false);
    } else alert("Code Incorrect");
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-[#030303] text-slate-900 dark:text-white transition-all font-sans overflow-x-hidden">
        
        {/* HEADER */}
        <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-xl border-b dark:border-white/5">
          <div className="text-2xl font-black italic tracking-tighter uppercase cursor-pointer" onClick={() => setView('landing')}>
            MIR<span className="text-indigo-600">.TOOL</span>
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full border dark:border-white/10">
            {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
        </nav>

        <main className="max-w-5xl mx-auto p-4 pt-32 pb-20">
          
          {view === 'landing' && (
            <div className="text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8]">
                Student<br/><span className="text-indigo-600 underline decoration-4 underline-offset-8">Metrics.</span>
              </h1>
              <p className="text-xs font-black opacity-30 tracking-[0.4em] uppercase">Moteur Prédictif de Performance Académique</p>
              <div className="flex flex-col items-center gap-6">
                <button onClick={() => setView('id')} className="bg-indigo-600 text-white font-black px-16 py-7 rounded-2xl text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl">Lancer l'Analyse</button>
                <button onClick={() => setView('login')} className="flex items-center gap-2 text-[10px] font-black opacity-20 hover:opacity-100 uppercase tracking-widest transition-opacity">
                  <Lock size={12}/> Terminal Administrateur
                </button>
              </div>
            </div>
          )}

          {view === 'id' && (
            <div className="max-w-md mx-auto bg-white dark:bg-[#08080a] p-10 rounded-[2.5rem] shadow-2xl border dark:border-white/5 animate-in zoom-in duration-300">
              <h2 className="text-2xl font-black mb-8 italic uppercase flex items-center gap-3"><User className="text-indigo-600"/> Profil</h2>
              <div className="space-y-4">
                <input className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl font-bold border-2 border-transparent focus:border-indigo-600 outline-none transition-all" placeholder="Nom et Prénom" onChange={e => setStudent({...student, full_name: e.target.value})}/>
                <select className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl font-bold border-2 border-transparent outline-none" onChange={e => setStudent({...student, etablissement: e.target.value})}>
                  <option value="">Établissement</option>
                  <option value="ENCG">ENCG</option><option value="ENSAM">ENSAM</option><option value="EST">EST</option><option value="FS">FS</option>
                </select>
                <button onClick={() => setView('survey')} className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl mt-4">Suivant</button>
              </div>
            </div>
          )}

          {view === 'survey' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="p-8 bg-indigo-600 text-white rounded-[2rem] shadow-2xl flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">{SURVEY_SCHEMA[currentMod].title}</h2>
                  <p className="text-[10px] font-black opacity-60 uppercase mt-1">Étape {currentMod + 1} / 3</p>
                </div>
                <ChevronRight size={40} className="opacity-20"/>
              </div>

              {SURVEY_SCHEMA[currentMod].questions.map(q => (
                <div key={q.id} className="bg-white dark:bg-[#08080a] p-8 rounded-[2rem] border dark:border-white/5 shadow-sm">
                  <label className="text-[10px] font-black uppercase opacity-40 mb-4 block tracking-widest">{q.label}</label>
                  {q.type === 'range' ? (
                    <div className="flex gap-4 items-center pt-2">
                      <span className="text-xs font-black opacity-20">1</span>
                      <input type="range" min={q.min} max={q.max} className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer" onChange={e => setAnswers({...answers, [q.id]: e.target.value})}/>
                      <span className="text-xs font-black opacity-20">5</span>
                    </div>
                  ) : (
                    <select className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-xl font-bold border-2 border-transparent focus:border-indigo-600 outline-none transition-all" onChange={e => setAnswers({...answers, [q.id]: e.target.value})}>
                      <option value="">Sélectionner une option...</option>
                      {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  )}
                </div>
              ))}
              
              <button 
                onClick={() => currentMod < 2 ? setCurrentMod(currentMod + 1) : submitFinal()}
                className="w-full bg-indigo-600 text-white font-black py-6 rounded-3xl text-lg uppercase tracking-tighter shadow-2xl hover:bg-indigo-700 transition-colors"
              >
                {currentMod === 2 ? 'Calculer mes résultats' : 'Passer à la suite'}
              </button>
            </div>
          )}

          {view === 'login' && (
            <div className="max-w-sm mx-auto p-12 bg-white dark:bg-[#08080a] rounded-[3rem] shadow-2xl border dark:border-white/5 text-center">
              <Shield size={50} className="mx-auto mb-6 text-indigo-600"/>
              <input type="password" placeholder="Passcode" className="w-full bg-slate-50 dark:bg-white/5 p-5 rounded-2xl text-center font-black mb-4 border-2 border-transparent focus:border-indigo-600 outline-none" onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && loginAdmin()}/>
              <button onClick={loginAdmin} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest">Connecter</button>
            </div>
          )}

          {view === 'admin' && (
            <div className="space-y-10 animate-in fade-in duration-1000">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <h2 className="text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                  <BarChart3 className="text-indigo-600" size={40}/> Analytics
                </h2>
                <button onClick={() => setView('landing')} className="bg-red-500/10 text-red-500 border border-red-500/20 px-8 py-3 rounded-xl font-black text-xs uppercase">Déconnexion</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminData.map(item => {
                  const spi = calculateSPI(item);
                  const isLow = spi < 45;
                  return (
                    <div key={item.id} className="bg-white dark:bg-[#08080a] p-8 rounded-[2.5rem] border dark:border-white/5 shadow-xl group hover:border-indigo-600/30 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-black uppercase text-xl leading-none mb-1">{item.full_name}</h4>
                          <p className="text-[10px] font-black opacity-30 uppercase">{item.etablissement}</p>
                        </div>
                        <div className={`text-3xl font-black italic ${isLow ? 'text-red-500' : 'text-emerald-500'}`}>{spi}%</div>
                      </div>
                      
                      <div className={`p-4 rounded-2xl mb-4 ${isLow ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                        <p className={`text-[10px] font-black uppercase mb-1 ${isLow ? 'text-red-500' : 'text-emerald-500'}`}>
                          {isLow ? 'Risque de l3awa9ib' : 'Trajectoire Succès'}
                        </p>
                        <div className="flex gap-4 mt-2">
                           <div className="text-center flex-1">
                             <div className="text-xs font-bold">{item.q11}/5</div>
                             <div className="text-[8px] opacity-40 font-black uppercase">Stress</div>
                           </div>
                           <div className="text-center flex-1">
                             <div className="text-xs font-bold">{item.q7}/5</div>
                             <div className="text-[8px] opacity-40 font-black uppercase">Mobile</div>
                           </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'success' && (
            <div className="text-center py-20 space-y-8 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={48}/>
              </div>
              <h2 className="text-7xl font-black italic uppercase tracking-tighter">Transmission Réussie.</h2>
              <p className="max-w-md mx-auto font-bold opacity-30 uppercase tracking-widest text-xs">Données enregistrées dans le serveur central MIR.TOOL</p>
              <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white font-black py-6 px-16 rounded-2xl shadow-2xl hover:scale-105 transition-transform uppercase">Quitter</button>
            </div>
          )}

        </main>

        {loading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
            <Cpu className="text-indigo-600 animate-spin mb-4" size={50}/>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Calcul des Probabilités...</p>
          </div>
        )}

      </div>
    </div>
  );
}

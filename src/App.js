import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  ClipboardList, BarChart3, Lock, RefreshCcw, Download, 
  CheckCircle, Smartphone, Moon, Sun, Brain, Zap, 
  Clock, ShieldCheck, ChevronRight, ChevronLeft, LayoutGrid 
} from 'lucide-react';
import 'chart.js/auto';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Kc9W9PuMbUoFg31Y7BdKcA_11Fveyve';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [view, setView] = useState('survey'); 
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [stats, setStats] = useState({ total: 0, avgStress: 0 });

  const [form, setForm] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: 3, q6: '', q7: 3, q8: 3, q9: 3, q10: '',
    q11: 3, q12: '', q13: 3, q14: '', q15: '', q16: '', q17: 3, q18: '', q19: 3, q20: 3,
    q21: '', q22: '', q23: 1, q24: '', q25: '', q26: '', q27: '', q28: '', q29: 3, q30: ''
  });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
    if (data) {
      setResponses(data);
      const avg = data.reduce((acc, curr) => acc + (curr.q13 || 0), 0) / data.length;
      setStats({ total: data.length, avgStress: avg.toFixed(1) });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('student_surveys').insert([form]);
    setLoading(false);
    if (!error) setView('success');
    else alert("Database Error: " + error.message);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'ADMIN123') { setIsAuthorized(true); fetchData(); setView('dashboard'); }
    else alert("Accès Refusé");
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-white transition-all duration-300">
        
        {/* Nav Bar */}
        <nav className="flex justify-between items-center p-6 px-10 sticky top-0 bg-white/5 dark:bg-[#0F172A]/5 backdrop-blur-2xl z-50 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center rotate-3 shadow-lg shadow-indigo-500/20">
              <LayoutGrid size={18} className="text-white -rotate-3" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">Sphinx<span className="text-indigo-600">.io</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setView('survey')} className={`text-xs font-black uppercase tracking-widest ${view === 'survey' ? 'text-indigo-600' : 'text-slate-400'}`}>Sondage</button>
            <button onClick={() => setView(isAuthorized ? 'dashboard' : 'admin-login')} className={`text-xs font-black uppercase tracking-widest ${view === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>Analytics</button>
            <button onClick={() => setDarkMode(!darkMode)} className="hover:scale-110 transition-transform">
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-16">
          
          {/* SURVEY VIEW */}
          {view === 'survey' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <header className="flex justify-between items-end">
                <div className="space-y-2">
                  <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Bilan<br/>Etudiant</h2>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Étape {step} / 3 — {Math.round((step/3)*100)}%</p>
                </div>
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3].map(s => <div key={s} className={`h-1.5 w-10 rounded-full transition-all ${step >= s ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/10'}`}></div>)}
                </div>
              </header>

              <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                    <Section title="Méthodes & Travail" icon={<Clock size={20}/>}>
                      <Question label="Q1. Organisation des révisions">
                        <select className="input-style" value={form.q1} onChange={e => setForm({...form, q1: e.target.value})}>
                          <option value="">Sélectionner...</option><option>Planning strict</option><option>Au feeling</option><option>Dernière minute</option>
                        </select>
                      </Question>
                      <Question label="Q5. Procrastination (1-5)">
                        <input type="range" min="1" max="5" value={form.q5} className="range-style" onChange={e => setForm({...form, q5: e.target.value})} />
                      </Question>
                    </Section>
                    <button type="button" onClick={() => setStep(2)} className="w-full bg-indigo-600 text-white p-6 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">SUIVANT <ChevronRight size={20}/></button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                    <Section title="Digital & Focus" icon={<Smartphone size={20}/>}>
                      <Question label="Q7. Téléphone en révision (1-5)">
                        <input type="range" min="1" max="5" value={form.q7} className="range-style" onChange={e => setForm({...form, q7: e.target.value})} />
                      </Question>
                      <Question label="Q11. Impact Réseaux Sociaux (1-5)">
                        <input type="range" min="1" max="5" value={form.q11} className="range-style" onChange={e => setForm({...form, q11: e.target.value})} />
                      </Question>
                    </Section>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-200 dark:bg-white/10 p-6 rounded-2xl font-black">RETOUR</button>
                      <button type="button" onClick={() => setStep(3)} className="flex-[2] bg-indigo-600 text-white p-6 rounded-2xl font-black">SUIVANT</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                    <Section title="Bien-être & Mental" icon={<Brain size={20}/>}>
                      <Question label="Q13. Stress Global (1-5)">
                        <input type="range" min="1" max="5" value={form.q13} className="range-style" onChange={e => setForm({...form, q13: e.target.value})} />
                      </Question>
                      <Question label="Q29. Motivation Actuelle (1-5)">
                        <input type="range" min="1" max="5" value={form.q29} className="range-style" onChange={e => setForm({...form, q29: e.target.value})} />
                      </Question>
                    </Section>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setStep(2)} className="flex-1 bg-slate-200 dark:bg-white/10 p-6 rounded-2xl font-black">RETOUR</button>
                      <button type="submit" disabled={loading} className="flex-[2] bg-emerald-600 text-white p-6 rounded-2xl font-black text-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all">
                        {loading ? 'ENVOI...' : 'FINALISER'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* SUCCESS VIEW */}
          {view === 'success' && (
            <div className="text-center py-20 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_20px_50px_rgba(79,70,229,0.4)] rotate-12">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-6xl font-black tracking-tighter uppercase mb-4 italic">Confirmé.</h2>
              <p className="text-slate-500 text-xl max-w-md mx-auto mb-12">Données synchronisées avec le serveur central Sphinx.</p>
              <button onClick={() => window.location.reload()} className="bg-slate-900 dark:bg-white dark:text-black text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs">Nouveau Dossier</button>
            </div>
          )}

          {/* ADMIN LOGIN */}
          {view === 'admin-login' && (
            <div className="max-w-md mx-auto bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[3rem] text-center shadow-2xl">
              <ShieldCheck size={64} className="mx-auto text-indigo-600 mb-8" />
              <h2 className="text-3xl font-black mb-10 tracking-tighter uppercase italic">Espace Admin</h2>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input type="password" placeholder="Passcode" className="w-full p-5 bg-slate-50 dark:bg-white/5 rounded-2xl text-center font-bold outline-none ring-indigo-500 focus:ring-2" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
                <button type="submit" className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-sm">Entrer</button>
              </form>
            </div>
          )}

          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <header className="flex justify-between items-center">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Analytics Dashboard</h2>
                <button onClick={fetchData} className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl active:rotate-180 transition-all duration-500"><RefreshCcw size={20}/></button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Dossiers" value={stats.total} />
                <StatCard label="Stress Moyen" value={stats.avgStress} sub="/ 5" />
                <button className="bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all">
                  <Download size={24}/>
                  <span className="font-black uppercase tracking-widest text-[10px]">Exporter CSV</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10">
                   <Bar data={{
                    labels: ['Stress', 'Motivation', 'Tél', 'Proc.'],
                    datasets: [{
                      label: 'Niveau Moyen',
                      data: [stats.avgStress, 3.2, 4.1, 2.8],
                      backgroundColor: '#4f46e5',
                      borderRadius: 10
                    }]
                   }} />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        .input-style { @apply w-full p-5 rounded-2xl border-2 bg-transparent border-slate-100 dark:border-white/10 focus:border-indigo-600 outline-none font-bold transition-all; }
        .range-style { @apply w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600; }
      `}</style>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-10 rounded-[3rem] shadow-xl">
      <div className="flex items-center gap-3 mb-10 opacity-40 uppercase font-black text-[10px] tracking-[0.4em]">
        {icon} <span>{title}</span>
      </div>
      <div className="space-y-10">{children}</div>
    </div>
  );
}

function Question({ label, children }) {
  return (
    <div className="space-y-5">
      <label className="block text-2xl font-black tracking-tighter italic">{label}</label>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
      <h4 className="text-4xl font-black">{value} <span className="text-lg text-slate-500 font-medium">{sub}</span></h4>
    </div>
  );
}

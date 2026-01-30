import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  ClipboardList, BarChart3, RefreshCcw, CheckCircle, 
  Smartphone, Moon, Sun, Brain, Clock, ChevronRight, 
  ChevronLeft, LayoutGrid, ShieldCheck, Download, Zap, Heart
} from 'lucide-react';
import 'chart.js/auto';

// --- DATABASE CONFIG ---
const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGVjb3piYWZvemVoZWR0aGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzU2NDksImV4cCI6MjA4NTM1MTY0OX0.vMKJ-Kb5UqBO1OiokGsv2ayb51AXL79HCzcrUD7WZ0w'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [view, setView] = useState('survey'); 
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const [form, setForm] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: 3, q6: '',
    q7: 3, q8: 3, q9: 3, q10: '', q11: 3, q12: '',
    q13: 3, q14: '', q15: '', q16: '', q17: 3, q18: '',
    q19: 3, q20: 3, q21: '', q22: '', q23: 1, q24: '',
    q25: '', q26: '', q27: '', q28: '', q29: 3, q30: ''
  });

  // Calculate Progress
  const filledCount = Object.values(form).filter(v => v !== '' && v !== 0).length;
  const progress = (filledCount / 30) * 100;

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
    if (data) setResponses(data);
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
      <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white transition-all duration-500 font-sans">
        
        {/* PROGRESS BAR */}
        <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 dark:bg-white/5 z-[100]">
          <div className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-700" style={{ width: `${progress}%` }}></div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex justify-between items-center p-6 px-10 sticky top-0 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl z-50 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center rotate-3 shadow-lg"><LayoutGrid size={22} className="text-white -rotate-3" /></div>
            <span className="text-2xl font-black tracking-tighter uppercase italic tracking-widest">SPHINX<span className="text-indigo-600">.IO</span></span>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => setView('survey')} className={`text-xs font-black uppercase tracking-[0.2em] ${view === 'survey' ? 'text-indigo-600' : 'text-slate-400'}`}>Sondage</button>
            <button onClick={() => setView(isAuthorized ? 'dashboard' : 'admin-login')} className={`text-xs font-black uppercase tracking-[0.2em] ${view === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>Admin</button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
              {darkMode ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} className="text-indigo-600" />}
            </button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-16">
          
          {/* 1. SURVEY VIEW */}
          {view === 'survey' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <header className="flex justify-between items-end border-l-4 border-indigo-600 pl-6">
                <div className="space-y-1">
                  <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none">Bilan<br/>Étudiant</h2>
                  <p className="text-slate-500 font-black uppercase text-xs tracking-[0.3em]">Phase {step} de 3</p>
                </div>
              </header>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* STEP 1: WORK HABITS */}
                {step === 1 && (
                  <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                    <Section title="Efficacité & Organisation" icon={<Clock className="text-amber-500"/>}>
                      <Question label="Q1. Rythme d'organisation global">
                        <select className="input-style" value={form.q1} onChange={e => setForm({...form, q1: e.target.value})}>
                          <option value="">Sélectionner...</option>
                          <option>Très structuré (Planning)</option>
                          <option>Modéré (Au jour le jour)</option>
                          <option>Désorganisé (Dernière minute)</option>
                        </select>
                      </Question>
                      <Question label="Q5. Tendance à la procrastination (1-5)">
                        <input type="range" min="1" max="5" value={form.q5} className="range-style" onChange={e => setForm({...form, q5: parseInt(e.target.value)})} />
                      </Question>
                    </Section>
                    <button type="button" onClick={() => setStep(2)} className="btn-primary">CONTINUER <ChevronRight size={20}/></button>
                  </div>
                )}

                {/* STEP 2: DIGITAL & WELLBEING */}
                {step === 2 && (
                  <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                    <Section title="Focus & Santé Mentale" icon={<Brain className="text-purple-500"/>}>
                      <Question label="Q7. Utilisation smartphone en étude (1-5)">
                        <input type="range" min="1" max="5" value={form.q7} className="range-style" onChange={e => setForm({...form, q7: parseInt(e.target.value)})} />
                      </Question>
                      <Question label="Q13. Niveau de stress actuel (1-5)">
                        <input type="range" min="1" max="5" value={form.q13} className="range-style" onChange={e => setForm({...form, q13: parseInt(e.target.value)})} />
                      </Question>
                    </Section>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setStep(1)} className="btn-secondary">RETOUR</button>
                      <button type="button" onClick={() => setStep(3)} className="btn-primary">SUIVANT</button>
                    </div>
                  </div>
                )}

                {/* STEP 3: PERFORMANCE & FUTURE */}
                {step === 3 && (
                  <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                    <Section title="Ambitions & Résultats" icon={<Zap className="text-emerald-500"/>}>
                      <Question label="Q29. Motivation pour ce semestre (1-5)">
                        <input type="range" min="1" max="5" value={form.q29} className="range-style" onChange={e => setForm({...form, q29: parseInt(e.target.value)})} />
                      </Question>
                      <Question label="Q30. Confiance en votre réussite">
                        <select className="input-style" value={form.q30} onChange={e => setForm({...form, q30: e.target.value})}>
                          <option value="">Sélectionner...</option>
                          <option>Absolue</option><option>Incertaine</option><option>Faible</option>
                        </select>
                      </Question>
                    </Section>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setStep(2)} className="btn-secondary">RETOUR</button>
                      <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? 'TRANSMISSION...' : 'TRANSMETTRE LE BILAN'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* 2. SUCCESS VIEW */}
          {view === 'success' && (
            <div className="text-center py-24 animate-in zoom-in duration-700">
              <div className="w-28 h-28 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-[0_20px_60px_rgba(16,185,129,0.4)] rotate-12">
                <CheckCircle size={56} />
              </div>
              <h2 className="text-7xl font-black tracking-tighter uppercase italic mb-6">Enregistré.</h2>
              <p className="text-slate-500 text-2xl max-w-md mx-auto mb-12 font-medium">Tes données ont été sécurisées dans la base Sphinx.</p>
              <button onClick={() => window.location.reload()} className="bg-slate-900 dark:bg-white dark:text-black text-white px-16 py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all">Nouveau Bilan</button>
            </div>
          )}

          {/* 3. ADMIN LOGIN VIEW */}
          {view === 'admin-login' && (
            <div className="max-w-md mx-auto bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[3.5rem] shadow-2xl animate-in zoom-in">
              <ShieldCheck size={64} className="mx-auto text-indigo-600 mb-8" />
              <h2 className="text-3xl font-black text-center mb-10 uppercase italic">Espace Sécurisé</h2>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input type="password" placeholder="Code Administrateur" className="input-style text-center" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
                <button type="submit" className="btn-primary w-full">DÉVERROUILLER</button>
              </form>
            </div>
          )}

          {/* 4. DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <header className="flex justify-between items-center">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Tableau de Bord</h2>
                <div className="flex gap-4">
                   <button onClick={fetchData} className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:rotate-180 transition-all duration-500"><RefreshCcw size={22}/></button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <StatCard label="Total Réponses" value={responses.length} />
                <StatCard label="Stress Moyen" value={(responses.reduce((a,b)=>a+(b.q13||0),0)/responses.length || 0).toFixed(1)} sub="/ 5" />
              </div>

              <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] border border-slate-200 dark:border-white/10">
                <Bar data={{
                  labels: ['Stress', 'Motivation', 'Tél', 'Proc.'],
                  datasets: [{
                    label: 'Moyenne Globale',
                    data: [
                      (responses.reduce((a,b)=>a+(b.q13||0),0)/responses.length),
                      (responses.reduce((a,b)=>a+(b.q29||0),0)/responses.length),
                      (responses.reduce((a,b)=>a+(b.q7||0),0)/responses.length),
                      (responses.reduce((a,b)=>a+(b.q5||0),0)/responses.length)
                    ],
                    backgroundColor: '#6366f1',
                    borderRadius: 12
                  }]
                }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COMPONENT STYLES */}
      <style>{`
        .input-style { @apply w-full p-6 rounded-2xl border-2 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus:border-indigo-600 outline-none font-bold transition-all dark:text-white; }
        .range-style { @apply w-full h-3 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600; }
        .btn-primary { @apply w-full bg-indigo-600 text-white p-7 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95; }
        .btn-secondary { @apply flex-1 border-2 border-slate-200 dark:border-white/10 p-7 rounded-[2rem] font-black text-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all; }
        .btn-submit { @apply flex-[2] bg-emerald-600 text-white p-7 rounded-[2rem] font-black text-xl italic hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all; }
      `}</style>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[3.5rem] shadow-2xl">
      <div className="flex items-center gap-4 mb-12 opacity-50 font-black text-xs uppercase tracking-[0.4em]">
        {icon} <span>{title}</span>
      </div>
      <div className="space-y-12">{children}</div>
    </div>
  );
}

function Question({ label, children }) {
  return (
    <div className="space-y-6">
      <label className="block text-3xl font-black tracking-tighter italic leading-none">{label}</label>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-sm">
      <p className="text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest mb-3">{label}</p>
      <h4 className="text-6xl font-black italic tracking-tighter">{value} <span className="text-xl text-slate-400 not-italic font-medium">{sub}</span></h4>
    </div>
  );
}

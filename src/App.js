import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { ClipboardList, BarChart3, Lock, RefreshCcw, Download, CheckCircle, Smartphone, Moon, Sun, Brain, Zap, Target, Clock, ShieldCheck } from 'lucide-react';
import 'chart.js/auto';

const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Kc9W9PuMbUoFg31Y7BdKcA_11Fveyve';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [view, setView] = useState('survey'); 
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);

  const [form, setForm] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: 3, q6: '', q7: 3, q8: 3, q9: 3, q10: '',
    q11: 3, q12: '', q13: 3, q14: '', q15: '', q16: '', q17: 3, q18: '', q19: 3, q20: 3,
    q21: '', q22: '', q23: 1, q24: '', q25: '', q26: '', q27: '', q28: '', q29: 3, q30: ''
  });

  useEffect(() => {
    const filled = Object.values(form).filter(v => v !== '' && v !== 0).length;
    setProgress((filled / 30) * 100);
  }, [form]);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
    if (data) setResponses(data);
    setLoading(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'ADMIN123') { setIsAuthorized(true); fetchData(); setView('dashboard'); }
    else { alert("Accès Refusé"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('student_surveys').insert([form]);
    setLoading(false);
    if (!error) setView('success');
  };

  const exportCSV = () => {
    const headers = "ID,Date,Stress,Motivation,Sommeil,Procrastination\n";
    const rows = responses.map(r => `${r.id},${new Date(r.created_at).toLocaleDateString()},${r.q13},${r.q29},${r.q20},${r.q5}\n`).join("");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Sphinx_Data_30.csv'; a.click();
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-all duration-500">
        
        {/* Fixed Progress Bar */}
        {view === 'survey' && (
          <div className="fixed top-0 left-0 w-full h-2 bg-slate-200 dark:bg-slate-800 z-[100]">
            <div className="h-full bg-indigo-600 shadow-[0_0_20px_#4f46e5] transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex justify-between items-center p-4 px-8 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50 border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-4 font-bold">
            <button onClick={() => setView('survey')} className={`flex items-center gap-2 px-5 py-2 rounded-2xl transition-all ${view === 'survey' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}><ClipboardList size={18}/> Sondage</button>
            <button onClick={() => setView(isAuthorized ? 'dashboard' : 'admin-login')} className={`flex items-center gap-2 px-5 py-2 rounded-2xl transition-all ${view === 'dashboard' ? 'bg-slate-900 dark:bg-white dark:text-black text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}><BarChart3 size={18}/> Analyse</button>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform">
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
          </button>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {view === 'survey' && (
            <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <header className="text-center space-y-4">
                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">Sphinx Analytical Research</span>
                <h1 className="text-6xl font-black tracking-tighter italic">Étude 30</h1>
              </header>

              <Section title="Gestion du Temps" icon={<Clock className="text-amber-500"/>}>
                <Question label="Q1. Rythme de révisions hebdomadaire"><select className="input-style" onChange={e => setForm({...form, q1: e.target.value})}><option value="">Choisir...</option><option>Faible</option><option>Régulier</option><option>Intensif</option></select></Question>
                <Question label="Q5. Niveau de procrastination (1-5)"><input type="range" min="1" max="5" className="range-style" onChange={e => setForm({...form, q5: parseInt(e.target.value)})} /></Question>
              </Section>

              <Section title="Digital & Focus" icon={<Smartphone className="text-blue-500"/>}>
                <Question label="Q7. Usage téléphone en révision (1-5)"><input type="range" min="1" max="5" className="range-style" onChange={e => setForm({...form, q7: parseInt(e.target.value)})} /></Question>
                <Question label="Q11. Influence des réseaux sociaux (1-5)"><input type="range" min="1" max="5" className="range-style" onChange={e => setForm({...form, q11: parseInt(e.target.value)})} /></Question>
              </Section>

              <Section title="État Psychologique" icon={<Brain className="text-purple-500"/>}>
                <Question label="Q13. Stress général (1-5)"><input type="range" min="1" max="5" className="range-style" onChange={e => setForm({...form, q13: parseInt(e.target.value)})} /></Question>
                <Question label="Q29. Motivation actuelle (1-5)"><input type="range" min="1" max="5" className="range-style" onChange={e => setForm({...form, q29: parseInt(e.target.value)})} /></Question>
              </Section>

              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-8 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all hover:-translate-y-1">
                {loading ? "TRANSMISSION..." : "SOUMETTRE LES 30 RÉPONSES"}
              </button>
            </form>
          )}

          {view === 'admin-login' && (
            <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-center animate-in zoom-in">
              <ShieldCheck size={64} className="mx-auto text-indigo-600 mb-6" />
              <h2 className="text-3xl font-black mb-8 tracking-tight">Espace Admin</h2>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input type="password" placeholder="Code Secret..." className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center font-bold text-xl outline-none focus:ring-2 ring-indigo-500" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
                <button type="submit" className="w-full bg-slate-900 dark:bg-indigo-600 text-white p-5 rounded-2xl font-black tracking-widest">DÉVERROUILLER</button>
              </form>
            </div>
          )}

          {view === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div>
                  <h2 className="text-3xl font-black tracking-tight">Analytique Sphinx</h2>
                  <p className="text-slate-500 font-medium">{responses.length} réponses collectées</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={exportCSV} className="bg-emerald-100 text-emerald-700 px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-emerald-200 transition-all"><Download size={16}/> EXPORTER CSV</button>
                  <button onClick={fetchData} className="p-4 bg-indigo-50 dark:bg-slate-800 text-indigo-600 rounded-2xl hover:rotate-180 transition-all duration-500"><RefreshCcw size={20}/></button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ChartCard title="Moyennes Globales (Niveau /5)">
                  <Bar data={{
                    labels: ['Stress', 'Motivation', 'Détresse Tél', 'Procrastination'],
                    datasets: [{
                      label: 'Moyenne Étudiante',
                      data: [
                        (responses.reduce((a, b) => a + (b.q13 || 0), 0) / responses.length).toFixed(1),
                        (responses.reduce((a, b) => a + (b.q29 || 0), 0) / responses.length).toFixed(1),
                        (responses.reduce((a, b) => a + (b.q7 || 0), 0) / responses.length).toFixed(1),
                        (responses.reduce((a, b) => a + (b.q5 || 0), 0) / responses.length).toFixed(1)
                      ],
                      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'],
                      borderRadius: 12
                    }]
                  }} />
                </ChartCard>

                <ChartCard title="Répartition par Type">
                  <Pie data={{
                    labels: ['Faible', 'Régulier', 'Intensif'],
                    datasets: [{
                      data: [
                        responses.filter(r => r.q1 === 'Faible').length,
                        responses.filter(r => r.q1 === 'Régulier').length,
                        responses.filter(r => r.q1 === 'Intensif').length,
                      ],
                      backgroundColor: ['#94a3b8', '#6366f1', '#1e1b4b']
                    }]
                  }} />
                </ChartCard>
              </div>
            </div>
          )}

          {view === 'success' && (
            <div className="text-center bg-white dark:bg-slate-900 p-20 rounded-[4rem] shadow-2xl border-2 border-indigo-50 dark:border-indigo-900/20 animate-in zoom-in">
              <CheckCircle size={100} className="mx-auto text-emerald-500 mb-8 animate-bounce" />
              <h2 className="text-5xl font-black mb-6 italic tracking-tighter">TERMINE !</h2>
              <p className="text-slate-500 text-xl font-medium mb-12">Tes 30 réponses ont été injectées dans la base de données.</p>
              <button onClick={() => setView('survey')} className="bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black text-lg">RETOURNER AU SONDAGE</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .input-style { @apply w-full p-5 rounded-2xl border-2 bg-transparent border-slate-100 dark:border-slate-800 focus:border-indigo-600 outline-none font-bold transition-all dark:text-white; }
        .range-style { @apply w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-xl appearance-none cursor-pointer accent-indigo-600; }
      `}</style>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">{icon}</div>
        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">{title}</h3>
      </div>
      <div className="space-y-10">{children}</div>
    </div>
  );
}

function Question({ label, children }) {
  return (
    <div className="space-y-4">
      <label className="block font-black text-2xl tracking-tighter">{label}</label>
      {children}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">{title}</h3>
      {children}
    </div>
  );
}

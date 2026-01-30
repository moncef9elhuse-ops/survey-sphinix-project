import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Bar, Pie } from 'react-chartjs-2';
import { ClipboardList, BarChart3, Lock, RefreshCcw, Download, CheckCircle, Smartphone, Moon, Sun, Brain, Zap, Target } from 'lucide-react';
import 'chart.js/auto';

// --- CONFIGURATION ---
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
    q1_time: '', q5: 3, q7: 3, q10: '', q11: 3, q14: '', q16: 3, q17: '', q20: '', motivation: 3
  });

  // Track Survey Progress
  useEffect(() => {
    const filled = Object.values(form).filter(v => v !== '' && v !== 0).length;
    setProgress((filled / Object.keys(form).length) * 100);
  }, [form]);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
    if (data) setResponses(data);
    setLoading(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'ADMIN123') { 
      setIsAuthorized(true); 
      fetchData(); 
      setView('dashboard');
    } else { alert("Mot de passe incorrect"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('student_surveys').insert([form]);
      if (error) throw error;
      setView('success');
    } catch (err) { alert("Erreur: " + err.message); }
    finally { setLoading(false); }
  };

  const exportCSV = () => {
    const headers = "Date,Gestion,Stress,Telephone,Sommeil,Preparation\n";
    const rows = responses.map(r => `${new Date(r.created_at).toLocaleDateString()},${r.q1_time},${r.q11},${r.q7},${r.q16},${r.q17}\n`).join("");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sphinx_export.csv'; a.click();
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
        
        {/* Progress Bar */}
        {view === 'survey' && (
          <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 dark:bg-slate-800 z-[100]">
            <div className="h-full bg-indigo-600 transition-all duration-500 shadow-[0_0_10px_#4f46e5]" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {/* Navbar */}
        <nav className="flex justify-between items-center p-4 px-8 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50 border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-4">
            <button onClick={() => setView('survey')} className={`flex items-center gap-2 px-5 py-2 rounded-2xl font-bold transition-all ${view === 'survey' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}><ClipboardList size={18}/> Sondage</button>
            <button onClick={() => setView(isAuthorized ? 'dashboard' : 'admin-login')} className={`flex items-center gap-2 px-5 py-2 rounded-2xl font-bold transition-all ${view === 'dashboard' || view === 'admin-login' ? 'bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}><BarChart3 size={18}/> Analyse</button>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-transform active:scale-90">
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
          </button>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-12">
          {view === 'survey' && (
            <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center space-y-4">
                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Sphinx Pro 2026</span>
                <h1 className="text-5xl font-black tracking-tighter uppercase">Bilan Réussite</h1>
              </div>

              <Section title="Gestion du Temps" icon={<Zap className="text-amber-500"/>}>
                <Question label="Q1. Rythme de révisions hebdomadaire">
                  <div className="grid grid-cols-1 gap-2">
                    {['Peu fréquent', 'Régulier', 'Intensif'].map(opt => (
                      <button key={opt} type="button" onClick={() => setForm({...form, q1_time: opt})} 
                        className={`p-4 rounded-2xl border-2 font-bold text-left transition-all ${form.q1_time === opt ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700' : 'border-slate-100 dark:border-slate-800'}`}>{opt}</button>
                    ))}
                  </div>
                </Question>
              </Section>

              <Section title="Psychologie & Bien-être" icon={<Brain className="text-purple-500"/>}>
                <Question label="Q11. Niveau de stress actuel (1-5)">
                  <input type="range" min="1" max="5" className="w-full h-2 accent-indigo-600" value={form.q11} onChange={e => setForm({...form, q11: parseInt(e.target.value)})} />
                </Question>
                <Question label="Q17. Sentiment de préparation">
                  <select className="w-full p-4 rounded-2xl border-2 dark:bg-slate-900 border-slate-100 dark:border-slate-800 outline-none" onChange={e => setForm({...form, q17: e.target.value})}>
                    <option value="">Sélectionner...</option>
                    <option>Très bien préparé(e)</option>
                    <option>Moyennement préparé(e)</option>
                    <option>Pas du tout préparé(e)</option>
                  </select>
                </Question>
              </Section>

              <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-6 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-indigo-700 transition-all active:scale-95">
                {loading ? "ENVOI..." : "SOUMETTRE LE BILAN"}
              </button>
            </form>
          )}

          {view === 'admin-login' && !isAuthorized && (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] shadow-2xl text-center border border-slate-200 dark:border-slate-800 max-w-md mx-auto">
              <Lock size={48} className="mx-auto text-indigo-600 mb-6" />
              <h2 className="text-2xl font-black mb-6 tracking-tight">Accès Administrateur</h2>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input type="password" placeholder="Pass..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl text-center text-lg focus:border-indigo-600 outline-none transition-all" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
                <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-black">ACCÉDER</button>
              </form>
            </div>
          )}

          {view === 'dashboard' && isAuthorized && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h2 className="text-2xl font-black">ANALYSE SPHINX</h2>
                <div className="flex gap-2">
                  <button onClick={exportCSV} className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2"><Download size={14}/> EXCEL</button>
                  <button onClick={fetchData} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><RefreshCcw size={18} className={loading ? 'animate-spin' : ''}/></button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Stress vs Réussite">
                  <Bar data={{
                    labels: ['Stress', 'Prép.', 'Motivation'],
                    datasets: [{ label: 'Moyennes', data: [
                      responses.reduce((a, b) => a + (b.q11 || 0), 0) / responses.length || 0,
                      responses.filter(r => r.q17?.includes('Très bien')).length,
                      responses.reduce((a, b) => a + (b.motivation || 0), 0) / responses.length || 0
                    ], backgroundColor: '#4f46e5' }]
                  }} />
                </Card>
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 overflow-auto h-80">
                  <table className="w-full text-xs text-left">
                    <thead className="border-b dark:border-slate-800 text-slate-400 uppercase font-black">
                      <tr><th className="p-2">Date</th><th className="p-2">Stress</th><th className="p-2">Gestion</th></tr>
                    </thead>
                    <tbody>
                      {responses.map((r, i) => (
                        <tr key={i} className="border-b dark:border-slate-800">
                          <td className="p-2 text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                          <td className="p-2 font-bold">{r.q11}/5</td>
                          <td className="p-2">{r.q1_time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {view === 'success' && (
            <div className="bg-white dark:bg-slate-900 p-16 rounded-[3rem] shadow-2xl text-center border-2 border-indigo-50 dark:border-indigo-900/30 animate-in zoom-in duration-500">
              <CheckCircle size={80} className="mx-auto text-emerald-500 mb-6" />
              <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">Succès !</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg font-medium">Vos réponses sont maintenant dans la base Sphinx.</p>
              <button onClick={() => setView('survey')} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg">Nouvelle Réponse</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) { 
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">{icon}</div>
        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">{title}</h3>
      </div>
      <div className="space-y-8">{children}</div>
    </div>
  ); 
}

function Question({ label, children }) { 
  return (
    <div className="space-y-4">
      <label className="block font-black text-lg tracking-tight">{label}</label>
      {children}
    </div>
  ); 
}

function Card({ title, children }) { 
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 h-80">
      <h3 className="font-black text-xs uppercase mb-4 text-slate-400">{title}</h3>
      {children}
    </div>
  ); 
}

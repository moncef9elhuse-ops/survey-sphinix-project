import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Bar, Pie } from 'react-chartjs-2';
import { ClipboardList, BarChart3, Lock, RefreshCcw, Download, CheckCircle, Smartphone, Moon, Sun, Brain, Zap, Target } from 'lucide-react';
import 'chart.js/auto';

// Ensure these match your Supabase Dashboard API settings
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
    q1_time: 'Je révise régulièrement', q5: 3, q6: 'Assez tôt',
    q7: 3, q8: 3, q9: 3, q10: 'Moyennement',
    q11: 3, q12: 'Moyennement', q14: 'Moyennement',
    q15: 3, q16: 3, q17: 'Moyennement préparé(e)', q20: 'Je progresse régulièrement'
  });

  useEffect(() => {
    const filled = Object.values(form).filter(v => v !== '').length;
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
    if (adminPass === 'ADMIN123') { setIsAuthorized(true); fetchData(); setView('dashboard'); }
    else { alert("Accès refusé"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('student_surveys').insert([{
        q1_time: form.q1_time, q5_procr_freq: form.q5, q6_start: form.q6,
        q7_phone_use: form.q7, q8_time_loss: form.q8, q9_concentr: form.q9, q10_fatigue: form.q10,
        q11_stress: form.q11, q12_time_stress: form.q12, q14_pressure: form.q14,
        q15_sleep_reg: form.q15, q16_sleep_sat: form.q16, q17_prep: form.q17, q20_goals: form.q20
      }]);
      if (error) throw error;
      setView('success');
    } catch (err) { alert("Erreur: " + err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
        
        {view === 'survey' && (
          <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 dark:bg-slate-800 z-[100]">
            <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        <nav className="flex justify-between items-center p-4 px-8 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50 border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-4">
            <button onClick={() => setView('survey')} className={`px-4 py-2 rounded-xl font-bold ${view === 'survey' ? 'bg-indigo-600 text-white' : ''}`}>Sondage</button>
            <button onClick={() => setView(isAuthorized ? 'dashboard' : 'admin-login')} className={`px-4 py-2 rounded-xl font-bold ${view === 'dashboard' ? 'bg-slate-900 text-white' : ''}`}>Analyse</button>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
          </button>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-12">
          {view === 'survey' && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Sphinx 2026</h1>
                <p className="text-slate-500 font-medium">Bilan Réussite & Habitudes</p>
              </div>

              <Section title="Gestion du Temps" icon={<Zap className="text-amber-500"/>}>
                <Question label="Q1. Organisation des révisions">
                  <select className="w-full p-4 rounded-2xl border-2 dark:bg-slate-900 border-slate-100 dark:border-slate-800" onChange={e => setForm({...form, q1_time: e.target.value})}>
                    <option>Je révise peu</option><option>Je révise régulièrement</option><option>Je révise intensivement</option>
                  </select>
                </Question>
                <Question label="Q5. Report des tâches (1: Jamais, 5: Toujours)">
                  <input type="range" min="1" max="5" className="w-full h-2 accent-indigo-600" onChange={e => setForm({...form, q5: parseInt(e.target.value)})} />
                </Question>
              </Section>

              <Section title="Usage Numérique" icon={<Smartphone className="text-blue-500"/>}>
                <Question label="Q7. Téléphone pendant les révisions (1-5)">
                  <input type="range" min="1" max="5" className="w-full h-2 accent-indigo-600" onChange={e => setForm({...form, q7: parseInt(e.target.value)})} />
                </Question>
                <Question label="Q10. Impression de fatigue liée au téléphone">
                  <select className="w-full p-4 rounded-2xl border-2 dark:bg-slate-900 border-slate-100 dark:border-slate-800" onChange={e => setForm({...form, q10: e.target.value})}>
                    <option>Pas du tout</option><option>Moyennement</option><option>Énormément</option>
                  </select>
                </Question>
              </Section>

              <Section title="Psychologie & Sommeil" icon={<Brain className="text-purple-500"/>}>
                <Question label="Q11. Niveau de stress (1-5)">
                  <input type="range" min="1" max="5" className="w-full h-2 accent-indigo-600" onChange={e => setForm({...form, q11: parseInt(e.target.value)})} />
                </Question>
                <Question label="Q16. Qualité du sommeil (1-5)">
                  <input type="range" min="1" max="5" className="w-full h-2 accent-indigo-600" onChange={e => setForm({...form, q16: parseInt(e.target.value)})} />
                </Question>
                <Question label="Q17. Préparation aux examens">
                  <select className="w-full p-4 rounded-2xl border-2 dark:bg-slate-900 border-slate-100 dark:border-slate-800" onChange={e => setForm({...form, q17: e.target.value})}>
                    <option>Très bien préparé(e)</option><option>Moyennement préparé(e)</option><option>Pas du tout préparé(e)</option>
                  </select>
                </Question>
              </Section>

              <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-6 rounded-[2rem] font-black text-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-500/20">
                {loading ? "ENVOI..." : "SOUMETTRE MON BILAN"}
              </button>
            </form>
          )}

          {view === 'admin-login' && !isAuthorized && (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] shadow-2xl text-center border border-slate-100 dark:border-slate-800 max-w-md mx-auto">
              <Lock size={48} className="mx-auto text-indigo-600 mb-6" />
              <h2 className="text-2xl font-black mb-6">Accès Sécurisé</h2>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input type="password" placeholder="Pass..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl text-center" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
                <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold">ENTRER</button>
              </form>
            </div>
          )}

          {view === 'dashboard' && isAuthorized && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold">Dash Sphinx</h2>
                <div className="flex gap-2">
                  <button onClick={fetchData} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><RefreshCcw size={18} className={loading ? 'animate-spin' : ''}/></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 h-80">
                  <Bar data={{
                    labels: ['Stress', 'Tél.', 'Sommeil'],
                    datasets: [{ label: 'Score Moyen', data: [
                      responses.reduce((a, b) => a + (b.q11_stress || 0), 0) / responses.length || 0,
                      responses.reduce((a, b) => a + (b.q7_phone_use || 0), 0) / responses.length || 0,
                      responses.reduce((a, b) => a + (b.q16_sleep_sat || 0), 0) / responses.length || 0
                    ], backgroundColor: '#6366f1' }]
                  }} />
                </div>
              </div>
            </div>
          )}

          {view === 'success' && (
            <div className="bg-white dark:bg-slate-900 p-16 rounded-[3rem] shadow-2xl text-center border border-indigo-50 dark:border-indigo-900/30">
              <CheckCircle size={80} className="mx-auto text-emerald-500 mb-6 animate-bounce" />
              <h2 className="text-4xl font-black mb-4 tracking-tighter">SUCCESS !</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">Tes données sont maintenant dans la base Sphinx.</p>
              <button onClick={() => setView('survey')} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg">Nouvelle Réponse</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) { 
  return (<div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm"><div className="flex items-center gap-3 mb-8"><div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">{icon}</div><h3 className="font-black text-xs uppercase tracking-widest text-slate-400">{title}</h3></div><div className="space-y-8">{children}</div></div>); 
}
function Question({ label, children }) { 
  return (<div className="space-y-4"><label className="block font-black text-lg tracking-tight">{label}</label>{children}</div>); 
}

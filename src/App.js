import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ClipboardList, CheckCircle, Smartphone, Moon, Sun, Brain, Zap, Target, Clock, Coffee, Heart } from 'lucide-react';

const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Kc9W9PuMbUoFg31Y7BdKcA_l1Fveyve';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [view, setView] = useState('survey');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);

  const [form, setForm] = useState({
    q1_organisation: '', q2_frequence: '', q3_duree: '', q4_methode: '', q5_procrastination: 3, q6_moment_travail: '',
    q7_usage_tel: 3, q8_perte_temps: 3, q9_concentration: 3, q10_fatigue_ecran: '', q11_reseaux_sociaux: 3, q12_mode_avion: '',
    q13_stress_niveau: 3, q14_moment_stress: '', q15_physique_stress: '', q16_pression_reussite: '', q17_anxiete_examen: 3, q18_soutien_moral: '',
    q19_regularite_sommeil: 3, q20_satisfaction_sommeil: 3, q21_heures_nuit: '', q22_ecran_avant_dodo: '', q23_reveils_nocturnes: 1, q24_siestes: '',
    q25_preparation_exam: '', q26_difficulte_matiere: '', q27_environnement: '', q28_objectifs: '', q29_motivation_actuelle: 3, q30_confiance_futur: ''
  });

  useEffect(() => {
    const filled = Object.values(form).filter(v => v !== '' && v !== 0).length;
    setProgress((filled / Object.keys(form).length) * 100);
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('student_surveys').insert([form]);
    setLoading(false);
    if (!error) setView('success');
    else alert("Database Error: " + error.message);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-all duration-500 pb-20">
        
        <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 dark:bg-slate-800 z-[100]">
          <div className="h-full bg-indigo-600 transition-all duration-500 shadow-[0_0_15px_#4f46e5]" style={{ width: `${progress}%` }}></div>
        </div>

        <nav className="flex justify-between items-center p-4 px-8 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-black italic text-indigo-600">SPHINX 30</h2>
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all active:scale-90">
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
          </button>
        </nav>

        <div className="max-w-3xl mx-auto px-6 mt-12">
          {view === 'survey' && (
            <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <header className="text-center space-y-4">
                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Sondage Académique Complet</span>
                <h1 className="text-5xl font-black tracking-tighter">Bilan Étudiant</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Veuillez répondre avec sincérité pour des résultats optimaux.</p>
              </header>

              <Section title="1. Méthodes de Travail" icon={<Clock className="text-amber-500"/>}>
                <Question label="Q1. Organisation globale">
                  <select className="input-style" onChange={e => setForm({...form, q1_organisation: e.target.value})}>
                    <option value="">Choisir...</option><option>Planning strict</option><option>Au feeling</option><option>Dernière minute</option>
                  </select>
                </Question>
                <Question label="Q5. Niveau de procrastination (1-5)">
                  <input type="range" min="1" max="5" className="range-style" onChange={e => setForm({...form, q5_procrastination: parseInt(e.target.value)})} />
                </Question>
              </Section>

              <Section title="2. Environnement Numérique" icon={<Smartphone className="text-blue-500"/>}>
                <Question label="Q7. Usage du téléphone en travaillant (1-5)">
                  <input type="range" min="1" max="5" className="range-style" onChange={e => setForm({...form, q7_usage_tel: parseInt(e.target.value)})} />
                </Question>
                <Question label="Q12. Utilisez-vous le mode 'Ne pas déranger' ?">
                  <select className="input-style" onChange={e => setForm({...form, q12_mode_avion: e.target.value})}>
                    <option value="">Choisir...</option><option>Systématiquement</option><option>Parfois</option><option>Jamais</option>
                  </select>
                </Question>
              </Section>

              <Section title="3. Bien-être & Mental" icon={<Brain className="text-purple-500"/>}>
                <Question label="Q13. Stress ressenti actuellement (1-5)">
                  <input type="range" min="1" max="5" className="range-style" onChange={e => setForm({...form, q13_stress_niveau: parseInt(e.target.value)})} />
                </Question>
                <Question label="Q18. Avez-vous un soutien moral suffisant ?">
                  <select className="input-style" onChange={e => setForm({...form, q18_soutien_moral: e.target.value})}>
                    <option value="">Choisir...</option><option>Oui, totalement</option><option>Partiellement</option><option>Pas assez</option>
                  </select>
                </Question>
              </Section>

              <Section title="4. Cycle du Sommeil" icon={<Coffee className="text-cyan-500"/>}>
                <Question label="Q20. Satisfaction de votre repos (1-5)">
                  <input type="range" min="1" max="5" className="range-style" onChange={e => setForm({...form, q20_satisfaction_sommeil: parseInt(e.target.value)})} />
                </Question>
                <Question label="Q22. Écran moins de 30min avant le dodo ?">
                  <select className="input-style" onChange={e => setForm({...form, q22_ecran_avant_dodo: e.target.value})}>
                    <option value="">Choisir...</option><option>Rarement</option><option>Parfois</option><option>Toujours</option>
                  </select>
                </Question>
              </Section>

              <Section title="5. Ambitions & Futur" icon={<Target className="text-emerald-500"/>}>
                <Question label="Q29. Motivation actuelle (1-5)">
                  <input type="range" min="1" max="5" className="range-style" onChange={e => setForm({...form, q29_motivation_actuelle: parseInt(e.target.value)})} />
                </Question>
                <Question label="Q30. Confiance en votre avenir professionnel">
                  <select className="input-style" onChange={e => setForm({...form, q30_confiance_futur: e.target.value})}>
                    <option value="">Choisir...</option><option>Très confiant</option><option>Incertain</option><option>Anxieux</option>
                  </select>
                </Question>
              </Section>

              <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-8 rounded-[2.5rem] font-black text-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-500/40 transition-all hover:-translate-y-1 active:scale-95">
                {loading ? "TRANSFERT EN COURS..." : "TRANSMETTRE MON BILAN COMPLET"}
              </button>
            </form>
          )}

          {view === 'success' && (
            <div className="text-center bg-white dark:bg-slate-900 p-20 rounded-[4rem] shadow-2xl border-4 border-emerald-50 dark:border-emerald-900/20 animate-in zoom-in">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8"><CheckCircle size={48} /></div>
              <h2 className="text-5xl font-black mb-4">BRAVO !</h2>
              <p className="text-slate-500 text-xl font-medium">Les 30 points d'analyse ont été envoyés à Sphinx.</p>
              <button onClick={() => window.location.reload()} className="mt-12 bg-slate-900 dark:bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black text-lg tracking-widest">NOUVEAU SONDAGE</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Dynamic Style Injection */}
      <style>{`
        .input-style { @apply w-full p-5 rounded-[1.5rem] border-2 bg-transparent border-slate-100 dark:border-slate-800 focus:border-indigo-600 outline-none font-bold transition-all; }
        .range-style { @apply w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-xl appearance-none cursor-pointer accent-indigo-600 shadow-inner; }
      `}</style>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-10 rounded-[3.5rem] border border-white dark:border-slate-800 shadow-sm transition-all hover:shadow-2xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl shadow-sm">{icon}</div>
        <h3 className="font-black text-sm uppercase tracking-[0.3em] text-slate-400">{title}</h3>
      </div>
      <div className="space-y-10">{children}</div>
    </div>
  );
}

function Question({ label, children }) {
  return (
    <div className="space-y-5">
      <label className="block font-black text-2xl tracking-tighter leading-tight">{label}</label>
      {children}
    </div>
  );
}

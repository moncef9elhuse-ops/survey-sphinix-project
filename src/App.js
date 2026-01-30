import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Bar, Pie } from 'react-chartjs-2';
import { ClipboardList, BarChart3, Send, CheckCircle, Lock, RefreshCcw } from 'lucide-react';
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

  // Form state containing all questions from your PDF 
  const [form, setForm] = useState({
    q1_time: 'Je révise régulièrement',
    q5_procr_freq: 3,
    q6_start: 'Assez tôt',
    q7_phone_use: 3,
    q8_time_loss: 3,
    q9_concentr: 3,
    q10_fatigue: 'Moyennement',
    q11_stress: 3,
    q12_time_stress: 'Moyennement',
    q14_pressure: 'Moyennement',
    q15_sleep_reg: 3,
    q16_sleep_sat: 3,
    q17_prep: 'Moyennement préparé(e)',
    q20_goals: 'Je progresse régulièrement'
  });

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('student_surveys')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setResponses(data);
    setLoading(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'ADMIN123') { // Your Admin Password
      setIsAuthorized(true);
      fetchData();
    } else {
      alert("Mot de passe incorrect");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('student_surveys').insert([form]);
      if (error) throw error;
      setView('success');
    } catch (err) {
      alert("Erreur: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Navigation */}
      <nav className="flex justify-center p-4 gap-4 sticky top-0 bg-slate-50/90 backdrop-blur-md z-50">
        <button onClick={() => setView('survey')} className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition ${view === 'survey' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white shadow-sm'}`}>
          <ClipboardList size={18}/> Questionnaire
        </button>
        <button onClick={() => setView('admin-login')} className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition ${view === 'dashboard' || view === 'admin-login' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white shadow-sm'}`}>
          <BarChart3 size={18}/> Admin Analytics
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4">
        
        {/* VIEW: QUESTIONNAIRE  */}
        {view === 'survey' && (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl space-y-8 border border-slate-100">
            <header className="border-b pb-4">
              <h1 className="text-2xl font-black text-indigo-900">ÉTUDE SUR LA RÉUSSITE ACADÉMIQUE</h1>
              <p className="text-slate-500">Merci de répondre honnêtement à ces questions.</p>
            </header>

            <Section title="A & C. Gestion du Temps & Procrastination">
              <Question label="Q1. Organisation des révisions">
                <select className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 ring-indigo-500" onChange={e => setForm({...form, q1_time: e.target.value})}>
                  <option>Je révise peu</option><option>Je révise régulièrement</option><option>Je révise plusieurs heures par jour</option><option>Je révise intensivement</option>
                </select>
              </Question>
              <Question label="Q5. Fréquence de procrastination (1: Jamais, 5: Toujours)">
                <input type="range" min="1" max="5" className="w-full accent-indigo-600" value={form.q5_procr_freq} onChange={e => setForm({...form, q5_procr_freq: parseInt(e.target.value)})} />
              </Question>
            </Section>

            <Section title="D & E. Usage du Téléphone">
              <Question label="Q7. Utilisation du téléphone en révisant (1: Faible, 5: Élevé)">
                <input type="range" min="1" max="5" className="w-full accent-indigo-600" value={form.q7_phone_use} onChange={e => setForm({...form, q7_phone_use: parseInt(e.target.value)})} />
              </Question>
              <Question label="Q10. Impression de fatigue liée au téléphone">
                <select className="w-full p-3 bg-slate-50 border rounded-xl" onChange={e => setForm({...form, q10_fatigue: e.target.value})}>
                  <option>Pas du tout</option><option>Un peu</option><option>Moyennement</option><option>Beaucoup</option><option>Énormément</option>
                </select>
              </Question>
            </Section>

            <Section title="F & G. Stress & Anxiété">
              <Question label="Q11. Niveau de stress ressenti (1: Calme, 5: Très stressé)">
                <input type="range" min="1" max="5" className="w-full accent-indigo-600" value={form.q11_stress} onChange={e => setForm({...form, q11_stress: parseInt(e.target.value)})} />
              </Question>
              <Question label="Q14. Pression excessive pour réussir">
                <select className="w-full p-3 bg-slate-50 border rounded-xl" onChange={e => setForm({...form, q14: e.target.value})}>
                  <option>Pas du tout</option><option>Un peu</option><option>Moyennement</option><option>Assez</option><option>Tout à fait</option>
                </select>
              </Question>
            </Section>

            <Section title="H & I. Sommeil & Performance">
              <Question label="Q17. Sentiment de préparation aux examens">
                <select className="w-full p-3 bg-slate-50 border rounded-xl" value={form.q17_prep} onChange={e => setForm({...form, q17_prep: e.target.value})}>
                  <option>Très bien préparé(e)</option><option>Assez bien préparé(e)</option><option>Moyennement préparé(e)</option><option>Pas du tout préparé(e)</option>
                </select>
              </Question>
            </Section>

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black text-lg shadow-lg hover:bg-indigo-700 transition transform active:scale-95">
              {loading ? "ENVOI EN COURS..." : "ENVOYER LE QUESTIONNAIRE"}
            </button>
          </form>
        )}

        {/* VIEW: ADMIN LOGIN */}
        {view === 'admin-login' && !isAuthorized && (
          <div className="bg-white p-12 rounded-3xl shadow-xl text-center border border-slate-100 mt-20">
            <Lock className="mx-auto mb-4 text-indigo-600" size={48} />
            <h2 className="text-2xl font-bold mb-6">Accès Administrateur</h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input type="password" placeholder="Entrez le mot de passe..." className="w-full p-4 border rounded-2xl text-center text-lg" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
              <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold text-lg">DÉVERROUILLER</button>
            </form>
          </div>
        )}

        {/* VIEW: DASHBOARD & ALL DATA TABLE */}
        {(view === 'dashboard' || (view === 'admin-login' && isAuthorized)) && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">ANALYSE SPHINX</h2>
                <p className="text-slate-500 font-medium">{responses.length} réponses collectées</p>
              </div>
              <button onClick={fetchData} className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition">
                <RefreshCcw size={24} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Niveau de Préparation (Q17)">
                <div className="h-64">
                  <Pie data={{
                    labels: ['Bien', 'Moyen', 'Pas du tout'],
                    datasets: [{
                      data: [
                        responses.filter(r => r.q17_prep?.includes('bien')).length,
                        responses.filter(r => r.q17_prep?.includes('Moyennement')).length,
                        responses.filter(r => r.q17_prep?.includes('Pas du tout')).length
                      ],
                      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                      borderWidth: 0
                    }]
                  }} options={{ maintainAspectRatio: false }} />
                </div>
              </Card>

              <Card title="Stress Moyen vs Procrastination">
                <Bar data={{
                  labels: ['Stress (Q11)', 'Procr. (Q5)', 'Tél. (Q7)'],
                  datasets: [{
                    label: 'Score Moyen / 5',
                    data: [
                      (responses.reduce((a, b) => a + (b.q11_stress || 0), 0) / responses.length || 0),
                      (responses.reduce((a, b) => a + (b.q5_procr_freq || 0), 0) / responses.length || 0),
                      (responses.reduce((a, b) => a + (b.q7_phone_use || 0), 0) / responses.length || 0)
                    ],
                    backgroundColor: '#6366f1',
                    borderRadius: 8
                  }]
                }} />
              </Card>
            </div>

            {/* FULL DATA TABLE */}
            <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
              <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Toutes les Données Utilisateurs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black">
                      <th className="p-5">Date</th>
                      <th className="p-5">Q1 Gestion</th>
                      <th className="p-5">Q11 Stress</th>
                      <th className="p-5">Q17 Préparation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {responses.map((row, i) => (
                      <tr key={i} className="hover:bg-indigo-50/30 transition">
                        <td className="p-5 text-slate-400 font-mono text-xs">
                          {new Date(row.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-5 font-bold text-slate-700">{row.q1_time}</td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full font-black text-xs ${row.q11_stress > 3 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {row.q11_stress}/5
                          </span>
                        </td>
                        <td className="p-5 font-medium text-slate-600">{row.q17_prep}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SUCCESS MESSAGE */}
        {view === 'success' && (
          <div className="bg-white p-16 rounded-3xl shadow-2xl text-center border mt-10">
            <div className="bg-green-100 text-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
              <CheckCircle size={48}/>
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter">MERCI !</h2>
            <p className="text-slate-500 mb-10 text-lg font-medium">Vos réponses sont maintenant dans le système Sphinx.</p>
            <button onClick={() => setView('survey')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100">
              Soumettre une autre réponse
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// UI COMPONENTS
function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-indigo-600 rounded-full"></span> {title}
      </h3>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function Question({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-slate-700 font-bold text-sm tracking-tight">{label}</label>
      {children}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border">
      <h3 className="font-bold mb-4 text-slate-800 text-sm uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

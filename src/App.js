import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Bar, Pie } from 'react-chartjs-2';
import { ClipboardList, BarChart3, Lock, RefreshCcw, Download, CheckCircle, AlertCircle } from 'lucide-react';
import 'chart.js/auto';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://fgtecozbafozehedthlq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Kc9W9PuMbUoFg31Y7BdKcA_l1Fveyve';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [view, setView] = useState('survey'); 
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [form, setForm] = useState({
    q1_time: 'Je révise régulièrement',
    q5_procr_freq: 3,
    q7_phone_use: 3,
    q11_stress: 3,
    q16_sleep_sat: 3,
    q17_prep: 'Moyennement préparé(e)'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('student_surveys').select('*').order('created_at', { ascending: false });
      if (data) setResponses(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'ADMIN123') { 
      setIsAuthorized(true);
      fetchData();
    } else { alert("Mot de passe incorrect"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('student_surveys').insert([form]);
      if (error) throw error;
      setView('success');
    } catch (err) {
      alert("ERREUR DATABASE: " + err.message);
    } finally { setLoading(false); }
  };

  const exportToCSV = () => {
    const headers = "Date,Gestion,Procrastination,Stress,Sommeil,Preparation\n";
    const rows = responses.map(r => `${new Date(r.created_at).toLocaleDateString()},${r.q1_time},${r.q5_procr_freq},${r.q11_stress},${r.q16_sleep_sat},${r.q17_prep}\n`).join("");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'data_sphinx.csv'; a.click();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10">
      <nav className="flex justify-center p-4 gap-4 bg-white shadow-sm sticky top-0 z-50">
        <button onClick={() => setView('survey')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${view === 'survey' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
          <ClipboardList size={18}/> Questionnaire
        </button>
        <button onClick={() => setView('admin-login')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${view !== 'survey' && view !== 'success' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
          <BarChart3 size={18}/> Admin
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 mt-6">
        {view === 'survey' && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <h2 className="text-xl font-bold border-b pb-2 text-blue-800 uppercase">Questionnaire Étudiant</h2>
            
            <div>
              <label className="block font-bold text-sm mb-2">Q1. Comment révisez-vous ?</label>
              <select className="w-full p-2 border rounded bg-gray-50" onChange={e => setForm({...form, q1_time: e.target.value})}>
                <option>Je révise peu</option>
                <option>Je révise régulièrement</option>
                <option>Je révise intensivement</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-sm mb-2">Q11. Niveau de stress (1 à 5)</label>
              <input type="range" min="1" max="5" className="w-full" value={form.q11_stress} onChange={e => setForm({...form, q11_stress: parseInt(e.target.value)})} />
            </div>

            <div>
              <label className="block font-bold text-sm mb-2">Q17. Sentiment de préparation</label>
              <select className="w-full p-2 border rounded bg-gray-50" onChange={e => setForm({...form, q17_prep: e.target.value})}>
                <option>Moyennement préparé(e)</option>
                <option>Très bien préparé(e)</option>
                <option>Pas du tout préparé(e)</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">
              {loading ? "ENVOI..." : "ENVOYER"}
            </button>
          </form>
        )}

        {view === 'admin-login' && !isAuthorized && (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <Lock className="mx-auto mb-4 text-blue-600" size={40} />
            <h2 className="text-lg font-bold mb-4">Code Admin requis</h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input type="password" placeholder="Mot de passe..." className="w-full p-2 border rounded text-center" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
              <button type="submit" className="w-full bg-gray-800 text-white p-2 rounded font-bold">ACCÉDER</button>
            </form>
          </div>
        )}

        {isAuthorized && (view === 'admin-login' || view === 'dashboard') && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border">
              <h2 className="font-bold">ANALYSE SPHINX ({responses.length})</h2>
              <div className="flex gap-2">
                <button onClick={exportToCSV} className="p-2 bg-green-100 text-green-700 rounded flex items-center gap-1 text-xs font-bold"><Download size={14}/> EXCEL</button>
                <button onClick={fetchData} className="p-2 bg-blue-50 text-blue-600 rounded"><RefreshCcw size={16} className={loading ? 'animate-spin' : ''}/></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-xs font-bold mb-2 uppercase text-gray-400">Préparation (Q17)</h3>
                <Pie data={{
                  labels: ['Bien', 'Moyen', 'Pas'],
                  datasets: [{ data: [
                    responses.filter(r => r.q17_prep?.includes('bien')).length,
                    responses.filter(r => r.q17_prep?.includes('Moyennement')).length,
                    responses.filter(r => r.q17_prep?.includes('Pas')).length
                  ], backgroundColor: ['#22c55e', '#eab308', '#ef4444'] }]
                }} />
              </div>
              <div className="bg-white p-4 rounded shadow overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr><th className="p-2">Date</th><th className="p-2">Stress</th><th className="p-2">Prép.</th></tr>
                  </thead>
                  <tbody>
                    {responses.map((r, i) => (
                      <tr key={i} className="border-t text-center">
                        <td className="p-2">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="p-2 font-bold text-blue-600">{r.q11_stress}/5</td>
                        <td className="p-2">{r.q17_prep}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === 'success' && (
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center border-t-8 border-green-500">
            <CheckCircle size={60} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-black mb-2">MERCI POUR VOTRE RÉPONSE !</h2>
            <p className="text-gray-500 mb-6 font-medium">Vos données ont été enregistrées avec succès.</p>
            <img src="https://illustrations.popsy.co/emerald/success.svg" alt="Success" className="w-48 mx-auto mb-6" />
            <button onClick={() => setView('survey')} className="text-blue-600 font-bold underline">Envoyer une autre réponse</button>
          </div>
        )}
      </div>
    </div>
  );
}

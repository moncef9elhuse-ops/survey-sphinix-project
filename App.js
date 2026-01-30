import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { ClipboardList, BarChart3, Send, Smartphone, Moon, Brain, AlertTriangle } from 'lucide-react';
import 'chart.js/auto';

const supabase = createClient('YOUR_URL', 'YOUR_KEY');

export default function App() {
  const [view, setView] = useState('survey');
  const [responses, setResponses] = useState([]);
  const [form, setForm] = useState({
    q1: 'Je révise régulièrement', q5: 3, q6: 'Assez tôt',
    q7: 3, q8: 3, q9: 3, q10: 'Moyennement',
    q11: 3, q12: 'Moyennement', q14: 'Moyennement',
    q15: 3, q16: 3, q17: 'Moyennement préparé(e)', q20: 'Je progresse régulièrement'
  });

  const fetchData = async () => {
    const { data } = await supabase.from('student_surveys').select('*');
    if (data) setResponses(data);
  };

  useEffect(() => { if (view === 'dashboard') fetchData(); }, [view]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('student_surveys').insert([{
      q1_time: form.q1, q5_procr_freq: form.q5, q6_start: form.q6,
      q7_phone_use: form.q7, q8_time_loss: form.q8, q9_concentr: form.q9,
      q10_fatigue: form.q10, q11_stress: form.q11, q12_time_stress: form.q12,
      q14_pressure: form.q14, q15_sleep_reg: form.q15, q16_sleep_sat: form.q16,
      q17_prep: form.q17, q20_goals: form.q20
    }]);
    setView('success');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <nav className="flex justify-center mb-8 gap-4 sticky top-0 bg-slate-50 py-4 z-10">
        <button onClick={() => setView('survey')} className={`px-6 py-2 rounded-full font-bold transition ${view === 'survey' ? 'bg-indigo-600 text-white' : 'bg-white shadow-sm'}`}>Questionnaire</button>
        <button onClick={() => setView('dashboard')} className={`px-6 py-2 rounded-full font-bold transition ${view === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-white shadow-sm'}`}>Analyse Sphinx</button>
      </nav>

      <div className="max-w-3xl mx-auto pb-20">
        {view === 'survey' && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            {/* Section A & C: Gestion & Procrastination */}
            <Section title="A & C - Gestion du Temps & Procrastination" icon={<Brain size={20}/>}>
              <Question label="Q1. Organisation des révisions [cite: 2]">
                <select className="w-full p-3 border rounded-xl bg-white" onChange={e => setForm({...form, q1: e.target.value})}>
                  <option>Je révise peu</option><option>Je révise régulièrement</option><option>Je révise plusieurs heures par jour</option><option>Je révise intensivement</option>
                </select>
              </Question>
              <Question label="Q5. Fréquence du report des tâches (1: Faible, 5: Élevé) [cite: 11]">
                <input type="range" min="1" max="5" className="w-full accent-indigo-600" onChange={e => setForm({...form, q5: parseInt(e.target.value)})} />
              </Question>
            </Section>

            {/* Section D & E: Téléphone */}
            <Section title="D & E - Usage du Téléphone & Burnout" icon={<Smartphone size={20}/>}>
              <Question label="Q7. Utilisation du téléphone en révision (1: Presque jamais, 5: Toujours) [cite: 14]">
                <input type="range" min="1" max="5" className="w-full accent-indigo-600" onChange={e => setForm({...form, q7: parseInt(e.target.value)})} />
              </Question>
              <Question label="Q10. Impression de fatigue liée au téléphone [cite: 19]">
                <select className="w-full p-3 border rounded-xl bg-white" onChange={e => setForm({...form, q10: e.target.value})}>
                  <option>Pas du tout</option><option>Un peu</option><option>Moyennement</option><option>Beaucoup</option><option>Énormément</option>
                </select>
              </Question>
            </Section>

            {/* Section F & G: Stress & Anxiété */}
            <Section title="F & G - Stress & Anxiété" icon={<AlertTriangle size={20}/>}>
              <Question label="Q11. Niveau de stress ressenti (1: Faible, 5: Très élevé) [cite: 20]">
                <input type="range" min="1" max="5" className="w-full accent-indigo-600" onChange={e => setForm({...form, q11: parseInt(e.target.value)})} />
              </Question>
              <Question label="Q14. Pression excessive pour réussir [cite: 23]">
                <select className="w-full p-3 border rounded-xl bg-white" onChange={e => setForm({...form, q14: e.target.value})}>
                  <option>Pas du tout</option><option>Un peu</option><option>Moyennement</option><option>Assez</option><option>Tout à fait</option>
                </select>
              </Question>
            </Section>

            {/* Section H & I: Sommeil & Performance */}
            <Section title="H & I - Sommeil & Performance" icon={<Moon size={20}/>}>
              <Question label="Q16. Satisfaction du sommeil (1: Pas du tout, 5: Très bien) [cite: 25]">
                <input type="range" min="1" max="5" className="w-full accent-indigo-600" onChange={e => setForm({...form, q16: parseInt(e.target.value)})} />
              </Question>
              <Question label="Q17. Sentiment de préparation [cite: 26]">
                <select className="w-full p-3 border rounded-xl bg-white" onChange={e => setForm({...form, q17: e.target.value})}>
                  <option>Très bien préparé(e)</option><option>Assez bien préparé(e)</option><option>Moyennement préparé(e)</option><option>Pas du tout préparé(e)</option>
                </select>
              </Question>
            </Section>

            <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700">Envoyer les réponses</button>
          </form>
        )}

        {view === 'dashboard' && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <h2 className="text-2xl font-bold text-slate-800">Analyses Globales (Type Sphinx)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Niveaux de Stress vs Sommeil (Moyennes)">
                <Bar data={{
                  labels: ['Stress (Q11)', 'Procrastination (Q5)', 'Sommeil (Q16)'],
                  datasets: [{
                    label: 'Score Moyen / 5',
                    data: [
                      (responses.reduce((a, b) => a + (b.q11 || 0), 0) / responses.length || 0),
                      (responses.reduce((a, b) => a + (b.q5 || 0), 0) / responses.length || 0),
                      (responses.reduce((a, b) => a + (b.q16 || 0), 0) / responses.length || 0)
                    ],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
                  }]
                }} />
              </Card>
              <Card title="Sentiment de Préparation (Q17)">
                <Pie data={{
                  labels: ['Bien', 'Moyen', 'Pas du tout'],
                  datasets: [{
                    data: [
                      responses.filter(r => r.q17?.includes('bien')).length,
                      responses.filter(r => r.q17?.includes('Moyennement')).length,
                      responses.filter(r => r.q17?.includes('Pas du tout')).length
                    ],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                  }]
                }} />
              </Card>
            </div>
          </div>
        )}

        {view === 'success' && (
          <div className="text-center bg-white p-12 rounded-3xl shadow-xl">
            <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40}/></div>
            <h2 className="text-3xl font-bold mb-4">Réponses Envoyées !</h2>
            <p className="text-slate-500 mb-8">Merci pour votre participation à cette étude.</p>
            <button onClick={() => setView('survey')} className="text-indigo-600 font-bold">Soumettre une autre réponse</button>
          </div>
        )}
      </div>
    </div>
  );
}

const Section = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
    <div className="flex items-center gap-3 mb-6 text-indigo-600 font-bold uppercase tracking-wider text-sm border-b pb-4">{icon} {title}</div>
    <div className="space-y-6">{children}</div>
  </div>
);

const Question = ({ label, children }) => (
  <div><label className="block text-slate-700 font-semibold mb-3">{label}</label>{children}</div>
);

const Card = ({ title, children }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"><h3 className="font-bold mb-4 text-slate-700">{title}</h3>{children}</div>
);

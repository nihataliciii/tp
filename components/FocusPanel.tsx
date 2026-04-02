'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Brain, Zap, TrendingUp, Clock, Target } from 'lucide-react';

interface TestResult {
  id: string;
  score: number;
  status: string;
  test_type: string;
  created_at: string;
}

const focusQuotes = [
  'Zamanı ölçemezsiniz; sadece onu hissedebilirsiniz.',
  'Dikkat, beynin en değerli kaynağıdır.',
  'Her saniye bir seçimdir.',
  'Odaklanmak, hayır diyebilme sanatıdır.',
  'Derin iş, sığ dünyadaki süper güçtür.',
];

export default function FocusPanel() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote] = useState(() => focusQuotes[Math.floor(Math.random() * focusQuotes.length)]);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setResults(data ?? []);
      setLoading(false);
    }

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(() => load());
    return () => listener.subscription.unsubscribe();
  }, []);

  const latestScore = results[0]?.score;
  const avgScore = results.length
    ? Math.round((results.reduce((s, r) => s + r.score, 0) / results.length) * 100)
    : null;

  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <aside className="focus-panel">
      {/* Date */}
      <div className="focus-panel-section">
        <p className="focus-date">{today}</p>
        <h2 className="focus-title">Bugünün Odağı</h2>
      </div>

      {/* Stats */}
      <div className="focus-panel-section">
        <h3 className="focus-section-label">Test İstatistikleri</h3>
        <div className="focus-stats">
          <div className="focus-stat-card">
            <div className="focus-stat-icon">
              <Target size={16} />
            </div>
            <div>
              <p className="focus-stat-value">{results.length}</p>
              <p className="focus-stat-label">Toplam Test</p>
            </div>
          </div>

          {avgScore !== null && (
            <div className="focus-stat-card">
              <div className="focus-stat-icon focus-stat-icon-green">
                <TrendingUp size={16} />
              </div>
              <div>
                <p className="focus-stat-value">{avgScore}%</p>
                <p className="focus-stat-label">Ort. Skor</p>
              </div>
            </div>
          )}

          {latestScore !== undefined && (
            <div className="focus-stat-card">
              <div className="focus-stat-icon focus-stat-icon-purple">
                <Zap size={16} />
              </div>
              <div>
                <p className="focus-stat-value">{Math.round(latestScore * 100)}%</p>
                <p className="focus-stat-label">Son Test</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent tests */}
      {results.length > 0 && (
        <div className="focus-panel-section">
          <h3 className="focus-section-label">Son Testler</h3>
          <div className="focus-results">
            {loading ? (
              <div className="focus-loading">
                <div className="focus-spinner" />
              </div>
            ) : (
              results.map((r) => (
                <div key={r.id} className="focus-result-item">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-slate-400" />
                    <span className="focus-result-type">{r.test_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`focus-result-badge ${
                        r.status === 'Normal Algı'
                          ? 'badge-amber'
                          : r.status === 'Yavaş Algı'
                          ? 'badge-green'
                          : 'badge-red'
                      }`}
                    >
                      {r.status}
                    </span>
                    <span className="focus-result-score">{Math.round(r.score * 100)}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Quote */}
      <div className="focus-quote">
        <Brain size={16} className="text-indigo-400 shrink-0 mt-0.5" />
        <p>{quote}</p>
      </div>
    </aside>
  );
}

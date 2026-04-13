'use client';

import { useApp } from '@/lib/AppContext';
import { useAuthStore } from '@/lib/useAuthStore';
import { t } from '@/lib/i18n';
import { Brain, Clock, BarChart2, ChevronRight, ShieldCheck, Zap } from 'lucide-react';

export default function TestIntroScreen() {
  const { setStage, language } = useApp();
  const { currentUser } = useAuthStore();

  const steps = [
    {
      icon: Brain,
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.15)',
      title: language === 'tr' ? 'Anket Soruları' : 'Survey Questions',
      desc: language === 'tr'
        ? 'Uyku, ekran süresi ve alışkanlıklarınız hakkında ~5 dakikalık bilimsel anket.'
        : 'A ~5 min scientific survey about your sleep, screen time and habits.',
    },
    {
      icon: Clock,
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.15)',
      title: language === 'tr' ? 'Kör Kronometre Testi' : 'Blind Chronometer Test',
      desc: language === 'tr'
        ? '5 turda, size verilen sürenin ne kadar sürdüğünü tahmin etmeniz beklenir. Herhangi bir sayacı görmeden.'
        : '5 rounds of estimating how long a given duration lasts — with no visible timer.',
    },
    {
      icon: BarChart2,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.15)',
      title: language === 'tr' ? 'Kişisel Analiz' : 'Personal Analysis',
      desc: language === 'tr'
        ? 'Test sonucunuzu bilimsel verilerle karşılaştırarak zaman algı profilinizi öğrenin.'
        : 'Compare your results with scientific benchmarks to learn your time perception profile.',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto relative z-10 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent-purple)]/40 bg-[var(--accent-purple)]/10 text-[var(--accent-purple-light)] text-sm font-semibold tracking-wide mb-6 uppercase" style={{ letterSpacing: '0.1em' }}>
          <Zap size={14} />
          {language === 'tr' ? 'Teste Hazır mısın?' : 'Ready for the Test?'}
        </div>
        <h1
          className="text-5xl md:text-6xl font-black text-slate-700 dark:text-white mb-4 uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}
        >
          {language === 'tr' ? 'Zaman Algısı Testi' : 'Time Perception Test'}
        </h1>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
          {language === 'tr'
            ? 'Bu test, bilimsel yöntemlerle zaman algı hızınızı ve odak profilinizi ölçer. 3 aşamadan oluşur:'
            : 'This test uses scientific methods to measure your time perception speed and focus profile. It has 3 stages:'}
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-4 mb-8">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              className="glass-card p-6 flex items-start gap-5 glass-card-hover"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border"
                style={{ background: step.bg, borderColor: `${step.color}40` }}
              >
                <Icon size={28} style={{ color: step.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: step.bg, color: step.color }}
                  >
                    {language === 'tr' ? `Aşama ${i + 1}` : `Stage ${i + 1}`}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-1">{step.title}</h3>
                <p className="text-[var(--text-secondary)] text-base leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rules note */}
      <div
        className="p-5 rounded-2xl mb-8 flex gap-4 items-start"
        style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
      >
        <ShieldCheck size={22} className="shrink-0 mt-0.5" style={{ color: '#a855f7' }} />
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {language === 'tr'
            ? 'Testi dürüst şekilde tamamla — sonuçlar yalnızca senin içindir. Anket cevapların hesaplama algoritmasına dahil edilir. Kronometreyi çalıştırırken saate bakma!'
            : 'Complete the test honestly — results are for you only. Survey answers feed into the calculation algorithm. Don\'t look at a clock while timing!'}
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => setStage('survey')}
        className="w-full inline-flex items-center justify-center gap-4 font-black text-2xl py-7 px-10 rounded-2xl bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] text-white uppercase tracking-widest shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] hover:scale-[1.01] transition-all duration-300"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}
      >
        {language === 'tr' ? 'Anket ile Başla' : 'Start with Survey'}
        <ChevronRight size={30} />
      </button>

      {!currentUser && (
        <p className="text-center mt-4 text-base text-[var(--accent-cyan)] opacity-70 font-medium">
          {language === 'tr' ? '⚠ Misafir olarak devam ediyorsun — sonuçlar kaydedilmeyecek.' : '⚠ You\'re continuing as guest — results won\'t be saved.'}
        </p>
      )}
    </div>
  );
}

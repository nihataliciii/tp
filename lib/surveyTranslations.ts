import { Language } from './i18n';
import baseQuestions, { Question } from './questionsData';

const translations: Record<string, Record<Language, any>> = {
  sleep_hours: {
    tr: { q: 'Dün gece kaç saat uyudun?', s: 'En doğru sonuç için dünkü gerçek uyku süresini gir.', u: 'saat', f: 'Her 1 saatlik eksik uyku, kısa süreli zaman algısını %4.4 oranında bozuyor ve reaksiyon hızında ölçülebilir sapma yaratıyor.' },
    en: { q: 'How many hours did you sleep last night?', s: 'Enter your actual sleep duration for the most accurate result.', u: 'hours', f: 'Every 1 hour of missed sleep disrupts short-term time perception by 4.4% and creates a measurable deviation in reaction speed.' },
    fr: { q: 'Combien d\'heures avez-vous dormi la nuit dernière ?', s: 'Entrez la durée réelle pour un résultat plus précis.', u: 'heures', f: 'Chaque heure de sommeil manquée perturbe la perception du temps à court terme de 4,4 % et crée une déviation mesurable de la vitesse de réaction.' },
    de: { q: 'Wie viele Stunden hast du letzte Nacht geschlafen?', s: 'Gib deine tatsächliche Schlafdauer ein.', u: 'Stunden', f: 'Jede fehlende Stunde Schlaf stört die kurzfristige Zeitwahrnehmung um 4,4 %.' },
    zh: { q: '昨晚你睡了几个小时？', s: '输入你的实际睡眠时间以获得最准确的结果。', u: '小时', f: '每缺少 1 小时睡眠，短期时间感知偏差约 4.4%。' },
    ru: { q: 'Сколько часов вы спали прошлой ночью?', s: 'Введите фактическую продолжительность сна.', u: 'часов', f: 'Каждый недостающий час сна искажает восприятие времени на 4,4%.' }
  },
  sleep_quality: {
    tr: { q: 'Genel uyku kalitenini nasıl değerlendirirsin?', 
          c: ['Çok kötü – Sık sık uyanıyorum', 'Orta – Bazen uyanıyorum', 'İyi – Çoğunlukla kesintisiz', 'Mükemmel – Hiç uyanmıyorum'],
          f: 'Bölünmüş uyku, kesintisiz uyku ile aynı süreye sahip olsa bile prefrontal korteksi %12 daha az restore eder ve odak penceresini daraltır.' },
    en: { q: 'How would you rate your overall sleep quality?', 
          c: ['Very poor – Frequent awakenings', 'Moderate – Sometimes wake up', 'Good – Mostly uninterrupted', 'Excellent – Never wake up'],
          f: 'Fragmented sleep, even if equal in duration to uninterrupted sleep, restores the prefrontal cortex 12% less and narrows the focus window.' },
    fr: { q: 'Comment évalueriez-vous la qualité de votre sommeil ?', 
          c: ['Très mauvaise – Réveils fréquents', 'Moyenne – Réveils occasionnels', 'Bonne – Principalement ininterrompue', 'Excellente – Aucun réveil'],
          f: 'Le sommeil fragmenté restaure le cortex préfrontal 12 % de moins que le sommeil ininterrompu.' },
    de: { q: 'Wie beurteilen Sie Ihre Schlafqualität?', c: ['Sehr schlecht', 'Mäßig', 'Gut', 'Ausgezeichnet'], f: 'Unterbrochener Schlaf verringert die Regeneration des präfrontalen Kortex um 12%.' },
    zh: { q: '您如何评价您的整体睡眠质量？', c: ['非常差', '中等', '良好', '极好'], f: '碎片化的睡眠使前额叶皮层的恢复减少 12%。' },
    ru: { q: 'Как бы вы оценили качество своего сна?', c: ['Очень плохое', 'Умеренное', 'Хорошее', 'Отличное'], f: 'Фрагментированный сон восстанавливает префронтальную кору на 12% меньше.' }
  },
  sleep_consistency: {
    tr: { q: 'Hafta genelinde uyku saatlerin ne kadar tutarlı?', 
          c: ['Hiç tutarlı değil (±3+ saat fark)', 'Az tutarlı (±2 saat fark)', 'Orta tutarlı (±1 saat fark)', 'Çok tutarlı (her gün aynı saatlerde)'],
          f: 'Sirkadiyen ritim tutarsızlığı, zaman algısında haftalık %7-9 sapma yaratır.' },
    en: { q: 'How consistent are your sleep hours throughout the week?', 
          c: ['Not consistent at all (±3+ hours diff)', 'Slightly consistent (±2 hours diff)', 'Moderately consistent (±1 hour diff)', 'Very consistent (same hours daily)'],
          f: 'Circadian rhythm inconsistency creates a weekly deviation of 7-9% in time perception.' },
    fr: { q: 'Quelle est la régularité de vos heures de sommeil tout au long de la semaine ?', 
          c: ['Pas du tout régulier (±3+ h diff)', 'Peu régulier (±2 h diff)', 'Assez régulier (±1 h diff)', 'Très régulier (mêmes heures tous les jours)'],
          f: 'L\'incohérence du rythme circadien crée une déviation hebdomadaire de 7 à 9 % de la perception du temps.' },
    de: { q: 'Wie konstant sind Ihre Schlafenszeiten?', c: ['Sehr inkonsistent', 'Etwas inkonsistent', 'Mäßig konstant', 'Sehr konstant'], f: 'Ein inkonsistenter Tagesrhythmus verschiebt die Zeitwahrnehmung um 7-9%.' },
    zh: { q: '您的睡眠时间规律吗？', c: ['完全不规律', '稍微规律', '比较规律', '非常规律'], f: '昼夜节律不一致会导致时间感知出现 7-9% 的偏差。' },
    ru: { q: 'Насколько постоянен ваш график сна?', c: ['Совсем непостоянен', 'Слегка непостоянен', 'Умеренно постоянен', 'Очень постоянен'], f: 'Несоответствие циркадных ритмов создает отклонение восприятия времени на 7-9%.' }
  },
  screen_hours: {
    tr: { q: 'Günde ortalama kaç saat ekran süren var?', s: 'Telefon + bilgisayar + tablet toplam süre', u: 'saat', f: '6 saatin üzerindeki her ekran saati, zaman algısı doğruluğunu %3.4 oranında düşürüyor.' },
    en: { q: 'What is your average daily screen time?', s: 'Total time on phone + computer + tablet', u: 'hours', f: 'Every screen hour over 6 hours reduces time perception accuracy by 3.4%.' },
    fr: { q: 'Quel est votre temps d\'écran quotidien moyen ?', s: 'Temps total téléphone + ordinateur + tablette', u: 'heures', f: 'Chaque heure d\'écran au-delà de 6 heures réduit la précision de la perception du temps de 3,4 %.' },
    de: { q: 'Wie hoch ist Ihre durchschnittliche Bildschirmzeit?', s: 'Handy + PC + Tablet', u: 'Stunden', f: 'Jede Bildschirmstunde über 6 Stunden verringert die Zeitwahrnehmung um 3,4%.' },
    zh: { q: '您每天平均屏幕使用时间是多少？', s: '手机、电脑和平板电脑的总时间', u: '小时', f: '每天超过 6 小时的屏幕时间会使时间感知的准确性下降 3.4%。' },
    ru: { q: 'Каково ваше среднее время у экрана в день?', s: 'Суммарно телефон + компьютер + планшет', u: 'часы', f: 'Каждый час у экрана свыше 6 снижает точность восприятия времени на 3,4%.' }
  },
  phone_pickups: {
    tr: { q: 'Günde telefona kaç kez bakıyorsunuz (yaklaşık)?', c: ['1-20 kez', '20-50 kez', '50-100 kez', '100+ kez'], f: 'Her telefon kontrolü ortalama 23 dakikalık derin odak döngüsünü bozar.' },
    en: { q: 'How many times do you check your phone daily (approx)?', c: ['1-20 times', '20-50 times', '50-100 times', '100+ times'], f: 'Every phone check disrupts an average 23-minute deep focus cycle.' },
    fr: { q: 'Combien de fois vérifiez-vous votre téléphone par jour (environ) ?', c: ['1-20 fois', '20-50 fois', '50-100 fois', '100+ fois'], f: 'Chaque vérification perturbe un cycle de concentration profonde d\'environ 23 minutes.' },
    de: { q: 'Wie oft schauen Sie aufs Handy?', c: ['1-20 mal', '20-50 mal', '50-100 mal', '100+ mal'], f: 'Jeder Handykontrollblick stört den Tiefenfokus um bis zu 23 Minuten.' },
    zh: { q: '您每天大约看多少次手机？', c: ['1-20次', '20-50次', '50-100次', '100次以上'], f: '每次看手机平均会打断 23 分钟的深度专注。' },
    ru: { q: 'Сколько раз в день вы проверяете телефон?', c: ['1-20 раз', '20-50 раз', '50-100 раз', '100+ раз'], f: 'Каждая проверка телефона прерывает 23-минутный цикл глубокого внимания.' }
  },
  short_video_hours: {
    tr: { q: 'Günde kaç saat kısa video izliyorsun? (TikTok, Reels, vb.)', u: 'saat', f: 'Kısa video platformları, dopamin sistemini 2 dakikada bir "ödüllendirerek" tolerans oluşturuyor.' },
    en: { q: 'How many hours of short videos do you watch daily? (TikTok, Reels, etc.)', u: 'hours', f: 'Short video platforms build dopamine tolerance by rewarding the brain every 2 minutes.' },
    fr: { q: 'Combien d\'heures de vidéos courtes regardez-vous par jour ? (TikTok, Reels, etc.)', u: 'heures', f: 'Ces plateformes de vidéos courtes développent une tolérance à la dopamine.' },
    de: { q: 'Wie viele Stunden Kurzvideos konsumierst du täglich?', u: 'Stunden', f: 'Kurzvideos erhöhen die Dopamintoleranz erheblich.' },
    zh: { q: '每天观看短视频多少小时？（TikTok、Reels等）', u: '小时', f: '短视频平台每隔 2 分钟奖励一次多巴胺以建立耐受性。' },
    ru: { q: 'Сколько часов коротких видео вы смотрите ежедневно?', u: 'часов', f: 'Платформы коротких видео повышают толерантность к дофамину.' }
  },
  content_switch_speed: {
    tr: { q: 'Bir videoyu ne kadar izledikten sonra geçiyorsun?', c: ['Sonuna kadar izliyorum', 'Çoğu zaman bitiriyorum', '10-30 saniye içinde geçiyorum', '5 saniyeden az – çok hızlı'], f: '5 saniye altındaki içerik tüketimi, prefrontal korteksin "sabır devresi"ni devre dışı bırakır.' },
    en: { q: 'How soon do you skip a video?', c: ['I watch till the end', 'I finish most of the time', 'I skip within 10-30 seconds', 'Under 5 seconds – very fast'], f: 'Consuming content under 5 seconds disables the "patience circuit" of the prefrontal cortex.' },
    fr: { q: 'À quelle vitesse passez-vous une vidéo ?', c: ['Je regarde jusqu\'à la fin', 'Je finis la plupart du temps', 'Je zappe entre 10 et 30 secondes', 'Moins de 5 secondes – très rapide'], f: 'La consommation de contenus de moins de 5 secondes désactive le circuit de patience.' },
    de: { q: 'Wie schnell überspringst du ein Video?', c: ['Bis zum Ende', 'Meistens zu Ende', '10-30 Sekunden', 'Unter 5 Sekunden'], f: 'Der schnelle Konsum unter 5 Sekunden deaktiviert die Geduldssteuerung.' },
    zh: { q: '您多快会跳过视频？', c: ['全看完', '大部分看完', '10-30秒内跳过', '5秒内跳过'], f: '5秒以下的消费会解除前额叶耐性回路。' },
    ru: { q: 'Как скоро вы пролистываете видео?', c: ['Досматриваю до конца', 'Чаще всего досматриваю', 'Пролистываю через 10-30 секунд', 'Меньше 5 секунд'], f: 'Просмотр короче 5 секунд отключает контроль терпения.' }
  },
  age: {
    tr: { q: 'Kaç yaşındasın?', u: 'yaş', f: '18-25 yaş arası, nöroplastisite zirvesindedir. Zaman algısı 30 yaş sonrası yılda ~%0.5 yavaşlar.' },
    en: { q: 'How old are you?', u: 'years', f: 'Ages 18-25 are at peak neuroplasticity. Time perception slows down by ~0.5% a year after 30.' },
    fr: { q: 'Quel âge avez-vous ?', u: 'ans', f: 'Les 18-25 ans sont au pic de la neuroplasticité. La perception du temps ralentit d\'environ 0,5 % par an après 30 ans.' },
    de: { q: 'Wie alt bist du?', u: 'Jahre', f: 'Ab dem 30. Lebensjahr verlangsamt sich die Zeitwahrnehmung um ca. 0,5% pro Jahr.' },
    zh: { q: '你多大了？', u: '岁', f: '18-25岁是神经可塑性峰值。30岁后感知放缓0.5%。' },
    ru: { q: 'Сколько вам лет?', u: 'лет', f: 'Возраст 18-25 - пик нейропластичности. Восприятие замедляется после 30 лет.' }
  },
  stress_level: {
    tr: { q: 'Son iki haftada stres düzeyini nasıl değerlendirirsin?', c: ['Çok düşük – Rahat ve sakinim', 'Orta – Yönetilebilir düzeyde', 'Yüksek – Bunalmış hissediyorum', 'Aşırı – Kronik stres içindeyim'], f: 'Kronik stres altında kortizol yüksekliği, zaman algısını %15-30 oranında hızlandırır.' },
    en: { q: 'How would you rate your stress level in the past two weeks?', c: ['Very low – Relaxed and calm', 'Moderate – Manageable', 'High – Feeling overwhelmed', 'Extreme – Chronic stress'], f: 'High cortisol under chronic stress accelerates time perception by 15-30%.' },
    fr: { q: 'Comment évalueriez-vous votre niveau de stress ces deux dernières semaines ?', c: ['Très faible – Dendu(e)', 'Moyen – Gérable', 'Élevé – Débordé(e)', 'Extrême – Stress chronique'], f: 'Le cortisol élevé sous stress chronique accélère la perception du temps de 15 à 30 %.' },
    de: { q: 'Wie hoch ist dein Stresslevel?', c: ['Sehr niedrig', 'Mäßig', 'Hoch', 'Extrem'], f: 'Hohes Cortisol durch Stress beschleunigt das Zeitempfinden um 15-30%.' },
    zh: { q: '您如何评价过去两周的压力水平？', c: ['非常低', '中等', '高', '极高'], f: '高皮质醇在慢性压力下可加速时间感知 15-30%。' },
    ru: { q: 'Как вы оцениваете свой уровень стресса?', c: ['Очень низкий', 'Средний', 'Высокий', 'Экстремально'], f: 'Высокий уровень кортизола при стрессе ускоряет восприятие времени.' }
  },
  exercise_frequency: {
    tr: { q: 'Haftada kaç kez egzersiz yapıyorsun? (20+ dakika)', c: ['Hiç yapmıyorum', 'Haftada 1-2 kez', 'Haftada 3-4 kez', 'Haftada 5+ kez'], f: 'Aerobik egzersiz, temporal lob aktivasyonunu güçlendirerek zaman algısı hassasiyetini iyileştirir.' },
    en: { q: 'How many times a week do you exercise? (20+ mins)', c: ['Never', '1-2 times a week', '3-4 times a week', '5+ times a week'], f: 'Aerobic exercise improves time perception sensitivity by strengthening temporal lobe activation.' },
    fr: { q: 'Combien de fois par semaine faites-vous de l\'exercice ?', c: ['Jamais', '1-2 fois par semaine', '3-4 fois par semaine', '5+ fois par semaine'], f: 'L\'exercice aérobie renforce l\'activation du lobe temporal et la sensibilité perceptive du temps.' },
    de: { q: 'Wie oft treiben Sie Sport?', c: ['Nie', '1-2 mal', '3-4 mal', '5+ mal'], f: 'Sport verbessert die zeitliche Sensibilität des Gehirns.' },
    zh: { q: '每周锻炼几次？', c: ['从不', '每周1-2次', '每周3-4次', '每周5次以上'], f: '有氧运动改善颞叶活化。' },
    ru: { q: 'Как часто вы тренируетесь?', c: ['Никогда', '1-2 раза в неделю', '3-4 раза', '5+ раз'], f: 'Упражнения укрепляют активацию височной доли.' }
  },
  multitask_habit: {
    tr: { q: 'Ne sıklıkla farklı uygulamalara/işlere geçiş yapıyorsun?', c: ['Neredeyse hiç – Tek işe odaklanırım', 'Bazen – Saatte 1-2 kez', 'Sık – Her 10-15 dakikada bir', 'Sürekli – Her 2-3 dakikada bir'], f: 'Görev geçişi (task-switching), her seferinde beynin iç zaman saatini %11 oranında bozar.' },
    en: { q: 'How often do you switch between different apps/tasks?', c: ['Almost never – Single focus', 'Sometimes – 1-2 times an hour', 'Often – Every 10-15 minutes', 'Constantly – Every 2-3 minutes'], f: 'Task-switching disrupts the brain\'s internal clock by 11% each time.' },
    fr: { q: 'À quelle fréquence passez-vous d\'une tâche à l\'autre ?', c: ['Presque jamais – Focus unique', 'Parfois – 1 à 2 fois par heure', 'Souvent – Toutes les 10 à 15 mins', 'Constamment – Toutes les 2 à 3 mins'], f: 'La transition des tâches perturbe l\'horloge interne du cerveau de 11 % à chaque fois.' },
    de: { q: 'Wie oft wechselst du Aufgaben?', c: ['Selten', 'Manchmal', 'Oft', 'Ständig'], f: 'Aufgabenwechsel stört die innere Uhr des Gehirns jedes Mal um 11%.' },
    zh: { q: '切换工作的频率有多高？', c: ['几乎从不', '偶尔', '经常', '不断切换'], f: '任务切换每次会干扰内部时钟 11%。' },
    ru: { q: 'Как часто вы переключаетесь между задачами?', c: ['Почти никогда', 'Иногда', 'Часто', 'Постоянно'], f: 'Многозадачность нарушает работу внутренних часов мозга на 11%.' }
  }
};

export const getLocalizedSurvey = (lang: Language): Question[] => {
  return baseQuestions.map(q => {
    const t = translations[q.id]?.[lang] || translations[q.id]?.['en'];
    if (!t) return q;

    const modified = { ...q, question: t.q, academicFact: t.f };
    if (t.s) modified.subtext = t.s;
    if (t.u) modified.unit = t.u;
    if (t.c && q.choices) {
      modified.choices = q.choices.map((choice, i) => ({
        ...choice,
        label: t.c[i] || choice.label
      }));
    }
    return modified;
  });
};

export const surveyLabels: Record<string, Record<Language, string>> = {
  sleep: { tr: 'Uyku', en: 'Sleep', fr: 'Sommeil', de: 'Schlaf', zh: '睡眠', ru: 'Сон' },
  screenTime: { tr: 'Ekran Süresi', en: 'Screen Time', fr: 'Temps d\'écran', de: 'Bildschirmzeit', zh: '屏幕时间', ru: 'Экранное время' },
  shortVideo: { tr: 'Kısa Video', en: 'Short Video', fr: 'Vidéos Courtes', de: 'Kurzvideos', zh: '短视频', ru: 'Короткие видео' },
  cognitive: { tr: 'Bilişsel', en: 'Cognitive', fr: 'Cognitif', de: 'Kognitiv', zh: '认知', ru: 'Когнитивные' },
  lifestyle: { tr: 'Yaşam Tarzı', en: 'Lifestyle', fr: 'Mode de vie', de: 'Lebensstil', zh: '生活方式', ru: 'Стиль жизни' },
  minLabel: { tr: 'Min', en: 'Min', fr: 'Min', de: 'Min', zh: '最小', ru: 'Мин' },
  maxLabel: { tr: 'Max', en: 'Max', fr: 'Max', de: 'Max', zh: '最大', ru: 'Макс' }
};

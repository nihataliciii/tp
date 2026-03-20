'use client';

import { useState, useEffect } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  date: string;
}

const STORAGE_KEY = 'blog_posts_v1';

const MOCK_DATA: BlogPost[] = [
  {
    id: '1',
    title: 'Dopamin Detoksu ve Zaman Algısı',
    summary: 'Kısa video tüketimi (TikTok, Reels) dopamin reseptörlerimizi nasıl aşındırıyor?',
    content: 'Günümüzde ortalama dikkat süresi bir akvaryum balığıyla yarışır hale geldi. Peki ama neden?\n\nKısa video tüketimi beyinde anında bir dopamin ödülü yaratır. Her kaydırmada farklı bir uyaranla karşılaştığınızda beyniniz bu hızlı tempoya adapte olur. Sabır gerektiren normal yaşantı –ki buna bir kitabı okumak, veya bir sınava hazırlanmak da dahil– bir anda "çok yavaş" hissettirmeye başlar.\n\nAraştırmalar, bu hızlı dopamin döngüsünün zaman algısını bozduğunu ve kişilerin "zaman geçmiyor" yanılgısına daha sık düştüğünü gösteriyor. Dopamin detoksu ile reseptörleri tekrar kalibre etmek sadece odak süresini değil, hayattan alınan zevki de artırır.',
    imageUrl: 'https://images.unsplash.com/photo-1550592704-6c7b94b053dd?q=80&w=1470&auto=format&fit=crop',
    category: 'Nörobilim',
    date: '2026-03-20'
  },
  {
    id: '2',
    title: 'Pomodoro Tekniğinin Bilimsel Temelleri',
    summary: 'Neden 25 dakika odaklanmak, beynin en optimal çalışma süresidir?',
    content: 'Francesco Cirillo tarafından geliştirilen Pomodoro Tekniği, basitçe 25 dakika kesintisiz çalışma ve ardından 5 dakika mola vermeye dayanır.\n\nBu kuralın nörolojik bir açıklaması vardır. Beynin prefrontal korteksi aşırı yoğun odaklanma sürelerinde hızla yorulur (bilişsel yorgunluk). Ancak 25-30 dakikalık periyotlar, "Ultradian Ritimler" ile mükemmel uyuşur. Kısa molalar beynin hafızayı pekiştirmesine (memory consolidation) fırsat verirken difüz (dağınık) düşünme moduna geçmesini sağlar.\n\nHücresel düzeyde metabolik atıklar arındırılır ve bir sonraki Pomodoro turu için gerekli enerji toplanır.',
    imageUrl: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?q=80&w=1476&auto=format&fit=crop',
    category: 'Üretkenlik',
    date: '2026-03-18'
  }
];

export function useBlogStore() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Sadece client side'da çalıştır
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setPosts(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse blog posts from localStorage", e);
          setPosts(MOCK_DATA);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
        }
      } else {
        // İlk açılışta mock veriyi yükle
        setPosts(MOCK_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
      }
      setIsLoaded(true);
    }
  }, []);

  const addPost = (post: Omit<BlogPost, 'id' | 'date'>) => {
    const newPost: BlogPost = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    
    setPosts(prev => {
      const updated = [newPost, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updatePost = (id: string, updatedFields: Partial<Omit<BlogPost, 'id' | 'date'>>) => {
    setPosts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updatedFields } : p);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deletePost = (id: string) => {
    setPosts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    posts,
    isLoaded,
    addPost,
    updatePost,
    deletePost
  };
}

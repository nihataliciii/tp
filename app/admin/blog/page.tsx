'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { useBlogStore } from '@/lib/useBlogStore';
import { useAuthStore } from '@/lib/useAuthStore';
import { t } from '@/lib/i18n';
import { FileEdit, Trash2, PlusCircle, Save, UploadCloud, FileText, Image as ImageIcon, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';

export default function AdminBlogPage() {
  const router = useRouter();
  const { language } = useApp();
  const { currentUser } = useAuthStore();
  const { posts, addPost, deletePost, isLoaded } = useBlogStore();
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Authorization Check & Redirect
  useEffect(() => {
    if (!currentUser || currentUser.email.toLowerCase() !== 'admin@admin.com') {
      router.push('/login');
    }
  }, [currentUser, router]);

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.type.startsWith('image/')) {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        try {
          const compressed = await imageCompression(file, options);
          setImageFile(compressed);
          setImagePreview(URL.createObjectURL(compressed));
        } catch (error) {
          console.error("Compression error:", error);
        }
      } else if (file.type === 'application/pdf') {
        if (file.size > 5 * 1024 * 1024) {
          alert("PDF dosyası 5MB'dan küçük olmalıdır.");
        } else {
          setPdfFile(file);
        }
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf']
    }
  });

  if (!currentUser || currentUser.email.toLowerCase() !== 'admin@admin.com') {
    return null; 
  }

  if (!isLoaded) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    let uploadedImageUrl = '';
    let uploadedPdfUrl = undefined;

    if (imageFile || pdfFile) {
      setIsUploading(true);
      setUploadProgress(0);
      try {
        const result = await new Promise<{imageUrl: string, pdfUrl: string}>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/api/blog/upload');
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setUploadProgress(Math.round((e.loaded / e.total) * 100));
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error("Upload failed"));
            }
          };
          xhr.onerror = () => reject(new Error("Network Error"));
          
          const fd = new FormData();
          if (imageFile) fd.append('image', imageFile);
          if (pdfFile) fd.append('pdf', pdfFile);
          xhr.send(fd);
        });

        if (result.imageUrl) uploadedImageUrl = result.imageUrl;
        if (result.pdfUrl) uploadedPdfUrl = result.pdfUrl;
      } catch (err) {
        console.error(err);
        alert("Dosya yüklenirken hata oluştu!");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    addPost({
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      imageUrl: uploadedImageUrl || 'https://images.unsplash.com/photo-1550592704-6c7b94b053dd?auto=format&fit=crop&q=80',
      pdfUrl: uploadedPdfUrl,
      category: formData.category || 'Genel'
    });

    setFormData({ title: '', summary: '', content: '', category: '' });
    setImageFile(null);
    setPdfFile(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full p-6 lg:p-12 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex justify-between items-center mb-8 border-b border-[var(--border-accent)] pb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileEdit className="text-[var(--accent-purple)]" /> 
            {t(language, 'adminPanel')}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-1 glass-card p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <PlusCircle size={20} className="text-[var(--accent-cyan)]" />
              {t(language, 'newPost')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col relative">
              <input
                className="input-field"
                placeholder={t(language, 'title')}
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
                disabled={isUploading}
              />
              <input
                className="input-field"
                placeholder="Özet"
                value={formData.summary}
                onChange={e => setFormData({...formData, summary: e.target.value})}
                required
                disabled={isUploading}
              />
              <input
                className="input-field"
                placeholder={t(language, 'category')}
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                disabled={isUploading}
              />
              
              {/* Drag and Drop Zone */}
              <div 
                {...getRootProps()} 
                className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? 'border-[var(--accent-purple)] bg-[rgba(124,58,237,0.1)] shadow-[0_0_30px_rgba(124,58,237,0.3)]' 
                    : 'border-[var(--text-muted)] hover:border-[var(--accent-cyan)] hover:bg-[rgba(6,182,212,0.05)]'
                }`}
              >
                <input {...getInputProps()} disabled={isUploading} />
                <UploadCloud size={40} className={isDragActive ? 'text-[var(--accent-purple)]' : 'text-[var(--text-muted)]'} />
                <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
                  {isDragActive ? 'Dosyaları buraya bırakın...' : 'Dosyaları Buraya Sürükleyin veya Tıklayın'}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)] px-4">
                  Image (Kapak) ve PDF (Ek Kaynak) desteklenir.
                </p>
              </div>

              {/* Upload Previews */}
              {(imagePreview || pdfFile) && (
                <div className="flex flex-col gap-2 mt-2 bg-black/20 p-3 rounded-xl border border-[var(--border-accent)]">
                  <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Eklenecek Dosyalar</h3>
                  {imagePreview && (
                    <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={imagePreview} alt="cover" className="w-10 h-10 rounded object-cover" />
                        <span className="text-sm font-medium truncate max-w-[150px]">{imageFile?.name}</span>
                      </div>
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="p-1 hover:text-red-400">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {pdfFile && (
                    <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--accent-purple)]/20 rounded flex items-center justify-center text-[var(--accent-purple-light)]">
                          <FileText size={20} />
                        </div>
                        <span className="text-sm font-medium truncate max-w-[150px]">{pdfFile.name}</span>
                      </div>
                      <button type="button" onClick={() => setPdfFile(null)} className="p-1 hover:text-red-400">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <textarea
                className="input-field min-h-[200px] resize-y"
                placeholder={t(language, 'content')}
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                required
                disabled={isUploading}
              />
              
              {isUploading ? (
                <div className="mt-2 text-center w-full">
                  <div className="w-full h-8 bg-black/50 rounded-xl overflow-hidden border border-[var(--border-accent)] relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white text-[text-shadow:0_0_4px_black] mix-blend-plus-lighter">
                      % {uploadProgress} Yükleniyor...
                    </div>
                  </div>
                </div>
              ) : (
                <button type="submit" className="btn-primary flex items-center justify-center gap-2 mt-2 w-full">
                  <Save size={18} /> {t(language, 'saveRef')}
                </button>
              )}
            </form>
          </div>

          {/* Posts List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-6">Mevcut Yazılar ({posts.length})</h2>
            {posts.length === 0 ? (
              <p className="text-[var(--text-muted)]">Burada henüz hiç yazı yok.</p>
            ) : (
              posts.map(post => (
                <div key={post.id} className="glass-card p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <img src={post.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <h3 className="font-bold text-white text-lg line-clamp-1">{post.title}</h3>
                      <div className="flex gap-3 text-xs text-[var(--text-muted)] font-medium mt-1">
                        <span className="text-[var(--accent-cyan)]">{post.category}</span>
                        <span>•</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deletePost(post.id)}
                    className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

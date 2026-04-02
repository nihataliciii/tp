'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useBlogStore } from '@/lib/useBlogStore';
import {
  FileEdit, Trash2, PlusCircle, Save, UploadCloud, FileText, X,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';

export default function AdminBlogPage() {
  const router = useRouter();
  const { posts, addPost, deletePost, isLoaded } = useBlogStore();

  const [authorized, setAuthorized] = useState(false);
  const [formData, setFormData] = useState({ title: '', summary: '', content: '', category: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user || data.user.email?.toLowerCase() !== 'admin@admin.com') {
        router.push('/login');
      } else {
        setAuthorized(true);
      }
    });
  }, [router]);

  const onDrop = async (accepted: File[]) => {
    for (const file of accepted) {
      if (file.type.startsWith('image/')) {
        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true,
          });
          setImageFile(compressed);
          setImagePreview(URL.createObjectURL(compressed));
        } catch (err) { console.error('Compression error', err); }
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
      'application/pdf': ['.pdf'],
    },
  });

  const uploadToSupabase = async (file: File, bucket: string, path: string): Promise<string> => {
    const supabase = createClient();
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    let uploadedImageUrl = '';
    let uploadedPdfUrl: string | undefined;

    if (imageFile || pdfFile) {
      setIsUploading(true);
      setUploadProgress(10);
      try {
        const timestamp = Date.now();

        if (imageFile) {
          const ext = imageFile.name.split('.').pop() ?? 'jpg';
          setUploadProgress(40);
          uploadedImageUrl = await uploadToSupabase(
            imageFile, 'blog-media', `images/${timestamp}.${ext}`
          );
          setUploadProgress(70);
        }

        if (pdfFile) {
          setUploadProgress(80);
          uploadedPdfUrl = await uploadToSupabase(
            pdfFile, 'blog-media', `pdfs/${timestamp}.pdf`
          );
          setUploadProgress(95);
        }

        setUploadProgress(100);
      } catch (err) {
        console.error(err);
        alert('Dosya yüklenirken hata oluştu!');
        setIsUploading(false);
        setUploadProgress(0);
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
      category: formData.category || 'Genel',
    });

    setFormData({ title: '', summary: '', content: '', category: '' });
    setImageFile(null);
    setPdfFile(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  if (!authorized || !isLoaded) return null;

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          <FileEdit size={24} className="text-indigo-500" />
          Admin Panel — Blog
        </h1>
        <p className="text-sm text-gray-400 mt-1">Yazı oluştur, yönet ve yayınla</p>
      </div>

      <div className="px-8 py-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Create Form ── */}
          <div className="lg:col-span-2">
            <div className="saas-card p-6 sticky top-6">
              <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <PlusCircle size={17} className="text-indigo-500" />
                Yeni Yazı
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  className="saas-input"
                  placeholder="Başlık *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={isUploading}
                />
                <input
                  className="saas-input"
                  placeholder="Özet"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  disabled={isUploading}
                />
                <input
                  className="saas-input"
                  placeholder="Kategori"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={isUploading}
                />

                {/* Drag & Drop Zone */}
                <div
                  {...getRootProps()}
                  className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} disabled={isUploading} />
                  <UploadCloud
                    size={32}
                    className={isDragActive ? 'text-indigo-500' : 'text-gray-300'}
                  />
                  <p className="mt-2 text-sm font-medium text-gray-600">
                    {isDragActive ? 'Bırakın...' : 'Sürükle & Bırak veya Tıkla'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Görsel (kapak) ve PDF (ek kaynak)</p>
                </div>

                {/* File Previews */}
                {(imagePreview || pdfFile) && (
                  <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Eklenecek Dosyalar</p>

                    {imagePreview && (
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imagePreview} alt="cover" className="w-9 h-9 rounded object-cover" />
                          <span className="text-sm text-gray-700 truncate max-w-[140px]">{imageFile?.name}</span>
                        </div>
                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="text-gray-400 hover:text-red-400 p-1">
                          <X size={15} />
                        </button>
                      </div>
                    )}

                    {pdfFile && (
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 bg-indigo-50 rounded flex items-center justify-center text-indigo-500">
                            <FileText size={16} />
                          </div>
                          <span className="text-sm text-gray-700 truncate max-w-[140px]">{pdfFile.name}</span>
                        </div>
                        <button type="button" onClick={() => setPdfFile(null)} className="text-gray-400 hover:text-red-400 p-1">
                          <X size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <textarea
                  className="saas-input min-h-[180px] resize-y"
                  placeholder="İçerik *"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  disabled={isUploading}
                />

                {/* Upload progress */}
                {isUploading && (
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading}
                  className="saas-btn w-full flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Yükleniyor... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Kaydet & Yayınla
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Post List ── */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="text-base font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Mevcut Yazılar
              <span className="ml-2 text-sm font-normal text-gray-400">({posts.length})</span>
            </h2>

            {posts.length === 0 ? (
              <div className="text-sm text-gray-400 py-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
                Henüz hiç yazı yok.
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="saas-card p-4 flex items-center gap-4 hover:border-indigo-200 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover shrink-0 bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-sm">{post.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span className="text-indigo-500 font-medium">{post.category}</span>
                      <span>·</span>
                      <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                      {post.pdfUrl && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1"><FileText size={11} /> PDF</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Sil"
                  >
                    <Trash2 size={16} />
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

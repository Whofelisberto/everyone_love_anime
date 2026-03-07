import { Loader2, Send, Upload, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import api from '../services/api';

export default function Create() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [creatingPost, setCreatingPost] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleCreatePost = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('O título é obrigatório.');
      return;
    }

    if (!content.trim()) {
      setError('O conteúdo do post é obrigatório.');
      return;
    }

    try {
      setCreatingPost(true);
      setError('');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      await api.post('/post', formData);

      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar post.');
    } finally {
      setCreatingPost(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Criar Post</h1>

          <form
            onSubmit={handleCreatePost}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4"
          >
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex: Naruto, Flamengo, Anime Blue Lock..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-600"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Compartilhe algo sobre anime..."
                className="w-full min-h-40 resize-y rounded-lg border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-pink-600 font-semibold"
              />
              <span className="text-sm text-gray-500 mt-1 block">{content.length} caracteres</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem (opcional)
              </label>
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Clique para fazer upload de uma imagem
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creatingPost}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 disabled:bg-gray-400 transition"
              >
                {creatingPost ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                Publicar
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

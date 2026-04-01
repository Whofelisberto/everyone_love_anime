import { Heart, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import CommentSection from './CommentSection';

type Post = {
  id: number;
  title: string;
  content: string;
  author_id: number;
  username: string;
  likes_count: number;
  comments_count: number;
  liked_by_current_user: boolean;
  image_url?: string;
  created_at: string;
};

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const fetchPosts = async () => {
  try {
    setLoadingPosts(true);
    const response = await api.get(`/posts?${Date.now()}`)
    const data = response.data;
    setPosts(Array.isArray(data) ? data : []);

  } catch (err: any) {
    setError(err.response?.data?.message || 'Erro ao carregar posts.');
  } finally {
    setLoadingPosts(false);
  }
};

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      const response = await api.post(`/post/${postId}/like`);

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked_by_current_user: response.data.liked,
                likes_count: response.data.likes_count,
              }
            : post
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao curtir/descurtir post.');
    }
  };

  const handleCommentCreated = (postId: number) => {
    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments_count: post.comments_count + 1,
            }
          : post
      )
    );
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Agora';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return 'Ontem';
    }

    if (diffInDays < 7) {
      return `Há ${diffInDays} dias`;
    }

    return postDate.toLocaleDateString('pt-BR');
  };

  // Filtrar posts com base na busca
  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true;
    const lowerSearch = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(lowerSearch) ||
      post.content.toLowerCase().includes(lowerSearch) ||
      post.username.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {searchQuery && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-pink-600">
          Resultados para: <strong>{searchQuery}</strong> ({filteredPosts.length} posts encontrados)
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loadingPosts ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-pink-600" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {searchQuery ? 'Nenhum post encontrado para essa busca.' : 'Nenhum post ainda.'}
        </div>
      ) : (
        filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4"
          >
            <header className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Link
                    to={`/profile/${post.author_id}`}
                    className="font-semibold hover:text-pink-600 transition-colors"
                  >
                    {post.username}
                  </Link>
                  <span>•</span>
                  <span>{getRelativeTime(post.created_at)}</span>
                </div>
              </div>
            </header>

            <p className="text-gray-700 font-semibold whitespace-pre-wrap">{post.content}</p>

            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-auto max-h-[600] object-contain rounded-lg"
              />
            )}

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <button
                type="button"
                onClick={() => handleLike(post.id)}
                className={`inline-flex items-center gap-1 transition ${
                  post.liked_by_current_user ? 'text-pink-600' : 'hover:text-pink-600'
                }`}
              >
                <Heart size={16} fill={post.liked_by_current_user ? 'currentColor' : 'none'} />
                {post.likes_count}
              </button>

              <span>{post.comments_count} comentários</span>
            </div>

            <CommentSection postId={post.id} onCommentCreated={() => handleCommentCreated(post.id)} />
          </article>
        ))
      )}
    </section>
  );
}

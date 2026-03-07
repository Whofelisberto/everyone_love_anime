import { Heart, Loader2, Send } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import api from '../services/api'
import CommentSection from './CommentSection'

type Post = {
  id: number
  content: string
  author_id: number
  username: string
  likes_count: number
  comments_count: number
  liked_by_current_user: boolean
}

export default function PostForm() {
  const [posts, setPosts] = useState<Post[]>([])
  const [content, setContent] = useState('')
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [creatingPost, setCreatingPost] = useState(false)
  const [error, setError] = useState('')

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true)
      const response = await api.get('/posts')
      setPosts(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar posts.')
    } finally {
      setLoadingPosts(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleCreatePost = async (event: FormEvent) => {
    event.preventDefault()

    if (!content.trim()) {
      setError('O conteúdo do post é obrigatório.')
      return
    }

    try {
      setCreatingPost(true)
      setError('')
      await api.post('/post', { content })
      setContent('')
      await fetchPosts()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar post.')
    } finally {
      setCreatingPost(false)
    }
  }

  const handleLike = async (postId: number) => {
    try {
      const response = await api.post(`/post/${postId}/like`)

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
      )
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao curtir/descurtir post.')
    }
  }

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
    )
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <form onSubmit={handleCreatePost} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Compartilhe algo sobre anime..."
          className="w-full min-h-28 resize-y rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-pink-600"
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{content.length} caracteres</span>
          <button
            type="submit"
            disabled={creatingPost}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 disabled:bg-gray-400 transition"
          >
            {creatingPost ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            Publicar
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {loadingPosts ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-pink-600" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">Nenhum post ainda.</div>
      ) : (
        posts.map((post) => (
          <article key={post.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
            <header>
              <h3 className="font-semibold text-gray-800">{post.username}</h3>
            </header>

            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

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
  )
}

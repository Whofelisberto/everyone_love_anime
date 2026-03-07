import { AlertCircle, Camera, Heart, Mail, MessageSquare, Shield, User as UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommentSection from '../Components/CommentSection'
import Footer from '../Components/Footer'
import Header from '../Components/Header'
import api from '../services/api'

interface User {
  id: number
  username: string
  email: string
  role: string
  profile_image?: string
}

type Post = {
  id: number
  title: string
  content: string
  author_id: number
  username: string
  likes_count: number
  comments_count: number
  liked_by_current_user: boolean
  image_url?: string
  created_at: string
}

declare global {
  interface Window {
    cloudinary: any
  }
}

export default function Profile() {
  const { userId } = useParams<{ userId: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const isOwnProfile = !userId || (currentUser && user && currentUser.id === user.id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)


        const currentUserResponse = await api.get('/me', { withCredentials: true })
        setCurrentUser(currentUserResponse.data)


        if (userId) {
          const userResponse = await api.get(`/user/${userId}`)
          setUser(userResponse.data)
        } else {
          setUser(currentUserResponse.data)
        }

        setError(null)
      } catch (error: any) {
        console.error('Error fetching user:', error)
        setError(error.response?.data?.message || 'Erro ao carregar dados do usuário')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return

      try {
        setLoadingPosts(true)
        const response = await api.get(`/user/${user.id}/posts`)
        setPosts(response.data)
      } catch (error: any) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoadingPosts(false)
      }
    }

    fetchPosts()
  }, [user])

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) {
      alert('Cloudinary não está carregado. Por favor, recarregue a página.')
      return
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dgscg4mpm',
        uploadPreset: 'leandro',
        sources: ['local', 'camera', 'url'],
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
        maxFileSize: 5000000, // 5MB
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
        croppingCoordinatesMode: 'custom',
        folder: 'profile_images',
        resourceType: 'image',
        theme: 'minimal',
      },
      async (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          setUploading(true)
          try {
            const imageUrl = result.info.secure_url
            const response = await api.put('/profile', {
              profile_image: imageUrl
            })
            setUser(response.data.user)
            setCurrentUser(response.data.user)
            setUploading(false)
            alert('Foto de perfil atualizada com sucesso!')
          } catch (error: any) {
            console.error('Error updating profile:', error)
            alert('Erro ao atualizar foto de perfil')
            setUploading(false)
          }
        }
        if (error) {
          console.error('Cloudinary upload error:', error)
          alert('Erro ao fazer upload da imagem')
        }
      }
    )

    widget.open()
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
      console.error('Error liking post:', err)
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

  const getRelativeTime = (dateString: string) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Agora'

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `Há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `Há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Ontem'
    if (diffInDays < 7) return `Há ${diffInDays} dias`

    return postDate.toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-pulse" />
            <p className="text-gray-600">Carregando perfil...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-gray-600">{error || 'Erro ao carregar dados do usuário'}</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              Fazer login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-gray-50 to-pink-50">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-full bg-linear-to-r from-pink-500 to-pink-600 flex items-center justify-center overflow-hidden ring-4 ring-pink-100 shadow-xl">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">❤️</span>
                )}
              </div>
              {isOwnProfile && (
                <button
                  onClick={openCloudinaryWidget}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                  title="Alterar foto de perfil"
                >
                  <Camera size={20} />
                </button>
              )}
            </div>


            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{user.username}</h1>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-pink-500" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-pink-500" />
                  <span className="text-sm capitalize">{user.role}</span>
                </div>
              </div>


              <div className="flex gap-6 justify-center md:justify-start mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{posts.length}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {posts.reduce((acc, post) => acc + post.likes_count, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Curtidas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {posts.reduce((acc, post) => acc + post.comments_count, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Comentários</div>
                </div>
              </div>
            </div>
          </div>
        </div>

       
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isOwnProfile ? 'Meus Posts' : `Posts de ${user.username}`}
          </h2>

          {loadingPosts ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {isOwnProfile ? 'Você ainda não criou nenhum post.' : 'Este usuário ainda não criou posts.'}
              </p>
              {isOwnProfile && (
                <Link
                  to="/criar"
                  className="mt-4 inline-block px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Criar primeiro post
                </Link>
              )}
            </div>
          ) : (
            posts.map((post) => (
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

                <CommentSection
                  postId={post.id}
                  onCommentCreated={() => handleCommentCreated(post.id)}
                />
              </article>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

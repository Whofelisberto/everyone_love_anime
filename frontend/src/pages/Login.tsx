import { AlertCircle, Loader, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Components/Header'
import api from '../services/api'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/login', {
        email,
        password,
      })


      if (response.data?.token) {
        localStorage.setItem('access_token', response.data.token)
      }


      localStorage.setItem('isLogado', 'true')
      if (response.data?.user?.username) {
        localStorage.setItem('name', JSON.stringify(response.data.user.username))
      }

      navigate('/')

    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao fazer login. Tente novamente.'
      )
      console.error('Erro ao fazer login:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-6xl gap-8 items-center">


          <div className="hidden lg:flex flex-1 flex-col justify-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Bem-vindo ao <span className="text-pink-600">Everyone Love Anime!</span>
            </h1>
            <p className="text-xl text-gray-600">
              Conecte-se com outros fãs de anime e compartilhe suas paixões
            </p>
          </div>

        
          <div className="w-full lg:flex-1 bg-white rounded-lg shadow-md p-8">

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h2>
              <p className="text-gray-600">Faça login na sua conta</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink: 0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@email.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-pink-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-pink-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>

            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-gray-500 text-sm">ou</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <p className="text-center text-gray-600">
              Não tem conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/registrar')}
                className="text-pink-600 hover:text-pink-700 font-semibold transition"
              >
                Cadastre-se
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

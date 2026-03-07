import { Loader2, MessageCircle, Send } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import api from '../services/api'

type Comment = {
	id: number
	content: string
	user_id: number
	username: string
	created_at: string
}

type CommentSectionProps = {
	postId: number
	onCommentCreated?: () => void
}

export default function CommentSection({ postId, onCommentCreated }: CommentSectionProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [comments, setComments] = useState<Comment[]>([])
	const [content, setContent] = useState('')
	const [loadingComments, setLoadingComments] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')

	const loadComments = async () => {
		try {
			setLoadingComments(true)
			setError('')
			const response = await api.get(`/post/${postId}/comentarios`)
			setComments(response.data)
		} catch (err: any) {
			setError(err.response?.data?.message || 'Erro ao carregar comentários.')
		} finally {
			setLoadingComments(false)
		}
	}

	const toggleOpen = async () => {
		const nextOpen = !isOpen
		setIsOpen(nextOpen)

		if (nextOpen) {
			await loadComments()
		}
	}

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()

		if (!content.trim()) {
			setError('O conteúdo do comentário é obrigatório.')
			return
		}

		try {
			setSubmitting(true)
			setError('')

			const response = await api.post(`/post/${postId}/criar-comentario`, {
				content,
			})

			setComments((previousComments) => [response.data, ...previousComments])
			setContent('')
			onCommentCreated?.()
		} catch (err: any) {
			setError(err.response?.data?.message || 'Erro ao criar comentário.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<section className="border-t border-gray-200 pt-4 space-y-3">
			<button
				type="button"
				onClick={toggleOpen}
				className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-pink-600 transition"
			>
				<MessageCircle size={16} />
				{isOpen ? 'Ocultar comentários' : 'Ver comentários'}
			</button>

			{isOpen && (
				<>
					<form onSubmit={handleSubmit} className="flex items-center gap-2">
						<input
							value={content}
							onChange={(event) => setContent(event.target.value)}
							placeholder="Escreva um comentário..."
							className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-600"
						/>
						<button
							type="submit"
							disabled={submitting}
							className="inline-flex items-center gap-1 rounded-lg bg-pink-600 px-3 py-2 text-white hover:bg-pink-700 disabled:bg-gray-400 transition"
						>
							{submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
						</button>
					</form>

					{error && <p className="text-sm text-red-600">{error}</p>}

					{loadingComments ? (
						<div className="py-3 flex justify-center">
							<Loader2 className="animate-spin text-pink-600" size={18} />
						</div>
					) : comments.length === 0 ? (
						<p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
					) : (
						<ul className="space-y-2">
							{comments.map((comment) => (
								<li key={comment.id} className="rounded-lg bg-gray-50 border border-gray-200 p-3">
									<p className="text-sm font-medium text-gray-800">{comment.username}</p>
									<p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{comment.content}</p>
								</li>
							))}
						</ul>
					)}
				</>
			)}
		</section>
	)
}

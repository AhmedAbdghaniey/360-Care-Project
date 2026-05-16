import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { usePost } from '../../hooks/usePosts'
import PostCard from '../../components/social/PostCard'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: post, isLoading } = usePost(id)

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="card space-y-3">
          <div className="flex items-center gap-3">
            <div className="skeleton h-10 w-10 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <div className="skeleton h-3 w-32" />
              <div className="skeleton h-2 w-20" />
            </div>
          </div>
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-600">Post not found</h2>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <FiArrowLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <PostCard post={post} />
    </div>
  )
}

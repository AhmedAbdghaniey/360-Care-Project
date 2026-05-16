import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiThumbsUp, FiMessageSquare, FiShare2, FiTrash2, FiEdit2, FiMoreHorizontal } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { useLikePost, useUnlikePost, useDeletePost } from '../../hooks/usePosts'
import CommentSection from './CommentSection'

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function PostCard({ post, onEdit }) {
  const { user } = useAuth()
  const likeMutation = useLikePost()
  const unlikeMutation = useUnlikePost()
  const deleteMutation = useDeletePost()
  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const isOwner = user?.id === post.userId

  const handleLike = () => {
    if (post.isLikedByMe) {
      unlikeMutation.mutate(post.id)
    } else {
      likeMutation.mutate(post.id)
    }
  }

  const handleDelete = () => {
    if (confirm('Delete this post?')) {
      deleteMutation.mutate(post.id)
    }
    setShowMenu(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-1">
        <Link to={`/doctors/${post.userId}`} className="shrink-0">
          {post.userProfileImage ? (
            <img src={post.userProfileImage} alt="" className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {post.userName?.charAt(0) || 'U'}
            </div>
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <Link to={`/doctors/${post.userId}`} className="font-semibold text-gray-800 hover:text-cyan-600 text-sm leading-tight">
            {post.userName}
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">{timeAgo(post.createdAt)}</p>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100">
            <FiMoreHorizontal className="h-5 w-5" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px]">
                {isOwner && onEdit && (
                  <button
                    onClick={() => { onEdit(post); setShowMenu(false) }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FiEdit2 className="h-4 w-4" /> Edit
                  </button>
                )}
                {isOwner && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 className="h-4 w-4" /> Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-3">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-[15px]">{post.content}</p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="px-0">
          <img src={post.imageUrl} alt="" className="w-full object-cover max-h-96" />
        </div>
      )}

      {/* Like count */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          {post.likeCount > 0 && (
            <>
              <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                <FiThumbsUp className="h-2.5 w-2.5 text-white" />
              </div>
              <span>{post.likeCount}</span>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mx-5 border-t border-gray-100">
        <div className="flex items-center py-0.5">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded text-sm font-medium transition-all ${
              post.isLikedByMe
                ? 'text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FiThumbsUp className={`h-4 w-4 ${post.isLikedByMe ? 'fill-current' : ''}`} />
            Like
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded text-sm font-medium transition-all ${
              showComments ? 'text-blue-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FiMessageSquare className={`h-4 w-4 ${showComments ? 'fill-current' : ''}`} />
            Comment
          </button>

          <button
            onClick={() => {
              const url = `${window.location.origin}/feed/post/${post.id}`
              navigator.clipboard.writeText(url)
              toast.success('Link copied to clipboard')
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            <FiShare2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-gray-100">
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  )
}

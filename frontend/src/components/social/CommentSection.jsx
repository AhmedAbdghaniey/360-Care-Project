import { useState } from 'react'
import { FiSend, FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { usePostComments, useAddComment, useDeleteComment } from '../../hooks/usePosts'

export default function CommentSection({ postId }) {
  const { user } = useAuth()
  const { data: comments, isLoading } = usePostComments(postId)
  const addComment = useAddComment()
  const deleteComment = useDeleteComment()
  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    addComment.mutate({ postId, data: { content } }, {
      onSuccess: () => setContent(''),
    })
  }

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Comment input */}
      <form onSubmit={handleSubmit} className="flex items-start gap-3">
        {user?.profileImage ? (
          <img src={user.profileImage} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
        )}
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:bg-gray-200 transition-all placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!content.trim() || addComment.isPending}
            className="p-2 rounded-full text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FiSend className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Comments list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="skeleton h-8 w-8 rounded-full shrink-0" />
              <div className="skeleton h-12 flex-1 rounded-xl" />
            </div>
          ))}
        </div>
      ) : comments?.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-2">No comments yet</p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {comments?.map((comment) => (
            <div key={comment.id} className="flex gap-2 items-start group">
              {comment.userProfileImage ? (
                <img src={comment.userProfileImage} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                  {comment.userName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="bg-gray-100 rounded-xl px-3 py-2">
                  <p className="text-sm font-semibold text-gray-700">{comment.userName}</p>
                  <p className="text-sm text-gray-600">{comment.content}</p>
                </div>
                <div className="flex items-center gap-3 mt-0.5 px-1">
                  <p className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              {user?.id === comment.userId && (
                <button
                  onClick={() => deleteComment.mutate({ postId, commentId: comment.id })}
                  className="p-1 rounded text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                >
                  <FiTrash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

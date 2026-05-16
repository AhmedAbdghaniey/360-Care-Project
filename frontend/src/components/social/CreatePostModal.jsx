import { useState } from 'react'
import { FiX, FiImage, FiXCircle } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useCreatePost } from '../../hooks/usePosts'

export default function CreatePostModal({ isOpen, onClose }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const createPost = useCreatePost()

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    createPost.mutate({ content, imageUrl: imageUrl || undefined }, {
      onSuccess: () => {
        setContent('')
        setImageUrl('')
        onClose()
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Create a post</h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-2">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="" className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
            <span className="badge badge-info text-[10px]">Doctor</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-5 py-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full resize-none border-0 outline-none text-[15px] text-gray-800 placeholder:text-gray-400 bg-transparent"
              autoFocus
            />
          </div>

          {/* Image URL input */}
          <div className="px-5 pb-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-blue-400">
              <FiImage className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL (optional)"
                className="flex-1 border-0 outline-none text-sm bg-transparent"
              />
              {imageUrl && (
                <button type="button" onClick={() => setImageUrl('')} className="text-gray-400 hover:text-gray-600">
                  <FiXCircle className="h-4 w-4" />
                </button>
              )}
            </div>
            {imageUrl && (
              <img src={imageUrl} alt="" className="mt-2 w-full rounded-lg object-cover max-h-48" onError={(e) => { e.target.style.display = 'none' }} />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || createPost.isPending}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {createPost.isPending ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

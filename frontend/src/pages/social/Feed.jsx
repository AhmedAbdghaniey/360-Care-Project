import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEdit3, FiRefreshCw, FiSearch } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useFeed } from '../../hooks/usePosts'
import PostCard from '../../components/social/PostCard'
import CreatePostModal from '../../components/social/CreatePostModal'

export default function Feed() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const { data: posts, isLoading, refetch, isFetching } = useFeed(page)

  return (
    <div className="max-w-[600px] mx-auto space-y-4">
      {/* LinkedIn-style Start a post box */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center gap-3">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="" className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <button
            onClick={() => setShowCreate(true)}
            className="flex-1 text-left px-4 py-2.5 border border-gray-300 rounded-full text-sm text-gray-500 hover:bg-gray-50 transition-all"
          >
            Share your thoughts...
          </button>
        </div>
      </div>

      {/* Feed header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Feed</h2>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
        >
          <FiRefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="skeleton h-12 w-12 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="skeleton h-3 w-32" />
                  <div className="skeleton h-2 w-20" />
                </div>
              </div>
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : posts?.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 text-center py-16 px-4">
          <div className="text-5xl mb-4 opacity-20">📝</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-1">No posts yet</h3>
          <p className="text-sm text-gray-400 mb-4 max-w-xs mx-auto">
            Follow other doctors to see their posts here, or create your first post!
          </p>
          <div className="flex flex-col items-center gap-2">
            <button onClick={() => setShowCreate(true)} className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700">
              Create your first post
            </button>
            <button onClick={() => navigate('/doctors')} className="flex items-center gap-1.5 px-5 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-full hover:bg-cyan-600">
              <FiSearch className="h-4 w-4" /> Browse Doctors to Follow
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {posts?.length >= 20 && (
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30"
              >
                Previous
              </button>
              <button onClick={() => setPage((p) => p + 1)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Next
              </button>
            </div>
          )}
        </div>
      )}

      <CreatePostModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}

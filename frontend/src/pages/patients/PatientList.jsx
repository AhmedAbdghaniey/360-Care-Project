import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiUser, FiCalendar, FiDroplet } from 'react-icons/fi'
import { usePatients } from '../../hooks/usePatients'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'

const gradientPairs = [
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-teal-400 to-cyan-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-emerald-400 to-teal-500',
]

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getGradient(name) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return gradientPairs[Math.abs(hash) % gradientPairs.length]
}

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function PatientList() {
  const navigate = useNavigate()
  const { data: patients, isLoading, isError, error } = usePatients()
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = useMemo(() => {
    if (!patients) return []
    const list = Array.isArray(patients) ? patients : patients?.data || patients?.patients || []
    return list.filter((p) => {
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      return (
        (p.name || '').toLowerCase().includes(term) ||
        (p.gender || '').toLowerCase().includes(term) ||
        (p.bloodType || '').toLowerCase().includes(term)
      )
    })
  }, [patients, searchTerm])

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">My Patients</h1>
        <EmptyState
          icon={FiUser}
          title="Failed to load patients"
          description={error?.message || 'Something went wrong.'}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Patients</h1>
        <p className="mt-1 text-sm text-gray-400">View and manage your patients.</p>
      </div>

      <div className="relative">
        <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, gender, or blood type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <LoadingSkeleton key={i} type="list" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiUser}
          title="No patients found"
          description={searchTerm ? 'Try a different search term.' : 'No patients have been assigned to you yet.'}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          {filtered.map((p, i) => (
            <motion.div
              key={p._id || p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/patients/${p._id || p.id}`)}
              className="card group flex cursor-pointer items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getGradient(p.name)} text-lg font-bold text-white shadow-md`}
              >
                {getInitials(p.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-800 group-hover:text-cyan-600 transition-colors">
                  {p.name || 'Unknown Patient'}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  {p.gender && (
                    <span className="flex items-center gap-1">
                      <FiUser className="h-3.5 w-3.5" />
                      {p.gender}
                    </span>
                  )}
                  {p.bloodType && (
                    <span className="flex items-center gap-1">
                      <FiDroplet className="h-3.5 w-3.5" />
                      {p.bloodType}
                    </span>
                  )}
                  {p.dob && (
                    <span className="flex items-center gap-1">
                      <FiCalendar className="h-3.5 w-3.5" />
                      {formatDate(p.dob)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

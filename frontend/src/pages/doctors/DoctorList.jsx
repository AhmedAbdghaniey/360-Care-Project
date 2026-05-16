import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiStar, FiClock, FiDollarSign } from 'react-icons/fi'
import { useDoctors } from '../../hooks/useDoctors'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'

const specializations = ['All', 'Cardiology', 'Pediatrics', 'Neurology', 'Dermatology', 'Orthopedics', 'Internal Medicine', 'Ophthalmology', 'Psychiatry']

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

export default function DoctorList() {
  const navigate = useNavigate()
  const { data: doctors, isLoading, isError, error } = useDoctors()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('All')

  const filtered = useMemo(() => {
    if (!doctors) return []
    const list = Array.isArray(doctors) ? doctors : doctors?.data || doctors?.doctors || []
    return list.filter((doc) => {
      const matchSearch =
        !searchTerm ||
        (doc.fullName || doc.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.specialization || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchSpecialization =
        selectedSpecialization === 'All' ||
        (doc.specialization || '') === selectedSpecialization
      return matchSearch && matchSpecialization
    })
  }, [doctors, searchTerm, selectedSpecialization])

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Find a Doctor</h1>
        <EmptyState
          icon={FiSearch}
          title="Failed to load doctors"
          description={error?.message || 'Something went wrong. Please try again.'}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Find a Doctor</h1>
        <p className="mt-1 text-sm text-gray-400">Search and filter doctors by specialization.</p>
      </div>

      <div className="relative">
        <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {specializations.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialization(spec)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              selectedSpecialization === spec
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} type="card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiSearch}
          title="No doctors found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.doctorId || doc._id || doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/doctors/${doc.doctorId || doc._id || doc.id}`)}
              className="card group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getGradient(doc.fullName || doc.name)} text-lg font-bold text-white shadow-md`}
                >
                  {getInitials(doc.fullName || doc.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-800 group-hover:text-cyan-600 transition-colors">
                    {doc.fullName || doc.name || 'Unknown Doctor'}
                  </h3>
                  <span className="mt-1 inline-block rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700">
                    {doc.specialization || 'General'}
                  </span>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    (doc.availabilityStatus || '').toLowerCase() === 'available'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {(doc.availabilityStatus || '').toLowerCase() === 'available' ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {doc.experienceYears != null && (
                  <span className="flex items-center gap-1">
                    <FiClock className="h-4 w-4" />
                    {doc.experienceYears} yr
                  </span>
                )}
                {doc.consultationFee != null && (
                  <span className="flex items-center gap-1">
                    <FiDollarSign className="h-4 w-4" />
                    ${doc.consultationFee}
                  </span>
                )}
                {doc.doctorScore != null && doc.doctorScore > 0 && (
                  <span className="flex items-center gap-1 text-amber-500">
                    <FiStar className="h-4 w-4 fill-current" />
                    {doc.doctorScore.toFixed(1)}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

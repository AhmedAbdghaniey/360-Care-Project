import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiUsers, FiUser, FiHeart, FiHome, FiBriefcase, FiCalendar,
  FiShield, FiToggleLeft, FiToggleRight, FiActivity,
  FiUserCheck, FiUserX, FiArrowRight, FiRefreshCw, FiTrash2,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/ui/StatCard'
import LoadingSkeleton from '../../components/ui/LoadingSkeleton'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { getStats } from '../../api/dashboard'
import { getUsers, toggleActive, deleteUser } from '../../api/admin'

const quickActions = [
  { label: 'Manage Users', icon: FiUsers, path: '/users', color: 'from-cyan-500 to-blue-600' },
  { label: 'View All Jobs', icon: FiBriefcase, path: '/jobs', color: 'from-violet-500 to-purple-600' },
  { label: 'View Appointments', icon: FiCalendar, path: '/appointments', color: 'from-teal-400 to-cyan-500' },
]

const roleIcon = {
  doctor: <FiUser className="h-3.5 w-3.5" />,
  patient: <FiHeart className="h-3.5 w-3.5" />,
  hospital: <FiHome className="h-3.5 w-3.5" />,
  admin: <FiShield className="h-3.5 w-3.5" />,
}

const roleBadge = {
  doctor: 'badge-info',
  patient: 'badge-success',
  hospital: 'badge-purple',
  admin: 'badge-warning',
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function AdminDashboard() {
  const { user } = useAuth()

  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [toggling, setToggling] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  function fetchStats() {
    setLoadingStats(true)
    getStats()
      .then((res) => setStats(res?.data || res))
      .catch(() => {})
      .finally(() => setLoadingStats(false))
  }

  function fetchUsers() {
    setLoadingUsers(true)
    getUsers()
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.data || []
        setUsers(list)
      })
      .catch(() => {})
      .finally(() => setLoadingUsers(false))
  }

  useEffect(() => { fetchStats(); fetchUsers() }, [])

  async function handleToggle(id) {
    setToggling(id)
    try {
      await toggleActive(id)
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === id ? { ...u, isActive: !u.isActive, active: !u.active } : u
        )
      )
    } catch {
      // silently fail
    } finally {
      setToggling(null)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id))
      toast.success('User deleted')
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setDeleteTarget(null)
    }
  }

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers ?? stats?.users ?? users.length, icon: FiUsers, color: 'primary' },
    { title: 'Doctors', value: stats?.totalDoctors ?? users.filter((u) => u.role === 'doctor').length, icon: FiUser, color: 'secondary' },
    { title: 'Patients', value: stats?.totalPatients ?? users.filter((u) => u.role === 'patient').length, icon: FiHeart, color: 'accent' },
    { title: 'Hospitals', value: stats?.totalHospitals ?? users.filter((u) => u.role === 'hospital').length, icon: FiHome, color: 'warm' },
    { title: 'Jobs', value: stats?.totalJobs ?? 0, icon: FiBriefcase, color: 'primary' },
    { title: 'Appointments', value: stats?.totalAppointments ?? 0, icon: FiCalendar, color: 'secondary' },
  ]

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt || b.created) - new Date(a.createdAt || a.created))
    .slice(0, 8)

  const recentActivity = recentUsers.map((u) => ({
    id: u._id || u.id,
    type: 'user_joined',
    user: u,
    time: u.createdAt || u.created,
    message: `${u.name || 'Someone'} joined as ${u.role}`,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-400">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}</p>
        </div>
        <button
          onClick={() => { fetchStats(); fetchUsers() }}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <FiRefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {loadingStats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <LoadingSkeleton key={i} type="card" />)}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          {statCards.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Users</h3>
              <Link to="/users" className="flex items-center gap-1 text-sm font-medium text-cyan-600 hover:text-cyan-700">
                View All <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loadingUsers ? (
              <LoadingSkeleton type="table" />
            ) : recentUsers.length === 0 ? (
              <EmptyState icon={FiUsers} title="No users found" description="Users will appear once they register." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-400">
                      <th className="pb-3 pr-4">User</th>
                      <th className="pb-3 pr-4">Role</th>
                      <th className="pb-3 pr-4">Joined</th>
                      <th className="pb-3 text-right">Active</th>
                      <th className="pb-3 pl-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((u) => {
                      const uid = u._id || u.id
                      const isActive = u.isActive ?? u.active ?? true
                      const isToggling = toggling === uid
                      return (
                        <tr key={uid} className="border-b border-gray-50 last:border-0">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold">
                                {u.name?.charAt(0) || '?'}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-700 truncate">{u.name || 'Unknown'}</p>
                                <p className="text-xs text-gray-400 truncate">{u.email || ''}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`${roleBadge[u.role] || 'badge-info'} inline-flex items-center gap-1`}>
                              {roleIcon[u.role] || null}
                              {(u.role || '').charAt(0).toUpperCase() + (u.role || '').slice(1)}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                            {u.createdAt || u.created ? formatDate(u.createdAt || u.created) : '--'}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleToggle(uid)}
                              disabled={isToggling}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                            >
                              {isToggling ? (
                                <FiRefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : isActive ? (
                                <FiToggleRight className="h-4 w-4" />
                              ) : (
                                <FiToggleLeft className="h-4 w-4" />
                              )}
                              {isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="py-3 pl-2 text-right">
                            <button
                              onClick={() => setDeleteTarget(uid)}
                              className="rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Recent Activity</h3>
            {loadingUsers ? (
              <LoadingSkeleton type="list" count={4} />
            ) : recentActivity.length === 0 ? (
              <p className="text-sm text-gray-400">No recent activity.</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((act) => (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <FiActivity className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-600">{act.message}</p>
                      <p className="text-xs text-gray-400">{timeAgo(act.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">{action.label}</p>
                  </div>
                  <FiArrowRight className="h-5 w-5 text-gray-300 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User" size="sm">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4">
            <FiTrash2 className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">Are you sure?</p>
              <p className="mt-1 text-sm text-red-600">This action cannot be undone. The user and their related data will be permanently deleted.</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary text-sm">Cancel</button>
            <button onClick={() => handleDelete(deleteTarget)} className="btn-danger text-sm">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

import { NavLink, useLocation } from 'react-router-dom'
import {
  FiHome, FiUser, FiCalendar, FiBriefcase, FiMessageSquare,
  FiFileText, FiActivity, FiStar, FiSettings, FiUsers,
  FiLogOut, FiMenu, FiX, FiCrosshair, FiRss, FiClock,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const roleNavMap = {
  ALL: [
    { name: 'Feed', path: '/feed', icon: FiRss },
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Messages', path: '/messages', icon: FiMessageSquare },
    { name: 'Profile', path: '/profile', icon: FiUser },
  ],
  DOCTOR: [
    { name: 'Doctors Directory', path: '/doctors', icon: FiStar },
    { name: 'Appointments', path: '/appointments', icon: FiCalendar },
    { name: 'My Availability', path: '/appointments/availability', icon: FiClock },
    { name: 'Jobs', path: '/jobs', icon: FiBriefcase },
    { name: 'My Applications', path: '/jobs/applications', icon: FiFileText },
  ],
  PATIENT: [
    { name: 'My Doctors', path: '/doctors', icon: FiUser },
    { name: 'Appointments', path: '/appointments', icon: FiCalendar },
  ],
  HOSPITAL: [
    { name: 'Doctors', path: '/doctors', icon: FiUsers },
    { name: 'My Jobs', path: '/jobs', icon: FiBriefcase },
    { name: 'Applications', path: '/jobs/applications', icon: FiFileText },
  ],
  ADMIN: [
    { name: 'Doctors', path: '/doctors', icon: FiUsers },
    { name: 'Appointments', path: '/appointments', icon: FiCalendar },
    { name: 'Users', path: '/dashboard/admin', icon: FiUsers },
  ],
}

export default function Sidebar({ isOpen, onToggle }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const role = (user?.role || 'ALL').toUpperCase()

  const navLinks = [
    ...(roleNavMap.ALL || []),
    ...(roleNavMap[role] || []),
  ]

  const uniqueLinks = navLinks.filter(
    (link, i, arr) => arr.findIndex((l) => l.path === link.path) === i
  )

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col glass border-r border-gray-200/50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-gray-200/50 px-6 py-5">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
              <FiCrosshair className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">Mid</span>
              <span className="text-gray-700">Space</span>
            </span>
          </NavLink>
          <button
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 lg:hidden"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          <ul className="space-y-1">
            {uniqueLinks.map((link) => {
              const isActive = location.pathname === link.path ||
                location.pathname.startsWith(link.path + '/')
              return (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={() => window.innerWidth < 1024 && onToggle?.()}
                    className={`sidebar-link group ${isActive ? 'active' : ''}`}
                  >
                    <link.icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">{link.name}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User profile & logout */}
        <div className="border-t border-gray-200/50 p-4">
          <div className="mb-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-md shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-800">{user?.name || 'User'}</p>
                <p className="truncate text-xs text-gray-400">{user?.email || ''}</p>
                <span className="mt-0.5 inline-block rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-cyan-600">
                  {user?.role || 'user'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="sidebar-link w-full text-red-500 hover:!bg-red-50 hover:!text-red-600"
          >
            <FiLogOut className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

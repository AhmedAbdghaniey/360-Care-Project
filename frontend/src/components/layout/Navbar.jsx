import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FiMenu, FiUser, FiSettings, FiLogOut, FiCrosshair } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/messages': 'Messages',
  '/profile': 'Profile',
  '/doctors': 'Doctors Directory',
  '/patients': 'My Patients',
  '/appointments': 'Appointments',
  '/medical-records': 'Medical Records',
  '/prescriptions': 'Prescriptions',
  '/jobs': 'Jobs',
  '/applications': 'Applications',
  '/users': 'Users',
  '/my-doctors': 'My Doctors',
}

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const title = pageTitles[location.pathname] || 'Dashboard'

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200/50 glass px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md">
            <FiCrosshair className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">Mid</span>
            <span className="text-gray-700">Space</span>
          </span>
        </div>
        <div className="mx-2 h-5 w-px bg-gray-200" />
        <h1 className="text-lg font-bold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="ml-2 flex items-center gap-2 rounded-xl p-1.5 hover:bg-gray-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl glass border border-gray-200/50 py-2 shadow-xl animate-scale-in">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400">{user?.email || ''}</p>
                <span className="mt-1 inline-block rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-cyan-600">
                  {user?.role || 'user'}
                </span>
              </div>
              <a
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <FiUser className="h-4 w-4" /> Profile
              </a>
              <a
                href="/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <FiSettings className="h-4 w-4" /> Settings
              </a>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

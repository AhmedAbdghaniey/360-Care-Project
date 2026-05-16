import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiCrosshair, FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'Features', href: '#features' },
  { name: 'Doctors', href: '#doctors' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Jobs', href: '#jobs' },
]

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href) => {
    setMobileOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/50'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-110">
              <FiCrosshair className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">Mid</span>
              <span className="text-gray-700">Space</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 transition-all duration-200"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="btn-secondary !px-5 !py-2.5 !text-sm"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="btn-primary !px-5 !py-2.5 !text-sm"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            {mobileOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition-all"
                >
                  {link.name}
                </button>
              ))}
              <hr className="my-3 border-gray-100" />
              <Link
                to="/login"
                className="block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="block w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-cyan-500/30"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

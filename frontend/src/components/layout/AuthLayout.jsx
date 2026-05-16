import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCrosshair } from 'react-icons/fi'

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-purple-50 p-4">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-violet-400/20 to-purple-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-teal-300/10 to-cyan-400/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center justify-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
              <FiCrosshair className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">Mid</span>
              <span className="text-gray-700">Space</span>
            </span>
          </div>
          <p className="text-sm text-gray-400">Your health, connected.</p>
        </div>

        {/* Glass form card */}
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <Outlet />
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} MidSpace. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}

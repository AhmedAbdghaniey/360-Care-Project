import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiUserPlus, FiHeart, FiHome, FiAlertCircle, FiCheck } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const roles = [
  { key: 'doctor', label: 'Doctor', icon: FiUserPlus, description: 'Manage patients & records' },
  { key: 'patient', label: 'Patient', icon: FiHeart, description: 'Find doctors & book visits' },
  { key: 'hospital', label: 'Hospital', icon: FiHome, description: 'Post jobs & hire doctors' },
]

function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'bg-gray-200' }
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' }
  if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' }
  if (score <= 4) return { score: 75, label: 'Good', color: 'bg-cyan-500' }
  return { score: 100, label: 'Strong', color: 'bg-emerald-500' }
}

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const strength = getStrength(form.password)

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Invalid email format'
    }
    if (!form.password) {
      errs.password = 'Password is required'
    } else if (form.password.length < 6) {
      errs.password = 'At least 6 characters'
    }
    if (!form.role) errs.role = 'Select a role'
    if (!acceptTerms) errs.terms = 'You must accept the terms'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')
    if (!validate()) return
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.role)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="mt-1 text-sm text-gray-400">Join the MidSpace community</p>
      </div>

      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
        >
          <FiAlertCircle className="h-5 w-5 shrink-0" />
          <span>{apiError}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-600">Full Name</label>
          <div className="relative">
            <FiUser className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
              className={`input-field pl-11 ${errors.name ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''}`}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-600">Email</label>
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
              className={`input-field pl-11 ${errors.email ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''}`}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-600">Password</label>
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }) }}
              className={`input-field pl-11 ${errors.password ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''}`}
            />
          </div>
          {form.password && (
            <div className="mt-2">
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${strength.score}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-full rounded-full ${strength.color}`}
                />
              </div>
              <p className={`mt-1 text-xs font-medium ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
            </div>
          )}
          {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">I am a</label>
          <div className="grid grid-cols-3 gap-2.5">
            {roles.map((r) => {
              const selected = form.role === r.key
              return (
                <motion.button
                  key={r.key}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setForm({ ...form, role: r.key }); setErrors({ ...errors, role: '' }) }}
                  className={`relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3.5 text-center transition-all duration-200 ${
                    selected
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-md shadow-cyan-200/50'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {selected && (
                    <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                      <FiCheck className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-colors ${
                    selected ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <r.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold">{r.label}</span>
                  <span className="text-[10px] leading-tight text-gray-400">{r.description}</span>
                </motion.button>
              )
            })}
          </div>
          {errors.role && <p className="mt-1 text-xs text-rose-500">{errors.role}</p>}
        </div>

        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={() => { setAcceptTerms(!acceptTerms); setErrors({ ...errors, terms: '' }) }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
          />
          <label className="text-sm text-gray-500">
            I agree to the{' '}
            <button type="button" className="font-medium text-cyan-600 hover:text-cyan-700">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="font-medium text-cyan-600 hover:text-cyan-700">
              Privacy Policy
            </button>
          </label>
        </div>
        {errors.terms && <p className="-mt-2 text-xs text-rose-500">{errors.terms}</p>}

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Create Account'
          )}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-cyan-600 hover:text-cyan-700">
          Sign in
        </Link>
      </p>
    </>
  )
}

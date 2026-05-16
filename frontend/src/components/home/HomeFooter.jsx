import { Link } from 'react-router-dom'
import { FiCrosshair, FiMail, FiPhone, FiMapPin, FiGithub, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi'

const quickLinks = [
  { name: 'Find Doctors', href: '/doctors' },
  { name: 'Book Appointment', href: '/appointments/book' },
  { name: 'Medical Records', href: '/medical-records' },
  { name: 'Job Opportunities', href: '/jobs' },
  { name: 'About Us', href: '#' },
  { name: 'Contact', href: '#' },
]

const forUsers = [
  { name: 'For Doctors', href: '/register' },
  { name: 'For Patients', href: '/register' },
  { name: 'For Hospitals', href: '/register' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Service', href: '#' },
]

export default function HomeFooter() {
  return (
    <footer className="relative bg-gray-900 text-gray-300">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-900 to-gray-900" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                <FiCrosshair className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MidSpace</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              The premier healthcare network connecting doctors, patients, and hospitals. 
              Revolutionizing medical care through smart technology.
            </p>
            <div className="flex gap-3">
              {[FiGithub, FiTwitter, FiLinkedin, FiInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">For Users</h3>
            <ul className="space-y-2.5">
              {forUsers.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <span className="text-sm text-gray-400">123 Healthcare Ave, Medical District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="h-4 w-4 shrink-0 text-cyan-400" />
                <a href="mailto:hello@midspace.com" className="text-sm text-gray-400 hover:text-cyan-400">hello@midspace.com</a>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="h-4 w-4 shrink-0 text-cyan-400" />
                <a href="tel:+1234567890" className="text-sm text-gray-400 hover:text-cyan-400">+1 (234) 567-890</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 py-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MidSpace. All rights reserved. Made with care for healthcare.
          </p>
        </div>
      </div>
    </footer>
  )
}

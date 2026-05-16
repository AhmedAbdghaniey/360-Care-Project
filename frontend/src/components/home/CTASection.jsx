import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

export default function CTASection() {
  return (
    <section id="cta" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to Transform Your{' '}
            <span className="text-cyan-200">Healthcare Experience?</span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-cyan-100"
          >
            Join thousands of healthcare professionals and patients who trust MidSpace for their medical needs.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-cyan-600 shadow-xl transition-all"
          >
            Get Started Today
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FiArrowRight className="h-5 w-5" />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

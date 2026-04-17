import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-lg shadow-brand-600/25">
        <span className="text-white font-bold text-base tracking-tight">P</span>
      </div>
      <span className="text-xl font-bold text-neutral-900 tracking-tight">
        Parabal
        <span className="text-brand-600 ml-1 font-normal text-base">Consultancy</span>
      </span>
    </Link>
  )
}

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Logo />

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === to
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/contact" className="btn-primary text-sm px-5 py-2.5">
                Get in Touch
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {mobileOpen && (
            <div className="md:hidden border-t border-neutral-100 py-3 space-y-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === to
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-2 border-t border-neutral-100">
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center text-sm"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <span className="text-white font-bold text-base">P</span>
                </div>
                <span className="text-xl font-bold tracking-tight">Parabal Consultancy</span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
                Empowering organisations to unlock their full potential through strategic insight, operational excellence, and transformative leadership.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">Services</h4>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                {['Strategy', 'Digital Transformation', 'Operations', 'Leadership'].map(s => (
                  <li key={s}>
                    <Link to="/services" className="hover:text-white transition-colors">{s}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-neutral-400">
                {[
                  { label: 'About', to: '/about' },
                  { label: 'Contact', to: '/contact' },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              © {new Date().getFullYear()} Parabal Consultancy. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-neutral-500">
              <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

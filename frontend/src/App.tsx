import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Upload } from './pages/Upload'
import { Configure } from './pages/Configure'
import { Report } from './pages/Report'
import { PublicReport } from './pages/PublicReport'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      {/* Logo mark */}
      <div className="relative">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-xl bg-brand-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {/* Logo text */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-bold text-neutral-900 tracking-tight">EvalHub</span>
        <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Pro</span>
      </div>
    </Link>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  // Public routes don't get the main layout
  if (location.pathname.startsWith('/public/')) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left side */}
            <div className="flex items-center gap-8">
              <Logo />

              {/* Nav links */}
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  to="/"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/'
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  Dashboard
                </Link>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link to="/upload" className="btn-primary">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Evaluation</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200/50 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <span>EvalHub Pro</span>
              <span className="text-neutral-300">·</span>
              <span>ML Evaluation Platform</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <span>Powered by</span>
              <span className="font-medium text-neutral-500">Claude AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/configure/:runId" element={<Configure />} />
        <Route path="/report/:runId" element={<Report />} />
        <Route path="/public/:token" element={<PublicReport />} />
      </Routes>
    </Layout>
  )
}

export default App

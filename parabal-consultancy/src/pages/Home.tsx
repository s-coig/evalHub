import { Link } from 'react-router-dom'

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Strategic Advisory',
    description: 'Clarity-led strategy that turns complex challenges into decisive competitive advantage.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    title: 'Digital Transformation',
    description: 'End-to-end modernisation programmes that embed technology as a core driver of value.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
      </svg>
    ),
    title: 'Operational Excellence',
    description: 'Lean, data-driven process redesign that cuts waste and accelerates throughput.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Leadership Development',
    description: 'Bespoke coaching and capability-building programmes for senior and high-potential leaders.',
  },
]

const stats = [
  { value: '200+', label: 'Engagements delivered' },
  { value: '94%', label: 'Client retention rate' },
  { value: '35+', label: 'Industries served' },
  { value: '18', label: 'Countries active' },
]

const testimonials = [
  {
    quote: 'Parabal gave us the strategic clarity we had been searching for. Within six months of our engagement, we had consolidated two underperforming divisions and grown EBITDA by 22%.',
    author: 'Sarah Okonkwo',
    role: 'CEO, Meridian Holdings',
  },
  {
    quote: 'The digital transformation roadmap they produced was the most actionable document our leadership team had ever seen. Implementation started the following week.',
    author: 'James Whitfield',
    role: 'COO, Nexar Infrastructure',
  },
  {
    quote: 'Their operational excellence work saved us over £3 million in the first year. The ROI was beyond anything we had projected.',
    author: 'Priya Nair',
    role: 'CFO, Arclight Group',
  },
]

export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-gradient-radial from-brand-900/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-dots opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-900/60 border border-brand-700/50 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-subtle" />
              Strategy · Transformation · Growth
            </span>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
              The insight to act,
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-brand-300">the rigour to deliver.</span>
            </h1>

            <p className="text-lg text-neutral-400 leading-relaxed mb-10 max-w-2xl">
              Parabal Consultancy partners with ambitious organisations to solve their most consequential challenges — from market entry and operational redesign to enterprise-wide digital transformation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="btn-primary px-7 py-3.5 text-base">
                Start a Conversation
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-medium rounded-xl border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
              >
                Explore Services
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Stats */}
      <section className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-bold text-neutral-900 tracking-tight">{value}</div>
                <div className="mt-1 text-sm text-neutral-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-4">What we do</h2>
          <p className="text-neutral-500 max-w-xl mx-auto">
            Four practice areas. One relentless focus: measurable, lasting impact for every client we serve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(({ icon, title, description }) => (
            <div key={title} className="card-interactive p-7 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
              </div>
              <Link
                to="/services"
                className="mt-auto text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition-colors"
              >
                Learn more
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* About strip */}
      <section className="bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-6">
              Built on rigour,<br />driven by results.
            </h2>
            <p className="text-neutral-500 leading-relaxed mb-6">
              Founded in 2011, Parabal has grown from a boutique strategy practice into a full-service consultancy trusted by FTSE 100 companies, fast-scaling start-ups, and public-sector bodies alike.
            </p>
            <p className="text-neutral-500 leading-relaxed mb-8">
              Our consultants bring deep functional expertise combined with the commercial acuity to translate recommendations into revenue, efficiency, and enduring organisational capability.
            </p>
            <Link to="/about" className="btn-secondary">
              Meet the team
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Founded', value: '2011' },
              { label: 'Team members', value: '120+' },
              { label: 'Avg. engagement ROI', value: '6.4×' },
              { label: 'Net Promoter Score', value: '72' },
            ].map(({ label, value }) => (
              <div key={label} className="card p-6">
                <div className="text-3xl font-bold text-brand-600 mb-1">{value}</div>
                <div className="text-sm text-neutral-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-4">Clients speak for us</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, author, role }) => (
            <div key={author} className="card p-8 flex flex-col gap-6">
              <svg className="w-8 h-8 text-brand-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003z" />
              </svg>
              <p className="text-neutral-700 leading-relaxed text-sm flex-1">"{quote}"</p>
              <div>
                <div className="font-semibold text-neutral-900 text-sm">{author}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to accelerate growth?
          </h2>
          <p className="text-brand-200 max-w-xl mx-auto mb-8">
            Tell us about your challenge. We will match you with the right team and respond within one business day.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors shadow-xl shadow-brand-800/30"
          >
            Get in Touch
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

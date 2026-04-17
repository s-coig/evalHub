import { Link } from 'react-router-dom'

const services = [
  {
    id: 'strategy',
    tag: 'Practice 01',
    title: 'Strategic Advisory',
    tagline: 'Clarity at every turn.',
    description:
      'From corporate strategy and portfolio rationalisation to market-entry design and M&A due diligence, our strategy practice equips leadership teams with the analytical depth and narrative clarity to make bold, defensible decisions.',
    deliverables: [
      'Corporate & business-unit strategy',
      'Market sizing & competitive landscaping',
      'Growth & innovation roadmaps',
      'M&A target screening & due diligence',
      'Portfolio rationalisation',
      'Go-to-market strategy',
    ],
    color: 'brand',
  },
  {
    id: 'digital',
    tag: 'Practice 02',
    title: 'Digital Transformation',
    tagline: 'Technology that earns its place.',
    description:
      'We help organisations design and execute transformation programmes that put technology in service of genuine business outcomes — not the other way around. From architecture reviews to change management, we stay until value is realised.',
    deliverables: [
      'Digital maturity assessment',
      'Technology architecture & vendor selection',
      'Data & analytics strategy',
      'AI/ML integration programmes',
      'Agile operating-model design',
      'Change management & adoption',
    ],
    color: 'emerald',
  },
  {
    id: 'operations',
    tag: 'Practice 03',
    title: 'Operational Excellence',
    tagline: 'Less waste. More momentum.',
    description:
      'We apply lean thinking, process analytics, and systems design to surface hidden inefficiencies and redesign operations for speed, quality, and cost. Our engagements regularly deliver double-digit margin improvements within twelve months.',
    deliverables: [
      'End-to-end process mapping & redesign',
      'Lean / Six Sigma programmes',
      'Supply chain & procurement optimisation',
      'Cost-reduction & complexity analysis',
      'Performance management systems',
      'Shared-services design',
    ],
    color: 'amber',
  },
  {
    id: 'leadership',
    tag: 'Practice 04',
    title: 'Leadership Development',
    tagline: 'Capability that compounds.',
    description:
      'Organisations outperform their peers when their leaders are exceptional. Our leadership practice blends individual coaching, team effectiveness work, and enterprise-wide capability programmes to build bench strength at every level.',
    deliverables: [
      'Executive 1:1 coaching',
      'Senior team effectiveness & alignment',
      'Succession planning & talent pipeline',
      'Leadership competency frameworks',
      'High-potential accelerator programmes',
      'Culture & engagement diagnostics',
    ],
    color: 'rose',
  },
]

const colorMap: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-600 border-brand-200',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-600 border-rose-200',
}

const tagColorMap: Record<string, string> = {
  brand: 'text-brand-500 bg-brand-50',
  emerald: 'text-emerald-600 bg-emerald-50',
  amber: 'text-amber-600 bg-amber-50',
  rose: 'text-rose-500 bg-rose-50',
}

export function ConsultancyServices() {
  return (
    <div>
      {/* Page header */}
      <section className="bg-neutral-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4">Our Services</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Four practice areas.<br />One standard of excellence.
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            Each Parabal practice is staffed by specialists with deep domain knowledge and a shared commitment to delivery — not just recommendation.
          </p>
        </div>
      </section>

      {/* Services list */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        {services.map(({ id, tag, title, tagline, description, deliverables, color }) => (
          <div key={id} id={id} className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 ${tagColorMap[color]}`}>
                {tag}
              </span>
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">{title}</h2>
              <p className="text-brand-600 font-medium mb-5">{tagline}</p>
              <p className="text-neutral-600 leading-relaxed">{description}</p>

              <div className="mt-8">
                <Link to="/consultancy/contact" className="btn-primary">
                  Discuss this practice
                </Link>
              </div>
            </div>

            <div className={`rounded-2xl border p-8 ${colorMap[color]}`}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 opacity-70">
                Key Deliverables
              </h3>
              <ul className="space-y-3">
                {deliverables.map(d => (
                  <li key={d} className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4 tracking-tight">Not sure which practice fits your need?</h2>
          <p className="text-neutral-500 max-w-lg mx-auto mb-8">
            Share your challenge with us and we will identify the right combination of capabilities — often across more than one practice.
          </p>
          <Link to="/consultancy/contact" className="btn-primary px-8 py-3.5 text-base">
            Talk to an Advisor
          </Link>
        </div>
      </section>
    </div>
  )
}

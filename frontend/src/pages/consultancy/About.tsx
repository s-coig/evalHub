import { Link } from 'react-router-dom'

const team = [
  {
    name: 'Eleanor Shaw',
    role: 'Founder & Managing Partner',
    bio: 'Eleanor founded Parabal after a decade at McKinsey and two years as Chief Strategy Officer at a FTSE 50 industrial. She leads our strategy practice and serves as lead partner on complex, cross-border engagements.',
    initials: 'ES',
  },
  {
    name: 'David Osei',
    role: 'Partner, Digital Transformation',
    bio: 'David brings 18 years of enterprise technology experience, including CTO roles at two venture-backed scale-ups. He oversees architecture, AI programmes, and our relationships with major cloud providers.',
    initials: 'DO',
  },
  {
    name: 'Fatima Al-Rashid',
    role: 'Partner, Operational Excellence',
    bio: 'Fatima is a certified Lean Six Sigma Master Black Belt whose process redesign work has collectively returned over £200 million in savings across manufacturing, logistics, and financial services clients.',
    initials: 'FA',
  },
  {
    name: 'Tom Buchanan',
    role: 'Partner, Leadership Development',
    bio: 'A former professional coach and organisational psychologist, Tom has supported more than 300 senior executives across 20 countries. He holds a DPhil in Leadership from the University of Oxford.',
    initials: 'TB',
  },
]

const values = [
  {
    title: 'Intellectual honesty',
    description: 'We tell clients what we believe to be true, not what they want to hear. Our credibility rests on it.',
  },
  {
    title: 'Delivery over decks',
    description: 'Recommendations are only as good as their implementation. We stay engaged until outcomes are real.',
  },
  {
    title: 'Deep expertise',
    description: 'We hire domain specialists, not generalists. You receive insight that only comes from years in your sector.',
  },
  {
    title: 'Long-term partnerships',
    description: 'Nearly 60% of our revenue comes from clients we have worked with for more than three years. Trust is built slowly and carefully.',
  },
]

export function ConsultancyAbout() {
  return (
    <div>
      {/* Header */}
      <section className="bg-neutral-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4">About Us</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Who we are
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            Parabal was founded on a simple belief: that great consulting is as much about character as it is about capability.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-6">Our story</h2>
          <div className="space-y-4 text-neutral-600 leading-relaxed">
            <p>
              Parabal was founded in 2011 by Eleanor Shaw, following her observation that many large consulting firms had become increasingly process-driven — prioritising billable hours over genuine client outcomes.
            </p>
            <p>
              She set out to build something different: a firm small enough to remain intellectually agile, yet experienced enough to take on the most complex challenges that global organisations face.
            </p>
            <p>
              Thirteen years on, Parabal has grown to over 120 consultants operating across 18 countries. We have helped clients navigate market disruptions, rescue failing transformation programmes, build high-performing leadership teams, and capture hundreds of millions in operational savings.
            </p>
            <p>
              We remain founder-led, partner-owned, and fiercely independent — with no venture capital, no private equity, and no agenda beyond the success of the clients we serve.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { year: '2011', event: 'Founded in London by Eleanor Shaw.' },
            { year: '2014', event: 'Opened our second office in Dubai, serving the Gulf region.' },
            { year: '2017', event: 'Launched our Digital Transformation practice in response to client demand.' },
            { year: '2020', event: 'Grew by 30% during the pandemic, supporting crisis response engagements globally.' },
            { year: '2023', event: 'Reached 120 consultants; opened offices in Singapore and Toronto.' },
          ].map(({ year, event }) => (
            <div key={year} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-brand-50 border-2 border-brand-200 flex items-center justify-center text-xs font-bold text-brand-700 flex-shrink-0">
                  {year.slice(2)}
                </div>
                <div className="w-0.5 flex-1 bg-brand-100 mt-1" />
              </div>
              <div className="pb-6">
                <div className="text-xs font-semibold text-brand-600 mb-0.5">{year}</div>
                <div className="text-sm text-neutral-600">{event}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2 text-center">What we stand for</h2>
          <p className="text-neutral-500 text-center mb-12">The principles that guide every engagement.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ title, description }) => (
              <div key={title} className="card p-7">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center mb-5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2 text-center">Our partners</h2>
        <p className="text-neutral-500 text-center mb-12">The senior leaders who drive every Parabal engagement.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map(({ name, role, bio, initials }) => (
            <div key={name} className="card p-7 flex flex-col gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg">
                {initials}
              </div>
              <div>
                <div className="font-semibold text-neutral-900">{name}</div>
                <div className="text-xs text-brand-600 font-medium mt-0.5">{role}</div>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed flex-1">{bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Work with us</h2>
          <p className="text-brand-200 mb-8 max-w-md mx-auto">
            Whether you have a defined brief or an unformed challenge, our partners are happy to explore what a Parabal engagement could look like.
          </p>
          <Link
            to="/consultancy/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors shadow-xl shadow-brand-800/30"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}

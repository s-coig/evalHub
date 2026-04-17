import { useState } from 'react'

const offices = [
  { city: 'London', address: '25 Moorgate, London EC2R 6AR', phone: '+44 20 7946 0100' },
  { city: 'Dubai', address: 'DIFC Gate Building, Level 14, Dubai', phone: '+971 4 570 2200' },
  { city: 'Singapore', address: '1 Raffles Place, #20-61, Singapore 048616', phone: '+65 6911 4400' },
  { city: 'Toronto', address: '145 King Street West, Suite 1000, Toronto ON', phone: '+1 416 555 0190' },
]

const interests = [
  'Strategic Advisory',
  'Digital Transformation',
  'Operational Excellence',
  'Leadership Development',
  'Other / Not sure yet',
]

export function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    organisation: '',
    interest: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-neutral-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4">Contact</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Let's start a conversation.
          </h1>
          <p className="text-neutral-400 max-w-xl text-lg">
            Tell us about your challenge. We respond to every enquiry within one business day.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16">
        {/* Form */}
        <div>
          {submitted ? (
            <div className="card p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">Message received</h2>
              <p className="text-neutral-500 leading-relaxed">
                Thank you for getting in touch. A member of our team will respond to <strong className="text-neutral-700">{form.email}</strong> within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="name">
                    Full name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="email">
                    Work email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="organisation">
                  Organisation <span className="text-rose-500">*</span>
                </label>
                <input
                  id="organisation"
                  name="organisation"
                  type="text"
                  required
                  value={form.organisation}
                  onChange={handleChange}
                  placeholder="Your company name"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="interest">
                  Area of interest
                </label>
                <select
                  id="interest"
                  name="interest"
                  value={form.interest}
                  onChange={handleChange}
                  className="input bg-white"
                >
                  <option value="">Select a practice area…</option>
                  {interests.map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="message">
                  Tell us about your challenge <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe the challenge or opportunity you are looking to address…"
                  className="input resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 text-base justify-center">
                Send Message
              </button>

              <p className="text-xs text-neutral-400 text-center">
                We treat your information with the same confidentiality we apply to our client work.
              </p>
            </form>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-10">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-5">Our offices</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {offices.map(({ city, address, phone }) => (
                <div key={city} className="card p-5">
                  <div className="font-semibold text-neutral-900 mb-2">{city}</div>
                  <div className="text-sm text-neutral-500 leading-relaxed mb-1">{address}</div>
                  <div className="text-sm text-brand-600 font-medium">{phone}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-7 bg-brand-50 border-brand-100">
            <h3 className="font-semibold text-neutral-900 mb-3">General enquiries</h3>
            <p className="text-sm text-neutral-600 mb-4">
              For press, partnerships, or recruitment enquiries, please use the addresses below.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-neutral-400 w-20 flex-shrink-0">Press</span>
                <span className="text-brand-600 font-medium">press@parabal.com</span>
              </li>
              <li className="flex gap-2">
                <span className="text-neutral-400 w-20 flex-shrink-0">Careers</span>
                <span className="text-brand-600 font-medium">careers@parabal.com</span>
              </li>
              <li className="flex gap-2">
                <span className="text-neutral-400 w-20 flex-shrink-0">Partners</span>
                <span className="text-brand-600 font-medium">partners@parabal.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

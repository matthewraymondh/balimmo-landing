import { useState } from 'react'

const WHATSAPP_URL =
  'https://wa.me/6285333777500?text=' +
  encodeURIComponent("Hi Balimmo, I'm interested in investing in Bali. Can you help me?")

const initialValues = { firstName: '', lastName: '', email: '', phone: '', message: '' }

function validate(values) {
  const errors = {}
  if (!values.firstName.trim()) errors.firstName = 'Please enter your first name.'
  if (!values.email.trim()) {
    errors.email = 'Please enter your email so we can reply to you.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'That email address doesn’t look right — please double-check it.'
  }
  if (!values.message.trim()) errors.message = 'Tell us a little about what you’re looking for.'
  return errors
}

function Field({ id, label, error, optional, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-primary">
        {label}
        {optional && <span className="ml-1 font-normal text-primary/70">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

// Static replacement for the original Livewire contact form. Submission is
// simulated client-side; in production this posts to the lead endpoint.
export default function ContactSection() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitted

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    // Clear a field's error as soon as the user starts fixing it.
    setErrors((errs) => (errs[key] ? { ...errs, [key]: undefined } : errs))
  }

  const inputClass = (key) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-accent ${
      errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-200'
    }`

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus()
      return
    }
    setStatus('submitted')
  }

  return (
    <section id="contact" className="section-pad">
      <div className="container-x">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:gap-16">
          {/* Left: copy + image */}
          <div className="w-full space-y-6 text-center lg:sticky lg:top-28 lg:text-left">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              Let our team guide you
            </h2>
            <p className="text-primary">
              Book a free consultation with our experts and let us find your dream villa together.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-7 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-2.9-1.3-4.8-4.2-5-4.4-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.3.1 1.7.8 2 1 .3.1.5.2.5.3.1.1.1.7-.1 1.4Z" />
              </svg>
              Chat with us on WhatsApp
            </a>
            <img
              src="/landing/assets/img/other/contact-us-thumb.avif"
              alt="The Balimmo advisory team"
              width="6720"
              height="4276"
              loading="lazy"
              decoding="async"
              className="mx-auto h-auto w-full rounded-lg object-cover lg:mx-0"
            />
          </div>

          {/* Right: lead form */}
          <div className="w-full">
            {status === 'submitted' ? (
              <div
                role="status"
                className="space-y-4 rounded-2xl bg-white p-8 text-center shadow-md ring-1 ring-gray-100"
              >
                <svg
                  className="mx-auto text-accent-strong"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8 12.5 3 3 5-6" />
                </svg>
                <h3 className="text-2xl font-bold text-primary">Thank you, {values.firstName}!</h3>
                <p className="text-primary/80">
                  Your request has been received. One of our advisors will get back to you within one
                  business day. In a hurry?
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-solid"
                >
                  Talk to us now on WhatsApp
                </a>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100 sm:p-8"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field id="firstName" label="First name" error={errors.firstName}>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={values.firstName}
                      onChange={set('firstName')}
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                      placeholder="John"
                      className={inputClass('firstName')}
                    />
                  </Field>
                  <Field id="lastName" label="Last name" optional>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={values.lastName}
                      onChange={set('lastName')}
                      placeholder="Doe"
                      className={inputClass('lastName')}
                    />
                  </Field>
                </div>

                <Field id="email" label="Email" error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={values.email}
                    onChange={set('email')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    placeholder="you@example.com"
                    className={inputClass('email')}
                  />
                </Field>

                <Field id="phone" label="Phone / WhatsApp" optional>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={set('phone')}
                    placeholder="+62 ..."
                    className={inputClass('phone')}
                  />
                </Field>

                <Field id="message" label="Message" error={errors.message}>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    value={values.message}
                    onChange={set('message')}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    placeholder="Tell us about your project..."
                    className={inputClass('message')}
                  />
                </Field>

                <button type="submit" className="btn-solid w-full">
                  Send my request
                </button>
                <p className="text-center text-xs text-primary/70">
                  We reply within one business day. Your details are never shared.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

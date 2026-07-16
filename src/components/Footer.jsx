const QUICK_LINKS = [
  { label: 'Listing', href: '#featured' },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Login', href: '#' },
  { label: 'Mentions légales', href: '#' },
]

const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/people/Balimmo/61557243686168/' },
  { label: 'Instagram', href: 'https://www.instagram.com/balimmo.properties' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@balimmo' },
  { label: 'YouTube', href: 'https://www.youtube.com/@balimmo.construction' },
]

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white/90">
      <div className="container-x py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* About + contact */}
          <div className="lg:col-span-2">
            <img
              src="/landing/assets/img/logo/logo-balimmo-white.png"
              alt="Balimmo"
              width="1415"
              height="323"
              loading="lazy"
              className="w-[180px]"
            />
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <img src="/landing/assets/img/logo/logo-balimmo-properties.png" alt="Balimmo Properties" width="1414" height="320" loading="lazy" className="w-[130px]" />
              <img src="/landing/assets/img/logo/logo-balimmo-construction.png" alt="Balimmo Construction" width="1416" height="321" loading="lazy" className="w-[130px]" />
              <img src="/landing/assets/img/logo/logo-balimmo-management.png" alt="Balimmo Management" width="1434" height="320" loading="lazy" className="w-[130px]" />
            </div>
            <p className="mt-5 max-w-md text-sm text-white/70">
              Discover leading properties and secure your dream home with us. Expert guidance and
              support at every step.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span aria-hidden>📍</span>
                <span>Jalan Raya Semer No.12, Kerobokan, 80361 BALI</span>
              </li>
              <li className="flex items-center gap-3">
                <span aria-hidden>✉️</span>
                <a href="mailto:hello@balimmo.fr" className="hover:text-accent">hello@balimmo.fr</a>
              </li>
              <li className="flex items-center gap-3">
                <span aria-hidden>📱</span>
                <a href="tel:+6285333777500" className="hover:text-accent">(+62) 85 333 777 500</a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-white">Quick Links</h2>
            <ul className="space-y-2 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/70 hover:text-accent">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + AREBI */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-white">Our Social Media</h2>
            <ul className="space-y-2 text-sm">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/70 hover:text-accent"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h3 className="mb-2 text-sm font-semibold text-white">
                Asosiasi Real Estate Broker Indonesia
              </h3>
              <img src="/landing/assets/img/logo/logo-arebi.png" alt="AREBI" width="250" height="283" loading="lazy" className="w-16" />
              <p className="mt-2 text-xs text-white/60">Member Number: 2025000055A</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-6">
        <div className="container-x space-y-2 text-center">
          <p className="text-sm text-white/70">
            PT BALIMMO DEVELOPMENT GROUP © 2021 - {new Date().getFullYear()}. All rights reserved
          </p>
          <p className="mx-auto max-w-3xl text-xs text-white/50">
            Any projection of profitability or rental income is purely indicative and does not
            constitute a contractual guarantee.
          </p>
        </div>
      </div>
    </footer>
  )
}

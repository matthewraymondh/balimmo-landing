const REGIONS = [
  {
    name: 'Uluwatu',
    roi: 'ROI >11% net',
    desc: 'Luxury ocean-view villas | Resort growth',
    image: '/landing/assets/img/invest/invest-1.png',
  },
  {
    name: 'Canggu',
    roi: 'ROI >10% net',
    desc: 'High demand from expats & digital nomads',
    image: '/landing/assets/img/invest/invest-2.png',
  },
  {
    name: 'Ubud',
    roi: 'ROI >10% net',
    desc: 'Wellness tourism | Long-stay rentals',
    image: '/landing/assets/img/invest/invest-3.png',
  },
]

export default function InvestRegions() {
  return (
    <section id="invest" className="section-pad">
      <div className="container-x">
        {/* Evergreen title — the previous "in 2025" dated the page as soon as the year rolled over. */}
        <h2 className="section-title mb-12 lg:mb-16">Where to Invest in Bali</h2>

        <div className="space-y-12 lg:space-y-16">
          {REGIONS.map((region, i) => (
            <div
              key={region.name}
              className={`flex flex-col items-center gap-8 lg:gap-16 ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}
            >
              <div className="w-full">
                <img
                  src={region.image}
                  alt={`${region.name} area in Bali`}
                  width="602"
                  height="452"
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full rounded-lg object-cover"
                />
              </div>
              <div className="w-full space-y-5 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                  <span className="text-accent-strong">{region.name}</span> Area
                </h3>
                <p className="text-2xl font-bold text-primary sm:text-3xl">{region.roi}</p>
                <p className="text-primary">{region.desc}</p>
                <div>
                  <a href="#featured" className="btn-solid">
                    Discover opportunities
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

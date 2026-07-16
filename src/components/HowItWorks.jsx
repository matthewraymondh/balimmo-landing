const STEPS = [
  { num: '1', title: 'Discover', desc: 'Explore our curated listings.' },
  { num: '2', title: 'Test', desc: 'Visit & evaluate with our experts.' },
  { num: '3', title: 'Secure', desc: 'Legal due diligence & purchase.' },
  { num: '4', title: 'Enjoy', desc: 'ROI management & Bali lifestyle.' },
]

export default function HowItWorks() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <h2 className="section-title mb-12 lg:mb-16">How it works</h2>

        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <img
            src="/landing/assets/img/other/how-it-works.png"
            alt="Balimmo brochure presenting the buying process"
            width="602"
            height="453"
            loading="lazy"
            decoding="async"
            className="h-auto w-full lg:w-1/2"
          />

          {/* Steps: stacked on mobile, grid on tablet, single vertical timeline on desktop */}
          <ol className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
            {STEPS.map((step) => (
              <li key={step.num} className="relative border-l-2 border-primary-deep/30 pl-6">
                <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary-deep" />
                <p className="text-2xl font-bold text-primary-deep">
                  {step.num} - {step.title}
                </p>
                <p className="mt-1 text-primary-muted">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

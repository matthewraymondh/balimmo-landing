const POINTS = [
  'Tested properties in real-life conditions',
  'Exclusive partnerships with developers',
  'Legal expertise (Leasehold, Freehold, Hak Pakai)',
  'ROI calculator & financial projections',
]

function CheckIcon() {
  return (
    <svg
      className="mt-1 shrink-0 text-accent"
      width="18"
      height="14"
      viewBox="0 0 15 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.9001 1.62081C14.0668 1.78748 14.1501 1.98986 14.1501 2.22796C14.1501 2.46605 14.0668 2.66843 13.9001 2.8351L7.43583 9.29939L6.22154 10.5137C6.05487 10.6803 5.85249 10.7637 5.6144 10.7637C5.3763 10.7637 5.17392 10.6803 5.00725 10.5137L3.79297 9.29939L0.560826 6.06724C0.394159 5.90058 0.310826 5.6982 0.310826 5.4601C0.310826 5.222 0.394159 5.01962 0.560826 4.85296L1.77511 3.63867C1.94178 3.472 2.14416 3.38867 2.38225 3.38867C2.62035 3.38867 2.82273 3.472 2.9894 3.63867L5.6144 6.2726L11.4715 0.406528C11.6382 0.239862 11.8406 0.156528 12.0787 0.156528C12.3168 0.156528 12.5192 0.239862 12.6858 0.406528L13.9001 1.62081Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function WhyChoose() {
  return (
    <section className="section-pad pt-0">
      <div className="container-x">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
              Why choose <span className="block">Balimmo Properties?</span>
            </h2>
            <p>More than a broker, Balimmo is your trusted partner in Bali.</p>
            <p>
              We carefully test and evaluate every property to secure your investment. From legal due
              diligence to rental yield projections, our transparent process is designed for
              international investors.
            </p>
            <ul className="space-y-4">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckIcon />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <img
            src="/landing/assets/img/other/contact-us-thumb.avif"
            alt="The Balimmo Properties team"
            width="6720"
            height="4276"
            loading="lazy"
            decoding="async"
            className="h-auto w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </section>
  )
}

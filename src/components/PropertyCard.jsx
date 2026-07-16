function BedIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 25 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M6.26832 3.08576H9.70875C10.1912 3.08576 10.6311 3.28308 10.9488 3.6009C11.2667 3.91871 11.464 4.35756 11.464 4.841V6.17302H13.5385V4.841C13.5385 4.35996 13.7358 3.92185 14.0536 3.6033C14.3745 3.28402 14.8119 3.08672 15.293 3.08672H18.7334C19.2145 3.08672 19.6533 3.28404 19.9719 3.60185C20.2912 3.92113 20.4885 4.35941 20.4885 4.84195V6.17398H21.9693V1.9459C21.9693 1.62975 21.8395 1.34125 21.6302 1.13212C21.4211 0.923008 21.1325 0.792937 20.8164 0.792937H4.18422C3.86807 0.792937 3.57882 0.922824 3.36969 1.13212C3.16058 1.34123 3.03051 1.62975 3.03051 1.9459V6.17398H4.51139V4.84195C4.51139 4.36016 4.7087 3.92205 5.02652 3.6035C5.3458 3.28422 5.78408 3.08691 6.26662 3.08691L6.26832 3.08576ZM0.792967 11.167H24.2084V7.96014C24.2084 7.686 24.0967 7.43638 23.916 7.25654C23.7362 7.07672 23.4865 6.96415 23.2124 6.96415H1.78733C1.51319 6.96415 1.26357 7.0758 1.08373 7.25654C0.903913 7.43635 0.791345 7.686 0.791345 7.96014V11.167H0.792967ZM24.2084 11.9594H0.792967V12.5607C0.792967 12.8341 0.905536 13.0828 1.08535 13.2636C1.26443 13.4443 1.51407 13.556 1.7882 13.556H23.2132C23.4787 13.556 23.7212 13.4506 23.8995 13.2811L23.9161 13.2636C24.0969 13.0828 24.2085 12.8341 24.2085 12.5607V11.9594H24.2084Z"
        fill="currentColor"
      />
    </svg>
  )
}

function Stat({ value, label, children }) {
  return (
    <li className="flex flex-1 flex-col items-center gap-1 text-center">
      <span className="flex items-center gap-1 text-lg font-bold text-primary">
        {value}
        {children}
      </span>
      <span className="text-xs text-primary/70">{label}</span>
    </li>
  )
}

export default function PropertyCard({ property, currency }) {
  const price =
    currency === 'IDR'
      ? `IDR ${property.priceIdr.toLocaleString('en-US')}`
      : `$ ${property.priceUsd.toLocaleString('en-US')}`

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={property.image}
          alt={property.name}
          width="862"
          height="543"
          loading="lazy"
          decoding="async"
          className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold capitalize text-white">
            {property.area}
          </span>
          {property.exclusive && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
              Balimmo exclusive
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold capitalize text-primary">
          <a href={`#${property.slug}`} className="hover:text-accent">
            {property.name}
          </a>
        </h3>

        <p className="mt-2 text-2xl font-bold text-accent-strong">{price}</p>

        <hr className="my-4 border-gray-100" />

        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-primary">
            {property.legalStatus}
          </span>
          {property.legalStatus === 'Leasehold' && property.leaseYearsLeft && (
            <span className="text-sm text-primary/70">{property.leaseYearsLeft} years left</span>
          )}
        </div>

        <ul className="flex justify-between border-t border-gray-100 pt-4">
          <Stat value={property.bedroom} label="Bedrooms">
            <BedIcon />
          </Stat>
          <Stat value={property.bathroom} label="Bathrooms" />
          <Stat value={`${property.landSize} m²`} label="Land Size" />
        </ul>
      </div>
    </article>
  )
}

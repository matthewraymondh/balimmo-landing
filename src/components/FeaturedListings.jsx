import { useState } from 'react'
import { featuredProperties } from '../data/properties.js'
import PropertyCard from './PropertyCard.jsx'

export default function FeaturedListings() {
  // Default to USD: the page targets international investors and the hero
  // search already quotes villa prices in USD.
  const [currency, setCurrency] = useState('USD')

  return (
    <section id="featured" className="section-pad">
      <div className="container-x">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="section-title">Our exclusive listings</h2>
          <p className="mt-4 text-primary/80">
            Discover our exclusive properties, available only through Balimmo. These villas and lands
            represent the finest opportunities in Bali, secured with priority access for our investors.
          </p>
        </div>

        {/* Currency toggle (static prices flip label) */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full bg-gray-100 p-1">
            {['IDR', 'USD'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${
                  currency === c ? 'bg-primary text-white' : 'text-primary hover:text-accent'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} currency={currency} />
          ))}
        </div>
      </div>
    </section>
  )
}

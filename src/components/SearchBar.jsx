import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import FilterChip from './search/FilterChip.jsx'
import RangeSlider from './search/RangeSlider.jsx'
import useClickOutside from '../hooks/useClickOutside.js'
import { useSearch } from '../context/SearchContext.jsx'
import {
  AREAS,
  VILLA_OWNERSHIP,
  LAND_OWNERSHIP,
  MAX_VILLA_BED,
  VILLA_BED_STEP,
  MAX_VILLA_PRICE_USD,
  VILLA_PRICE_STEP,
  MAX_LAND_SIZE_ARE,
  LAND_SIZE_STEP,
  MAX_LAND_PRICE_IDR,
  LAND_PRICE_STEP,
  formatUsd,
  formatIdr,
} from '../data/searchOptions.js'

// Small reusable checkbox-list body (shared by desktop popover + mobile sheet).
function CheckboxList({ options, selected, onToggle, suffix = '' }) {
  return (
    <div className="flex flex-col gap-1">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 py-1 text-sm text-primary">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
            className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          {opt}
          {suffix}
        </label>
      ))}
    </div>
  )
}

export default function SearchBar({ variant = 'hero' }) {
  // Filter state is shared across instances (hero + docked navbar) via context.
  const { tab, setTab, villa, setVilla, land, setLand } = useSearch()
  const [openKey, setOpenKey] = useState(null) // which desktop popover is open (local per instance)
  const [sheetOpen, setSheetOpen] = useState(false)

  const isNavbar = variant === 'navbar'
  const isVilla = tab === 'villa'
  const state = isVilla ? villa : land
  const setState = isVilla ? setVilla : setLand
  const fmtPrice = isVilla ? formatUsd : formatIdr

  const patch = (changes) => setState((s) => ({ ...s, ...changes }))
  const toggleIn = (key, value) =>
    setState((s) => ({
      ...s,
      [key]: s[key].includes(value) ? s[key].filter((v) => v !== value) : [...s[key], value],
    }))

  const toggleChip = (key) => setOpenKey((k) => (k === key ? null : key))
  const closeChip = () => setOpenKey(null)

  // Lock body scroll while the mobile filter sheet is open.
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sheetOpen])

  const sheetRef = useRef(null)
  useClickOutside(sheetRef, () => setSheetOpen(false), sheetOpen)

  // Move focus into the sheet when it opens and back to the trigger on close,
  // so keyboard / screen-reader users aren't left behind the dialog.
  const closeBtnRef = useRef(null)
  const triggerRef = useRef(null)
  const wasOpen = useRef(false)
  useEffect(() => {
    if (sheetOpen) {
      wasOpen.current = true
      closeBtnRef.current?.focus()
    } else if (wasOpen.current) {
      wasOpen.current = false
      triggerRef.current?.focus({ preventScroll: true })
    }
  }, [sheetOpen])

  // ---- chip value summaries ----
  const nameValue = state.name.trim() || 'Any'
  const bedValue =
    villa.bedMin === 0 && villa.bedMax === MAX_VILLA_BED ? 'Any' : `${villa.bedMin} - ${villa.bedMax}`
  const sizeValue =
    land.sizeMin === 0 && land.sizeMax === MAX_LAND_SIZE_ARE
      ? 'Any'
      : `${land.sizeMin} - ${land.sizeMax} are`
  const priceValue = (() => {
    const maxP = isVilla ? MAX_VILLA_PRICE_USD : MAX_LAND_PRICE_IDR
    if (state.priceMin === 0 && state.priceMax === maxP) return 'Any'
    return `${fmtPrice(state.priceMin)} - ${fmtPrice(state.priceMax)}`
  })()
  const summarize = (arr) => (arr.length === 0 ? 'Any' : arr.length === 1 ? arr[0] : `${arr.length} selected`)

  // ---- filter body renderers (reused in popover + sheet) ----
  const nameBody = (
    <input
      type="text"
      value={state.name}
      onChange={(e) => patch({ name: e.target.value })}
      placeholder={isVilla ? 'Type villa name...' : 'Type land name...'}
      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent"
    />
  )

  const rangeBody = isVilla ? (
    <RangeSlider
      min={0}
      max={MAX_VILLA_BED}
      step={VILLA_BED_STEP}
      valueMin={villa.bedMin}
      valueMax={villa.bedMax}
      onChange={(a, b) => patch({ bedMin: a, bedMax: b })}
      format={(v) => `${v}`}
    />
  ) : (
    <RangeSlider
      min={0}
      max={MAX_LAND_SIZE_ARE}
      step={LAND_SIZE_STEP}
      valueMin={land.sizeMin}
      valueMax={land.sizeMax}
      onChange={(a, b) => patch({ sizeMin: a, sizeMax: b })}
      format={(v) => `${v} are`}
    />
  )

  const priceBody = (
    <RangeSlider
      min={0}
      max={isVilla ? MAX_VILLA_PRICE_USD : MAX_LAND_PRICE_IDR}
      step={isVilla ? VILLA_PRICE_STEP : LAND_PRICE_STEP}
      valueMin={state.priceMin}
      valueMax={state.priceMax}
      onChange={(a, b) => patch({ priceMin: a, priceMax: b })}
      format={fmtPrice}
    />
  )

  const areaBody = (
    <CheckboxList
      options={AREAS}
      selected={state.areas}
      onToggle={(v) => toggleIn('areas', v)}
      suffix=" Area"
    />
  )

  const ownershipBody = (
    <CheckboxList
      options={isVilla ? VILLA_OWNERSHIP : LAND_OWNERSHIP}
      selected={state.ownership}
      onToggle={(v) => toggleIn('ownership', v)}
    />
  )

  const resetRange = () =>
    isVilla
      ? patch({ bedMin: 0, bedMax: MAX_VILLA_BED })
      : patch({ sizeMin: 0, sizeMax: MAX_LAND_SIZE_ARE })
  const resetPrice = () =>
    patch({ priceMin: 0, priceMax: isVilla ? MAX_VILLA_PRICE_USD : MAX_LAND_PRICE_IDR })

  // Static clone: submit is a pure no-op (no navigation, no filtering).
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div
      className={
        isNavbar
          ? 'w-full bg-transparent'
          : 'mx-auto w-full max-w-5xl rounded-2xl bg-transparent'
      }
    >
      <div className={isNavbar ? 'lg:flex lg:items-center lg:gap-3' : ''}>
        {/* Villa / Land segmented toggle */}
        <div
          className={
            isNavbar
              ? 'mb-3 flex justify-center lg:mb-0 lg:shrink-0 lg:justify-start'
              : 'mb-4 flex justify-center lg:justify-start'
          }
        >
          <div className="inline-flex rounded-full bg-gray-100 p-1">
            {['villa', 'land'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t)
                  setOpenKey(null)
                }}
                className={`rounded-full font-semibold capitalize transition-colors ${
                  isNavbar ? 'px-5 py-1.5 text-sm' : 'px-8 py-2 text-sm'
                } ${tab === t ? 'bg-primary text-white' : 'text-primary hover:text-accent'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={isNavbar ? 'lg:flex-1' : ''}>
        {/* ===== Desktop: filter-chip bar ===== */}
        <div className="hidden flex-wrap items-stretch gap-2 lg:flex">
          <FilterChip chipKey="name" label="Name" value={nameValue} isOpen={openKey === 'name'} onToggle={toggleChip} onClose={closeChip} onClear={() => patch({ name: '' })}>
            {nameBody}
          </FilterChip>

          <FilterChip
            chipKey="range"
            label={isVilla ? 'Bedrooms' : 'Size (are)'}
            value={isVilla ? bedValue : sizeValue}
            isOpen={openKey === 'range'}
            onToggle={toggleChip}
            onClose={closeChip}
            onClear={resetRange}
            popoverClassName="min-w-[300px]"
          >
            {rangeBody}
          </FilterChip>

          <FilterChip chipKey="price" label="Price" value={priceValue} isOpen={openKey === 'price'} onToggle={toggleChip} onClose={closeChip} onClear={resetPrice} popoverClassName="min-w-[320px]">
            {priceBody}
          </FilterChip>

          <FilterChip chipKey="area" label="Area" value={summarize(state.areas)} isOpen={openKey === 'area'} onToggle={toggleChip} onClose={closeChip} onClear={() => patch({ areas: [] })}>
            {areaBody}
          </FilterChip>

          <FilterChip chipKey="type" label="Type" value={summarize(state.ownership)} isOpen={openKey === 'type'} onToggle={toggleChip} onClose={closeChip} onClear={() => patch({ ownership: [] })}>
            {ownershipBody}
          </FilterChip>

          <button type="submit" className="btn-solid ml-auto shrink-0 px-8">
            {isVilla ? 'Find my villa' : 'Find my land'}
          </button>
        </div>

        {/* ===== Mobile: single Search button opens the filter sheet ===== */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setSheetOpen(true)}
          className="btn-solid flex w-full items-center justify-center gap-2 lg:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          Search
        </button>
        </form>
      </div>

      {/* ===== Mobile filter sheet =====
          Rendered in a portal: inside the hero the sheet sits in the hero's `z-10`
          stacking context, which loses to the sticky `z-50` navbar — the header /
          close button end up hidden (and untappable) behind it. Portaling to
          <body> puts the dialog in the root stacking context, above everything. */}
      {sheetOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Search filters"
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setSheetOpen(false)} />
          <div
            ref={sheetRef}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <span className="text-lg font-bold text-primary">Filters</span>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close filters"
                className="rounded p-2 text-primary/60 hover:text-primary"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body: all groups stacked */}
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              {/* Tab toggle inside sheet too */}
              <div className="flex rounded-full bg-gray-100 p-1">
                {['villa', 'land'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                      tab === t ? 'bg-primary text-white' : 'text-primary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-primary">Name</p>
                {nameBody}
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-primary">{isVilla ? 'Bedrooms' : 'Size (are)'}</p>
                {rangeBody}
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-primary">Price ({isVilla ? 'USD' : 'IDR'})</p>
                {priceBody}
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-primary">Area</p>
                {areaBody}
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-primary">Type</p>
                {ownershipBody}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-4">
              <button type="button" onClick={() => setSheetOpen(false)} className="btn-solid w-full">
                {isVilla ? 'Find my villa' : 'Find my land'}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}

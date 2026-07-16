import { useRef } from 'react'
import useClickOutside from '../../hooks/useClickOutside.js'

// Desktop filter chip: a pill trigger (label + value + chevron) that toggles a popover.
// Open state is lifted to the parent (via `isOpen` / `onToggle`) so only one chip is
// open at a time. The popover closes on outside click / Escape and offers Clear + Apply.
export default function FilterChip({
  chipKey,
  label,
  value,
  isOpen,
  onToggle,
  onClose,
  onClear,
  children,
  popoverClassName = '',
}) {
  const ref = useRef(null)
  useClickOutside(ref, onClose, isOpen)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => onToggle(chipKey)}
        className={`flex min-w-[120px] items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left transition-colors ${
          isOpen ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <span className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-primary/70">
            {label}
          </span>
          <span className="text-sm font-semibold text-primary">{value}</span>
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-primary/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 z-30 mt-2 min-w-[260px] rounded-xl bg-white p-4 shadow-xl ring-1 ring-gray-100 ${popoverClassName}`}
        >
          {children}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={onClear}
              className="text-sm font-semibold text-primary/60 hover:text-primary"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-primary px-5 py-1.5 text-sm font-semibold text-white hover:bg-primary-deep"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

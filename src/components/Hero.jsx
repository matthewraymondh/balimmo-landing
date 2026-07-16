import { useEffect, useRef, useState } from 'react'
import SearchBar from './SearchBar.jsx'
import { useSearch } from '../context/SearchContext.jsx'

// Decide once whether the decorative background video should load at all:
// skip it for users who prefer reduced motion and on Data-Saver / 2G connections.
function shouldLoadVideo() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const conn = navigator.connection
  if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) return false
  return true
}

export default function Hero() {
  const { setSentinel } = useSearch()
  const videoRef = useRef(null)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [playing, setPlaying] = useState(true)

  // The 8 MB video is decoration, not content: keep it off the critical path.
  // The poster image paints immediately; the video only starts downloading
  // after the page has fully loaded (and only for users who benefit from it).
  useEffect(() => {
    if (!shouldLoadVideo()) return undefined
    const enable = () => setVideoEnabled(true)
    if (document.readyState === 'complete') {
      enable()
      return undefined
    }
    window.addEventListener('load', enable, { once: true })
    return () => window.removeEventListener('load', enable)
  }, [])

  // WCAG 2.2.2: auto-playing content that lasts more than 5s needs a pause control.
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <section id="top" className="relative flex min-h-[85vh] items-center overflow-hidden">
      {/* Poster paints first (fast LCP fallback); the video fades in over it once ready. */}
      <img
        src="/landing/assets/img/banner/video-fallback.png"
        alt=""
        width="1920"
        height="1080"
        fetchpriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {videoEnabled && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          poster="/landing/assets/img/banner/video-fallback.png"
        >
          <source src="/landing/assets/img/banner/video-bg.mp4" type="video/mp4" />
        </video>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="container-x relative z-10 py-20 text-center text-white">
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
          Invest in Bali with Confidence
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/90 sm:text-lg">
          Hand-picked villas &amp; lands, tested and secured for your peace of mind.
        </p>

        <div className="mt-10">
          <SearchBar variant="hero" />
        </div>

        {/* Sentinel: when this scrolls above the navbar, the search docks into the navbar. */}
        <div ref={setSentinel} aria-hidden="true" className="h-px w-full" />
      </div>

      {videoEnabled && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? 'Pause background video' : 'Play background video'}
          className="absolute bottom-4 right-4 z-10 rounded-full bg-black/40 p-2.5 text-white transition-colors hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/70"
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M7 4h4v16H7zM13 4h4v16h-4z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}
    </section>
  )
}

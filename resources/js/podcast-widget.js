document.addEventListener('DOMContentLoaded', () => {
  const widget = document.querySelector('.podcast-widget')
  const toggle = document.getElementById('podcast-toggle')
  const panel = document.getElementById('podcast-panel')
  const audio = document.getElementById('podcast-audio')
  if (!widget || !toggle || !panel || !audio) return

  // First-visit intro animation: skipped for users who prefer reduced
  // motion, and only plays once per browser session so it doesn't
  // replay every time someone navigates back to the homepage.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReducedMotion && !sessionStorage.getItem('podcastIntroShown')) {
    widget.classList.add('is-introducing')
    sessionStorage.setItem('podcastIntroShown', '1')
  }

  const openPanel = () => {
    panel.hidden = false
    toggle.setAttribute('aria-expanded', 'true')
  }

  const closePanel = () => {
    panel.hidden = true
    toggle.setAttribute('aria-expanded', 'false')
  }

  toggle.addEventListener('click', () => {
    if (panel.hidden) {
      openPanel()
      audio.play().catch(() => {})
    } else {
      closePanel()
      audio.pause()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      closePanel()
      toggle.focus()
    }
  })

  document.addEventListener('click', (e) => {
    if (!panel.hidden && !widget.contains(e.target)) {
      closePanel()
    }
  })

  audio.addEventListener('play', () => {
    toggle.setAttribute('aria-label', 'Pause audio introduction')
  })
  audio.addEventListener('pause', () => {
    toggle.setAttribute('aria-label', 'Play audio introduction')
  })
  audio.addEventListener('ended', () => {
    toggle.setAttribute('aria-label', 'Play audio introduction')
  })
})

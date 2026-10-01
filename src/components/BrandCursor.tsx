import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const nativeCursorTargets = '[disabled], [aria-disabled="true"], iframe, object, embed, select, input[type="file"], input[type="range"], input[type="color"]'
const interactiveTargets = 'a[href], button, [role="button"], [role="link"], [role="option"], summary, label[for], input[type="checkbox"], input[type="radio"], input[type="button"], input[type="submit"], input[type="reset"]'
const editableTargets = 'input, textarea, [contenteditable]:not([contenteditable="false"])'
const textTargets = 'p, h1, h2, h3, h4, h5, h6, li, dt, dd, label, span, strong, em, small, blockquote, td, th'

export default function BrandCursor() {
  const layerRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const layer = layerRef.current, pointer = pointerRef.current
    if (!layer || !pointer) return
    const supported = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)')
    let positioned = false, pressed = false, scrolling = false
    let targetX = 0, targetY = 0
    let lockedIntent: string | null = null
    let holdTimer: number | undefined, scrollTimer: number | undefined
    let scrollFrame: number | null = null

    const restoreNative = () => {
      layer.dataset.visible = 'false'
      document.documentElement.classList.remove('wyattel-cursor-active')
    }
    const intentFor = (target: Element | null) => {
      if (!target || target.closest(nativeCursorTargets)) return null
      if (target.closest(interactiveTargets)) return 'interactive'
      if (target.closest('[draggable="true"], [data-cursor="grab"]')) return 'grab'
      if (target.closest(editableTargets)) return 'text'
      const text = target.closest(textTargets)
      if (text?.textContent?.trim() && window.getComputedStyle(text).userSelect !== 'none') return 'text'
      return 'default'
    }
    const refresh = () => {
      if (!positioned || !supported.matches) { restoreNative(); return }
      const intent = lockedIntent || intentFor(document.elementFromPoint(targetX, targetY))
      if (!intent) { restoreNative(); return }
      layer.dataset.intent = scrolling && !pressed ? 'scroll' : intent
      layer.dataset.visible = 'true'
      document.documentElement.classList.add('wyattel-cursor-active')
    }
    const release = () => {
      window.clearTimeout(holdTimer)
      pressed = false
      lockedIntent = null
      layer.dataset.pressed = 'false'
      layer.dataset.held = 'false'
      refresh()
    }
    const hide = () => {
      positioned = false
      scrolling = false
      window.clearTimeout(scrollTimer)
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame)
      scrollFrame = null
      release()
      restoreNative()
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') { hide(); return }
      targetX = event.clientX
      targetY = event.clientY
      positioned = true
      pointer.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      refresh()
    }
    const press = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') { hide(); return }
      move(event)
      if (layer.dataset.visible !== 'true' || event.button !== 0) return
      pressed = true
      lockedIntent = intentFor(event.target instanceof Element ? event.target : null)
      layer.dataset.pressed = 'true'
      holdTimer = window.setTimeout(() => {
        if (pressed) layer.dataset.held = 'true'
      }, 350)
      refresh()
    }
    const leave = (event: PointerEvent) => { if (event.relatedTarget === null) hide() }
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'Tab') hide() }
    const visibility = () => { if (document.hidden) hide() }
    const checkSupport = () => { if (!supported.matches) hide() }
    const scroll = () => {
      // Recheck the element beneath a stationary pointer after page or panel scrolling.
      if (scrollFrame === null) scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null
        refresh()
      })
    }
    const wheel = (event: WheelEvent) => {
      if (!positioned || event.ctrlKey || (!event.deltaX && !event.deltaY)) return
      scrolling = true
      refresh()
      window.clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => { scrolling = false; refresh() }, 180)
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', press, { passive: true })
    window.addEventListener('pointerup', release, { passive: true })
    window.addEventListener('pointercancel', hide)
    window.addEventListener('pointerout', leave)
    window.addEventListener('blur', hide)
    window.addEventListener('keydown', keyboard)
    window.addEventListener('wheel', wheel, { passive: true })
    window.addEventListener('scroll', scroll, { passive: true, capture: true })
    document.addEventListener('visibilitychange', visibility)
    supported.addEventListener('change', checkSupport)
    return () => {
      hide()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', hide)
      window.removeEventListener('pointerout', leave)
      window.removeEventListener('blur', hide)
      window.removeEventListener('keydown', keyboard)
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('scroll', scroll, true)
      document.removeEventListener('visibilitychange', visibility)
      supported.removeEventListener('change', checkSupport)
    }
  }, [])

  return createPortal(
    <div ref={layerRef} className="wyattel-cursor-layer" data-visible="false" aria-hidden="true">
      <span ref={pointerRef} className="wyattel-cursor-pointer">
        <svg className="wyattel-cursor-arrow" viewBox="0 0 20 28" width="20" height="28" focusable="false">
          <path d="M1 1v19l5.2-4.8L10 24l4-2-3.8-8.6H17Z" />
        </svg>
        <svg className="wyattel-cursor-hand" viewBox="0 0 28 32" width="28" height="32" focusable="false">
          <path d="M8 16V4a2.5 2.5 0 0 1 5 0v9-2a2.5 2.5 0 0 1 5 0v3-1a2.5 2.5 0 0 1 5 0v3a2 2 0 0 1 4 0v5c0 4-2 8-5 10H12L3 20c-2-3 1-6 3-4l2 2Z" />
        </svg>
        <svg className="wyattel-cursor-text" viewBox="0 0 16 26" width="16" height="26" focusable="false">
          <path d="M3 2h3l2 2 2-2h3M8 4v18M3 24h3l2-2 2 2h3" />
        </svg>
        <svg className="wyattel-cursor-scroll" viewBox="0 0 22 32" width="22" height="32" focusable="false">
          <rect x="3" y="2" width="16" height="27" rx="7" />
          <path className="wyattel-cursor-wheel" d="M11 7v6" />
        </svg>
        <svg className="wyattel-cursor-grab" viewBox="0 0 28 32" width="28" height="32" focusable="false">
          <path d="M4 15V9a2.5 2.5 0 0 1 5 0V6a2.5 2.5 0 0 1 5 0v1a2.5 2.5 0 0 1 5 0v3a2.5 2.5 0 0 1 5 0v10c0 5-2 8-4 10H10L2 20c-2-3 0-6 2-5Z" />
        </svg>
      </span>
    </div>, document.body,
  )
}

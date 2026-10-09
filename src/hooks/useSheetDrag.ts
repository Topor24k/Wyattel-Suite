import { useRef, type PointerEvent, type RefObject } from 'react'

const settle = 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * Drag-down-to-dismiss for bottom sheets, as in native apps. Spread the
 * returned props on the grab handle; the sheet follows the finger and either
 * slides away (far or fast enough) or springs back.
 */
export function useSheetDrag(sheetRef: RefObject<HTMLElement | null>, onDismiss: () => void) {
  const start = useRef<{ y: number; time: number } | null>(null)
  const offset = useRef(0)

  const move = (value: number, animate: boolean) => {
    const sheet = sheetRef.current
    if (!sheet) return
    sheet.style.transition = animate ? settle : 'none'
    sheet.style.transform = value > 0 ? `translateY(${value}px)` : ''
  }

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    start.current = { y: event.clientY, time: performance.now() }
    offset.current = 0
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!start.current) return
    offset.current = Math.max(0, event.clientY - start.current.y)
    move(offset.current, false)
  }

  const finish = () => {
    if (!start.current) return
    const velocity = offset.current / Math.max(performance.now() - start.current.time, 1)
    start.current = null
    const sheet = sheetRef.current
    if (sheet && (offset.current > sheet.offsetHeight * 0.25 || velocity > 0.6)) {
      move(sheet.offsetHeight, true)
      window.setTimeout(onDismiss, 200)
    } else {
      move(0, true)
    }
    offset.current = 0
  }

  return { onPointerDown, onPointerMove, onPointerUp: finish, onPointerCancel: finish }
}

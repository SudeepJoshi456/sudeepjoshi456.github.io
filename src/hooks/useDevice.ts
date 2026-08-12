import { useEffect, useState } from 'react'

export function useIsTouch() {
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const noHover = window.matchMedia('(hover: none)').matches
    setTouch(coarse || noHover || 'ontouchstart' in window)
  }, [])

  return touch
}

export function useShortcutLabel() {
  const [label, setLabel] = useState('Ctrl /')

  useEffect(() => {
    const mac = /Mac|iPhone|iPad/.test(navigator.platform) || navigator.userAgent.includes('Mac')
    setLabel(mac ? '⌘/' : 'Ctrl /')
  }, [])

  return label
}

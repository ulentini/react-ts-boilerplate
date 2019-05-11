import { useEffect, useRef } from "react"

export function useInterval(callback: () => any, delay: number) {
  const savedCallback = useRef<() => any>()
  const intervalRef = useRef<NodeJS.Timeout>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  const setupInterval = () => {
    function tick() {
      savedCallback.current && savedCallback.current()
    }
    if (delay !== null) {
      intervalRef.current = setInterval(tick, delay)
      return () => clearInterval(intervalRef.current as NodeJS.Timeout)
    }
  }

  useEffect(setupInterval, [delay])

  const resetInterval = () => {
    clearInterval(intervalRef.current as NodeJS.Timeout)
  }

  return [resetInterval, setupInterval]
}

export function useBodyListener(
  eventType: string,
  callback: (event: Event) => void,
  dependencies: any[] = [],
) {
  useEffect(() => {
    const listener = (event: Event) => {
      callback(event)
    }

    document.body.addEventListener(eventType, listener)

    return () => {
      document.body.removeEventListener(eventType, listener)
    }
  }, dependencies)
}

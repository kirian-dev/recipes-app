import { useCallback, useRef } from 'react'

interface UseInfiniteScrollOptions {
  onIntersect: () => void
  threshold?: number
  rootMargin?: string
}

export const useInfiniteScroll = ({
  onIntersect,
  threshold = 0.1,
  rootMargin = '100px',
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useRef<HTMLDivElement | null>(null)

  const setLastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (lastElementRef.current) {
        observerRef.current?.disconnect()
      }

      lastElementRef.current = node

      if (node) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              onIntersect()
            }
          },
          {
            threshold,
            rootMargin,
          }
        )

        observerRef.current.observe(node)
      }
    },
    [onIntersect, threshold, rootMargin]
  )

  return {
    lastElementRef: setLastElementRef,
  }
} 
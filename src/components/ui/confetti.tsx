"use client"

import { Fragment } from "react"

interface ConfettiBurstProps {
  className?: string
}

const CONFETTI_PARTS = Array.from({ length: 18 }, (_, index) => index)

export function ConfettiBurst({ className }: ConfettiBurstProps) {
  return (
    <div className={className} aria-hidden>
      {CONFETTI_PARTS.map((part) => (
        <Fragment key={part}>
          <span className={`confetti-piece confetti-piece-${part + 1}`} />
        </Fragment>
      ))}
    </div>
  )
}

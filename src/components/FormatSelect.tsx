"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"

export const COLLAB_FORMATS = [
  "Join a livestream",
  "Join a recorded video",
  "Remote co-recording",
  "Gameplay collaboration",
  "Podcast or interview",
  "In-person collaboration",
] as const

interface FormatSelectProps {
  value: string
  onChange: (value: string) => void
}

export default function FormatSelect({ value, onChange }: FormatSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative mt-1">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full items-center justify-between border border-border bg-background px-3 text-left text-sm text-text-primary transition-colors hover:border-accent/60 focus:border-accent focus:outline-none"
      >
        <span>{value}</span>
        <ChevronDown
          className={`h-4 w-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-30 mt-1 w-full border border-border bg-surface p-1 shadow-xl shadow-black/20"
        >
          {COLLAB_FORMATS.map((format) => {
            const selected = format === value
            return (
              <button
                key={format}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(format)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                  selected
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:bg-background hover:text-text-primary"
                }`}
              >
                <Check className={`h-4 w-4 ${selected ? "opacity-100" : "opacity-0"}`} />
                <span>{format}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

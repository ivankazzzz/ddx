"use client"

import { useState, useEffect } from "react"

export function ClockComponent() {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-lg">
      {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </div>
  )
}

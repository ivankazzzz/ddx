"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ClockComponent } from "./components/ClockComponent"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; level: number } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return (
    <>
      <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Pembayaran Uang Kos</h1>
          <ClockComponent />
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <p>Selamat datang, {user.id}</p>
            <Button onClick={handleLogout} variant="secondary">Logout</Button>
          </div>
        )}
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </>
  )
}

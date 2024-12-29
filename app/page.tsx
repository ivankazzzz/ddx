"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Ini hanya contoh data, Anda perlu menggantinya dengan data sebenarnya dari backend
const dashboardData = {
  totalRooms: 50,
  occupiedRooms: 35,
  emptyRooms: 15,
  totalTenants: 60,
  unpaidRooms: [
    { id: 1, roomNumber: "101", tenants: ["John Doe", "Jane Smith"] },
    { id: 2, roomNumber: "205", tenants: ["Alice Johnson"] },
  ]
}

export default function Home() {
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

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Jumlah Kamar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardData.totalRooms}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kamar Terisi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardData.occupiedRooms}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kamar Kosong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardData.emptyRooms}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Jumlah Penghuni</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardData.totalTenants}</p>
          </CardContent>
        </Card>
      </div>
      {user.level !== 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Pembayaran Tertunggak</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.unpaidRooms.length > 0 ? (
              <ul className="space-y-2">
                {dashboardData.unpaidRooms.map((room) => (
                  <li key={room.id} className="flex justify-between items-center">
                    <span>
                      Kamar No {room.roomNumber} - {room.tenants.join(", ")}
                    </span>
                    <Link href={`/rooms#${room.roomNumber}`}>
                      <Button variant="outline" size="sm">Detail</Button>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Tidak ada pembayaran tertunggak</p>
            )}
            <Link href="/rooms">
              <Button className="mt-4">Lihat Semua Kamar</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

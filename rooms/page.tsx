"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format, addMonths } from "date-fns"
import { CalendarIcon, ArrowLeft, ChevronDown, ChevronUp, Plus, Copy } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"

const paymentPatterns = [
  "1 bulan", "2 bulan", "3 bulan", "4 bulan", "5 bulan", "6 bulan",
  "7 bulan", "8 bulan", "9 bulan", "10 bulan", "11 bulan", "12 bulan"
]

type Payment = {
  period: number
  paymentPattern: string
  paymentProofDate: Date | null
  paymentProofLink: string
  nextPaymentDate: Date | null
}

type Tenant = {
  name: string
  prodi: string
  phoneNumber: string
  dpDate: Date | null
  entryDate: Date | null
  payments: Payment[]
}

type Room = {
  number: string
  tenants: [Tenant, Tenant]
}

const initialPayment: Payment = {
  period: 1,
  paymentPattern: "1 bulan",
  paymentProofDate: null,
  paymentProofLink: "",
  nextPaymentDate: null
}

const initialTenant: Tenant = {
  name: "",
  prodi: "",
  phoneNumber: "",
  dpDate: null,
  entryDate: null,
  payments: [{ ...initialPayment }]
}

const initialRoomNumbers = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "101", "102", "103", "104", "105", "106", "107", "108",
  "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212",
  "301", "302", "303", "304", "305", "306", "307", "308"
]

export default function RoomsPage() {
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

  const [rooms, setRooms] = useState<Room[]>(
    initialRoomNumbers.map(number => ({
      number,
      tenants: [{ ...initialTenant }, { ...initialTenant }]
    }))
  )

  const handleNameChange = (roomIndex: number, tenantIndex: number, name: string) => {
    setRooms(prevRooms => {
      const newRooms = [...prevRooms]
      newRooms[roomIndex].tenants[tenantIndex].name = name
      return newRooms
    })
  }

  const handleProdiChange = (roomIndex: number, tenantIndex: number, prodi: string) => {
    setRooms(prevRooms => {
      const newRooms = [...prevRooms]
      newRooms[roomIndex].tenants[tenantIndex].prodi = prodi
      return newRooms
    })
  }

  const handlePhoneNumberChange = (roomIndex: number, tenantIndex: number, phoneNumber: string) => {
    setRooms(prevRooms => {
      const newRooms = [...prevRooms]
      newRooms[roomIndex].tenants[tenantIndex].phoneNumber = phoneNumber
      return newRooms
    })
  }

  const handleDateChange = (roomIndex: number, tenantIndex: number, field: 'dpDate' | 'entryDate', date: Date | null) => {
    setRooms(prevRooms => {
      const newRooms = [...prevRooms]
      newRooms[roomIndex].tenants[tenantIndex][field] = date
      if (field === 'entryDate' && date) {
        const tenant = newRooms[roomIndex].tenants[tenantIndex]
        tenant.payments.forEach(payment => {
          const monthsToAdd = parseInt(payment.paymentPattern)
          payment.nextPaymentDate = addMonths(date, monthsToAdd)
        })
      }
      return newRooms
    })
  }

  const handlePaymentChange = (roomIndex: number, tenantIndex: number, paymentIndex: number, field: keyof Payment, value: string | Date | null) => {
    setRooms(prevRooms => {
      const newRooms = [...prevRooms]
      const payment = newRooms[roomIndex].tenants[tenantIndex].payments[paymentIndex]
      if (field === 'paymentPattern') {
        payment[field] = value as string
      } else if (field === 'paymentProofDate' || field === 'nextPaymentDate') {
        payment[field] = value as Date | null
      } else {
        payment[field] = value as string
      }

      if (field === 'paymentProofDate' && value) {
        const monthsToAdd = parseInt(payment.paymentPattern)
        payment.nextPaymentDate = addMonths(value as Date, monthsToAdd)
      }

      return newRooms
    })
  }

  const addPayment = (roomIndex: number, tenantIndex: number) => {
    setRooms(prevRooms => {
      const newRooms = [...prevRooms]
      const tenant = newRooms[roomIndex].tenants[tenantIndex]
      const newPeriod = tenant.payments.length + 1
      tenant.payments.push({ ...initialPayment, period: newPeriod })
      return newRooms
    })
  }

  const addRoom = () => {
    const newRoomNumber = (parseInt(rooms[rooms.length - 1].number) + 1).toString()
    setRooms(prevRooms => [...prevRooms, {
      number: newRoomNumber,
      tenants: [{ ...initialTenant }, { ...initialTenant }]
    }])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Nomor HP disalin",
        description: "Nomor HP telah disalin ke clipboard.",
      })
    }, (err) => {
      console.error('Tidak dapat menyalin teks: ', err)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Link href="/">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold">Info Penghuni</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {rooms.map((room, roomIndex) => (
          <AccordionItem key={room.number} value={room.number}>
            <AccordionTrigger>Kamar No {room.number}</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent>
                  {room.tenants.map((tenant, tenantIndex) => (
                    <div key={tenantIndex} className="mb-8">
                      <h3 className="font-semibold text-lg mb-4">Penghuni {tenantIndex + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor={`name-${roomIndex}-${tenantIndex}`}>Nama</Label>
                          <Input
                            id={`name-${roomIndex}-${tenantIndex}`}
                            value={tenant.name}
                            onChange={(e) => handleNameChange(roomIndex, tenantIndex, e.target.value)}
                            readOnly={user.level === 2}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`prodi-${roomIndex}-${tenantIndex}`}>Prodi</Label>
                          <Input
                            id={`prodi-${roomIndex}-${tenantIndex}`}
                            value={tenant.prodi}
                            onChange={(e) => handleProdiChange(roomIndex, tenantIndex, e.target.value)}
                            readOnly={user.level === 2}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`phone-${roomIndex}-${tenantIndex}`}>Nomor HP</Label>
                          <div className="flex">
                            <Input
                              id={`phone-${roomIndex}-${tenantIndex}`}
                              value={tenant.phoneNumber}
                              onChange={(e) => handlePhoneNumberChange(roomIndex, tenantIndex, e.target.value)}
                              readOnly={user.level === 2}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="ml-2"
                              onClick={() => copyToClipboard(tenant.phoneNumber)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label>Tanggal DP</Label>
                          <Input
                            type="date"
                            value={tenant.dpDate ? format(tenant.dpDate, "yyyy-MM-dd") : ""}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : null;
                              handleDateChange(roomIndex, tenantIndex, 'dpDate', date);
                            }}
                            readOnly={user.level === 2}
                          />
                        </div>
                        <div>
                          <Label>Tanggal Masuk</Label>
                          <Input
                            type="date"
                            value={tenant.entryDate ? format(tenant.entryDate, "yyyy-MM-dd") : ""}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : null;
                              handleDateChange(roomIndex, tenantIndex, 'entryDate', date);
                            }}
                            readOnly={user.level === 2}
                          />
                        </div>
                      </div>
                      {user.level !== 3 && tenant.payments.map((payment, paymentIndex) => (
                        <div key={paymentIndex} className="border p-4 rounded-md mb-4">
                          <h4 className="font-semibold mb-2">Pembayaran Periode {payment.period}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`pattern-${roomIndex}-${tenantIndex}-${paymentIndex}`}>Pola Pembayaran</Label>
                              <Select
                                onValueChange={(value) => handlePaymentChange(roomIndex, tenantIndex, paymentIndex, 'paymentPattern', value)}
                                value={payment.paymentPattern}
                              >
                                <SelectTrigger id={`pattern-${roomIndex}-${tenantIndex}-${paymentIndex}`}>
                                  <SelectValue placeholder="Pilih pola pembayaran" />
                                </SelectTrigger>
                                <SelectContent>
                                  {paymentPatterns.map((pattern) => (
                                    <SelectItem key={pattern} value={pattern}>
                                      {pattern}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Tanggal Bukti Bayar</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={`w-full justify-start text-left font-normal ${
                                      !payment.paymentProofDate && "text-muted-foreground"
                                    }`}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {payment.paymentProofDate ? format(payment.paymentProofDate, "PPP") : <span>Pilih tanggal</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={payment.paymentProofDate || undefined}
                                    onSelect={(date) => handlePaymentChange(roomIndex, tenantIndex, paymentIndex, 'paymentProofDate', date)}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div>
                              <Label htmlFor={`proof-link-${roomIndex}-${tenantIndex}-${paymentIndex}`}>Link Bukti Bayar</Label>
                              <Input
                                id={`proof-link-${roomIndex}-${tenantIndex}-${paymentIndex}`}
                                value={payment.paymentProofLink}
                                onChange={(e) => handlePaymentChange(roomIndex, tenantIndex, paymentIndex, 'paymentProofLink', e.target.value)}
                                placeholder="https://example.com/bukti-bayar.jpg"
                              />
                            </div>
                            <div>
                              <Label>Tanggal Pembayaran Berikutnya</Label>
                              <Input
                                value={payment.nextPaymentDate ? format(payment.nextPaymentDate, "PPP") : ""}
                                readOnly
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {user.level === 1 && (
                        <Button onClick={() => addPayment(roomIndex, tenantIndex)} className="mt-2">
                          <Plus className="mr-2 h-4 w-4" /> Tambah Pembayaran
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {user.level === 1 && (
        <Button onClick={addRoom} className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Tambah Kamar
        </Button>
      )}
    </div>
  )
}

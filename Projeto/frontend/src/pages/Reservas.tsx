import { useState } from "react"
import { Calendar, Clock, User, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface Reservation {
  id: string
  lab: string
  date: string
  time: string
  endTime: string
  status: "confirmada" | "em-andamento" | "concluida" | "cancelada"
  substitute?: string
  canCancel: boolean
  createdAt: string
}

export default function Reservas() {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      lab: "UCL1",
      date: "2024-01-15",
      time: "09:00",
      endTime: "11:00",
      status: "confirmada",
      substitute: "João Silva",
      canCancel: true,
      createdAt: "2024-01-10T10:30:00Z"
    },
    {
      id: "2", 
      lab: "UCL2",
      date: "2024-01-16",
      time: "14:00",
      endTime: "16:00",
      status: "confirmada",
      canCancel: true,
      createdAt: "2024-01-12T15:20:00Z"
    },
    {
      id: "3",
      lab: "UCL1", 
      date: "2024-01-10",
      time: "10:00",
      endTime: "12:00",
      status: "concluida",
      canCancel: false,
      createdAt: "2024-01-05T09:15:00Z"
    },
    {
      id: "4",
      lab: "UCL3",
      date: "2024-01-08",
      time: "15:00", 
      endTime: "17:00",
      status: "cancelada",
      substitute: "Maria Santos",
      canCancel: false,
      createdAt: "2024-01-03T14:45:00Z"
    }
  ])

  const [cancelingId, setCancelingId] = useState<string | null>(null)

  const getStatusBadge = (status: Reservation["status"]) => {
    const configs = {
      "confirmada": { variant: "default", icon: CheckCircle, color: "bg-primary" },
      "em-andamento": { variant: "secondary", icon: Clock, color: "bg-blue-500" },
      "concluida": { variant: "outline", icon: CheckCircle, color: "bg-green-500" },
      "cancelada": { variant: "destructive", icon: XCircle, color: "bg-red-500" }
    } as const

    const config = configs[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={cn(config.color, "text-white")}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    )
  }

  const handleCancelReservation = async (reservation: Reservation) => {
    const reservationDateTime = new Date(`${reservation.date}T${reservation.time}:00`)
    const now = new Date()
    const hoursDiff = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursDiff < 1) {
      alert("Não é possível cancelar reservas com menos de 1 hora de antecedência.")
      return
    }

    setCancelingId(reservation.id)
    
    // Simulate API call
    setTimeout(() => {
      setReservations(prev => 
        prev.map(r => 
          r.id === reservation.id 
            ? { ...r, status: "cancelada" as const, canCancel: false }
            : r
        )
      )
      setCancelingId(null)
      alert("Reserva cancelada com sucesso! Um email de confirmação foi enviado.")
    }, 1000)
  }

  const activeReservations = reservations.filter(r => r.status === "confirmada" || r.status === "em-andamento")
  const pastReservations = reservations.filter(r => r.status === "concluida" || r.status === "cancelada")

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Minhas Reservas</h1>
        <p className="text-muted-foreground">
          Gerencie suas reservas de laboratório ativas e históricas
        </p>
      </div>

      {/* Important Notice */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-700">
          <strong>Lembrete:</strong> Cancelamentos só são permitidos até 1 hora antes do horário de início. 
          Não comparecer sem cancelar pode resultar em bloqueio temporário.
        </AlertDescription>
      </Alert>

      {/* Active Reservations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Calendar className="h-5 w-5" />
            Reservas Ativas ({activeReservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeReservations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma reserva ativa encontrada</p>
              <Button className="mt-4 bg-primary hover:bg-primary-hover" asChild>
                <a href="/agendar">Fazer Nova Reserva</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeReservations.map((reservation) => (
                <div key={reservation.id} className="border border-border rounded-lg p-6 hover:shadow-medium transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center">
                        <span className="font-bold text-primary text-lg">{reservation.lab}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{formatDate(reservation.date)}</h3>
                          {getStatusBadge(reservation.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{reservation.time} - {reservation.endTime}</span>
                          </div>
                          {reservation.substitute && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>Suplente: {reservation.substitute}</span>
                            </div>
                          )}
                          <div className="text-xs">
                            Criada em: {new Date(reservation.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 lg:flex-row">
                      <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                        Detalhes
                      </Button>
                      {reservation.canCancel && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          disabled={cancelingId === reservation.id}
                          onClick={() => handleCancelReservation(reservation)}
                        >
                          {cancelingId === reservation.id ? "Cancelando..." : "Cancelar"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Reservations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            Histórico ({pastReservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pastReservations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma reserva no histórico</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-4 border border-border rounded-lg opacity-75 hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <span className="font-bold text-muted-foreground text-sm">{reservation.lab}</span>
                    </div>
                    <div>
                      <p className="font-medium">{formatDate(reservation.date)} - {reservation.time}</p>
                      {reservation.substitute && (
                        <p className="text-sm text-muted-foreground">Suplente: {reservation.substitute}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(reservation.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
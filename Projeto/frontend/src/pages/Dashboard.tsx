import { useState, useEffect } from "react"
import { Calendar, Clock, User, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Reservation {
  id: string
  lab: string
  date: string
  time: string
  status: "confirmada" | "em-andamento" | "concluida"
  substitute?: string
}

interface PrintJob {
  id: string
  filename: string
  status: "NA_FILA" | "INICIADA" | "FINALIZADA"
  position: number
  estimatedStart: string
  printTime: string
  material: string
}

export default function Dashboard() {
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([
    {
      id: "1",
      lab: "UCL1",
      date: "2024-01-15",
      time: "09:00",
      status: "confirmada",
      substitute: "João Silva"
    },
    {
      id: "2", 
      lab: "UCL2",
      date: "2024-01-16",
      time: "14:00",
      status: "confirmada"
    }
  ])

  const [printQueue, setPrintQueue] = useState<PrintJob[]>([
    {
      id: "p1",
      filename: "projeto_final.stl",
      status: "NA_FILA",
      position: 2,
      estimatedStart: "14:30",
      printTime: "2h 15min",
      material: "PLA Branco"
    }
  ])

  const getStatusBadge = (status: Reservation["status"]) => {
    const variants = {
      "confirmada": "default",
      "em-andamento": "secondary", 
      "concluida": "outline"
    } as const

    return (
      <Badge variant={variants[status]} className="bg-primary text-primary-foreground">
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    )
  }

  const getPrintStatusBadge = (status: PrintJob["status"]) => {
    const variants = {
      "NA_FILA": "default",
      "INICIADA": "secondary",
      "FINALIZADA": "outline"
    } as const

    const labels = {
      "NA_FILA": "Na Fila",
      "INICIADA": "Em Impressão", 
      "FINALIZADA": "Finalizada"
    }

    return (
      <Badge variant={variants[status]} className="bg-primary text-primary-foreground">
        {labels[status]}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Início</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao sistema de reservas de laboratórios
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reservas Ativas
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{upcomingReservations.length}</div>
            <p className="text-xs text-muted-foreground">
              próximas reservas confirmadas
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fila de Impressão
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{printQueue.length}</div>
            <p className="text-xs text-muted-foreground">
              trabalhos na fila
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status Geral
            </CardTitle>
            <User className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ativo</div>
            <p className="text-xs text-muted-foreground">
              sem bloqueios pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Reservations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Calendar className="h-5 w-5" />
            Próximas Reservas
          </CardTitle>
          <CardDescription>
            Suas reservas confirmadas para os próximos dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingReservations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma reserva encontrada</p>
              <Button className="mt-4 bg-primary hover:bg-primary-hover" asChild>
                <a href="/agendar">Fazer Nova Reserva</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-soft transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                      <span className="font-bold text-primary">{reservation.lab}</span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {new Date(reservation.date).toLocaleDateString('pt-BR')} às {reservation.time}
                      </p>
                      {reservation.substitute && (
                        <p className="text-sm text-muted-foreground">
                          Suplente: {reservation.substitute}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(reservation.status)}
                    <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                      Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Print Queue */}
      {printQueue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Clock className="h-5 w-5" />
              Fila de Impressão 3D
            </CardTitle>
            <CardDescription>
              Acompanhe o status dos seus trabalhos de impressão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {printQueue.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-soft transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                      <span className="font-bold text-primary">#{job.position}</span>
                    </div>
                    <div>
                      <p className="font-medium">{job.filename}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Início: {job.estimatedStart}</span>
                        <span>Duração: {job.printTime}</span>
                        <span>Material: {job.material}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPrintStatusBadge(job.status)}
                    {job.status === "NA_FILA" && (
                      <Button variant="destructive" size="sm">
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Lembrete Importante</h3>
              <p className="text-sm text-amber-700 mt-1">
                Lembre-se de confirmar sua presença no laboratório até 15 minutos após o horário de início da reserva, 
                caso contrário ela será automaticamente cancelada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
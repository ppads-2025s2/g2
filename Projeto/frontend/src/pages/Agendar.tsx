import { useState } from "react"
import { ChevronRight, User, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WeeklyCalendar } from "@/components/lab/WeeklyCalendar"
import { cn } from "@/lib/utils"

interface TimeSlot {
  hour: string
  day: number
  isSelected: boolean
  isOccupied: boolean
  lab?: string
}

interface ReservationData {
  lab: string
  date: string
  time: string
  substitute: string
}

export default function Agendar() {
  const [selectedLab, setSelectedLab] = useState("UCL1")
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([])
  const [substitute, setSubstitute] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [reservationData, setReservationData] = useState<ReservationData | null>(null)

  const labs = [
    { value: "UCL1", label: "UCL1 - Laboratório de Computação 1" },
    { value: "UCL2", label: "UCL2 - Laboratório de Computação 2" },
    { value: "UCL3", label: "UCL3 - Laboratório de Computação 3" },
  ]

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlots(prev => {
      const exists = prev.some(s => s.hour === slot.hour && s.day === slot.day)
      if (exists) {
        return prev.filter(s => !(s.hour === slot.hour && s.day === slot.day))
      } else {
        return [...prev, slot]
      }
    })
  }

  const handleConfirmSelection = () => {
    if (selectedSlots.length === 0) return
    
    const firstSlot = selectedSlots[0]
    const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1)
    const selectedDate = new Date(startOfWeek)
    selectedDate.setDate(startOfWeek.getDate() + firstSlot.day)

    setReservationData({
      lab: selectedLab,
      date: selectedDate.toLocaleDateString('pt-BR'),
      time: firstSlot.hour,
      substitute: substitute || "Não informado"
    })
    
    setCurrentStep(2)
  }

  const handleConfirmReservation = () => {
    // Here you would typically send the reservation to your backend
    console.log("Reserva confirmada:", reservationData)
    // Redirect or show success message
    alert("Reserva confirmada com sucesso!")
    setCurrentStep(1)
    setSelectedSlots([])
    setSubstitute("")
    setReservationData(null)
  }

  const handleCancel = () => {
    setCurrentStep(1)
    setSelectedSlots([])
    setSubstitute("")
    setReservationData(null)
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Agendar</h1>
        <p className="text-muted-foreground">
          {currentStep === 1 ? "Selecione o laboratório, horário e suplente para sua reserva" : "Confirme os dados da sua reserva"}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
          currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          1
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
          currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          2
        </div>
        <div className="flex-1 ml-4">
          <p className="text-sm font-medium">
            {currentStep === 1 ? "Seleção de Horário" : "Confirmação da Reserva"}
          </p>
        </div>
      </div>

      {/* Step 1: Selection */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Laboratory Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Laboratório</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="lab-select">Selecione o laboratório</Label>
                  <Select value={selectedLab} onValueChange={setSelectedLab}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {labs.map((lab) => (
                        <SelectItem key={lab.value} value={lab.value}>
                          {lab.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="substitute">Suplente (TIA/E-mail)</Label>
                  <Input
                    id="substitute"
                    placeholder="Ex: 12345678 ou email@uni.br"
                    value={substitute}
                    onChange={(e) => setSubstitute(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Opcional: pessoa autorizada a usar sua reserva
                  </p>
                </div>

                {selectedSlots.length > 0 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-primary mb-2">Horários Selecionados:</h4>
                      <div className="space-y-2">
                        {selectedSlots.map((slot, index) => {
                          const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex"]
                          return (
                            <div key={index} className="flex items-center gap-2 text-sm bg-primary-light p-2 rounded">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>{weekDays[slot.day]} - {slot.hour}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary-hover"
                        onClick={handleConfirmSelection}
                      >
                        Confirmar Seleção
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setSelectedSlots([])}
                      >
                        Limpar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <div className="lg:col-span-2">
            <WeeklyCalendar
              selectedSlots={selectedSlots}
              onSlotSelect={handleSlotSelect}
              selectedLab={selectedLab}
            />
          </div>
        </div>
      )}

      {/* Step 2: Confirmation */}
      {currentStep === 2 && reservationData && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Confirmação da Reserva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Data</h4>
                    <p className="text-muted-foreground">{reservationData.date}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Horário</h4>
                    <p className="text-muted-foreground">{reservationData.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary rounded text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">
                    L
                  </div>
                  <div>
                    <h4 className="font-medium">Laboratório</h4>
                    <p className="text-muted-foreground">{reservationData.lab}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Suplente</h4>
                    <p className="text-muted-foreground">{reservationData.substitute}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary-light p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2">Regras Importantes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Confirme sua presença até 15 minutos após o início</li>
                  <li>• Cancelamentos são permitidos até 1 hora antes do horário</li>
                  <li>• O suplente deve apresentar identificação válida</li>
                  <li>• Você receberá confirmação por email</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary-hover"
                  onClick={handleConfirmReservation}
                >
                  Confirmar Reserva
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 hover:bg-primary hover:text-primary-foreground"
                  onClick={handleBack}
                >
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
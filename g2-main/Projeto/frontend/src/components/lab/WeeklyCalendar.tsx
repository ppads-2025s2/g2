import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimeSlot {
  hour: string
  day: number
  isSelected: boolean
  isOccupied: boolean
  lab?: string
}

interface WeeklyCalendarProps {
  selectedSlots: TimeSlot[]
  onSlotSelect: (slot: TimeSlot) => void
  selectedLab: string
}

export function WeeklyCalendar({ selectedSlots, onSlotSelect, selectedLab }: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(0)
  
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ]
  
  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex"]
  
  // Mock data for occupied slots
  const occupiedSlots = new Set([
    "09:00-1", "10:00-2", "14:00-3", "15:00-4"
  ])

  const isSlotSelected = (hour: string, day: number) => {
    return selectedSlots.some(slot => slot.hour === hour && slot.day === day)
  }

  const isSlotOccupied = (hour: string, day: number) => {
    return occupiedSlots.has(`${hour}-${day}`)
  }

  const handleSlotClick = (hour: string, day: number) => {
    if (isSlotOccupied(hour, day)) return

    const slot: TimeSlot = {
      hour,
      day,
      isSelected: !isSlotSelected(hour, day),
      isOccupied: false,
      lab: selectedLab
    }
    
    onSlotSelect(slot)
  }

  const getWeekDates = () => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (currentWeek * 7))
    
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })
  }

  const weekDates = getWeekDates()

  return (
    <div className="bg-card rounded-lg shadow-medium p-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentWeek(prev => prev - 1)}
          className="hover:bg-primary hover:text-primary-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold text-foreground">
          {weekDates[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {' '}
          {weekDates[4].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </h3>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentWeek(prev => prev + 1)}
          className="hover:bg-primary hover:text-primary-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-6 gap-2">
        {/* Header */}
        <div className="p-3 font-medium text-center text-muted-foreground">
          Horário
        </div>
        {weekDays.map((day, index) => (
          <div key={day} className="p-3 font-medium text-center text-muted-foreground">
            <div>{day}</div>
            <div className="text-sm text-muted-foreground">
              {weekDates[index].getDate().toString().padStart(2, '0')}
            </div>
          </div>
        ))}

        {/* Time Slots */}
        {timeSlots.map((hour) => (
          <div key={hour} className="contents">
            <div className="p-3 font-medium text-center border-r border-border bg-muted/30">
              {hour}
            </div>
            {[0, 1, 2, 3, 4].map((day) => (
              <button
                key={`${hour}-${day}`}
                className={cn(
                  "p-3 border border-border text-sm font-medium transition-all duration-200 hover:shadow-soft",
                  isSlotOccupied(hour, day) 
                    ? "bg-lab-occupied text-muted-foreground cursor-not-allowed"
                    : isSlotSelected(hour, day)
                    ? "bg-lab-selected text-white shadow-strong"
                    : "bg-lab-available hover:bg-primary-light cursor-pointer"
                )}
                onClick={() => handleSlotClick(hour, day)}
                disabled={isSlotOccupied(hour, day)}
              >
                {isSlotOccupied(hour, day) ? "Ocupado" : 
                 isSlotSelected(hour, day) ? "Selecionado" : "Disponível"}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-lab-available border border-border"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-lab-selected"></div>
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-lab-occupied"></div>
          <span>Ocupado</span>
        </div>
      </div>
    </div>
  )
}
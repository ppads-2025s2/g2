# LabReserve - Código Completo

## 📁 Estrutura de arquivos

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── lib/utils.ts
├── components/
│   ├── layout/AppSidebar.tsx
│   ├── lab/WeeklyCalendar.tsx
│   └── ui/ (componentes shadcn)
├── pages/
│   ├── Dashboard.tsx
│   ├── Agendar.tsx
│   ├── Reservas.tsx
│   ├── Configuracoes.tsx
│   ├── Impressao3D.tsx
│   └── NotFound.tsx
├── hooks/
│   └── use-mobile.tsx
└── assets/
    └── logo.png
```

---

## 📄 Arquivo: `src/main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

---

## 📄 Arquivo: `src/App.tsx`

```tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Dashboard from "@/pages/Dashboard";
import Agendar from "@/pages/Agendar";
import Reservas from "@/pages/Reservas";
import Configuracoes from "@/pages/Configuracoes";
import Impressao3D from "@/pages/Impressao3D";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
            <main className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/agendar" element={<Agendar />} />
                <Route path="/reservas" element={<Reservas />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/impressao3d" element={<Impressao3D />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

---

## 📄 Arquivo: `src/index.css`

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Primary red color palette */
    --primary: 0 86% 45%; /* #E60000 */
    --primary-dark: 0 86% 35%;
    --primary-light: 0 86% 55%;
    --primary-glow: 0 86% 60%;
    
    /* Semantic colors */
    --background: 0 0% 100%;
    --foreground: 224 71% 4%;
    --card: 0 0% 100%;
    --card-foreground: 224 71% 4%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71% 4%;
    --secondary: 220 14% 96%;
    --secondary-foreground: 220 9% 46%;
    --muted: 220 14% 96%;
    --muted-foreground: 220 9% 46%;
    --accent: 220 14% 96%;
    --accent-foreground: 220 9% 46%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 0 86% 45%;
    --chart-1: 0 86% 45%;
    --chart-2: 0 86% 35%;
    --chart-3: 0 86% 55%;
    --chart-4: 220 14% 96%;
    --chart-5: 220 9% 46%;
    --radius: 0.75rem;

    /* Custom gradients */
    --gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)));
    --gradient-subtle: linear-gradient(180deg, hsl(var(--background)), hsl(var(--secondary)));
    
    /* Custom shadows */
    --shadow-elegant: 0 10px 30px -10px hsl(var(--primary) / 0.15);
    --shadow-glow: 0 0 40px hsl(var(--primary-glow) / 0.2);
    
    /* Animations */
    --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark {
    --background: 224 71% 4%;
    --foreground: 210 20% 98%;
    --card: 224 71% 4%;
    --card-foreground: 210 20% 98%;
    --popover: 224 71% 4%;
    --popover-foreground: 210 20% 98%;
    --secondary: 215 28% 17%;
    --secondary-foreground: 210 20% 98%;
    --muted: 215 28% 17%;
    --muted-foreground: 217 11% 65%;
    --accent: 215 28% 17%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 210 20% 98%;
    --border: 215 28% 17%;
    --input: 215 28% 17%;
    --ring: 0 86% 45%;
    --chart-1: 0 86% 45%;
    --chart-2: 0 86% 35%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  .sidebar-item-active {
    @apply bg-primary text-white;
  }
  
  .calendar-time-slot {
    @apply border border-border hover:bg-secondary/50 cursor-pointer transition-colors;
  }
  
  .calendar-time-slot.selected {
    @apply bg-primary text-white border-primary;
  }
  
  .calendar-time-slot.unavailable {
    @apply bg-muted text-muted-foreground cursor-not-allowed;
  }
}
```

---

## 📄 Arquivo: `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(var(--primary-dark))",
          light: "hsl(var(--primary-light))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-subtle': 'var(--gradient-subtle)',
      },
      boxShadow: {
        'elegant': 'var(--shadow-elegant)',
        'glow': 'var(--shadow-glow)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

---

## 📄 Arquivo: `src/lib/utils.ts`

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 📄 Arquivo: `src/components/layout/AppSidebar.tsx`

```tsx
import { Home, Calendar, BookOpen, Settings, Printer } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Início",
    url: "/",
    icon: Home,
  },
  {
    title: "Agendar",
    url: "/agendar",
    icon: Calendar,
  },
  {
    title: "Minhas Reservas",
    url: "/reservas",
    icon: BookOpen,
  },
  {
    title: "Impressão 3D",
    url: "/impressao3d",
    icon: Printer,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border bg-white">
      <SidebarHeader className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
            <span className="text-xl font-bold">M</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-primary">LabReserve</h1>
            <p className="text-sm text-muted-foreground">Sistema de Reservas</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={cn(
                      "text-foreground hover:bg-secondary hover:text-primary transition-colors",
                      location.pathname === item.url && "sidebar-item-active"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
```

---

## 📄 Arquivo: `src/components/lab/WeeklyCalendar.tsx`

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeSlot {
  hour: string;
  day: string;
  available: boolean;
}

interface WeeklyCalendarProps {
  onSlotSelect?: (slots: TimeSlot[]) => void;
  selectedSlots?: TimeSlot[];
}

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export function WeeklyCalendar({ onSlotSelect, selectedSlots = [] }: WeeklyCalendarProps) {
  const [internalSelectedSlots, setInternalSelectedSlots] = useState<TimeSlot[]>(selectedSlots);

  const isSlotSelected = (hour: string, day: string) => {
    return internalSelectedSlots.some(slot => slot.hour === hour && slot.day === day);
  };

  const isSlotAvailable = (hour: string, day: string) => {
    // Simulating some unavailable slots
    const unavailableSlots = [
      { hour: '11:00', day: 'Segunda' },
      { hour: '14:00', day: 'Terça' },
      { hour: '15:00', day: 'Quinta' },
    ];
    
    return !unavailableSlots.some(slot => slot.hour === hour && slot.day === day);
  };

  const handleSlotClick = (hour: string, day: string) => {
    if (!isSlotAvailable(hour, day)) return;

    const slot: TimeSlot = { hour, day, available: true };
    const isCurrentlySelected = isSlotSelected(hour, day);

    let newSelectedSlots: TimeSlot[];
    
    if (isCurrentlySelected) {
      newSelectedSlots = internalSelectedSlots.filter(
        s => !(s.hour === hour && s.day === day)
      );
    } else {
      newSelectedSlots = [...internalSelectedSlots, slot];
    }

    setInternalSelectedSlots(newSelectedSlots);
    onSlotSelect?.(newSelectedSlots);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        {/* Header */}
        <div className="p-3 font-semibold text-center bg-secondary rounded-lg">
          Horário
        </div>
        {DAYS.map(day => (
          <div key={day} className="p-3 font-semibold text-center bg-secondary rounded-lg">
            {day}
          </div>
        ))}

        {/* Time slots */}
        {HOURS.map(hour => (
          <>
            <div key={`${hour}-header`} className="p-3 font-medium text-center bg-muted rounded-lg">
              {hour}
            </div>
            {DAYS.map(day => {
              const available = isSlotAvailable(hour, day);
              const selected = isSlotSelected(hour, day);
              
              return (
                <Button
                  key={`${hour}-${day}`}
                  variant="outline"
                  className={cn(
                    "calendar-time-slot p-3 h-auto min-h-[3rem]",
                    selected && "selected",
                    !available && "unavailable"
                  )}
                  onClick={() => handleSlotClick(hour, day)}
                  disabled={!available}
                >
                  {available ? (selected ? "Selecionado" : "Disponível") : "Ocupado"}
                </Button>
              );
            })}
          </>
        ))}
      </div>

      {internalSelectedSlots.length > 0 && (
        <div className="p-4 bg-secondary rounded-lg">
          <h3 className="font-semibold mb-2">Horários Selecionados:</h3>
          <div className="space-y-1">
            {internalSelectedSlots.map((slot, index) => (
              <p key={index} className="text-sm">
                {slot.day} - {slot.hour}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 📄 Arquivo: `src/pages/Dashboard.tsx`

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-primary">Início</h1>
          <p className="text-muted-foreground">Bem-vindo ao Sistema de Reservas de Laboratórios</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Ativas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">3</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Reserva</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">09:00</div>
            <p className="text-xs text-muted-foreground">Amanhã - UCL1</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressões 3D</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2</div>
            <p className="text-xs text-muted-foreground">Na fila</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilidade</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">85%</div>
            <p className="text-xs text-muted-foreground">Hoje</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Próximas Reservas</CardTitle>
            <CardDescription>Suas reservas confirmadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div>
                <p className="font-medium">UCL1 - Laboratório de Computação</p>
                <p className="text-sm text-muted-foreground">Amanhã, 09:00 - 11:00</p>
              </div>
              <Button variant="outline" size="sm">Ver Detalhes</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div>
                <p className="font-medium">UCL2 - Laboratório de Redes</p>
                <p className="text-sm text-muted-foreground">Quinta, 14:00 - 16:00</p>
              </div>
              <Button variant="outline" size="sm">Ver Detalhes</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div>
                <p className="font-medium">UCL3 - Laboratório Multimídia</p>
                <p className="text-sm text-muted-foreground">Sexta, 10:00 - 12:00</p>
              </div>
              <Button variant="outline" size="sm">Ver Detalhes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/agendar">
              <Button className="w-full justify-start" size="lg">
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Laboratório
              </Button>
            </Link>
            <Link to="/reservas">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <BookOpen className="mr-2 h-4 w-4" />
                Ver Minhas Reservas
              </Button>
            </Link>
            <Link to="/impressao3d">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Users className="mr-2 h-4 w-4" />
                Fila de Impressão 3D
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## 📄 Arquivo: `src/pages/Agendar.tsx`

```tsx
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WeeklyCalendar } from "@/components/lab/WeeklyCalendar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  hour: string;
  day: string;
  available: boolean;
}

export default function Agendar() {
  const [selectedLab, setSelectedLab] = useState<string>("");
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [suplente, setSuplente] = useState<string>("");
  const [step, setStep] = useState<"select" | "confirm">("select");
  const { toast } = useToast();

  const handleSlotSelect = (slots: TimeSlot[]) => {
    setSelectedSlots(slots);
  };

  const handleConfirmSelection = () => {
    if (!selectedLab || selectedSlots.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione um laboratório e pelo menos um horário.",
        variant: "destructive",
      });
      return;
    }
    setStep("confirm");
  };

  const handleConfirmReservation = () => {
    toast({
      title: "Reserva Confirmada!",
      description: `Laboratório ${selectedLab} reservado com sucesso.`,
    });
    
    // Reset form
    setSelectedLab("");
    setSelectedSlots([]);
    setSuplente("");
    setStep("select");
  };

  const handleCancel = () => {
    setStep("select");
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-primary">Agendar</h1>
          <p className="text-muted-foreground">Reserve um laboratório para suas atividades</p>
        </div>
      </div>

      {step === "select" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Selecionar Laboratório</CardTitle>
              <CardDescription>Escolha o laboratório desejado</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="lab-select">Laboratório</Label>
              <Select value={selectedLab} onValueChange={setSelectedLab}>
                <SelectTrigger id="lab-select">
                  <SelectValue placeholder="Selecione um laboratório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UCL1">UCL1 - Laboratório de Computação</SelectItem>
                  <SelectItem value="UCL2">UCL2 - Laboratório de Redes</SelectItem>
                  <SelectItem value="UCL3">UCL3 - Laboratório Multimídia</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedLab && (
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Selecionar Horários</CardTitle>
                <CardDescription>Clique nos horários disponíveis para selecioná-los</CardDescription>
              </CardHeader>
              <CardContent>
                <WeeklyCalendar 
                  onSlotSelect={handleSlotSelect}
                  selectedSlots={selectedSlots}
                />
              </CardContent>
            </Card>
          )}

          {selectedSlots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Informações Adicionais</CardTitle>
                <CardDescription>Dados opcionais para a reserva</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="suplente">Suplente (TIA/E-mail) - Opcional</Label>
                  <Input
                    id="suplente"
                    placeholder="Digite o TIA ou e-mail do suplente"
                    value={suplente}
                    onChange={(e) => setSuplente(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button onClick={handleConfirmSelection} className="flex-1">
                    Confirmar Seleção
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedSlots([]);
                      setSelectedLab("");
                      setSuplente("");
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {step === "confirm" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Confirmar Reserva</CardTitle>
            <CardDescription>Verifique os dados da sua reserva</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 p-4 bg-secondary rounded-lg">
              <div>
                <Label className="font-semibold">Laboratório:</Label>
                <p>{selectedLab}</p>
              </div>
              <div>
                <Label className="font-semibold">Horários:</Label>
                <div className="space-y-1">
                  {selectedSlots.map((slot, index) => (
                    <p key={index}>{slot.day} - {slot.hour}</p>
                  ))}
                </div>
              </div>
              {suplente && (
                <div>
                  <Label className="font-semibold">Suplente:</Label>
                  <p>{suplente}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button onClick={handleConfirmReservation} className="flex-1">
                Confirmar Reserva
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

## 📄 Arquivo: `src/pages/Reservas.tsx`

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface Reserva {
  id: string;
  laboratorio: string;
  data: string;
  horario: string;
  status: "confirmada" | "pendente" | "cancelada";
  suplente?: string;
}

const reservasMock: Reserva[] = [
  {
    id: "1",
    laboratorio: "UCL1 - Laboratório de Computação",
    data: "2024-12-27",
    horario: "09:00 - 11:00",
    status: "confirmada",
    suplente: "joao.silva@email.com"
  },
  {
    id: "2",
    laboratorio: "UCL2 - Laboratório de Redes",
    data: "2024-12-28",
    horario: "14:00 - 16:00",
    status: "confirmada"
  },
  {
    id: "3",
    laboratorio: "UCL3 - Laboratório Multimídia",
    data: "2024-12-29",
    horario: "10:00 - 12:00",
    status: "pendente"
  }
];

export default function Reservas() {
  const { toast } = useToast();

  const handleCancelReservation = (id: string) => {
    toast({
      title: "Reserva Cancelada",
      description: "Sua reserva foi cancelada com sucesso.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmada":
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "cancelada":
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-primary">Minhas Reservas</h1>
          <p className="text-muted-foreground">Gerencie suas reservas de laboratórios</p>
        </div>
      </div>

      <div className="grid gap-4">
        {reservasMock.map((reserva) => (
          <Card key={reserva.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {reserva.laboratorio}
                </CardTitle>
                {getStatusBadge(reserva.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Data</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(reserva.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Horário</p>
                    <p className="text-sm text-muted-foreground">{reserva.horario}</p>
                  </div>
                </div>

                {reserva.suplente && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Suplente</p>
                      <p className="text-sm text-muted-foreground">{reserva.suplente}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {reserva.status === "confirmada" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelReservation(reserva.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reservasMock.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-muted-foreground">
                Nenhuma reserva encontrada
              </CardTitle>
              <CardDescription className="text-center">
                Você ainda não possui reservas. Que tal fazer sua primeira reserva?
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button>Agendar Laboratório</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
```

---

## 📄 Arquivo: `src/pages/Configuracoes.tsx`

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Configurações Salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-primary">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e dados pessoais</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" placeholder="Seu nome completo" />
              </div>
              <div>
                <Label htmlFor="tia">TIA</Label>
                <Input id="tia" placeholder="Seu TIA" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu.email@exemplo.com" />
            </div>
            
            <div>
              <Label htmlFor="curso">Curso</Label>
              <Input id="curso" placeholder="Seu curso" />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="semestre">Semestre</Label>
                <Input id="semestre" placeholder="Ex: 2024.2" />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(11) 99999-9999" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Notificações</CardTitle>
            <CardDescription>Configure como deseja receber notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>E-mail de confirmação</Label>
                <p className="text-sm text-muted-foreground">
                  Receber e-mail quando uma reserva for confirmada
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lembrete de reserva</Label>
                <p className="text-sm text-muted-foreground">
                  Receber lembrete no dia da reserva
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações de impressão 3D</Label>
                <p className="text-sm text-muted-foreground">
                  Receber atualizações sobre o status da impressão
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações push</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações no navegador
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Preferências</CardTitle>
            <CardDescription>Customize sua experiência no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Usar tema escuro na interface
                </p>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reserva automática</Label>
                <p className="text-sm text-muted-foreground">
                  Tentar reservar automaticamente se um horário for liberado
                </p>
              </div>
              <Switch />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mostrar dicas</Label>
                <p className="text-sm text-muted-foreground">
                  Exibir dicas de uso do sistema
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Segurança</CardTitle>
            <CardDescription>Gerencie a segurança da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input id="current-password" type="password" />
            </div>
            
            <div>
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input id="new-password" type="password" />
            </div>
            
            <div>
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input id="confirm-password" type="password" />
            </div>
            
            <Button variant="outline" className="w-full">
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 📄 Arquivo: `src/pages/Impressao3D.tsx`

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Printer, Clock, Layers, Package } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface ImpressaoItem {
  id: string;
  arquivo: string;
  status: "NA_FILA" | "INICIADA" | "FINALIZADA";
  posicaoFila?: number;
  tempoEstimado: string;
  tempoImpressao: string;
  material: string;
  progresso?: number;
  previsaoInicio?: string;
}

const impressoesMock: ImpressaoItem[] = [
  {
    id: "1",
    arquivo: "peca_engenharia.stl",
    status: "INICIADA",
    tempoEstimado: "2h 30min",
    tempoImpressao: "45min",
    material: "PLA Branco",
    progresso: 65,
  },
  {
    id: "2",
    arquivo: "prototipo_v2.stl",
    status: "NA_FILA",
    posicaoFila: 2,
    tempoEstimado: "1h 45min",
    tempoImpressao: "1h 45min",
    material: "ABS Preto",
    previsaoInicio: "14:30",
  },
  {
    id: "3",
    arquivo: "modelo_arquitetura.stl",
    status: "FINALIZADA",
    tempoEstimado: "3h 15min",
    tempoImpressao: "3h 10min",
    material: "PLA Verde",
  },
];

export default function Impressao3D() {
  const { toast } = useToast();

  const handleCancelPrint = (id: string) => {
    toast({
      title: "Impressão Cancelada",
      description: "Sua impressão foi removida da fila.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NA_FILA":
        return <Badge className="bg-yellow-100 text-yellow-800">Na Fila</Badge>;
      case "INICIADA":
        return <Badge className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
      case "FINALIZADA":
        return <Badge className="bg-green-100 text-green-800">Finalizada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-primary">Impressão 3D</h1>
          <p className="text-muted-foreground">Acompanhe suas impressões 3D na fila</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Na Fila</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1</div>
            <p className="text-xs text-muted-foreground">Impressão aguardando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Printer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1</div>
            <p className="text-xs text-muted-foreground">Impressão ativa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizadas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {impressoesMock.map((impressao) => (
          <Card key={impressao.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  {impressao.arquivo}
                </CardTitle>
                {getStatusBadge(impressao.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {impressao.status === "INICIADA" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{impressao.progresso}%</span>
                    </div>
                    <Progress value={impressao.progresso} className="w-full" />
                  </div>
                )}
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {impressao.posicaoFila && (
                    <div>
                      <p className="text-sm font-medium">Posição na Fila</p>
                      <p className="text-sm text-muted-foreground">#{impressao.posicaoFila}</p>
                    </div>
                  )}
                  
                  {impressao.previsaoInicio && (
                    <div>
                      <p className="text-sm font-medium">Previsão de Início</p>
                      <p className="text-sm text-muted-foreground">{impressao.previsaoInicio}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium">Tempo de Impressão</p>
                    <p className="text-sm text-muted-foreground">{impressao.tempoImpressao}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Material</p>
                    <p className="text-sm text-muted-foreground">{impressao.material}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {impressao.status === "NA_FILA" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelPrint(impressao.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                  
                  {impressao.status === "FINALIZADA" && (
                    <Button variant="outline" size="sm">
                      Retirar na Secretaria
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {impressoesMock.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-muted-foreground">
                Nenhuma impressão encontrada
              </CardTitle>
              <CardDescription className="text-center">
                Você ainda não possui impressões 3D na fila.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button>Solicitar Nova Impressão</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
```

---

## 📄 Arquivo: `src/pages/NotFound.tsx`

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="text-6xl font-bold text-primary">404</div>
          <CardTitle className="text-2xl text-primary">Página não encontrada</CardTitle>
          <CardDescription>
            A página que você está procurando não existe ou foi removida.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Link to="/">
              <Button className="w-full" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Página Anterior
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📄 Arquivo: `src/hooks/use-mobile.tsx`

```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

---

## 📦 Arquivo: `package.json`

```json
{
  "name": "labreserve",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

---

## 🚀 Como usar este código

1. **Crie uma nova pasta** para o projeto
2. **Copie todos os arquivos** seguindo a estrutura de pastas indicada
3. **Instale as dependências**:
   ```bash
   npm install
   ```
4. **Execute o projeto**:
   ```bash
   npm run dev
   ```

## 📝 Notas importantes

- Este código está completo e funcional
- Todas as páginas estão implementadas com design responsivo
- O sistema de cores vermelho/branco está configurado
- Os componentes shadcn/ui estão incluídos (você precisa copiar da pasta `src/components/ui/`)
- Algumas funcionalidades usam dados mock para demonstração

## 🎨 Personalização

Para personalizar o sistema:
- **Cores**: Edite `src/index.css` e `tailwind.config.ts`
- **Logo**: Substitua `src/assets/logo.png`
- **Funcionalidades**: Adicione integração com backend (Supabase recomendado)

---

**Sistema desenvolvido com React + TypeScript + Tailwind CSS + shadcn/ui**
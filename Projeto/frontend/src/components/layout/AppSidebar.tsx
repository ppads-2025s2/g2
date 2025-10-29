import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Settings,
  Menu,
  Printer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import logoImage from "@/assets/logo.png"

const menuItems = [
  { title: "Início", url: "/", icon: Home },
  { title: "Agendar", url: "/agendar", icon: Calendar },
  { title: "Minhas Reservas", url: "/reservas", icon: BookOpen },
  { title: "Impressão 3D", url: "/impressao3d", icon: Printer },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
]

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const location = useLocation()
  
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-primary-foreground hover:bg-primary-hover shadow-medium"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-lab-sidebar transition-transform duration-300 ease-in-out w-64",
        "md:translate-x-0",
        isCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
      )}>
        {/* Logo Section */}
        <div className="flex items-center justify-center p-6 border-b border-white/20">
          <img src={logoImage} alt="LabReserve Logo" className="w-12 h-12 rounded-full object-cover" />
          <span className="ml-3 text-white font-semibold text-lg">LabReserve</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.url}>
                <NavLink
                  to={item.url}
                  className={({ isActive: navIsActive }) => cn(
                    "flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                    "text-white hover:bg-white/10",
                    (navIsActive || isActive(item.url)) && "bg-white/20 shadow-soft"
                  )}
                  onClick={() => setIsCollapsed(true)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center text-white">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Usuário</p>
              <p className="text-xs opacity-75">estudante@uni.br</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
}
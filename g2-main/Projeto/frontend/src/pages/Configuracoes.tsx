import { useState } from "react"
import { User, Mail, Bell, Shield, Save, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Configuracoes() {
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    // Personal Info
    name: "João Silva",
    email: "joao.silva@uni.br",
    tia: "12345678",
    semester: "8º",
    course: "Ciência da Computação",
    
    // Notification Settings
    emailNotifications: true,
    reminderNotifications: true,
    queueNotifications: true,
    cancelationNotifications: true,
    
    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      alert("Perfil atualizado com sucesso!")
    }, 1000)
  }

  const handleChangePassword = async () => {
    if (settings.newPassword !== settings.confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }
    
    if (settings.newPassword.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres!")
      return
    }

    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSettings(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }))
      alert("Senha alterada com sucesso!")
    }, 1000)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais, notificações e configurações de segurança
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Suas informações acadêmicas e de contato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => handleSettingChange("name", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Institucional</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange("email", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="tia">TIA</Label>
              <Input
                id="tia"
                value={settings.tia}
                disabled
                className="mt-2 bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">O TIA não pode ser alterado</p>
            </div>
            <div>
              <Label htmlFor="semester">Semestre</Label>
              <Input
                id="semester"
                value={settings.semester}
                onChange={(e) => handleSettingChange("semester", e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="course">Curso</Label>
              <Input
                id="course"
                value={settings.course}
                onChange={(e) => handleSettingChange("course", e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="bg-primary hover:bg-primary-hover"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure quando e como você deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Confirmação de Reserva</h4>
                <p className="text-sm text-muted-foreground">
                  Receber email quando uma reserva for confirmada
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Lembretes</h4>
                <p className="text-sm text-muted-foreground">
                  Receber lembrete no dia da reserva
                </p>
              </div>
              <Switch
                checked={settings.reminderNotifications}
                onCheckedChange={(checked) => handleSettingChange("reminderNotifications", checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Fila de Impressão 3D</h4>
                <p className="text-sm text-muted-foreground">
                  Receber atualizações sobre status da impressão
                </p>
              </div>
              <Switch
                checked={settings.queueNotifications}
                onCheckedChange={(checked) => handleSettingChange("queueNotifications", checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Cancelamentos</h4>
                <p className="text-sm text-muted-foreground">
                  Receber notificações sobre cancelamentos
                </p>
              </div>
              <Switch
                checked={settings.cancelationNotifications}
                onCheckedChange={(checked) => handleSettingChange("cancelationNotifications", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            Segurança
          </CardTitle>
          <CardDescription>
            Altere sua senha para manter sua conta segura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Para alterar sua senha, preencha todos os campos abaixo. A nova senha deve ter pelo menos 6 caracteres.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Senha Atual</Label>
              <div className="relative mt-2">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  value={settings.currentPassword}
                  onChange={(e) => handleSettingChange("currentPassword", e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={settings.newPassword}
                onChange={(e) => handleSettingChange("newPassword", e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={settings.confirmPassword}
                onChange={(e) => handleSettingChange("confirmPassword", e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleChangePassword}
            disabled={isSaving || !settings.currentPassword || !settings.newPassword || !settings.confirmPassword}
            className="bg-primary hover:bg-primary-hover"
          >
            <Shield className="h-4 w-4 mr-2" />
            {isSaving ? "Alterando..." : "Alterar Senha"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
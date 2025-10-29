import { useState } from "react"
import { Clock, FileText, Printer, AlertCircle, Upload, Trash2, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface PrintJob {
  id: string
  filename: string
  status: "NA_FILA" | "INICIADA" | "FINALIZADA" | "CANCELADA"
  position: number
  estimatedStart: string
  printTime: string
  material: string
  uploadedAt: string
  startedAt?: string
  finishedAt?: string
  progress?: number
}

export default function Impressao3D() {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([
    {
      id: "p1",
      filename: "projeto_final.stl",
      status: "NA_FILA",
      position: 1,
      estimatedStart: "14:30",
      printTime: "2h 15min",
      material: "PLA Branco",
      uploadedAt: "2024-01-15T09:30:00Z"
    },
    {
      id: "p2",
      filename: "prototipo_v2.stl",
      status: "INICIADA",
      position: 0,
      estimatedStart: "12:00",
      printTime: "3h 45min",
      material: "ABS Preto",
      uploadedAt: "2024-01-15T08:15:00Z",
      startedAt: "2024-01-15T12:00:00Z",
      progress: 65
    },
    {
      id: "p3",
      filename: "engrenagem.stl",
      status: "FINALIZADA",
      position: 0,
      estimatedStart: "08:00",
      printTime: "1h 30min",
      material: "PETG Transparente",
      uploadedAt: "2024-01-14T16:45:00Z",
      startedAt: "2024-01-15T08:00:00Z",
      finishedAt: "2024-01-15T09:30:00Z"
    }
  ])

  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [newFile, setNewFile] = useState<File | null>(null)

  const materials = [
    "PLA Branco",
    "PLA Preto", 
    "PLA Vermelho",
    "ABS Branco",
    "ABS Preto",
    "PETG Transparente"
  ]

  const getStatusBadge = (status: PrintJob["status"], progress?: number) => {
    const configs = {
      "NA_FILA": { color: "bg-primary", icon: Clock, label: "Na Fila" },
      "INICIADA": { color: "bg-blue-500", icon: Printer, label: progress ? `${progress}%` : "Em Impressão" },
      "FINALIZADA": { color: "bg-green-500", icon: Eye, label: "Pronta para Retirada" },
      "CANCELADA": { color: "bg-red-500", icon: Trash2, label: "Cancelada" }
    }

    const config = configs[status]
    const Icon = config.icon

    return (
      <Badge className={cn(config.color, "text-white flex items-center gap-1")}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const handleCancelJob = (jobId: string) => {
    setPrintJobs(prev => 
      prev.map(job => 
        job.id === jobId && job.status === "NA_FILA"
          ? { ...job, status: "CANCELADA" as const }
          : job
      )
    )
    alert("Trabalho cancelado com sucesso!")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewFile(file)
    }
  }

  const handleSubmitJob = () => {
    if (!newFile || !selectedMaterial) {
      alert("Por favor, selecione um arquivo e um material.")
      return
    }

    const newJob: PrintJob = {
      id: `p${Date.now()}`,
      filename: newFile.name,
      status: "NA_FILA",
      position: printJobs.filter(j => j.status === "NA_FILA").length + 1,
      estimatedStart: "16:45", // Calculate based on queue
      printTime: "Estimando...",
      material: selectedMaterial,
      uploadedAt: new Date().toISOString()
    }

    setPrintJobs(prev => [...prev, newJob])
    setNewFile(null)
    setSelectedMaterial("")
    alert("Arquivo enviado para a fila de impressão!")
  }

  const queueJobs = printJobs.filter(job => job.status === "NA_FILA")
  const activeJobs = printJobs.filter(job => job.status === "INICIADA")
  const completedJobs = printJobs.filter(job => job.status === "FINALIZADA" || job.status === "CANCELADA")

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Impressão 3D</h1>
        <p className="text-muted-foreground">
          Gerencie seus trabalhos de impressão 3D e acompanhe o status da fila
        </p>
      </div>

      {/* Upload New Job */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Upload className="h-5 w-5" />
            Novo Trabalho de Impressão
          </CardTitle>
          <CardDescription>
            Envie seu arquivo STL para a fila de impressão
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="file-upload">Arquivo STL</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".stl"
                onChange={handleFileUpload}
                className="mt-2"
              />
              {newFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Arquivo selecionado: {newFile.name}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="material">Material</Label>
              <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione o material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material} value={material}>
                      {material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Arquivos devem ter no máximo 100MB. Tempo de impressão será calculado automaticamente após o upload.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleSubmitJob}
            disabled={!newFile || !selectedMaterial}
            className="bg-primary hover:bg-primary-hover w-full md:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Enviar para Fila
          </Button>
        </CardContent>
      </Card>

      {/* Active Print */}
      {activeJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Printer className="h-5 w-5" />
              Impressão em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeJobs.map((job) => (
              <div key={job.id} className="border border-border rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Printer className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{job.filename}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <span>Material: {job.material}</span>
                        <span>Tempo: {job.printTime}</span>
                        <span>Iniciada: {job.startedAt ? new Date(job.startedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(job.status, job.progress)}
                </div>
                
                {job.progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso da Impressão</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            Fila de Impressão ({queueJobs.length})
          </CardTitle>
          <CardDescription>
            Seus trabalhos aguardando impressão
          </CardDescription>
        </CardHeader>
        <CardContent>
          {queueJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum trabalho na fila</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queueJobs.map((job, index) => (
                <div key={job.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-soft transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                      <span className="font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{job.filename}</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <span>Início estimado: {job.estimatedStart}</span>
                        <span>Tempo: {job.printTime}</span>
                        <span>Material: {job.material}</span>
                        <span>Enviado: {new Date(job.uploadedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(job.status)}
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelJob(job.id)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-5 w-5" />
              Histórico ({completedJobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border border-border rounded-lg opacity-75 hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      job.status === "FINALIZADA" ? "bg-green-100" : "bg-red-100"
                    )}>
                      <FileText className={cn(
                        "h-6 w-6",
                        job.status === "FINALIZADA" ? "text-green-600" : "text-red-600"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium">{job.filename}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Material: {job.material}</span>
                        {job.finishedAt && (
                          <span>Finalizada: {new Date(job.finishedAt).toLocaleString('pt-BR')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(job.status)}
                    {job.status === "FINALIZADA" && (
                      <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                        Detalhes
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
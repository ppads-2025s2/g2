import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-12 w-12 text-primary" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Página não encontrada</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            A página que você está procurando não existe ou foi movida para outro local.
          </p>
        </div>
        <div className="space-y-4">
          <Button 
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
            asChild
          >
            <a href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Início
            </a>
          </Button>
          <div className="text-sm text-muted-foreground">
            Ou navegue usando o menu lateral
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

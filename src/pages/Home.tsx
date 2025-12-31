import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Pequeño delay para asegurar que el estado se haya propagado
      const timer = setTimeout(() => {
        setLocation("/dashboard");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    </div>
  );
}

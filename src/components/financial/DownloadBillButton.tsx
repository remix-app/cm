import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DownloadBillButtonProps {
  commonExpenseId: number;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function DownloadBillButton({ 
  commonExpenseId, 
  variant = "outline", 
  size = "sm",
  className 
}: DownloadBillButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const downloadMutation = trpc.financial.getBillPdf.useMutation({
    onSuccess: (data) => {
      try {
        // Convertir Base64 a Blob
        const byteCharacters = atob(data.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Crear link de descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", data.fileName);
        document.body.appendChild(link);
        link.click();
        
        // Limpieza
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success("Boleta descargada correctamente");
      } catch (error) {
        console.error("Error al procesar el PDF:", error);
        toast.error("Error al generar el archivo de descarga");
      } finally {
        setIsDownloading(false);
      }
    },
    onError: (error) => {
      setIsDownloading(false);
      toast.error(`Error: ${error.message}`);
    }
  });

  const handleDownload = async () => {
    setIsDownloading(true);
    downloadMutation.mutate({ commonExpenseId });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-4 w-4" />
          Descargar Boleta
        </>
      )}
    </Button>
  );
}

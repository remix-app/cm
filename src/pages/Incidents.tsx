import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertCircle, CheckCircle2, Clock, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Incidents() {
  const { t } = useTranslation();
  const { data: incidents, isLoading } = trpc.services.getIncidents.useQuery();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": 
        return <Badge variant="destructive" className="flex w-fit items-center gap-1"><AlertCircle className="h-3 w-3" />{t("open", "Abierto")}</Badge>;
      case "in_progress": 
        return <Badge variant="default" className="flex w-fit items-center gap-1 bg-blue-500"><Clock className="h-3 w-3" />{t("in_progress", "En curso")}</Badge>;
      case "resolved": 
        return <Badge variant="default" className="flex w-fit items-center gap-1 bg-emerald-500"><CheckCircle2 className="h-3 w-3" />{t("resolved", "Resuelto")}</Badge>;
      case "closed": 
        return <Badge variant="secondary">{t("closed", "Cerrado")}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent": return <Badge variant="destructive">{t("urgent", "Urgente")}</Badge>;
      case "high": return <Badge className="bg-orange-500">{t("high", "Alta")}</Badge>;
      case "medium": return <Badge className="bg-yellow-500">{t("medium", "Media")}</Badge>;
      case "low": return <Badge variant="secondary">{t("low", "Baja")}</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">{t("incidents", "Reporte de Incidentes")}</h1>
          <Button onClick={() => toast.info("Funcionalidad de reporte en desarrollo")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("new_incident", "Nuevo Reporte")}
          </Button>
        </div>
        
        <div className="grid gap-4">
          {isLoading ? (
            [1, 2].map((i) => (
              <Card key={i} className="animate-pulse h-32" />
            ))
          ) : incidents && incidents.length > 0 ? (
            incidents.map((incident) => (
              <Card key={incident.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                      <CardDescription>
                        {t("reported_on", "Reportado el")} {format(new Date(incident.createdAt), "PPP", { locale: es })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getPriorityBadge(incident.priority)}
                      {getStatusBadge(incident.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{incident.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{t("category", "Categoría")}: {incident.category}</span>
                    {incident.resolvedAt && (
                      <span>{t("resolved_on", "Resuelto el")} {format(new Date(incident.resolvedAt), "PPP", { locale: es })}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                {t("no_incidents", "No hay incidentes reportados.")}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Visits() {
  const { t } = useTranslation();
  const { data: visits, isLoading } = trpc.services.getVisits.useQuery();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled": return <Badge variant="outline">{t("scheduled", "Programada")}</Badge>;
      case "checked_in": return <Badge variant="default">{t("checked_in", "En curso")}</Badge>;
      case "checked_out": return <Badge variant="secondary">{t("checked_out", "Finalizada")}</Badge>;
      case "cancelled": return <Badge variant="destructive">{t("cancelled", "Cancelada")}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("visits", "Registro de Visitas")}</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("recent_visits", "Visitas Recientes")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 w-full bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : visits && visits.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("visitor", "Visitante")}</TableHead>
                    <TableHead>{t("date", "Fecha")}</TableHead>
                    <TableHead>{t("status", "Estado")}</TableHead>
                    <TableHead>{t("notes", "Notas")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">{visit.visitorName}</TableCell>
                      <TableCell>
                        {format(new Date(visit.visitDate), "PPP p", { locale: es })}
                      </TableCell>
                      <TableCell>{getStatusBadge(visit.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{visit.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                {t("no_visits", "No hay registros de visitas.")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

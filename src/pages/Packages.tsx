import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Package as PackageIcon, CheckCircle2, Clock } from "lucide-react";

export default function Packages() {
  const { t } = useTranslation();
  const { data: packages, isLoading } = trpc.services.getPackages.useQuery();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": 
        return (
          <Badge variant="outline" className="flex w-fit items-center gap-1 text-amber-600 border-amber-200 bg-amber-50">
            <Clock className="h-3 w-3" />
            {t("pending", "Pendiente")}
          </Badge>
        );
      case "picked_up": 
        return (
          <Badge variant="outline" className="flex w-fit items-center gap-1 text-emerald-600 border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="h-3 w-3" />
            {t("picked_up", "Retirado")}
          </Badge>
        );
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("packages", "Encomiendas")}</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageIcon className="h-5 w-5" />
              {t("recent_packages", "Encomiendas Recientes")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 w-full bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : packages && packages.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("carrier", "Transporte")}</TableHead>
                    <TableHead>{t("tracking", "Seguimiento")}</TableHead>
                    <TableHead>{t("received_at", "Recibido")}</TableHead>
                    <TableHead>{t("status", "Estado")}</TableHead>
                    <TableHead>{t("picked_up_at", "Retirado el")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.carrier || t("unknown", "Desconocido")}</TableCell>
                      <TableCell>{pkg.trackingNumber || "-"}</TableCell>
                      <TableCell>
                        {format(new Date(pkg.receivedAt), "PPP p", { locale: es })}
                      </TableCell>
                      <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                      <TableCell>
                        {pkg.pickedUpAt ? format(new Date(pkg.pickedUpAt), "PPP p", { locale: es }) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                {t("no_packages", "No hay encomiendas registradas.")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

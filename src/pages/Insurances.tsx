import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { Shield, Calendar, Building2, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Insurances() {
  const { t } = useTranslation();
  const { data: insurances, isLoading } = trpc.services.getInsurances.useQuery();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge variant="default" className="bg-emerald-500">{t("active", "Vigente")}</Badge>;
      case "expired": return <Badge variant="destructive">{t("expired", "Vencido")}</Badge>;
      case "cancelled": return <Badge variant="secondary">{t("cancelled", "Cancelado")}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("insurances", "Gestión de Seguros")}</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            [1, 2].map((i) => (
              <Card key={i} className="animate-pulse h-48" />
            ))
          ) : insurances && insurances.length > 0 ? (
            insurances.map((insurance) => (
              <Card key={insurance.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{insurance.type}</CardTitle>
                    </div>
                    {getStatusBadge(insurance.status)}
                  </div>
                  <CardDescription>{insurance.provider}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{t("policy", "Póliza")}: {insurance.policyNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{t("premium", "Prima")}: ${Number(insurance.premium).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(insurance.startDate), "PP", { locale: es })} - {format(new Date(insurance.endDate), "PP", { locale: es })}
                      </span>
                    </div>
                  </div>
                  {insurance.coverage && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground line-clamp-2">{insurance.coverage}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2">
              <CardContent className="py-10 text-center text-muted-foreground">
                {t("no_insurances", "No hay pólizas de seguro registradas.")}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { AlertTriangle, TrendingUp, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Delinquency() {
  const { t } = useTranslation();
  const { data: ranking, isLoading } = trpc.reports.getDelinquencyRanking.useQuery();
  
  const exportMutation = trpc.reports.exportDelinquencyReport.useMutation({
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${data.pdfBase64}`;
      link.download = data.fileName;
      link.click();
      toast.success(t("report_exported", "Reporte exportado con éxito"));
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleExport = () => {
    exportMutation.mutate();
  };

  const totalDebt = ranking?.reduce((acc, curr) => acc + Number(curr.totalDebt), 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">{t("delinquency_report", "Reporte de Morosidad")}</h1>
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            <FileDown className="mr-2 h-4 w-4" />
            {t("export_pdf", "Exportar PDF")}
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("total_overdue", "Total Deuda Vencida")}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalDebt.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {ranking?.length || 0} {t("properties_in_debt", "propiedades con deuda")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("delinquency_rate", "Tasa de Morosidad")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% {t("from_last_month", "respecto al mes anterior")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("delinquency_ranking", "Ranking de Morosidad")}</CardTitle>
            <CardDescription>{t("ranking_description", "Propiedades con pagos pendientes fuera de plazo.")}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 w-full bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : ranking && ranking.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("unit", "Unidad")}</TableHead>
                    <TableHead>{t("owner", "Propietario")}</TableHead>
                    <TableHead className="text-right">{t("debt_amount", "Monto Adeudado")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.unitNumber}</TableCell>
                      <TableCell>{item.ownerName}</TableCell>
                      <TableCell className="text-right font-bold text-destructive">
                        ${Number(item.totalDebt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                {t("no_delinquency", "No hay propiedades morosas registradas.")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

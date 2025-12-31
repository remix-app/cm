import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { Wallet, ShieldCheck, Construction, AlertCircle } from "lucide-react";

export default function Funds() {
  const { t } = useTranslation();

  const funds = [
    {
      name: t("reserve_fund", "Fondo de Reserva"),
      balance: 15420500,
      target: 20000000,
      icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
      description: t("reserve_fund_desc", "Fondo destinado a emergencias y reparaciones mayores.")
    },
    {
      name: t("maintenance_fund", "Fondo de Mantenimiento"),
      balance: 4250000,
      target: 5000000,
      icon: <Construction className="h-5 w-5 text-blue-500" />,
      description: t("maintenance_fund_desc", "Fondo para el mantenimiento preventivo de áreas comunes.")
    },
    {
      name: t("operational_fund", "Fondo Operacional"),
      balance: 2100000,
      target: 3000000,
      icon: <Wallet className="h-5 w-5 text-amber-500" />,
      description: t("operational_fund_desc", "Fondo para gastos operativos del mes en curso.")
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("funds_management", "Gestión de Fondos")}</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          {funds.map((fund, index) => {
            const percentage = (fund.balance / fund.target) * 100;
            return (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{fund.name}</CardTitle>
                    {fund.icon}
                  </div>
                  <CardDescription>{fund.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="text-2xl font-bold">${fund.balance.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {t("target", "Meta")}: ${fund.target.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress value={percentage} className="h-2" />
                    <div className="text-right text-xs font-medium">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <CardTitle>{t("fund_movements", "Movimientos Recientes")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="py-10 text-center text-muted-foreground">
              {t("no_movements", "No hay movimientos recientes en los fondos.")}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

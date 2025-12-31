import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Property() {
  const [, setLocation] = useLocation();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propiedad</h1>
          <p className="text-muted-foreground">
            Información y gestión de tu propiedad
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setLocation("/payments")}>
            <CardHeader>
              <CardTitle>Cartola</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Historial de pagos y estado de cuenta
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setLocation("/expenses")}>
            <CardHeader>
              <CardTitle>Detalle del gasto común</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Desglose mensual de gastos comunes
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setLocation("/packages")}>
            <CardHeader>
              <CardTitle>Encomiendas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gestión de paquetes y encomiendas
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setLocation("/visits")}>
            <CardHeader>
              <CardTitle>Visitas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Registro y autorización de visitas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

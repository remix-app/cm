import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DownloadBillButton } from "@/components/financial/DownloadBillButton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2 } from "lucide-react";

export default function Payments() {
  const { data: payments, isLoading } = trpc.financial.getPaymentHistory.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Historial de Pagos</h1>
        <Card>
          <CardHeader>
            <CardTitle>Cartola de Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !payments || payments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No se encontraron registros de pagos.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {payment.paidAt ? format(new Date(payment.paidAt), "dd MMM yyyy", { locale: es }) : "-"}
                      </TableCell>
                      <TableCell className="capitalize">
                        {format(new Date(payment.period), "MMMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                          {payment.status === "completed" ? "Completado" : payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${Number(payment.amount).toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DownloadBillButton 
                          commonExpenseId={payment.id} 
                          variant="ghost" 
                          size="sm" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

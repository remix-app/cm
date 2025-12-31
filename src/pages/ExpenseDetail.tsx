import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for expense detail
const mockExpenseDetail = {
  period: "Agosto 2025",
  total: 81362,
  dueDate: "12-11-2025",
  items: [
    {
      category: "Egresos",
      description: "Gasto común",
      communityAmount: 12580349,
      myAmount: 81362,
    },
  ],
  charges: [
    {
      description: "Oct25-Seg. Incendio 1de11",
      amount: 0,
    },
  ],
  individualConsumption: 0,
  funds: [
    { name: "Fondo aguinaldo", type: "Fijo", amount: 0 },
    { name: "Cartero", type: "Fijo", amount: 0 },
    { name: "Fondo de reserva", type: "Porcentual", amount: 0 },
  ],
};

const previousMonth = {
  period: "Julio 2025",
  total: 265158,
};

export default function ExpenseDetail() {
  const [, setLocation] = useLocation();
  const [currentPeriod, setCurrentPeriod] = useState("Agosto 2025");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Detalle del gasto común
              </h1>
              <p className="text-muted-foreground">
                Composición detallada de tu gasto común, comparados mes a mes
              </p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            Ir a Historial de pagos
          </Button>
        </div>

        {/* Payment Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Tu total a pagar es de
                </p>
                <div className="text-3xl font-bold">
                  ${mockExpenseDetail.total.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  + Cargo por servicio
                </p>
              </div>
              <Button className="gap-2">Pagar en línea</Button>
            </div>
          </CardContent>
        </Card>

        {/* Month Comparison */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Previous Month */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <CardTitle className="text-lg">{previousMonth.period}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Gasto común: ${previousMonth.total.toLocaleString()}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Descargar boleta
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ítem</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">
                        Monto de la comunidad
                      </TableHead>
                      <TableHead className="text-right">Mi monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Egresos</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right">
                        $12.460.663
                      </TableCell>
                      <TableCell className="text-right">
                        $265.158
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Gasto común</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right">
                        $12.460.663
                      </TableCell>
                      <TableCell className="text-right">
                        $265.158
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Current Month */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div />
                <div className="text-center">
                  <CardTitle className="text-lg">
                    {mockExpenseDetail.period}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Gasto común: ${mockExpenseDetail.total.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Descargar boleta
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ítem</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">
                        Monto de la comunidad
                      </TableHead>
                      <TableHead className="text-right">Mi monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockExpenseDetail.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {item.category}
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          ${item.communityAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.myAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-medium">Cargos</TableCell>
                      <TableCell colSpan={3}></TableCell>
                    </TableRow>
                    {mockExpenseDetail.charges.map((charge, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="pl-8">
                          {charge.description}
                        </TableCell>
                        <TableCell colSpan={2}></TableCell>
                        <TableCell className="text-right">
                          ${charge.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-medium">
                        Consumo individual
                      </TableCell>
                      <TableCell colSpan={2}>-</TableCell>
                      <TableCell className="text-right">
                        ${mockExpenseDetail.individualConsumption.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Fondos</TableCell>
                      <TableCell colSpan={3}></TableCell>
                    </TableRow>
                    {mockExpenseDetail.funds.map((fund, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="pl-8">{fund.name}</TableCell>
                        <TableCell>{fund.type}</TableCell>
                        <TableCell colSpan={2} className="text-right">
                          ${fund.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

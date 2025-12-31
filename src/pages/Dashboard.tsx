import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, FileText, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";

// Mock data for the chart
const expenseData = [
  { month: "Abr", amount: 190300 },
  { month: "May", amount: 265500 },
  { month: "Jun", amount: 380700 },
  { month: "Jul", amount: 190300 },
  { month: "Ago", amount: 265500 },
  { month: "Sep", amount: 95200 },
];

// Mock publications
const recentPublications = [
  {
    id: 1,
    title: "REP- Lista definitiva de dptos que toman seguro de incendios",
    date: "11 Ago 2025",
    category: "Agosto de 2025",
  },
  {
    id: 2,
    title: "Lista de Dptos que toman Seguro colectivo contra Incendio",
    date: "07 Ago 2025",
    category: "Agosto de 2025",
  },
  {
    id: 3,
    title: "Actualización Toma de Seguro de Incendios al 28 de julio",
    date: "28 Jul 2025",
    category: "Julio de 2025",
  },
];

export default function Dashboard() {
  const [totalAmount] = useState(81362);
  const [dueDate] = useState("12-11-2025");
  const maxAmount = Math.max(...expenseData.map(d => d.amount));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inicio</h1>
          <p className="text-muted-foreground">
            Bienvenido a tu panel de gestión de comunidad
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-800 dark:text-yellow-200" />
              <span className="text-yellow-800 dark:text-yellow-200">
                Valida que eres Arrendatario de esta propiedad y alíneate con la ley de copropiedad.
              </span>
              <Button variant="link" className="text-yellow-800 dark:text-yellow-200">
                Ir a validar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tu total a pagar es de</CardTitle>
              <CardDescription>Gasto común Agosto - 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold">${totalAmount.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">+ Cargo por servicio</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Pagar en línea
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Descargar Boleta
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Historial de pagos
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Fecha de Vencimiento: {dueDate}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquare className="h-4 w-4" />
                Enviar mensaje al administrador
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Información para pagar
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                Registrar visita
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Expense Evolution Chart - Simple Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Evolución Gastos Comunes</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-muted-foreground">
                      ${data.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-8 w-full rounded-md bg-muted">
                    <div
                      className="h-full rounded-md bg-primary transition-all"
                      style={{ width: `${(data.amount / maxAmount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">
                Comparar
              </Button>
              <Button variant="outline" size="sm">
                Cartola
              </Button>
              <Button variant="outline" size="sm">
                Ranking de morosidad
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Wall */}
        <Card>
          <CardHeader>
            <CardTitle>Muro de la comunidad</CardTitle>
            <CardDescription>Últimas publicaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPublications.map((pub) => (
                <div
                  key={pub.id}
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <MessageSquare className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{pub.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">{pub.category}</Badge>
                      <span>{pub.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-4">
              Ir a publicaciones →
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

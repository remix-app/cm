import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PaymentGateway() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");

  const initiateMutation = trpc.integrations.initiatePayment.useMutation({
    onSuccess: (data) => {
      setTransactionId(data.transactionId);
      if (data.url) {
        window.open(data.url, "_blank");
      }
      toast.success(t("payment_initiated", "Pago iniciado correctamente"));
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const verifyMutation = trpc.integrations.verifyPayment.useQuery(
    { transactionId },
    { enabled: !!transactionId }
  );

  const handleInitiatePayment = () => {
    if (!amount || !description) {
      toast.error(t("fill_all_fields", "Por favor completa todos los campos"));
      return;
    }

    initiateMutation.mutate({
      amount: parseFloat(amount),
      description,
      orderId: `ORD-${Date.now()}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">{t("payments", "Pagos")}</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t("initiate_payment", "Iniciar Pago")}
            </CardTitle>
            <CardDescription>
              {t("payment_description", "Completa los datos para procesar un pago seguro")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("amount", "Monto")}</label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={initiateMutation.isPending}
                  min="0"
                  step="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("description", "Descripción")}</label>
              <Input
                placeholder={t("payment_concept", "Concepto del pago")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={initiateMutation.isPending}
              />
            </div>

            <Button
              onClick={handleInitiatePayment}
              disabled={initiateMutation.isPending}
              className="w-full"
              size="lg"
            >
              {initiateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-4 w-4" />
              )}
              {t("proceed_payment", "Proceder al Pago")}
            </Button>
          </CardContent>
        </Card>

        {transactionId && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                {t("transaction_initiated", "Transacción Iniciada")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t("transaction_id", "ID de Transacción")}:</p>
                <p className="font-mono text-sm break-all">{transactionId}</p>
              </div>

              {verifyMutation.data && (
                <div className="space-y-2 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">{t("status", "Estado")}:</p>
                  <p className="font-semibold capitalize">{verifyMutation.data.status}</p>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setTransactionId("");
                  setAmount("");
                  setDescription("");
                }}
                className="w-full"
              >
                {t("new_payment", "Nuevo Pago")}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {t("payment_info", "Información de Pago")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>✓ {t("secure_payment", "Pagos seguros con encriptación SSL")}</p>
            <p>✓ {t("multiple_methods", "Múltiples métodos de pago disponibles")}</p>
            <p>✓ {t("instant_confirmation", "Confirmación instantánea de transacciones")}</p>
            <p>✓ {t("refund_support", "Soporte para reembolsos")}</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

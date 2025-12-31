import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { FileText, Upload, ExternalLink, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function Documents() {
  const { t } = useTranslation();
  const { data: documents, isLoading } = trpc.integrations.getDocuments.useQuery();
  const utils = trpc.useUtils();

  const uploadMutation = trpc.integrations.uploadDocument.useMutation({
    onSuccess: () => {
      utils.integrations.getDocuments.invalidate();
      toast.success(t("upload_success", "Documento subido con éxito"));
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({
        name: file.name,
        type: file.type,
        base64: base64,
        category: "general"
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">{t("documents", "Documentos")}</h1>
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploadMutation.isPending}
            />
            <Button asChild disabled={uploadMutation.isPending}>
              <label htmlFor="file-upload" className="cursor-pointer">
                {uploadMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {t("upload_document", "Subir Documento")}
              </label>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("community_documents", "Documentos de la Comunidad")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : documents && documents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name", "Nombre")}</TableHead>
                    <TableHead>{t("category", "Categoría")}</TableHead>
                    <TableHead>{t("date", "Fecha")}</TableHead>
                    <TableHead className="text-right">{t("actions", "Acciones")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {doc.name}
                      </TableCell>
                      <TableCell className="capitalize">{doc.category || "-"}</TableCell>
                      <TableCell>
                        {format(new Date(doc.createdAt), "PPP", { locale: es })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                {t("no_documents", "No hay documentos registrados.")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

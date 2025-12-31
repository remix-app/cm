import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function Votations() {
  const { t } = useTranslation();
  const utils = trpc.useUtils();
  const { data: votations, isLoading } = trpc.communications.getVotations.useQuery();
  const voteMutation = trpc.communications.vote.useMutation({
    onSuccess: () => {
      toast.success(t("vote_success", "Voto registrado con éxito"));
      utils.communications.getVotations.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleVote = (votationId: number, optionId: number) => {
    voteMutation.mutate({ votationId, optionId });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">{t("votations", "Votaciones")}</h1>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-muted" />
                <CardContent className="h-32" />
              </Card>
            ))}
          </div>
        ) : votations && votations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {votations.map((votation) => {
              const totalVotes = votation.options.reduce((acc, opt) => acc + opt.voteCount, 0);
              
              return (
                <Card key={votation.id}>
                  <CardHeader>
                    <CardTitle>{votation.title}</CardTitle>
                    <CardDescription>{votation.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {votation.options.map((option) => {
                      const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
                      return (
                        <div key={option.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{option.optionText}</span>
                            <span className="font-medium">{percentage.toFixed(1)}% ({option.voteCount})</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-1"
                            onClick={() => handleVote(votation.id, option.id)}
                            disabled={voteMutation.isPending}
                          >
                            {t("vote", "Votar")}
                          </Button>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">{t("no_active_votations", "No hay votaciones activas en este momento.")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

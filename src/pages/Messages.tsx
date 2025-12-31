import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Send, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function Messages() {
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState("");
  const utils = trpc.useUtils();
  const { data: messages, isLoading } = trpc.communications.getMessages.useQuery();
  const sendMessageMutation = trpc.communications.sendMessage.useMutation({
    onSuccess: () => {
      setNewMessage("");
      utils.communications.getMessages.invalidate();
      toast.success(t("message_sent", "Mensaje enviado"));
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate({ content: newMessage });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-12rem)] flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">{t("messages", "Mensajería")}</h1>
        
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("admin_chat", "Chat con Administración")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 w-2/3 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col items-end">
                      <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1">
                        {format(new Date(msg.createdAt), "p", { locale: es })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  {t("no_messages", "No hay mensajes anteriores.")}
                </div>
              )}
            </ScrollArea>
            
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                  placeholder={t("type_message", "Escribe un mensaje...")} 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sendMessageMutation.isPending}
                />
                <Button type="submit" disabled={sendMessageMutation.isPending || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

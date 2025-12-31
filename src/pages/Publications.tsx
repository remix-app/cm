import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, Filter, Pin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockPublications = [
  {
    id: 1,
    title: "REP- Lista definitiva de dptos que toman seguro de incendios",
    date: "11 Ago 2025",
    category: "Agosto de 2025",
    isPinned: false,
    content: "Se adjunta lista definitiva de departamentos que tomaron el seguro colectivo contra incendios.",
  },
  {
    id: 2,
    title: "Lista de Dptos que toman Seguro colectivo contra Incendio",
    date: "07 Ago 2025",
    category: "Agosto de 2025",
    isPinned: false,
    content: "Actualización de la lista de departamentos con seguro colectivo.",
  },
  {
    id: 3,
    title: "Actualización Toma de Seguro de Incendios al 28 de julio",
    date: "28 Jul 2025",
    category: "Julio de 2025",
    isPinned: false,
    content: "Información importante sobre seguros individuales según nueva ley.",
  },
];

export default function Publications() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPublications = mockPublications.filter((pub) =>
    pub.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publicaciones</h1>
          <p className="text-muted-foreground">
            Muro de comunicaciones de la comunidad
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Buscar publicaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredPublications.map((pub) => (
            <Card key={pub.id} className="transition-colors hover:bg-muted/50 cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <MessageSquare className="mt-1 h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold">{pub.title}</h3>
                    <p className="text-sm text-muted-foreground">{pub.content}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">{pub.category}</Badge>
                      <span>•</span>
                      <span>{pub.date}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

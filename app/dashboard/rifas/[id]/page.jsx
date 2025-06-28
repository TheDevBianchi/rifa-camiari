"use client";

import { useParams } from "next/navigation";
import { useRaffles } from "@/hooks/useRaffles";
import { useState, useCallback, useEffect, useMemo, memo } from "react";
import { Loader2, Ticket, Edit, Search } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditForm from "@/components/dashboard/forms/EditForm";
import StatsCard from "@/components/dashboard/stats-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TicketGrid from "@/components/rifas/ticket-grid.js"; // Especificar la extensión .js

export default function RaffleDetailsPage() {
  const { id } = useParams();
  const { getRaffleById, unreserveTickets } = useRaffles();
  const [raffle, setRaffle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTicket, setSearchTicket] = useState("");
  const [highlightedTicket, setHighlightedTicket] = useState(null);

  const loadRaffle = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getRaffleById(id);
      setRaffle(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar la rifa");
    } finally {
      setIsLoading(false);
    }
  }, [id, getRaffleById]);

  useEffect(() => {
    loadRaffle();
  }, [loadRaffle]);

  const progress = useMemo(() => {
    if (!raffle) return 0;
    return ((raffle.soldTickets?.length || 0) / raffle.totalTickets) * 100;
  }, [raffle]);

  console.log(raffle?.soldTickets)

  const handleTicketClick = (ticketNumber) => {
    console.log("Ticket clicked:", ticketNumber);
  };

  const handleUnreserveTicket = async (ticketNumber) => {
    try {
      await unreserveTickets(raffle.id, [ticketNumber]);
      toast.success("Ticket liberado exitosamente");
      loadRaffle(); // Reload the raffle data
    } catch (error) {
      toast.error("Error al liberar el ticket");
      console.error(error);
    }
  };

  // Optimizar el manejador de búsqueda
  const handleSearchTicket = useCallback((e) => {
    e?.preventDefault();
    
    const ticketNumber = parseInt(searchTicket, 10);
    if (isNaN(ticketNumber) || ticketNumber < 1 || ticketNumber > raffle?.totalTickets) {
      toast.error("Por favor ingresa un número de ticket válido");
      return;
    }

    // Ajustar el número para que coincida con el índice (0-based)
    const adjustedNumber = ticketNumber;
    setHighlightedTicket(adjustedNumber);
    
    const ticketElement = document.getElementById(`ticket-${adjustedNumber}`);
    if (ticketElement) {
      ticketElement.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
      
      // Resaltar el ticket
      ticketElement.classList.add("ring-4", "ring-primary", "ring-opacity-75");
      const timeoutId = setTimeout(() => {
        ticketElement.classList.remove("ring-4", "ring-primary", "ring-opacity-75");
        setHighlightedTicket(null);
      }, 4000);

      return () => clearTimeout(timeoutId);
    } else {
      toast.error("Ticket no encontrado");
    }
  }, [searchTicket, raffle?.totalTickets]);

  // Memoizar el manejador del cambio del input
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    // Validar que solo se ingresen números
    if (value === '' || /^\d+$/.test(value)) {
      setSearchTicket(value);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando detalles de la rifa...</span>
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Rifa no encontrada</h2>
        <p className="text-gray-400 mb-4">No se pudo cargar la información de la rifa solicitada.</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Agregar el buscador fijo aquí, fuera de las tabs */}
      <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-lg p-3 rounded-lg border border-primary/20 shadow-lg">
        <form 
          onSubmit={handleSearchTicket} 
          className="flex items-center gap-2"
        >
          <div className="flex flex-col">
            <label htmlFor="ticket-search" className="text-xs text-gray-400 mb-1">
              Buscar Ticket
            </label>
            <Input
              id="ticket-search"
              type="number"
              placeholder="Ej: 1234"
              value={searchTicket}
              onChange={handleSearchChange}
              className="w-32 bg-black/40"
              min={1}
              max={raffle?.totalTickets}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="icon"
            className="hover:bg-primary/20 mt-6"
          >
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="bg-black/40 border border-primary/20 backdrop-blur-xl">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Detalles y Tickets
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Rifa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card className="bg-black/60 backdrop-blur-xl border border-primary/20 shadow-[0_0_30px_rgba(0,255,140,0.1)]">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                {raffle.title}
              </CardTitle>
              <div className="bg-black/40 p-6 rounded-xl border border-white/10">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {raffle.description}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progreso de Ventas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary">
                  Progreso de Ventas
                </h3>
                <Progress value={progress} className="h-2 bg-black/60" />
                <div className="grid grid-cols-3 gap-4">
                  <StatsCard
                    title="Tickets Vendidos"
                    value={raffle.soldTickets?.length || 0}
                    total={raffle.totalTickets}
                    className="bg-black/40 border-secondary/10 hover:border-secondary/30 transition-all"
                  />
                  <StatsCard
                    title="Tickets Reservados"
                    value={raffle.reservedTickets?.length || 0}
                    total={raffle.totalTickets}
                    className="bg-black/40 border-primary/10 hover:border-primary/30 transition-all"
                  />
                  <StatsCard
                    title="Tickets Disponibles"
                    value={
                      raffle.totalTickets -
                      (raffle.soldTickets?.length || 0) -
                      (raffle.reservedTickets?.length || 0)
                    }
                    total={raffle.totalTickets}
                    className="bg-black/40 border-accent/10 hover:border-accent/30 transition-all"
                  />
                </div>
              </div>

              {/* Detalles Financieros */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                <div>
                  <h3 className="font-medium text-gray-400">
                    Precio por Ticket
                  </h3>
                  <p className="text-xl font-bold text-primary">
                    ${raffle.price} USD
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-400">Total Recaudado</h3>
                  <p className="text-xl font-bold text-secondary">
                    ${(raffle.soldTickets?.length || 0) * raffle.price} USD
                  </p>
                </div>
              </div>

              {/* Grid de Tickets */}
              <div className="pt-6 border-t border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Estado de Tickets</h3>
                <div className="w-full overflow-hidden px-0">
                  <TicketGrid
                    totalTickets={raffle.totalTickets || 0}
                    soldTickets={raffle.soldTickets || []}
                    reservedTickets={raffle.reservedTickets || []}
                    selectedTickets={[]}
                    onTicketClick={handleTicketClick}
                    isDashboard={true}
                    randomTickets={raffle.randomTickets || false}
                    users={raffle.users || []}
                    onUnreserveTicket={handleUnreserveTicket}
                    highlightedTicket={highlightedTicket}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <EditForm raffle={raffle} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

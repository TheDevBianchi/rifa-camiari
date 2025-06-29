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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/80 via-secondary/60 to-primary/40">
        <Loader2 className="h-8 w-8 animate-spin text-primary drop-shadow-[0_0_8px_var(--tw-shadow-color)] shadow-primary" />
        <span className="ml-2 text-primary font-bold text-xl drop-shadow-[0_0_8px_var(--tw-shadow-color)] shadow-secondary">Cargando detalles de la rifa...</span>
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="container mx-auto py-8 text-center bg-gradient-to-br from-primary/80 via-secondary/60 to-primary/40 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-primary drop-shadow-[0_0_8px_var(--tw-shadow-color)] shadow-primary">Rifa no encontrada</h2>
        <p className="text-secondary mb-4 font-semibold">No se pudo cargar la información de la rifa solicitada.</p>
        <Button variant="outline" className="border-primary text-primary font-bold shadow-md hover:bg-primary/10" onClick={() => window.history.back()}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-transparent rounded-2xl shadow-2xl">
      {/* Agregar el buscador fijo aquí, fuera de las tabs */}
      <div className="fixed bottom-4 right-4 z-50 bg-primary/95 backdrop-blur-lg p-3 rounded-xl border-2 border-secondary/60 shadow-2xl">
        <form 
          onSubmit={handleSearchTicket} 
          className="flex items-center gap-2"
        >
          <div className="flex flex-col">
            <label htmlFor="ticket-search" className="text-xs text-secondary mb-1 font-semibold">
              Buscar Ticket
            </label>
            <Input
              id="ticket-search"
              type="number"
              placeholder="Ej: 1234"
              value={searchTicket}
              onChange={handleSearchChange}
              className="w-32 bg-primary-500/10 text-primary border-2 border-primary focus:ring-primary font-bold shadow-inner"
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
            className="hover:bg-secondary/30 mt-6 border-2 border-secondary text-secondary shadow-md"
          >
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="bg-primary/30 border-2 border-secondary/60 backdrop-blur-xl shadow-lg">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-primary font-bold shadow-md"
          >
            <Ticket className="w-4 h-4 mr-2 text-primary-500" />
            Detalles y Tickets
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="data-[state=active]:bg-secondary data-[state=active]:text-white text-secondary font-bold shadow-md"
          >
            <Edit className="w-4 h-4 mr-2 text-secondary-500" />
            Editar Rifa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card className="bg-primary/20 backdrop-blur-xl border-2 border-primary/40 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-3xl text-primary font-extrabold text-primary-500 shadow-primary-500">
                {raffle.title}
              </CardTitle>
              <div className="bg-primary/10 p-6 rounded-xl border-2 border-secondary/30 shadow-inner">
                <p className="text-secondary leading-relaxed whitespace-pre-line font-semibold">
                  {raffle.description}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progreso de Ventas */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-secondary text-primary-500 shadow-secondary">
                  Progreso de Ventas
                </h3>
                <Progress value={progress} className="h-2 bg-secondary/40 shadow-inner" />
                <div className="grid grid-cols-3 gap-4">
                  <StatsCard
                    title="Tickets Vendidos"
                    value={raffle.soldTickets?.length || 0}
                    total={raffle.totalTickets}
                    className="bg-primary/20 border-2 border-secondary/30 hover:border-secondary/50 transition-all shadow-md text-primary font-bold"
                  />
                  <StatsCard
                    title="Tickets Reservados"
                    value={raffle.reservedTickets?.length || 0}
                    total={raffle.totalTickets}
                    className="bg-secondary/20 border-2 border-primary/30 hover:border-primary/50 transition-all shadow-md text-secondary font-bold"
                  />
                  <StatsCard
                    title="Tickets Disponibles"
                    value={
                      raffle.totalTickets -
                      (raffle.soldTickets?.length || 0) -
                      (raffle.reservedTickets?.length || 0)
                    }
                    total={raffle.totalTickets}
                    className="bg-primary/10 border-2 border-secondary/30 hover:border-secondary/50 transition-all shadow-md text-primary font-bold"
                  />
                </div>
              </div>

              {/* Detalles Financieros */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-secondary/40">
                <div>
                  <h3 className="font-bold text-secondary">
                    Precio por Ticket
                  </h3>
                  <p className="text-2xl font-extrabold text-primary text-primary-500 shadow-primary">
                    ${raffle.price} USD
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-secondary">Total Recaudado</h3>
                  <p className="text-2xl font-extrabold text-secondary text-primary-500 shadow-secondary">
                    ${(raffle.soldTickets?.length || 0) * raffle.price} USD
                  </p>
                </div>
              </div>

              {/* Grid de Tickets */}
              <div className="pt-6 border-t-2 border-secondary/40">
                <h3 className="text-lg font-bold mb-4 text-primary text-primary-500 shadow-primary">Estado de Tickets</h3>
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

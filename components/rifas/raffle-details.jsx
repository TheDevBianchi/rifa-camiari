"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, DollarSign, Tag } from "lucide-react";
import { PromoDisplay } from "./PromoDisplay";

export function RaffleDetails({ raffle }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = raffle.images;

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  // Calcular el progreso de la rifa
  const progress = ((raffle.totalTickets - raffle.availableNumbers) / raffle.totalTickets) * 100;
  const progressFormatted = Number(progress.toFixed(2));

  return (
    <div className="w-full bg-[#111111] rounded-xl overflow-hidden border border-primary-500/10 hover:border-primary-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(140,82,255,0.1)]">
      {/* Carrusel de imágenes */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                  <div className="relative h-[400px]">
                    <Image
                      src={`${image}`}
                      alt={`${raffle.title} - Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-[0_0_100%] min-w-0">
                <div className="relative h-[400px] bg-black/50 flex items-center justify-center">
                  <span className="text-gray-400">
                    No hay imágenes disponibles
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controles del carrusel */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full 
          hover:bg-primary-500/30 transition-all duration-300 border border-primary-500/20 z-10"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full 
          hover:bg-primary-500/30 transition-all duration-300 border border-primary-500/20 z-10"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {raffle.images &&
            raffle.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? "bg-primary-500" : "bg-white/30 hover:bg-primary-400/50"
                }`}
              />
            ))}
        </div>

        {/* Título superpuesto */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {raffle.title}
          </h1>
        </div>
      </div>

      {/* Información de la rifa */}
      <div className="p-6 space-y-6">
        {/* Descripción */}
        <div className="bg-black/40 p-5 rounded-xl border border-primary-500/5">
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {raffle.description}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-3 bg-black/40 p-5 rounded-xl border border-primary-500/5">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-white">
              Progreso del Sorteo
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
                {progressFormatted}%
              </span>
              <span className="text-gray-400 text-sm">completado</span>
            </div>
          </div>
          <div className="h-4 bg-black/60 rounded-full overflow-hidden border border-primary-500/10 relative">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.1)_30%,rgba(255,255,255,0)_50%)] animate-shine"></div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-200 mix-blend-difference">
              {progressFormatted}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

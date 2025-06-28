'use client'
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, CreditCard, Tag, ChevronRight } from 'lucide-react'

export default function SettingsPage() {
  const settingsSections = [
    {
      title: 'Precio del Dólar',
      description: 'Configura el precio del dólar para el cálculo de precios en diferentes monedas',
      icon: DollarSign,
      href: '/dashboard/settings/dollar-price',
      color: 'text-amber-500'
    },
    {
      title: 'Métodos de Pago',
      description: 'Administra los métodos de pago disponibles para tus clientes',
      icon: CreditCard,
      href: '/dashboard/settings/payment-methods',
      color: 'text-amber-500'
    },
    {
      title: 'Promociones',
      description: 'Configura promociones y descuentos para tus rifas',
      icon: Tag,
      href: '/dashboard/settings/promos',
      color: 'text-amber-500'
    }
  ]

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
          Configuración
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Administra las configuraciones generales de tu plataforma de rifas
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {settingsSections.map((section) => (
          <Link href={section.href} key={section.title}>
            <Card className="bg-black/60 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:border-amber-500/40 cursor-pointer transition-all duration-300 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <section.icon className={`h-5 w-5 ${section.color}`} />
                  <ChevronRight className="h-4 w-4 text-amber-500/50" />
                </div>
                <CardTitle className="text-lg font-medium text-amber-300 mt-2">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {section.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* General Settings Info */}
      <div className="mt-8 bg-black/60 border border-amber-500/20 rounded-lg p-4 md:p-6 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
        <h2 className="text-xl font-semibold text-amber-300 mb-4">Información General</h2>
        <p className="text-gray-400 mb-4">
          Estas configuraciones afectan a toda la plataforma. Asegúrate de revisarlas periódicamente para mantener tu plataforma actualizada.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-black/40 p-3 rounded-lg border border-amber-500/10">
            <p className="text-amber-400 font-medium mb-1">Versión de la Plataforma</p>
            <p className="text-gray-400">1.0.0</p>
          </div>
          <div className="bg-black/40 p-3 rounded-lg border border-amber-500/10">
            <p className="text-amber-400 font-medium mb-1">Última Actualización</p>
            <p className="text-gray-400">2 Mayo, 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}

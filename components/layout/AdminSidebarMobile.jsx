"use client"

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, Users, Gift, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const adminRoutes = [
  {
    icon: Home,
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    icon: Gift,
    href: "/dashboard/rifas",
    label: "Rifas",
  },
  {
    icon: ShoppingCart,
    href: "/dashboard/compras",
    label: "Compras",
  },
  {
    icon: BarChart,
    href: "/dashboard/ranking",
    label: "Ranking",
  },
  {
    icon: Settings,
    href: "/dashboard/settings",
    label: "Configuración",
  },
];

export default function AdminSidebarMobile() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    // Aquí iría la lógica real de logout
    router.push("/auth/sign-in");
  };

  return (
    <>
      {/* Cabecera fija con logo y menú */}
      <div className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between bg-primary-950/90 border-b border-primary-700 px-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-500 hover:bg-primary-500/10"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-7 w-7" />
        </Button>
        <div className="flex-1 flex flex-col items-center justify-center">
          <Image
            src="/logo-transparente.webp"
            alt="Logo Admin Camiari"
            width={36}
            height={36}
            className="rounded-full object-cover bg-primary-500/10 border border-primary-500 shadow"
            priority
          />
          <span className="text-sm font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent mt-1">
            Admin Camiari
          </span>
        </div>
        {/* Espacio para alinear el logo y texto al centro */}
        <div style={{ width: 44 }} />
      </div>

      {/* Overlay y panel lateral */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-full w-64 bg-primary-950 border-r border-primary-700 z-50 flex flex-col shadow-2xl animate-slide-in">
            {/* Cabecera del panel */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-primary-700">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo-transparente.webp"
                  alt="Logo Admin Camiari"
                  width={36}
                  height={36}
                  className="rounded-full object-cover bg-primary-500/10 border border-primary-500 shadow"
                  priority
                />
                <span className="text-lg font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
                  Admin Camiari
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-500 hover:bg-primary-500/10"
                onClick={() => setOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            {/* Opciones de navegación */}
            <nav className="flex-1 flex flex-col gap-1 p-4">
              {adminRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary-100 hover:bg-primary-500/10 hover:text-primary-300 transition-all"
                  onClick={() => setOpen(false)}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ))}
            </nav>
            {/* Botón cerrar sesión */}
            <div className="p-4 border-t border-primary-700">
              <Button
                variant="ghost"
                className="w-full justify-start text-secondary-400 hover:text-white hover:bg-secondary-500/20"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

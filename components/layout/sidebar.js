// components/layout/sidebar.js
"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Gift,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart,
  ShoppingCart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { signOut } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const routes = [
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

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="sticky inset-0 z-50">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-black/90 backdrop-blur-xl border-r border-primary-500/20 shadow-[0_0_30px_rgba(140,82,255,0.1)] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Cabecera responsive con logo, título y menú */}
        <div className="flex h-16 items-center border-b border-primary-500/20 px-2 md:px-6 justify-between gap-2">
          {/* Mobile: logo y texto centrados, botón menú a la derecha */}
          <div className="flex items-center w-full md:w-auto justify-center md:justify-start">
            <img
              src="/logo-transparente.webp"
              alt="Logo Rifa Camiari"
              className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover bg-primary-500/10 border border-primary-500 shadow-md"
            />
            <span className="ml-2 text-base md:text-2xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent truncate">
              Rifa Camiari
            </span>
          </div>
          {/* Botón menú solo en móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden p-2 text-primary-500 hover:bg-primary-500/10 hover:text-primary-300 transition-colors ml-auto"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
        <div className="flex h-screen flex-col justify-between space-y-4">
          <div className="flex flex-col space-y-2 p-4">
            {/* Navegación */}
            <div className="space-y-2 mt-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300",
                    "hover:bg-primary-500/10 hover:text-primary-300",
                    pathname === route.href
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-[0_0_15px_rgba(140,82,255,0.2)]"
                      : "text-gray-200"
                  )}
                >
                  <route.icon
                    className={cn(
                      "h-5 w-5",
                      pathname === route.href
                        ? "text-white"
                        : "text-gray-400 group-hover:text-primary-300"
                    )}
                  />
                  {route.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Botón de cerrar sesión */}
          <div className="mt-auto p-4 border-t border-primary-500/20">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-primary-300 hover:bg-primary-500/10 transition-all duration-300"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

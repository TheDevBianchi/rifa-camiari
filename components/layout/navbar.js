// components/layout/navbar.js
"use client"
import { Menu, X, User, ShoppingBag, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import CountrySelector from "@/components/ui/country-selector"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Rifas', href: '/rifas' },
    { name: 'Cómo Participar', href: '/como-participar' },
    { name: 'Contacto', href: '/contacto' }
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 shadow-lg backdrop-blur-sm py-2' : 'bg-black py-4'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo-transparente.webp" 
              alt="Logo" 
              width={50} 
              height={50} 
              className="h-10 w-auto" 
            />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">Rifas Adrian</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-amber-400' : 'text-white hover:text-amber-300'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Selector de países */}
            <CountrySelector />
            
            <Link href="/dashboard" className="flex items-center text-white hover:text-amber-300 transition-colors">
              <User className="h-5 w-5 mr-1" />
              <span className="text-sm">Mi Cuenta</span>
            </Link>
            <Link 
              href="/rifas" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium py-2 px-4 rounded-md transition-all duration-300 flex items-center"
            >
              <Gift className="h-4 w-4 mr-2" />
              <span>Comprar Tickets</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-amber-300 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-gray-800 mt-2">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-base font-medium ${pathname === link.href ? 'text-amber-400' : 'text-white hover:text-amber-300'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-800 flex flex-col space-y-3">
              {/* Selector de países en móvil */}
              <div className="flex items-center justify-center py-2">
                <CountrySelector />
              </div>
              
              <Link 
                href="/dashboard" 
                className="flex items-center text-white hover:text-amber-300 transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-5 w-5 mr-2" />
                <span>Mi Cuenta</span>
              </Link>
              <Link 
                href="/comprar" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                <Gift className="h-4 w-4 mr-2" />
                <span>Comprar Tickets</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
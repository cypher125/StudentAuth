"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image
                src="/logoyct.png"
                alt="Yabatech Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-montserrat font-bold text-primary text-lg">Student Auth</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-dark-neutral hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-dark-neutral hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/login" className="text-dark-neutral hover:text-primary transition-colors">
              Login
            </Link>
          </div>

          {/* Mobile Navigation Toggle */}
          <button className="md:hidden text-dark-neutral" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-dark-neutral hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block py-2 text-dark-neutral hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/login"
              className="block py-2 text-dark-neutral hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}


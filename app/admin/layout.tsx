"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown, Users, Settings, Home, LogOut, Shield } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

// Define our expected user structure
interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const typedUser = user as UserData; // Cast the user to our interface
  const router = useRouter()
  const pathname = usePathname()

  // Handle logout
  const handleLogout = () => {
    logout()
    router.push("/login/admin")
  }

  return (
    <div className="flex h-screen bg-light-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 border-b">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image src="/logoyct.png?height=32&width=32" alt="Yabatech Logo" fill className="object-contain" />
            </div>
            <span className="font-montserrat font-bold text-primary">Admin Panel</span>
          </Link>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            <Link 
              href="/admin" 
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === "/admin" ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/students"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === "/admin/students" ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              <Users className="h-5 w-5" />
              <span>Students</span>
            </Link>

            <Link
              href="/admin/users"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === "/admin/users" ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              <Shield className="h-5 w-5" />
              <span>Users</span>
            </Link>

            <Link
              href="/admin/admins"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === "/admin/admins" ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              <Shield className="h-5 w-5" />
              <span>Admins</span>
            </Link>
          </div>

          <div className="mt-8 pt-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-primary text-muted-foreground w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center md:hidden">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="Yabatech Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-montserrat font-bold text-primary">Admin</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-1 text-dark-neutral">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Shield size={16} />
                  </div>
                  <span className="hidden md:inline-block">
                    {typedUser?.firstName && typedUser?.lastName 
                      ? `${typedUser.firstName} ${typedUser.lastName}` 
                      : typedUser?.email || "Admin User"}
                  </span>
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  )
}


"use client"

import { LoginForm } from "@/components/login-form"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Shield } from "lucide-react"

export default function AdminLoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow flex items-center justify-center bg-light-bg py-8 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-card overflow-hidden">
            {/* Left side - Image and info */}
            <div className="md:w-1/2 bg-dark-neutral p-6 md:p-8 text-white flex flex-col">
              <div className="mb-6 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Portal</h1>
                <p className="opacity-90">Secure access to the Yabatech FRS administration</p>
              </div>

              <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                    <Shield className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Administrator Access</h3>
                  <p className="text-sm opacity-90 max-w-md">
                    This area is restricted to authorized personnel only. Administrators can manage students, view
                    reports, and configure system settings.
                  </p>
                </div>
              </div>

              <div className="mt-6 text-sm opacity-80 text-center md:text-left">
                <p>For security assistance, contact the system administrator.</p>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="md:w-1/2 p-6 md:p-8 flex items-center justify-center">
              <LoginForm
                role="admin"
                redirectPath="/admin"
                alternateLoginPath="/login"
                alternateLoginText="Student login?"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


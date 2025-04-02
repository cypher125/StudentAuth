"use client"

import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow flex items-center justify-center bg-light-bg py-8 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-card overflow-hidden">
            {/* Left side - Login form */}
            <div className="md:w-1/2 p-6 md:p-8 flex items-center justify-center">
              <LoginForm
                role="student"
                redirectPath="/profile"
                alternateLoginPath="/login/admin"
                alternateLoginText="Are you an administrator?"
              />
            </div>

            {/* Right side - Image and info */}
            <div className="md:w-1/2 bg-primary p-6 md:p-8 text-white flex flex-col">
              <div className="mb-6 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Student Login</h1>
                <p className="opacity-90">Access your Yabatech profile securely</p>
              </div>

              <div className="flex-grow flex items-center justify-center">
                <div className="relative w-full max-w-md h-64">
                  <div className="absolute inset-0 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-4 relative">
                        <Image
                          src="/logoyct.png?height=64&width=64"
                          alt="Yabatech Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Manual Login Option</h3>
                      <p className="text-sm opacity-90 mb-4">
                        Use your student credentials to access your profile when facial recognition is unavailable.
                      </p>
                      <Link
                        href="/scan"
                        className="inline-block bg-white text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
                      >
                        Try Facial Recognition
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm opacity-80 text-center md:text-left">
                <p>Need help? Contact the ICT support team at support@yabatech.edu.ng</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


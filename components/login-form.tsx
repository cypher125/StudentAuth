"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { ButtonCustom } from "@/components/ui/button-custom"
import { useAuth } from "@/context/auth-context"
import { LoginCredentials } from "@/app/types"

interface LoginFormProps {
  role: "admin" | "student"
  redirectPath: string
  alternateLoginPath?: string
  alternateLoginText?: string
}

export function LoginForm({ role, redirectPath, alternateLoginPath, alternateLoginText }: LoginFormProps) {
  // For both admin and student
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Admin login fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  // Student login fields
  const [matricNumber, setMatricNumber] = useState("")
  const [surname, setSurname] = useState("")

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      let credentials: LoginCredentials;
      
      if (role === "admin") {
    if (!email || !password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }

        credentials = {
          role: "admin",
          email,
          password
        }
      } else {
        if (!matricNumber || !surname) {
          setError("Please enter both matric number and surname")
          setIsLoading(false)
          return
        }
        
        credentials = {
          role: "student",
          matric_number: matricNumber,
          surname
        }
      }

      const success = await login(credentials)

      if (!success) {
        setError(role === "admin" ? "Invalid email or password" : "Invalid matric number or surname")
      }
      // Redirect is handled by the auth context if successful
    } catch (err) {
      setError("An error occurred during login. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const renderStudentForm = () => (
    <>
      <div className="mb-4">
        <label htmlFor="matricNumber" className="block text-sm font-medium text-dark-neutral mb-1">
          Matric Number
        </label>
        <input
          type="text"
          id="matricNumber"
          value={matricNumber}
          onChange={(e) => setMatricNumber(e.target.value)}
          className="w-full px-4 py-2 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter your matric number"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="surname" className="block text-sm font-medium text-dark-neutral mb-1">
          Surname
        </label>
        <input
          type="text"
          id="surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="w-full px-4 py-2 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter your surname"
          required
        />
          </div>
    </>
  )

  const renderAdminForm = () => (
    <>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-dark-neutral mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="admin@yabatech.edu.ng"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-dark-neutral mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-gray"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
    </>
  )

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-card p-6 md:p-8">
        <h2 className="text-2xl font-bold text-dark-neutral mb-6 text-center">
          {role === "admin" ? "Admin Login" : "Student Login"}
        </h2>

        {error && (
          <div className="mb-6 p-3 bg-error/10 border border-error/20 rounded-md text-error flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {role === "admin" ? renderAdminForm() : renderStudentForm()}

        <ButtonCustom type="submit" variant="primary" isLoading={isLoading} className="w-full mb-4">
          Log In
        </ButtonCustom>

        {role === "student" && (
          <div className="text-center mb-4">
            <Link href="/scan" className="text-primary hover:underline text-sm">
              Use Facial Recognition Instead
            </Link>
          </div>
        )}

        {alternateLoginPath && (
          <div className="text-center text-neutral-gray text-sm">
            {alternateLoginText || "Need a different login option?"}{" "}
            <Link href={alternateLoginPath} className="text-primary hover:underline">
              {role === "admin" ? "Student Login" : "Admin Login"}
            </Link>
          </div>
        )}
      </form>
    </div>
  )
}


"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { adminApi } from "@/lib/api"
import { toast } from "sonner"

interface Admin {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
  faculty: string
  status?: string
}

interface ViewAdminModalProps {
  isOpen: boolean
  onClose: () => void
  adminId: string | null
}

export function ViewAdminModal({ isOpen, onClose, adminId }: ViewAdminModalProps) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && adminId) {
      fetchAdminDetails(adminId)
    } else {
      setAdmin(null)
    }
  }, [isOpen, adminId])

  const fetchAdminDetails = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await adminApi.getAdmin(id)
      setAdmin(data)
    } catch (error) {
      console.error("Error fetching admin details:", error)
      toast.error("Failed to load admin details")
    } finally {
      setIsLoading(false)
    }
  }

  // If no admin ID is provided or if we're still loading, show a loading state
  if (!admin && isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Administrator Information</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <p>Loading administrator information...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // If no admin data was found
  if (!admin && !isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Administrator Information</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <p>No administrator information found</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Administrator Information</DialogTitle>
        </DialogHeader>

        {admin && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Admin icon */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                  <Shield className="w-12 h-12 text-primary" />
                </div>
                
                <div className="mt-2">
                  <Badge variant={admin.status === "inactive" ? "destructive" : "secondary"}>
                    {admin.status || "active"}
                  </Badge>
                </div>
              </div>

              {/* Admin Details */}
              <div className="flex-grow">
                <h3 className="text-2xl font-semibold">{admin.firstName} {admin.lastName}</h3>
                <p className="text-gray-500 mb-4">{admin.email}</p>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-gray-500">Username</p>
                      <p className="text-lg font-semibold">{admin.username}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-gray-500">Faculty</p>
                      <p className="text-lg font-semibold">{admin.faculty}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p className="text-xs font-mono">{admin.id}</p>
                </CardContent>
              </Card>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 
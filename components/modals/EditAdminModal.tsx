"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface EditAdminModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  adminId: string | null
}

export function EditAdminModal({ isOpen, onClose, onSuccess, adminId }: EditAdminModalProps) {
  const [formData, setFormData] = useState<Admin>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    faculty: "",
    status: "active"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  // Fetch admin data when modal opens
  useEffect(() => {
    if (isOpen && adminId) {
      fetchAdminDetails(adminId)
    }
  }, [isOpen, adminId])

  const fetchAdminDetails = async (id: string) => {
    setIsFetching(true)
    try {
      const data = await adminApi.getAdmin(id)
      setFormData({
        id: data.id || "",
        firstName: data.firstName || data.first_name || "",
        lastName: data.lastName || data.last_name || "",
        email: data.email || "",
        username: data.username || "",
        faculty: data.faculty || "",
        status: data.status || "active"
      })
    } catch (error) {
      console.error("Error fetching admin details:", error)
      toast.error("Failed to load admin details")
      onClose() // Close the modal if we can't load the data
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await adminApi.updateAdmin(formData.id, formData)
      toast.success("Administrator updated successfully")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error updating administrator:", error)
      toast.error("Failed to update administrator")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (isFetching) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Administrator</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <p>Loading administrator information...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Administrator</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty">Faculty</Label>
            <Select
              value={formData.faculty}
              onValueChange={(value) => handleChange("faculty", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Social Sciences">Social Sciences</SelectItem>
                <SelectItem value="Management Sciences">Management Sciences</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
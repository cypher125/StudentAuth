"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { adminApi } from "@/lib/api"
import { toast } from "sonner"

interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    matricNumber: "",
    faculty: "",
    department: "",
    level: "",
    course: "",
    grade: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [faceImage, setFaceImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create FormData object if there's an image to upload
      if (faceImage) {
        const formDataWithImage = new FormData()
        
        // Add all the form fields to FormData
        Object.entries(formData).forEach(([key, value]) => {
          formDataWithImage.append(key, value)
        })
        
        // Add the image file
        formDataWithImage.append('faceImage', faceImage)
        
        // Use the register-student-with-image endpoint
        await adminApi.registerStudentWithImage(formDataWithImage)
      } else {
        // No image, use the regular endpoint
        await adminApi.registerStudent({
          ...formData,
        })
      }
      
      toast.success("Student created successfully")
      onSuccess()
      onClose()
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        matricNumber: "",
        faculty: "",
        department: "",
        level: "",
        course: "",
        grade: "",
        password: "",
      })
      setFaceImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error creating student:", error)
      toast.error("Failed to create student")
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFaceImage(e.target.files[0])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
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
            <Label htmlFor="matricNumber">Matric Number</Label>
            <Input
              id="matricNumber"
              value={formData.matricNumber}
              onChange={(e) => handleChange("matricNumber", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="Science and Technology">Science and Technology</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="SMBS">SMBS</SelectItem>
                  <SelectItem value="Management Sciences">Management Sciences</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleChange("department", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Computer Engenering">Computer Engenering</SelectItem>
                  <SelectItem value="Food Technology">Food Technology</SelectItem>
                  <SelectItem value="Civil Engeneering">Civil Engeneering</SelectItem>
                  <SelectItem value="Mechanical Engeneering">Mechanical Engeneering</SelectItem>
                  <SelectItem value="Electrical Engeniering">Electrical Engeniering</SelectItem>
                  <SelectItem value="Statistics">Statistics</SelectItem>
                  <SelectItem value="Business Admin">Business Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleChange("level", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ND1">ND1</SelectItem>
                  <SelectItem value="ND2">ND2</SelectItem>
                  <SelectItem value="HND1">HND1</SelectItem>
                  <SelectItem value="HND2">HND2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => handleChange("grade", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="350 - 400">First Class</SelectItem>
                  <SelectItem value="300 - 350">Second Class Upper</SelectItem>
                  <SelectItem value="250 -  300">Second Class Lower</SelectItem>
                  <SelectItem value="100 - 200">Pass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Input
              id="course"
              value={formData.course}
              onChange={(e) => handleChange("course", e.target.value)}
              placeholder="Enter course name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faceImage">Face Image (Optional)</Label>
            <Input
              id="faceImage"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <p className="text-xs text-gray-500">
              Upload a clear frontal face image for facial recognition
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { adminApi } from "@/lib/api"
import { toast } from "sonner"

interface AddUserModalEnhancedProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  defaultRole?: "admin" | "student" | "staff"
}

export function AddUserModalEnhanced({ isOpen, onClose, onSuccess, defaultRole = "student" }: AddUserModalEnhancedProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: defaultRole,
    faculty: "",
    department: "",
    password: "",
    // Student-specific fields
    matricNumber: "",
    level: "",
    course: "",
    grade: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [faceImage, setFaceImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update role when defaultRole changes
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        role: defaultRole
      }))
    }
  }, [isOpen, defaultRole])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (formData.role === "admin") {
        // Create admin user
        await adminApi.registerAdmin({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          department: formData.department,
          faculty: formData.faculty,
          // Username defaults to email if not provided
        })
        toast.success("Admin created successfully")
      } else if (formData.role === "student") {
        // For student role, we need matric number and level
        if (!formData.matricNumber || !formData.level) {
          toast.error("Matric number and level are required for students")
          setIsLoading(false)
          return
        }
        
        // Check if there's a face image to upload
        if (faceImage) {
          const formDataWithImage = new FormData()
          
          // Add all the form fields to FormData
          Object.entries(formData).forEach(([key, value]) => {
            if (value) formDataWithImage.append(key, value)
          })
          
          // Add the image file
          formDataWithImage.append('faceImage', faceImage)
          
          // Use the register-student-with-image endpoint
          await adminApi.registerStudentWithImage(formDataWithImage)
        } else {
          // No image, use the regular endpoint
          await adminApi.registerStudent({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            matricNumber: formData.matricNumber,
            faculty: formData.faculty,
            department: formData.department,
            level: formData.level,
            course: formData.course,
            grade: formData.grade,
          })
        }
        toast.success("Student created successfully")
      } else {
        // Other roles - can add other role creation logic here
        await adminApi.createUser({
          ...formData,
          username: formData.email, // Use email as username
        })
        toast.success("User created successfully")
      }
      
      onSuccess()
      onClose()
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: defaultRole,
        faculty: "",
        department: "",
        password: "",
        matricNumber: "",
        level: "",
        course: "",
        grade: "",
      })
      setFaceImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("Failed to create user")
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

  // Show different fields based on role
  const isStudent = formData.role === "student"
  const isAdmin = formData.role === "admin"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isAdmin ? "Add New Admin" : isStudent ? "Add New Student" : "Add New User"}</DialogTitle>
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
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show matric number field only for students */}
          {isStudent && (
            <div className="space-y-2">
              <Label htmlFor="matricNumber">Matric Number</Label>
              <Input
                id="matricNumber"
                value={formData.matricNumber}
                onChange={(e) => handleChange("matricNumber", e.target.value)}
                required={isStudent}
              />
            </div>
          )}

          {/* Faculty field - shown for all, but required for students */}
          <div className="space-y-2">
            <Label htmlFor="faculty">Faculty</Label>
            <Select
              value={formData.faculty}
              onValueChange={(value) => handleChange("faculty", value)}
              required={isStudent}
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
                <SelectItem value="Science and Technology">Science and Technology</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show level field only for students */}
          {isStudent && (
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleChange("level", value)}
                required={isStudent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 Level</SelectItem>
                  <SelectItem value="200">200 Level</SelectItem>
                  <SelectItem value="300">300 Level</SelectItem>
                  <SelectItem value="400">400 Level</SelectItem>
                  <SelectItem value="500">500 Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Show course field only for students */}
          {isStudent && (
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => handleChange("course", e.target.value)}
                placeholder="Enter course name"
              />
            </div>
          )}

          {/* Show grade field only for students */}
          {isStudent && (
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
                  <SelectItem value="First Class">First Class</SelectItem>
                  <SelectItem value="Second Class Upper">Second Class Upper</SelectItem>
                  <SelectItem value="Second Class Lower">Second Class Lower</SelectItem>
                  <SelectItem value="Third Class">Third Class</SelectItem>
                  <SelectItem value="Pass">Pass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

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

          {/* Show face image upload only for students */}
          {isStudent && (
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
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : isAdmin ? "Create Admin" : isStudent ? "Create Student" : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
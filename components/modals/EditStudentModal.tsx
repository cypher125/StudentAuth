"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { adminApi } from "@/lib/api"
import { toast } from "sonner"

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  matricNumber: string
  faculty: string
  department: string
  class_year: string
  course: string
  grade: string
  faceImage?: string
  status?: string
}

interface EditStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  studentId: string | null
}

export function EditStudentModal({ isOpen, onClose, onSuccess, studentId }: EditStudentModalProps) {
  const [formData, setFormData] = useState<Student>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    matricNumber: "",
    faculty: "",
    department: "",
    class_year: "",
    course: "",
    grade: "",
    status: "active"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [faceImage, setFaceImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch student data when modal opens
  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentDetails(studentId)
    }
  }, [isOpen, studentId])

  const fetchStudentDetails = async (id: string) => {
    setIsFetching(true)
    try {
      const data = await adminApi.getStudent(id)
      setFormData({
        id: data.id || "",
        firstName: data.firstName || data.first_name || "",
        lastName: data.lastName || data.last_name || "",
        email: data.email || "",
        matricNumber: data.matricNumber || data.matric_number || "",
        faculty: data.faculty || "",
        department: data.department || "",
        class_year: data.class_year || data.class_year || "",
        course: data.course || "",
        grade: data.grade || "",
        status: data.status || "active",
        faceImage: data.faceImage || undefined
      })
    } catch (error) {
      console.error("Error fetching student details:", error)
      toast.error("Failed to load student details")
      onClose() // Close the modal if we can't load the data
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Check if there's a face image to upload
      if (faceImage) {
        const formDataWithImage = new FormData()
        
        // Add all the form fields to FormData
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined) formDataWithImage.append(key, String(value))
        })
        
        // Add the image file
        formDataWithImage.append('faceImage', faceImage)
        
        // Use the update endpoint with image
        await adminApi.updateStudentWithImage(formData.id, formDataWithImage)
      } else {
        // No image update, use the regular endpoint
        await adminApi.updateStudent(formData.id, formData)
      }
      
      toast.success("Student updated successfully")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error updating student:", error)
      toast.error("Failed to update student")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
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

  if (isFetching) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <p>Loading student information...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
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
              <Label htmlFor="class_year">class year</Label>
              <Select
                value={formData.class_year}
                onValueChange={(value) => handleChange("class_year", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class year" />
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
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
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
            {formData.faceImage && !faceImage && (
              <div className="mt-2 flex items-center">
                <img 
                  src={formData.faceImage} 
                  alt="Current face image" 
                  className="w-16 h-16 object-cover rounded-md mr-2"
                />
                <span className="text-xs text-gray-500">Current image (upload new to replace)</span>
              </div>
            )}
            {faceImage && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">New image selected to upload</span>
              </div>
            )}
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
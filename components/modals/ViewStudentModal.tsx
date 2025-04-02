"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { useState, useEffect } from "react"
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

interface ViewStudentModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string | null
}

export function ViewStudentModal({ isOpen, onClose, studentId }: ViewStudentModalProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentDetails(studentId)
    } else {
      setStudent(null)
    }
  }, [isOpen, studentId])

  const fetchStudentDetails = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await adminApi.getStudent(id)
      setStudent(data)
    } catch (error) {
      console.error("Error fetching student details:", error)
      toast.error("Failed to load student details")
    } finally {
      setIsLoading(false)
    }
  }

  // If no student ID is provided or if we're still loading, show a loading state
  if (!student && isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Information</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <p>Loading student information...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // If no student data was found
  if (!student && !isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Information</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <p>No student information found</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Student Information</DialogTitle>
        </DialogHeader>

        {student && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Face Image (if available) */}
              <div className="flex-shrink-0">
                {student.faceImage ? (
                  <img 
                    src={student.faceImage} 
                    alt={`${student.firstName} ${student.lastName}`} 
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-lg border flex items-center justify-center">
                    <Eye className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                <div className="mt-2">
                  <Badge variant={student.status === "inactive" ? "destructive" : "secondary"}>
                    {student.status || "active"}
                  </Badge>
                </div>
              </div>

              {/* Student Details */}
              <div className="flex-grow space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold">{student.firstName} {student.lastName}</h3>
                  <p className="text-gray-500">{student.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-gray-500">Matric Number</p>
                      <p className="text-lg font-semibold">{student.matricNumber}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-gray-500">Department</p>
                      <p className="text-lg font-semibold">{student.department}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-500">Faculty</p>
                  <p className="text-base font-semibold">{student.faculty}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-500">class year</p>
                  <p className="text-base font-semibold">{student.class_year}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-500">Course</p>
                  <p className="text-base font-semibold">{student.course || "N/A"}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-500">Grade</p>
                <p className="text-base font-semibold">{student.grade || "N/A"}</p>
              </CardContent>
            </Card>

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
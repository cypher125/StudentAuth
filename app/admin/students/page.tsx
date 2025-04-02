"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, Filter, ChevronLeft, ChevronRight, Edit, Trash2, Eye, Pencil } from "lucide-react"
import { ButtonCustom } from "@/components/ui/button-custom"
import { useApi } from "@/hooks/use-api"
import { Student } from "@/app/types"
import { adminApi } from '@/lib/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AddStudentModal } from "@/components/modals/AddStudentModal"
import { ViewStudentModal } from "@/components/modals/ViewStudentModal"
import { EditStudentModal } from "@/components/modals/EditStudentModal"
import { toast } from "sonner"
import { Pagination } from "@/components/pagination"

export default function StudentsPage() {
  const { getStudents } = useApi()
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true)
        console.log('Fetching students...')
        const data = await adminApi.getStudents()
        console.log('Fetched students data:', data)
        setStudents(data)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch students:', err)
        setError('Failed to fetch students. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) => {
      const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase()
      const matricNumber = (student.matricNumber || '').toLowerCase()
      const department = (student.department || '').toLowerCase()
      const searchLower = searchQuery.toLowerCase()

      return (
        fullName.includes(searchLower) ||
        matricNumber.includes(searchLower) ||
        department.includes(searchLower)
      )
    }
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles = {
      active: "bg-success/10 text-success",
      inactive: "bg-error/10 text-error",
      pending: "bg-accent/10 text-accent",
    }

    const style = statusStyles[status as keyof typeof statusStyles] || "bg-neutral-gray/10 text-neutral-gray"

    return (
      <span className={`${style} px-2 py-1 rounded-full text-xs`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await adminApi.deleteStudent(studentId)
        toast.success("Student deleted successfully")
        getStudents() // Refresh the list
      } catch (error) {
        console.error("Error deleting student:", error)
        toast.error("Failed to delete student")
      }
    }
  }

  const handleViewStudent = (studentId: string) => {
    setSelectedStudentId(studentId)
    setIsViewModalOpen(true)
  }

  const handleEditStudent = (studentId: string) => {
    setSelectedStudentId(studentId)
    setIsEditModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-gray">Loading students...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-error mb-4">{error}</div>
        <ButtonCustom 
          variant="primary" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </ButtonCustom>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <div>
            <CardTitle className="text-2xl font-bold">Students</CardTitle>
            <CardDescription>
              Manage student records
            </CardDescription>
      </div>
          <Button onClick={() => setIsAddStudentModalOpen(true)}>Add Student</Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button variant="outline" className="flex-shrink-0">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
      </div>

          <div className="border rounded-md overflow-hidden">
          <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Matric Number</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Level</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y">
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      No students found
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm">{student.matricNumber}</td>
                      <td className="px-4 py-3 text-sm">{student.department}</td>
                      <td className="px-4 py-3 text-sm">{student.class_year}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge
                          variant={student.status === "active" ? "secondary" : "destructive"}
                          className="capitalize"
                        >
                          {student.status || "active"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleViewStudent(student.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleEditStudent(student.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500" 
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredStudents.length}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onSuccess={() => {
          getStudents()
          setIsAddStudentModalOpen(false)
        }}
      />

      {/* View Student Modal */}
      <ViewStudentModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedStudentId(null)
        }}
        studentId={selectedStudentId}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedStudentId(null)
        }}
        onSuccess={() => {
          getStudents()
          setIsEditModalOpen(false)
          setSelectedStudentId(null)
        }}
        studentId={selectedStudentId}
      />
    </div>
  )
}


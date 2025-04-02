"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AddUserModalEnhanced } from "@/components/modals/AddUserModalEnhanced"
import { ViewAdminModal } from "@/components/modals/ViewAdminModal"
import { EditAdminModal } from "@/components/modals/EditAdminModal"
import { adminApi } from "@/lib/api"
import { toast } from "sonner"
import { Eye, Pencil, Trash2, Filter } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pagination } from "@/components/pagination"

interface Admin {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
  faculty: string
  status?: string
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false)
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const itemsPerPage = 5

  const fetchAdmins = async () => {
    try {
      setIsLoading(true)
      const data = await adminApi.getAdmins()
      setAdmins(data)
    } catch (error) {
      console.error("Error fetching admins:", error)
      toast.error("Failed to load administrators")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const filteredAdmins = admins.filter((admin) =>
    Object.values(admin).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDeleteAdmin = async (adminId: string) => {
    if (window.confirm("Are you sure you want to delete this administrator?")) {
      try {
        await adminApi.deleteAdmin(adminId)
        toast.success("Administrator deleted successfully")
        fetchAdmins() // Refresh the list
      } catch (error) {
        console.error("Error deleting administrator:", error)
        toast.error("Failed to delete administrator")
      }
    }
  }

  const handleViewAdmin = (adminId: string) => {
    setSelectedAdminId(adminId)
    setIsViewModalOpen(true)
  }

  const handleEditAdmin = (adminId: string) => {
    setSelectedAdminId(adminId)
    setIsEditModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Administrators</CardTitle>
            <CardDescription>Loading administrator data...</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <svg
                className="animate-spin h-8 w-8 mx-auto text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-2">Loading administrators...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Administrators</CardTitle>
            <CardDescription>Manage admin accounts</CardDescription>
          </div>
          <Button onClick={() => setIsAddAdminModalOpen(true)}>Add Admin</Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <Input
              placeholder="Search admins..."
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
                  <th className="px-4 py-3 text-left text-sm font-semibold">Username</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Faculty</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      No administrators found
                    </td>
                  </tr>
                ) : (
                  paginatedAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm">
                        {admin.firstName} {admin.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm">{admin.username}</td>
                      <td className="px-4 py-3 text-sm">{admin.email}</td>
                      <td className="px-4 py-3 text-sm">{admin.faculty}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge
                          variant={admin.status === "inactive" ? "destructive" : "secondary"}
                          className="capitalize"
                        >
                          {admin.status || "active"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleViewAdmin(admin.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleEditAdmin(admin.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500" 
                            onClick={() => handleDeleteAdmin(admin.id)}
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
              totalItems={filteredAdmins.length}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Admin Modal */}
      <AddUserModalEnhanced
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
        onSuccess={() => {
          fetchAdmins()
          setIsAddAdminModalOpen(false)
        }}
        defaultRole="admin"
      />

      {/* View Admin Modal */}
      <ViewAdminModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedAdminId(null)
        }}
        adminId={selectedAdminId}
      />

      {/* Edit Admin Modal */}
      <EditAdminModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedAdminId(null)
        }}
        onSuccess={() => {
          fetchAdmins()
          setIsEditModalOpen(false)
          setSelectedAdminId(null)
        }}
        adminId={selectedAdminId}
      />
    </div>
  )
} 
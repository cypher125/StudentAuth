"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, ChevronLeft, ChevronRight, Edit, Trash2, Eye, Shield, User } from "lucide-react"
import { ButtonCustom } from "@/components/ui/button-custom"
import { useApi } from "@/hooks/use-api"
import { Admin } from "@/app/types"
import { fetchAllUsers } from '../../../lib/api'
import {
  Table,
  TableBody,
  TableCaption,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AddUserModalEnhanced } from "@/components/modals/AddUserModalEnhanced"
import { toast } from "sonner"

// Define User type
interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  faculty?: string
  department?: string
  role: 'admin' | 'student'
  // Additional fields that might be present
  username?: string
  matric_number?: string
  class_year?: string
  course?: string
}

export default function UsersPage() {
  const { getAdminProfile } = useApi()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const itemsPerPage = 5
  const [users, setUsers] = useState<User[]>([])
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setIsLoading(true)
        // In the future, this should be updated to getAdmins() once it's available in the API
        // For now, we'll just use the current admin profile
        const currentAdmin = await getAdminProfile()
        setAdmins([currentAdmin])
        setIsLoading(false)
      } catch (err: any) {
        console.error("Error fetching admins:", err)
        setError(err.message || "Failed to load admin users")
        setIsLoading(false)
      }
    }

    fetchAdmins()
  }, [getAdminProfile])

  // Fetch users on component mount
  useEffect(() => {
    const getUsers = async () => {
      try {
        setIsLoading(true)
        console.log('Fetching all users...')
        const fetchedUsers = await fetchAllUsers()
        console.log('Users fetched successfully:', fetchedUsers)
        setUsers(fetchedUsers)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch users:', err)
        // Show more detailed error message
        const errorMessage = err.message || 'Failed to fetch users'
        setError(`${errorMessage}. Please try again later.`)
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    getUsers()
  }, [])

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.matric_number?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter ? user.role === roleFilter : true

    return matchesSearch && matchesRole
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

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

  // Role badge component
  const RoleBadge = ({ role }: { role: string }) => {
    const roleStyles = {
      admin: "bg-primary/10 text-primary",
      staff: "bg-accent/10 text-accent",
      student: "bg-neutral-gray/10 text-neutral-gray",
    }

    const style = roleStyles[role as keyof typeof roleStyles] || "bg-neutral-gray/10 text-neutral-gray"

    return (
      <span className={`${style} px-2 py-1 rounded-full text-xs flex items-center w-fit`}>
        {role === "admin" ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    )
  }

  // Create full name for display
  const getUserName = (user: User) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    return user.username || 'Unknown'
  }

  // Get department or faculty for display
  const getDepartment = (user: User) => {
    if (user.department) {
      return user.department
    }
    return user.faculty || 'Not specified'
  }

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // Replace with actual API call to delete user
        console.log(`Deleting user with ID: ${userId}`)
        toast.success("User deleted successfully")
        // Refresh the list
        const getUsers = async () => {
          try {
            setIsLoading(true)
            console.log('Fetching all users...')
            const fetchedUsers = await fetchAllUsers()
            console.log('Users fetched successfully:', fetchedUsers)
            setUsers(fetchedUsers)
            setError(null)
          } catch (err: any) {
            console.error('Failed to fetch users:', err)
            // Show more detailed error message
            const errorMessage = err.message || 'Failed to fetch users'
            setError(`${errorMessage}. Please try again later.`)
            setUsers([])
          } finally {
            setIsLoading(false)
          }
        }

        await getUsers()
      } catch (error) {
        console.error("Error deleting user:", error)
        toast.error("Failed to delete user")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-gray">Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-error mb-4">Error loading users: {error}</div>
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
            <CardTitle className="text-2xl font-bold">User Management</CardTitle>
            <CardDescription>
              Manage all users in the system
            </CardDescription>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsAddUserModalOpen(true)}>
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
            />
          </div>
            <div className="w-full md:w-40">
              <Select
                value={roleFilter || 'all'}
                onValueChange={(value) => setRoleFilter(value === 'all' ? null : value as string)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
        </div>
      </div>

          {isLoading ? (
            <div className="text-center py-10">Loading users...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => (
                      <TableRow key={`${user.role}-${user.id}`}>
                        <TableCell className="font-medium">
                          {getUserName(user)}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge 
                            className={user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}
                          >
                            {user.role === 'admin' ? 'Admin' : 'Student'}
                          </Badge>
                        </TableCell>
                        <TableCell>{getDepartment(user)}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-4 py-2 border-t">
                <div>
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-light-gray disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-dark-neutral">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-light-gray disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
                </div>
            </div>
          </div>
        )}
        </CardContent>
      </Card>

      <AddUserModalEnhanced
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSuccess={() => {
          // Refresh the list
          const getUsers = async () => {
            try {
              setIsLoading(true)
              console.log('Fetching all users...')
              const fetchedUsers = await fetchAllUsers()
              console.log('Users fetched successfully:', fetchedUsers)
              setUsers(fetchedUsers)
              setError(null)
            } catch (err: any) {
              console.error('Failed to fetch users:', err)
              // Show more detailed error message
              const errorMessage = err.message || 'Failed to fetch users'
              setError(`${errorMessage}. Please try again later.`)
              setUsers([])
            } finally {
              setIsLoading(false)
            }
          }

          getUsers()
          setIsAddUserModalOpen(false)
        }}
      />
    </div>
  )
}


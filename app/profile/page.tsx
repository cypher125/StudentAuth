"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ButtonCustom } from "@/components/ui/button-custom"
import { User, Mail, BookOpen, Calendar, AlertTriangle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useApi } from "@/hooks/use-api"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { getStudentProfile } = useApi()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        
        // Use the API to get student profile data
        const studentData = await getStudentProfile()

        // Format the name properly, ensuring both first and last name exist
        const firstName = studentData.firstName || studentData.first_name || '';
        const lastName = studentData.lastName || studentData.last_name || '';
        const fullName = `${lastName} ${firstName}`.trim() || 'Unknown';

        // Ensure we have proper date handling
        const createdDate = studentData.createdAt 
          ? new Date(studentData.createdAt) 
          : null;
        
        const enrollmentDateFormatted = createdDate
          ? createdDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          : 'Not available';

          setUserData({
          id: studentData.id,
          name: fullName,
          matricNumber: studentData.matricNumber || studentData.matric_number || 'Not available',
          department: studentData.department || 'Not available',
          level: studentData.class_year || 'Not available',
          email: studentData.email || 'Not available',
          faculty: studentData.faculty || 'Not available',
          course: studentData.course || 'Not available',
          grade: studentData.grade || 'Not available',
          enrollmentDate: enrollmentDateFormatted,
          photoUrl: studentData.faceImage || studentData.face_image || "/placeholder.svg?height=200&width=200",
          })

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load profile data. Please try again later.")
        setIsLoading(false)
      }
    }

      fetchUserData()
  }, [getStudentProfile])

  const handleSignOut = () => {
    logout()
    router.push("/login")
  }

  const handleReportIssue = () => {
    // In a real app, this would open a form or redirect to a support page
    alert("Report issue functionality would be implemented here.")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow flex items-center justify-center bg-light-bg">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-gray">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow flex items-center justify-center bg-light-bg">
          <div className="text-center max-w-md p-6">
            <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-dark-neutral mb-2">Error Loading Profile</h2>
            <p className="text-neutral-gray mb-6">{error}</p>
            <ButtonCustom 
              variant="primary" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </ButtonCustom>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow bg-light-bg py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-card p-6 mb-6 flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                  <Image
                    src={userData.photoUrl || "/placeholder.svg"}
                    alt={userData.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-dark-neutral mb-2">{userData.name}</h1>
                <p className="text-lg text-primary mb-1">{userData.matricNumber}</p>
                <p className="text-neutral-gray">
                  {userData.department} • {userData.level}
                </p>
              </div>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="text-xl font-bold text-dark-neutral mb-4">Personal Information</h2>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <User className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-neutral-gray">Full Name</p>
                      <p className="text-dark-neutral">{userData.name}</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <Mail className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-neutral-gray">Email</p>
                      <p className="text-dark-neutral">{userData.email}</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <User className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-neutral-gray">Student ID</p>
                      <p className="text-dark-neutral">{userData.id || 'Not available'}</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-neutral-gray">Enrollment Date</p>
                      <p className="text-dark-neutral">{userData.enrollmentDate}</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Academic Information */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="text-xl font-bold text-dark-neutral mb-4">Academic Information</h2>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <BookOpen className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-neutral-gray">Faculty</p>
                      <p className="text-dark-neutral">{userData.faculty}</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-neutral-gray">Department</p>
                      <p className="text-dark-neutral">{userData.department}</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <User className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-neutral-gray">Matriculation Number</p>
                      <p className="text-dark-neutral">{userData.matricNumber}</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-neutral-gray">Level</p>
                      <p className="text-dark-neutral">{userData.level}</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-neutral-gray">Grade</p>
                      <p className="text-dark-neutral">{userData.grade}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Courses Section - Separate Row */}
            <div className="bg-white rounded-lg shadow-card p-6 mb-6">
              <h2 className="text-xl font-bold text-dark-neutral mb-4">Courses</h2>
              <ul className="space-y-2">
                {userData.course && userData.course.split(',').map((course: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="min-w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-dark-neutral pt-0.5">{course.trim()}</p>
                  </li>
                ))}
                {!userData.course && (
                  <li className="text-neutral-gray italic">No courses registered</li>
                )}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <ButtonCustom variant="primary" onClick={handleSignOut} className="flex-1">
                Sign Out
              </ButtonCustom>
              <ButtonCustom variant="secondary" onClick={handleReportIssue} className="flex-1">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Report Issue
              </ButtonCustom>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Student, Admin, LoginCredentials } from "@/app/types"
import { authApi, adminApi, studentsApi } from "@/lib/api"
import { getAccessToken, setupTokenRefresh, clearTokens, storeTokens } from "@/lib/tokenService"

// Define user types and roles
export type UserRole = "admin" | "student" | "staff"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  matricNumber?: string
  department?: string
  level?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to convert API user to our User format
function convertApiUserToUser(apiUser: Student | Admin | any): User {
  // Check if it's a student (has matricNumber property)
  const isStudent = 'matricNumber' in apiUser || 'matric_number' in apiUser;
  
  // Handle camelCase or snake_case (API inconsistency)
  const firstName = apiUser.firstName || apiUser.first_name || '';
  const lastName = apiUser.lastName || apiUser.last_name || '';
  const matricNumber = apiUser.matricNumber || apiUser.matric_number || '';
  const department = apiUser.department || '';
  const classYear = apiUser.class_year || apiUser.level || '';
  
  // Create a proper name or fallback to username or Unknown
  const name = (firstName && lastName) 
    ? `${firstName} ${lastName}`
    : firstName || lastName || ('username' in apiUser ? apiUser.username : "Unknown");
  
  return {
    id: apiUser.id || '',
    name: name,
    email: apiUser.email || "",
    role: isStudent ? "student" : "admin",
    ...(isStudent && {
      matricNumber: matricNumber,
      department: department,
      level: classYear
    })
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // First check for access token
        const accessToken = getAccessToken();
        
        if (accessToken) {
          console.log('Found access token, fetching user profile');
          // Try to get profile from the API
          try {
            // Try as admin first
            const adminProfile = await adminApi.getProfile();
            if (adminProfile) {
              const userObject = convertApiUserToUser(adminProfile);
              userObject.role = "admin"; // Ensure role is set
              setUser(userObject);
              console.log('Admin profile found and set');
              
              // Store in cookie for backward compatibility
              Cookies.set("user", JSON.stringify(userObject), {
                expires: 7,
                path: "/",
                sameSite: "strict",
              });
              return;
            }
          } catch (adminError) {
            console.log('Not an admin, trying student profile');
            try {
              // Try as student
              const studentProfile = await studentsApi.getProfile();
              if (studentProfile) {
                const userObject = convertApiUserToUser(studentProfile);
                userObject.role = "student"; // Ensure role is set
                setUser(userObject);
                console.log('Student profile found and set');
                
                // Store in cookie for backward compatibility
                Cookies.set("user", JSON.stringify(userObject), {
                  expires: 7,
                  path: "/",
                  sameSite: "strict",
                });
                return;
              }
            } catch (studentError) {
              console.error('Failed to fetch student profile:', studentError);
            }
          }
        } else {
          // Fallback to cookie check for backward compatibility
          const storedUser = Cookies.get("user");
      if (storedUser) {
        try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              console.log('User loaded from cookie');
        } catch (error) {
              console.error("Failed to parse stored user:", error);
              Cookies.remove("user", { path: "/" });
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
    
    // Set up token refresh mechanism
    const cleanupTokenRefresh = setupTokenRefresh(() => {
      console.log('Token refresh failed, logging out');
      // If token refresh fails, log out the user
      setUser(null);
      clearTokens();
      Cookies.remove("user", { path: "/" });
      router.push("/login");
    });
    
    // Clean up token refresh on unmount
    return () => {
      cleanupTokenRefresh();
    };
  }, [router]);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await authApi.login(credentials);
      
      // Store JWT tokens using our tokenService
      if (response.token) {
        storeTokens(response.token, response.refresh);
      }
      
      if (response.user) {
        // Convert API user to our User format
        const userObject = convertApiUserToUser(response.user);
        setUser(userObject);
        
        // Set cookie for backward compatibility
        Cookies.set("user", JSON.stringify(userObject), {
          expires: 7,
          path: "/",
          sameSite: "strict",
        });
      }
      
      // Add a small delay before navigation to ensure data is stored
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Navigate based on role
      if (response.user) {
        // Use the role from the credentials to determine navigation
        if (credentials.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      }
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    // Clear all tokens and cookies
    clearTokens();
    Cookies.remove("user", { path: "/" });
    router.push("/login");
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    setUser,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


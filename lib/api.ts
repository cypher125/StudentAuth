import { Student, Admin, LoginCredentials, AuthResponse, RecognitionResponse } from "@/app/types";
import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  clearTokens,
  refreshAccessToken,
  setAuthFailed,
  addAuthHeader,
  ensureFreshToken
} from './tokenService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://studentauth.onrender.com/api';
//const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function for fetch requests with automatic token refresh
async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  // First, ensure we have a fresh token before making the request
  await ensureFreshToken();
  
  // Add auth header to options
  const authOptions = addAuthHeader(options);

  try {
    // Make the request with current token
    let response = await fetch(`${API_URL}${endpoint}`, authOptions);

  // Handle 401 Unauthorized - try to refresh token and retry
  if (response.status === 401) {
      console.log('Request returned 401, attempting token refresh');
      
    // Try to refresh the token
    const newToken = await refreshAccessToken();
    
    if (newToken) {
        console.log('Token refreshed successfully, retrying request');
        // Update auth header with new token
        const newOptions = {
        ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`
          }
        };
        
        // Retry with new token
        try {
          response = await fetch(`${API_URL}${endpoint}`, newOptions);
        } catch (error) {
          console.error("Failed to retry request after token refresh", error);
        }
      }
      
      // If still unauthorized after refresh, set auth failed flag
      if (response.status === 401) {
        console.error('Still unauthorized after token refresh');
        setAuthFailed();
      }
    }

    return response;
  } catch (error) {
    console.error(`Network error during fetchWithAuth to ${endpoint}:`, error);
    throw error;
  }
}

// Authentication API
export const authApi = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/users/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to login');
    }

    const data = await response.json();
    
    // Store tokens
      if (data.token) {
      storeTokens(data.token, data.refresh);
    }
    
    return data;
  },

  // Logout
  logout() {
    clearTokens();
  },

  // Verify token
  async verifyToken(): Promise<boolean> {
    try {
      const token = getAccessToken();
      if (!token) return false;
      
      const response = await fetch(`${API_URL}/users/token/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      if (!response.ok) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  },
  
  // Refresh token
  async refreshToken(): Promise<string | null> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return null;
    }
    
    try {
      const response = await fetch(`${API_URL}/users/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const data = await response.json();
      if (data.access) {
        storeTokens(data.access, refreshToken);
        return data.access;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }
};

// Students API
export const studentsApi = {
  // Get current student profile
  async getProfile(): Promise<Student> {
    const response = await fetchWithAuth('/users/students/profile/');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch student profile');
    }
    
    return response.json();
  },

  // Register new student
  async register(studentData: FormData): Promise<Student> {
    const response = await fetch(`${API_URL}/users/students/`, {
      method: 'POST',
      body: studentData, // Using FormData for file upload
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to register student');
    }
    
    return response.json();
  }
};

// Admin API
export const adminApi = {
  // Get current admin profile
  async getProfile(): Promise<Admin> {
    const response = await fetchWithAuth('/users/admins/profile/');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch admin profile');
    }
    
    return response.json();
  },

  // Get all students
  async getStudents(): Promise<Student[]> {
    try {
    const response = await fetchWithAuth('/users/students/');
    
    if (!response.ok) {
        console.error('Failed to fetch students:', response.status, response.statusText);
        throw new Error('Failed to fetch students');
      }
      
      const data = await response.json();
      console.log('Raw student data:', data);
      
      // Map backend field names to frontend field names and ensure all required fields exist
      return data.map((student: any) => ({
        id: student.id || '',
        firstName: student.first_name || '',
        lastName: student.last_name || '',
        matricNumber: student.matric_number || '',
        department: student.department || '',
        faculty: student.faculty || '',
        email: student.email || '',
        class_year: student.class_year || '',
        course: student.course || '',
        grade: student.grade || '',
        faceImage: student.face_image || '',
        
        // Keep original fields too
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        matric_number: student.matric_number || ''
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },
  
  // Get dashboard statistics
  async getDashboardStats(): Promise<any> {
    try {
      // Changed from /users/recognition/dashboard_stats/ to /recognition/dashboard_stats/
      const response = await fetchWithAuth('/recognition/dashboard_stats/');
    
    if (!response.ok) {
        console.error('Failed to fetch dashboard stats:', response.status, response.statusText);
        throw new Error('Failed to fetch dashboard statistics');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Return default data as fallback
      return {
        total_students: 0,
        verified_today: 0,
        failed_attempts: 0,
        avg_scan_time: 0
      };
    }
  },

  // Get a specific student with detailed information
  async getStudent(id: string): Promise<any> {
    try {
      const response = await fetchWithAuth(`/users/students/${id}/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch student details');
      }
      
      const data = await response.json();
      
      // Map to consistent field names
      return {
        id: data.id || '',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.user?.email || data.email || '',
        matricNumber: data.matric_number || '',
        faculty: data.faculty || '',
        department: data.department || '',
        level: data.class_year || '',
        course: data.course || '',
        grade: data.grade || '',
        faceImage: data.face_image || null,
        status: data.status || 'active',
        
        // Keep original fields too
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        matric_number: data.matric_number || '',
        class_year: data.class_year || '',
        face_image: data.face_image || null
      };
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },

  // Register a new student (creates both user and student profile)
  async registerStudent(studentData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    matricNumber: string;
    department: string;
    level: string;
    faculty?: string;
    course?: string;
    grade?: string;
  }) {
    const response = await fetchWithAuth('/users/students/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return response;
  },

  // Create a student (assuming user already exists)
  async createStudent(studentData: any) {
    const response = await fetchWithAuth('/users/students/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return response;
  },

  // Delete a student
  async deleteStudent(id: string) {
    const response = await fetchWithAuth(`/users/students/${id}/`, {
      method: 'DELETE',
    });
    return response;
  },

  // Register a new student with face image upload
  async registerStudentWithImage(formData: FormData): Promise<any> {
    const response = await fetchWithAuth('/users/register-student/', {
      method: 'POST',
      // Don't set Content-Type header when sending FormData
      // It will be set automatically with the correct boundary
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to register student with image');
    }
    
    return response.json();
  },
  
  // Register a new admin
  async registerAdmin(adminData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    department: string;
    faculty?: string;
    username?: string;
  }): Promise<any> {
    const response = await fetchWithAuth('/users/register-admin/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to register admin');
    }
    
    return response.json();
  },

  // Get all admins
  async getAdmins(): Promise<any[]> {
    try {
      const response = await fetchWithAuth('/users/admins/');
      
      if (!response.ok) {
        console.error('Failed to fetch admins:', response.status, response.statusText);
        throw new Error('Failed to fetch admins');
      }
      
      const data = await response.json();
      console.log('Raw admin data:', data);
      
      // Map backend field names to frontend field names
      return data.map((admin: any) => ({
        id: admin.id || '',
        firstName: admin.first_name || '',
        lastName: admin.last_name || '',
        username: admin.username || '',
        faculty: admin.faculty || '',
        email: admin.user?.email || '',
        
        // Keep original fields too
        first_name: admin.first_name || '',
        last_name: admin.last_name || ''
      }));
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },
  
  // Delete an admin
  async deleteAdmin(id: string) {
    const response = await fetchWithAuth(`/users/admins/${id}/`, {
      method: 'DELETE',
    });
    return response;
  },

  // Update a student's information
  async updateStudent(id: string, studentData: any): Promise<any> {
    try {
      const response = await fetchWithAuth(`/users/students/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update student');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },
  
  // Update a student with image
  async updateStudentWithImage(id: string, formData: FormData): Promise<any> {
    try {
      const response = await fetchWithAuth(`/users/students/${id}/`, {
        method: 'PATCH',
        // Don't set Content-Type with FormData
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to update student with image');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating student with image:', error);
      throw error;
    }
  },
  
  // Get a specific admin with detailed information
  async getAdmin(id: string): Promise<any> {
    try {
      const response = await fetchWithAuth(`/users/admins/${id}/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin details');
      }
      
      const data = await response.json();
      
      // Map to consistent field names
      return {
        id: data.id || '',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.user?.email || data.email || '',
        username: data.username || '',
        faculty: data.faculty || '',
        status: data.status || 'active',
        
        // Keep original fields too
        first_name: data.first_name || '',
        last_name: data.last_name || ''
      };
    } catch (error) {
      console.error('Error fetching admin:', error);
      throw error;
    }
  },
  
  // Update an admin's information
  async updateAdmin(id: string, adminData: any): Promise<any> {
    try {
      const response = await fetchWithAuth(`/users/admins/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update admin');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  },
  
  // Get a specific user with detailed information
  async getUser(id: string): Promise<any> {
    try {
      const response = await fetchWithAuth(`/users/users/${id}/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  
  // Update a user's information
  async updateUser(id: string, userData: any): Promise<any> {
    try {
      const response = await fetchWithAuth(`/users/users/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Create a new user
  async createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    department: string;
    password: string;
  }): Promise<any> {
    try {
      const response = await fetchWithAuth('/users/create_user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
};

// Recognition API
export const recognitionApi = {
  // Recognize face
  async recognizeFace(imageFile: File): Promise<RecognitionResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
    const response = await fetch(`${API_URL}/recognition/recognize/`, {
      method: 'POST',
      body: formData,
    });
    
      const data = await response.json();
      
      // If status is 404, it means no match found - this is a normal response, not an error
      if (response.status === 404) {
        console.log('No matching student found:', data);
        return {
          success: false,
          error: data.error || 'No matching student found',
          confidence: data.confidence || 0
        };
      }
      
      // For other non-200 responses, consider it an error
      if (!response.ok) {
        console.error('API error:', data);
        throw new Error(data.error || data.message || 'Face recognition failed');
      }
    
    // Store tokens if available in the response
      if (data.token) {
        storeTokens(data.token, data.refresh);
      }
      
      // Return the data as-is from the API, transformations will happen in the component
      return data;
    } catch (error) {
      console.error('Recognition error:', error);
      throw error;
    }
  },

  // Register face
  async registerFace(studentId: string, imageFile: File): Promise<{status: string, message: string}> {
    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('image', imageFile);
    
    const response = await fetchWithAuth('/recognition/register-face/', {
      method: 'POST',
      headers: {},
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to register face');
    }
    
    return response.json();
  }
};

// Function to fetch all users (both admins and students)
export const fetchAllUsers = async () => {
  try {
    // Get access token for authentication
    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make a direct request to the endpoint at /api/users/all-users/
    // This is where the backend has the endpoint defined
    const response = await fetch(`${API_URL}/users/all-users/`, {
      headers
    });
    
    console.log('Fetch all users response:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('Failed to fetch users:', response.status, response.statusText);
      throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Fetched users data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}; 
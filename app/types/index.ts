// Student type definition
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  matricNumber: string;
  faculty: string;
  department: string;
  class_year: string;
  course: string;
  grade: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  faceImage?: string;
  status?: string;
  
  // API response fields (snake_case)
  first_name?: string;
  last_name?: string;
  matric_number?: string;
  face_image?: string;
}

// Admin type definition
export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  faculty: string;
  email: string;
  password?: string; // Note: This should only be used for form handling, never stored
  createdAt: Date;
  updatedAt: Date;
}

// Face Recognition Response type - matching backend structure
export interface RecognitionResponse {
  success: boolean;
  confidence?: number;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    matric_number: string;
    department: string;
    class_year: string;
  };
  token?: string;
  refresh?: string;
  error?: string;
  errorCode?: string;
}

// API Response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errorCode?: string;
}

// Authentication types
export interface LoginCredentials {
  role: 'admin' | 'student';
  // Admin login
  email?: string;
  password?: string;
  // Student login
  matric_number?: string;
  surname?: string;
}

export interface AuthResponse {
  token: string;
  refresh?: string;
  user: Student | Admin;
}

// Face Registration type
export interface FaceRegistrationData {
  userId: string;
  faceImage: string; // base64 encoded image
}

// Student Registration type
export interface StudentRegistrationData {
  firstName: string;
  lastName: string;
  matricNumber: string;
  faculty: string;
  department: string;
  class: string;
  course: string;
  grade: string;
  email?: string;
  faceImage: string; // base64 encoded image
}

// Admin Registration type
export interface AdminRegistrationData {
  firstName: string;
  lastName: string;
  username: string;
  faculty: string;
  email: string;
  password: string;
} 
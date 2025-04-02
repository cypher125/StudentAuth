"use client"

import { useState, useCallback } from 'react';
import { authApi, studentsApi, adminApi, recognitionApi } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { Student, Admin, LoginCredentials, RecognitionResponse } from '@/app/types';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function useApi() {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication
  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      // User is now set in the auth context directly
      return response;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    
    // Clear tokens from local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, [setUser]);

  const verifyToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await authApi.verifyToken();
    } catch (err: any) {
      setError(err.message || 'Token verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await authApi.refreshToken();
    } catch (err: any) {
      setError(err.message || 'Token refresh failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Student
  const getStudentProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentsApi.getProfile();
      
      // Ensure all required fields are present before returning
      // Also map snake_case API fields to camelCase for frontend consistency
      return {
        id: data.id || '',
        firstName: data.firstName || data.first_name || '',
        lastName: data.lastName || data.last_name || '',
        matricNumber: data.matricNumber || data.matric_number || '',
        department: data.department || '',
        class_year: data.class_year || '',
        faculty: data.faculty || '',
        course: data.course || '',
        grade: data.grade || '',
        email: data.email || '',
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date(),
        faceImage: data.faceImage || data.face_image || '',
        
        // Keep original API fields
        first_name: data.first_name || data.firstName || '',
        last_name: data.last_name || data.lastName || '',
        matric_number: data.matric_number || data.matricNumber || '',
        face_image: data.face_image || data.faceImage || ''
      };
    } catch (err: any) {
      setError(err.message || 'Failed to fetch student profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerStudent = useCallback(async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      return await studentsApi.register(data);
    } catch (err: any) {
      setError(err.message || 'Failed to register student');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Admin
  const getAdminProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await adminApi.getProfile();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await adminApi.getStudents();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch students');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await adminApi.getDashboardStats();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard statistics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Recognition
  const recognizeFace = useCallback(async (imageFile: File): Promise<RecognitionResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await recognitionApi.recognizeFace(imageFile);
      
      // Debug the response structure
      console.log('API response for face recognition:', response);
      
      // Add additional response validation
      if (response && typeof response.success === 'boolean') {
        return response;
      } else {
        console.error('Invalid response format:', response);
        return {
          success: false,
          error: 'Invalid response format from server'
        };
      }
    } catch (err: any) {
      setError(err.message || 'Face recognition failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerFace = useCallback(async (studentId: string, imageFile: File) => {
    setLoading(true);
    setError(null);
    try {
      return await recognitionApi.registerFace(studentId, imageFile);
    } catch (err: any) {
      setError(err.message || 'Failed to register face');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    loading,
    error,
    
    // Auth methods
    login,
    logout,
    verifyToken,
    refreshToken,
    
    // Student methods
    getStudentProfile,
    registerStudent,
    
    // Admin methods
    getAdminProfile,
    getStudents,
    getDashboardStats,
    
    // Recognition methods
    recognizeFace,
    registerFace,
  };
} 
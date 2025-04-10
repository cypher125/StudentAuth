"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ButtonCustom } from "@/components/ui/button-custom"
import { Camera, X, AlertCircle, CheckCircle2, Info, UserCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useApi } from "@/hooks/use-api"
import { User as AuthUser, UserRole } from "@/context/auth-context"

// Token storage keys - must match api.ts
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Define UserData interface to match the API response structure
interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  matric_number?: string;
  department?: string;
  class_year?: string;
}

export default function ScanPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const { recognizeFace } = useApi()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanningStatus, setScanningStatus] = useState<"waiting" | "scanning" | "captured" | "processing" | "complete" | "error">("waiting")
  const [scanProgress, setScanProgress] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const [recognizedName, setRecognizedName] = useState<string | null>(null)

  // Function to stop the camera stream
  const stopCameraStream = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks()
      tracks.forEach((track) => {
        track.stop()
      })
      streamRef.current = null

      // Clear video source
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }

      console.log("Camera stream stopped")
    }
  }

  // Initialize camera when component mounts
  useEffect(() => {
        startVideo()

    // Clean up function to stop camera when component unmounts
    return () => {
      stopCameraStream()
    }
  }, [])

  const startVideo = async () => {
    try {
      // Stop any existing stream first
      stopCameraStream()

      // Start a new stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true)
        }
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera access to use facial recognition.")
    }
  }

  // Helper function to capture current frame from video
  const captureFrame = async (): Promise<Blob | null> => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return null;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  }

  const handleScan = async () => {
    setScanningStatus("scanning")
    setShowInstructions(false)
    setError(null)

    try {
      // Capture the current frame
      const imageBlob = await captureFrame();
      
      if (!imageBlob) {
        throw new Error("Failed to capture image. Please try again.");
      }
      
      // Update status to show face captured
      setScanningStatus("captured");
      setScanProgress(30);
      
      // Short delay to show the face captured message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update to processing state
      setScanningStatus("processing");
      
      // Progress update for UX during processing
      let progress = 30;
      const interval = setInterval(() => {
        progress += 3;
        setScanProgress(Math.min(progress, 95)); // Keep at 95% until API response
      }, 100);
      
      // Create a File object from the Blob
      const imageFile = new File([imageBlob], "face-scan.jpg", { type: "image/jpeg" });
      
      // Send to backend for recognition
      const result = await recognizeFace(imageFile);
      
      // Debug log to see the exact structure of the result
      console.log("Recognition result:", result);
      
      clearInterval(interval);
      setScanProgress(100);
      
      // Check if recognition was successful
      if (result.success === true) {
        // Success case - API result format from backend is different from what frontend expects
        const userData = result.user as UserData;
        if (userData && userData.first_name && userData.last_name) {
          setRecognizedName(`${userData.first_name} ${userData.last_name}`);
        } else {
          setRecognizedName("Unknown User");
        }
        
        setScanningStatus("complete");
        
        console.log("Recognition successful, user data:", userData);
        
        // Set user in authentication context
        // Convert API response to User format
        const user: AuthUser = {
          id: userData.id,
          name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email || (userData.matric_number ? `${userData.matric_number.toLowerCase()}@student.yabatech.edu.ng` : 'unknown@student.yabatech.edu.ng'),
          role: "student" as UserRole,
          matricNumber: userData.matric_number,
          department: userData.department,
          level: userData.class_year
        };
        
        setUser(user);
        
        // Store user in cookie for middleware authentication
        try {
          document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=86400`;
          console.log("User cookie set for middleware authentication");
        } catch (error) {
          console.error("Error setting user cookie:", error);
        }
        
        // Store tokens if available
        if (result.token) {
          localStorage.setItem(ACCESS_TOKEN_KEY, result.token);
          console.log("Token stored");
        }
        
        if (result.refresh) {
          localStorage.setItem(REFRESH_TOKEN_KEY, result.refresh);
          console.log("Refresh token stored");
        }
        
        // Redirect after a short delay
        console.log("Redirecting to profile page in 1.5 seconds...");
          setTimeout(() => {
          console.log("Executing redirect to /profile");
          router.push("/profile");
        }, 1500);
      } else {
        // No match found - handle this gracefully without throwing an error
        console.log("Recognition failed:", result);
        // Display the error message from the API or a default message
        setError(result.error || "No matching student found");
        setScanningStatus("error");
      }
    } catch (err: any) {
      console.error("Scan error:", err);
      // If it's a network error or other unexpected error
      setError(err.message || "Face recognition failed. Please try again or use manual login.");
      setScanningStatus("error");
    }
  }

  const cancelScan = () => {
    // Stop the camera before navigating away
    stopCameraStream()
    router.push("/")
  }

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions)
  }

  const goToManualLogin = () => {
    // Stop the camera before navigating away
    stopCameraStream()
    router.push("/login")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow bg-light-bg py-4 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-dark-neutral text-center">
              Facial Recognition
            </h1>

            <div className="bg-white rounded-lg shadow-card overflow-hidden">
              {/* Camera View - Increased height for mobile */}
              <div className="relative aspect-[4/5] sm:aspect-video bg-black">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-neutral/90">
                    <div className="text-white text-center">
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p>Loading facial recognition system...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-neutral/90">
                    <div className="text-white text-center p-6">
                      <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
                      <p className="text-lg mb-4">{error}</p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <ButtonCustom
                        variant="primary"
                          onClick={() => {
                            setError(null);
                            setScanningStatus("waiting");
                            startVideo();
                          }}
                        className="h-12 px-6 text-base"
                      >
                        Try Again
                      </ButtonCustom>
                        <ButtonCustom
                          variant="secondary"
                          onClick={goToManualLogin}
                          className="h-12 px-6 text-base"
                        >
                          Manual Login
                        </ButtonCustom>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Instructions Overlay */}
                    {showInstructions && scanningStatus === "waiting" && (
                      <div className="absolute inset-0 bg-dark-neutral/75 flex items-center justify-center p-6">
                        <div className="bg-white rounded-lg p-6 max-w-md text-center">
                          <h3 className="text-xl font-bold mb-4">Face Recognition Instructions</h3>
                          <ul className="text-left mb-6 space-y-2">
                            <li className="flex items-start">
                              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 mt-0.5">
                                1
                              </span>
                              Ensure your face is well-lit and clearly visible
                            </li>
                            <li className="flex items-start">
                              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 mt-0.5">
                                2
                              </span>
                              Position your face within the frame
                            </li>
                            <li className="flex items-start">
                              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 mt-0.5">
                                3
                              </span>
                              Look directly at the camera
                            </li>
                            <li className="flex items-start">
                              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 mt-0.5">
                                4
                              </span>
                              Press the scan button when ready
                            </li>
                          </ul>
                          <ButtonCustom
                            variant="primary"
                            onClick={toggleInstructions}
                            className="w-full h-12 text-base"
                          >
                            Got It
                          </ButtonCustom>
                        </div>
                      </div>
                    )}

                    {/* Scanning Overlay */}
                    {scanningStatus === "scanning" && (
                      <div className="absolute inset-0 bg-dark-neutral/50 flex flex-col items-center justify-center">
                        <div className="w-48 h-48 border-4 border-primary rounded-full animate-pulse mb-4" />
                        <div className="text-white text-center">
                          <p className="text-lg mb-2">Scanning...</p>
                          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300 ease-in-out"
                              style={{ width: `${scanProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Face Captured Overlay */}
                    {scanningStatus === "captured" && (
                      <div className="absolute inset-0 bg-dark-neutral/75 flex flex-col items-center justify-center">
                        <div className="w-48 h-48 border-4 border-success rounded-full mb-4 flex items-center justify-center">
                          <CheckCircle2 className="w-16 h-16 text-success" />
                        </div>
                        <div className="text-white text-center">
                          <p className="text-xl font-bold mb-2">Face Captured!</p>
                          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-success transition-all duration-300 ease-in-out"
                              style={{ width: `${scanProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Processing Overlay */}
                    {scanningStatus === "processing" && (
                      <div className="absolute inset-0 bg-dark-neutral/75 flex flex-col items-center justify-center">
                        <div className="relative w-48 h-48 mb-4">
                          {/* Circular container */}
                          <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                          
                          {/* Rotating arc - rolling scanner effect */}
                          <div className="absolute inset-0 rounded-full overflow-hidden">
                            <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        </div>
                        <div className="text-white text-center">
                          <p className="text-xl font-bold mb-2">Processing...</p>
                          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300 ease-in-out"
                              style={{ width: `${scanProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Success Overlay */}
                    {scanningStatus === "complete" && (
                      <div className="absolute inset-0 bg-dark-neutral/90 flex flex-col items-center justify-center text-white text-center">
                        <CheckCircle2 className="w-24 h-24 text-success mb-4" />
                        <p className="text-2xl font-bold mb-2">Face Recognized</p>
                        <p className="text-xl mb-4">Welcome, {recognizedName}</p>
                        <p>Redirecting to your profile...</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Control Panel */}
              <div className="p-4 md:p-6 border-t border-light-gray">
                {scanningStatus === "waiting" && !error && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <ButtonCustom
                      variant="primary"
                      onClick={handleScan}
                      disabled={!isCameraReady}
                      className="flex-grow h-12 text-base"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      {showInstructions ? "Start Scan" : "Scan Face"}
                    </ButtonCustom>
                    <button
                      onClick={toggleInstructions}
                      className="flex items-center justify-center text-primary"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      {showInstructions ? "Hide Instructions" : "Show Instructions"}
                    </button>
                  </div>
                )}

                {(scanningStatus === "scanning" || scanningStatus === "processing" || scanningStatus === "complete") && (
                  <div className="flex justify-between">
                    <ButtonCustom variant="secondary" onClick={cancelScan} disabled={scanningStatus === "complete"}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </ButtonCustom>
                    <Link href="/login" className="text-primary hover:underline flex items-center">
                      <UserCircle className="mr-1 h-4 w-4" />
                      Manual Login
                    </Link>
                  </div>
                )}

                {/* Help Text */}
                <p className="text-center text-neutral-gray text-sm mt-4">
                  Having trouble? Try using better lighting or{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    manual login
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


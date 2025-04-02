"use client"

import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ButtonCustom } from "@/components/ui/button-custom"
import { AlertTriangle, RefreshCw, UserCircle, LifeBuoy } from "lucide-react"

export default function ErrorPage() {
  const router = useRouter()

  const handleTryAgain = () => {
    router.push("/scan")
  }

  const handleManualLogin = () => {
    // In a real app, this would redirect to a manual login page
    alert("Manual login functionality would be implemented here.")
  }

  const handleContactSupport = () => {
    // In a real app, this would open a support form or contact page
    alert("Contact support functionality would be implemented here.")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow bg-light-bg py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-card p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/10 mb-6">
                <AlertTriangle className="h-10 w-10 text-error" />
              </div>

              <h1 className="text-3xl font-bold text-dark-neutral mb-4">Recognition Failed</h1>

              <p className="text-neutral-gray mb-6">
                We couldn't recognize your face. This could be due to lighting conditions, camera positioning, or your
                profile may not be registered in our system.
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-light-gray rounded-lg p-4 text-left">
                  <h3 className="font-bold text-dark-neutral mb-2">Troubleshooting Tips:</h3>
                  <ul className="space-y-2 text-neutral-gray">
                    <li className="flex items-start">
                      <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                        1
                      </span>
                      <span>Ensure you're in a well-lit environment.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                        2
                      </span>
                      <span>Position your face directly in front of the camera.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                        3
                      </span>
                      <span>Remove glasses, hats, or anything covering your face.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                        4
                      </span>
                      <span>Verify that you're registered in the system.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <ButtonCustom variant="primary" onClick={handleTryAgain} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </ButtonCustom>
                <ButtonCustom variant="secondary" onClick={handleManualLogin} className="w-full">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Manual Login
                </ButtonCustom>
                <ButtonCustom variant="tertiary" onClick={handleContactSupport} className="w-full">
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Contact Support
                </ButtonCustom>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


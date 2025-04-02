import { Shield, UserCheck, Clock, Lock } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ButtonCustom } from "@/components/ui/button-custom"
import { FeatureCard } from "@/components/feature-card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary min-h-screen flex items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light"></div>

          {/* Animated scanning elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[10%] right-[5%] w-32 h-32 rounded-full border-2 border-accent/30 animate-pulse-slow"></div>
            <div className="absolute top-[30%] left-[8%] w-20 h-20 rounded-full border border-white/20 animate-float"></div>
            <div className="absolute bottom-[15%] right-[15%] w-40 h-40 rounded-full border border-white/10 animate-spin-slow"></div>
            <div className="absolute top-[60%] left-[20%] w-24 h-24 rounded-full border border-accent/20 animate-pulse"></div>

            {/* Scanning lines */}
            <div className="absolute top-[20%] left-0 right-0 h-px bg-accent/30 animate-scan"></div>
            <div
              className="absolute top-[40%] left-0 right-0 h-px bg-white/20 animate-scan"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-[70%] left-0 right-0 h-px bg-accent/20 animate-scan"
              style={{ animationDelay: "1s" }}
            ></div>

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)",
                  backgroundSize: "50px 50px",
                }}
              ></div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-12 md:mb-0 text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>Yabatech Facial Recognition System</h1>
                <p className="text-lg md:text-xl mb-8 opacity-0 max-w-xl animate-slide-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                  Secure, fast, and reliable authentication using advanced facial recognition technology. Designed
                  specifically for Yabatech students and staff.
                </p>
                <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row opacity-0 animate-fade-in" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
                  <Link href="/scan">
                    <ButtonCustom
                      variant="secondary"
                      size="lg"
                      className="shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto hover:scale-105 transform"
                    >
                      Start Recognition
                    </ButtonCustom>
                  </Link>
                  <Link href="/about">
                    <ButtonCustom
                      variant="tertiary"
                      size="lg"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full md:w-auto hover:scale-105 transform transition-transform"
                    >
                      Learn More
                    </ButtonCustom>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-12 max-w-xl opacity-0 animate-fade-in" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
                  <div className="text-center transform hover:scale-110 transition-transform duration-300">
                    <p className="text-3xl font-bold text-accent">99.8%</p>
                    <p className="text-sm opacity-80">Accuracy Rate</p>
                  </div>
                  <div className="text-center transform hover:scale-110 transition-transform duration-300">
                    <p className="text-3xl font-bold text-accent">&lt;2s</p>
                    <p className="text-sm opacity-80">Recognition Time</p>
                  </div>
                  <div className="text-center transform hover:scale-110 transition-transform duration-300">
                    <p className="text-3xl font-bold text-accent">5000+</p>
                    <p className="text-sm opacity-80">Users Enrolled</p>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 flex justify-center opacity-0 animate-zoom-in" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
                <div className="relative w-full max-w-md h-80 md:h-96 bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  {/* Face outline animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-accent flex items-center justify-center animate-pulse-slow">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white/50 flex items-center justify-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-md"></div>
                      </div>
                    </div>
                  </div>

                  {/* Scanning animation */}
                  <div className="absolute inset-x-0 top-1/4 h-px bg-accent/50 animate-scan"></div>
                  <div
                    className="absolute inset-x-0 top-2/4 h-px bg-white/30 animate-scan"
                    style={{ animationDelay: "0.7s" }}
                  ></div>
                  <div
                    className="absolute inset-x-0 top-3/4 h-px bg-accent/30 animate-scan"
                    style={{ animationDelay: "1.4s" }}
                  ></div>

                  {/* Corner markers */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent/80 animate-pulse"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent/80 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent/80 animate-pulse" style={{ animationDelay: "1s" }}></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent/80 animate-pulse" style={{ animationDelay: "1.5s" }}></div>

                  {/* Status text */}
                  <div className="absolute bottom-6 inset-x-0 text-center">
                    <div className="inline-block bg-black/30 backdrop-blur-md text-white text-sm px-3 py-1 rounded-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]">
                      Ready for scanning
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce-slow">
            <div className="flex flex-col items-center">
              <span className="text-sm mb-2">Scroll to explore</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-dark-neutral opacity-0 animate-slide-down" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="opacity-0 animate-scale-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <FeatureCard
                icon={Shield}
                title="Secure Authentication"
                description="Advanced facial recognition technology ensures secure and reliable authentication."
                  className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              />
              </div>
              <div className="opacity-0 animate-scale-in" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              <FeatureCard
                icon={Clock}
                title="Quick Access"
                description="Get authenticated in seconds with our fast processing system."
                  className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              />
              </div>
              <div className="opacity-0 animate-scale-in" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
              <FeatureCard
                icon={UserCheck}
                title="User Friendly"
                description="Intuitive interface designed for ease of use by all Yabatech members."
                className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              />
              </div>
              <div className="opacity-0 animate-scale-in" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
              <FeatureCard
                icon={Lock}
                title="Data Protection"
                description="Your biometric data is encrypted and securely stored following best practices."
                className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-primary/5 to-white opacity-50"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl font-bold mb-4 text-dark-neutral opacity-0 animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>Ready to Get Started?</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              Experience the future of campus authentication. Fast, secure, and convenient.
            </p>
            <div className="opacity-0 animate-rotate-in" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
            <Link href="/scan">
              <ButtonCustom
                variant="primary"
                size="lg"
                  className="shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300"
              >
                Start Recognition
              </ButtonCustom>
            </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


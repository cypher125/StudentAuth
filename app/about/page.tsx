import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ButtonCustom } from "@/components/ui/button-custom"
import { Github, Linkedin, Mail } from "lucide-react"

// Mock data for team members - replace with actual student information
const teamMembers = [
  {
    id: 1,
    name: "Osoba Adejare",
    role: "Backend Developer",
    bio: "Final year Computer Science student with a passion for UI/UX design and frontend development. Specializes in React and Next.js.",
    imageUrl: "/jare.jpg?height=300&width=300",
    github: "https://github.com/adebayo",
    linkedin: "https://linkedin.com/in/adebayo",
    email: "osobaadejare@gmail.com",
  },
  {
    id: 2,
    name: "Michael Bethel Ikechukwu",
    role: "Backend Developer",
    bio: "Computer Engineering student with strong skills in Python and Django. Responsible for the facial recognition API and database architecture.",
    imageUrl: "/mithel2.jpg?height=300&width=300",
    github: "https://github.com/chioma",
    linkedin: "https://linkedin.com/in/chioma",
    email: "michaelbethel789@gmail.com",
  },
  {
    id: 3,
    name: "Olumide Taiwo",
    role: "Frontend Developer",
    bio: "Mathematics and Computer Science student specializing in machine learning and computer vision. Implemented the facial recognition algorithms.",
    imageUrl: "/olu.jpg?height=300&width=300",
    github: "https://github.com/taiwo",
    linkedin: "https://linkedin.com/in/taiwo",
    email: "taiwo.a@student.yabatech.edu.ng",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow bg-light-bg">
        {/* Hero Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Project</h1>
            <p className="text-lg max-w-3xl mx-auto opacity-90">
              Learn about the Yabatech Facial Recognition System and the talented students behind its development.
            </p>
          </div>
        </section>

        {/* About the System */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-dark-neutral text-center">The Facial Recognition System</h2>

              <div className="bg-white rounded-lg shadow-card p-6 md:p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                      <Image
                        src="recognition.jpeg?height=400&width=400"
                        alt="Facial Recognition System"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <h3 className="text-xl font-bold mb-4 text-primary">Project Overview</h3>
                    <p className="text-neutral-gray mb-4">
                      The Yabatech Facial Recognition System is a cutting-edge authentication solution designed
                      specifically for Yaba College of Technology. It provides a secure, efficient, and contactless
                      method for student and staff identification across campus facilities.
                    </p>
                    <p className="text-neutral-gray mb-4">
                      Using advanced computer vision and machine learning algorithms, our system can accurately identify
                      registered individuals in real-time, enhancing security while streamlining access to various
                      campus services.
                    </p>

                    <h3 className="text-xl font-bold mb-4 text-primary mt-6">Technology Stack</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="bg-light-gray rounded-md p-3 text-center">
                        <p className="font-semibold text-dark-neutral">Next.js</p>
                        <p className="text-sm text-neutral-gray">Frontend</p>
                      </div>
                      <div className="bg-light-gray rounded-md p-3 text-center">
                        <p className="font-semibold text-dark-neutral">Django</p>
                        <p className="text-sm text-neutral-gray">Backend</p>
                      </div>
                      <div className="bg-light-gray rounded-md p-3 text-center">
                        <p className="font-semibold text-dark-neutral">TensorFlow</p>
                        <p className="text-sm text-neutral-gray">ML Model</p>
                      </div>
                      <div className="bg-light-gray rounded-md p-3 text-center">
                        <p className="font-semibold text-dark-neutral">PostgreSQL</p>
                        <p className="text-sm text-neutral-gray">Database</p>
                      </div>
                      <div className="bg-light-gray rounded-md p-3 text-center">
                        <p className="font-semibold text-dark-neutral">Docker</p>
                        <p className="text-sm text-neutral-gray">Deployment</p>
                      </div>
                      <div className="bg-light-gray rounded-md p-3 text-center">
                        <p className="font-semibold text-dark-neutral">AWS</p>
                        <p className="text-sm text-neutral-gray">Cloud Infrastructure</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-card p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6 text-primary">Key Features</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-light-gray rounded-lg p-5">
                    <h4 className="font-bold text-dark-neutral mb-2">Real-time Recognition</h4>
                    <p className="text-neutral-gray">
                      Fast and accurate facial recognition with response times under 2 seconds, even in challenging
                      lighting conditions.
                    </p>
                  </div>

                  <div className="border border-light-gray rounded-lg p-5">
                    <h4 className="font-bold text-dark-neutral mb-2">Secure Authentication</h4>
                    <p className="text-neutral-gray">
                      Multi-factor biometric authentication with liveness detection to prevent spoofing attempts.
                    </p>
                  </div>

                  <div className="border border-light-gray rounded-lg p-5">
                    <h4 className="font-bold text-dark-neutral mb-2">Privacy Protection</h4>
                    <p className="text-neutral-gray">
                      All biometric data is encrypted and stored securely following industry best practices and data
                      protection regulations.
                    </p>
                  </div>

                  <div className="border border-light-gray rounded-lg p-5">
                    <h4 className="font-bold text-dark-neutral mb-2">Seamless Integration</h4>
                    <p className="text-neutral-gray">
                      Integrates with existing Yabatech systems including student management and access control systems.
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Link href="/scan">
                    <ButtonCustom variant="primary">Try the System</ButtonCustom>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2 text-dark-neutral text-center">Meet the Team</h2>
            <p className="text-neutral-gray text-center max-w-2xl mx-auto mb-12">
              Our talented team of Yabatech students combined their skills and expertise to bring this project to life.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-light-bg rounded-lg shadow-card overflow-hidden transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="relative w-full aspect-square">
                    <Image
                      src={member.imageUrl || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-xl text-dark-neutral">{member.name}</h3>
                    <p className="text-primary text-sm mb-2">{member.role}</p>
                    <p className="text-neutral-gray text-sm mb-4">{member.bio}</p>

                    <div className="flex space-x-3">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-gray hover:text-primary transition-colors"
                        aria-label={`${member.name}'s GitHub`}
                      >
                        <Github size={18} />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-gray hover:text-primary transition-colors"
                        aria-label={`${member.name}'s LinkedIn`}
                      >
                        <Linkedin size={18} />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-neutral-gray hover:text-primary transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Journey */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-dark-neutral text-center">Our Journey</h2>

              <div className="bg-white rounded-lg shadow-card p-6 md:p-8">
                <div className="relative border-l-2 border-primary pl-8 pb-8">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-bold text-dark-neutral mb-2">Project Inception</h3>
                  <p className="text-neutral-gray mb-2">September 2023</p>
                  <p className="text-neutral-gray">
                    The project began as a final year project proposal, aiming to solve the challenges of student
                    identification and authentication on campus.
                  </p>
                </div>

                <div className="relative border-l-2 border-primary pl-8 pb-8">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-bold text-dark-neutral mb-2">Research & Planning</h3>
                  <p className="text-neutral-gray mb-2">October - November 2023</p>
                  <p className="text-neutral-gray">
                    Extensive research on facial recognition technologies, security considerations, and user experience
                    design for biometric systems.
                  </p>
                </div>

                <div className="relative border-l-2 border-primary pl-8 pb-8">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-bold text-dark-neutral mb-2">Development Phase</h3>
                  <p className="text-neutral-gray mb-2">December 2023 - February 2024</p>
                  <p className="text-neutral-gray">
                    Building the core system components, including the facial recognition engine, backend API, and
                    frontend interface.
                  </p>
                </div>

                <div className="relative border-l-2 border-primary pl-8 pb-8">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-bold text-dark-neutral mb-2">Testing & Refinement</h3>
                  <p className="text-neutral-gray mb-2">March - April 2024</p>
                  <p className="text-neutral-gray">
                    Rigorous testing with a diverse group of students and staff, followed by system refinements based on
                    feedback.
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-bold text-dark-neutral mb-2">Deployment</h3>
                  <p className="text-neutral-gray mb-2">May 2024</p>
                  <p className="text-neutral-gray">
                    Official launch of the Yabatech Facial Recognition System, with ongoing support and feature
                    enhancements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Acknowledgements */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Acknowledgements</h2>
            <p className="max-w-3xl mx-auto mb-8 opacity-90">
              We extend our sincere gratitude to the following individuals and departments for their support and
              guidance throughout this project:
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-bold text-xl mb-3">Faculty Advisors</h3>
                <p className="opacity-90">Dr. Oluwaseun Adebayo</p>
                <p className="opacity-90">Prof. Chinedu Eze</p>
                <p className="opacity-90">Mrs. Folashade Ogunleye</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-bold text-xl mb-3">Departments</h3>
                <p className="opacity-90">Computer Science Department</p>
                <p className="opacity-90">ICT Center</p>
                <p className="opacity-90">Student Affairs</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-bold text-xl mb-3">Special Thanks</h3>
                <p className="opacity-90">Yabatech Management</p>
                <p className="opacity-90">Student Volunteers</p>
                <p className="opacity-90">Open Source Community</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-dark-neutral">Have Questions?</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto mb-8">
              We're happy to provide more information about our project or discuss potential collaborations.
            </p>
            <Link href="/contact">
              <ButtonCustom variant="primary" size="lg">
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </ButtonCustom>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


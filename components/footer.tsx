import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-light-gray py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative w-10 h-10 mr-2">
              <Image src="/logoyct.png?height=40&width=40" alt="Yabatech Logo" fill className="object-contain" />
            </div>
            <div>
              <p className="font-montserrat font-bold text-primary">Student Auth</p>
              <p className="text-neutral-gray text-sm">© {currentYear} Yaba College of Technology</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <Link
              href="/privacy"
              className="text-neutral-gray hover:text-primary transition-colors text-sm text-center md:text-left"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-neutral-gray hover:text-primary transition-colors text-sm text-center md:text-left"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-neutral-gray hover:text-primary transition-colors text-sm text-center md:text-left"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


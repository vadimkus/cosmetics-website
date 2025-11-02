// import Link from 'next/link' // Unused for now
import Image from 'next/image'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', showText: _showText = true, size = 'md' }: LogoProps) {
  // const sizeClasses = {
  //   sm: 'h-24 w-24',
  //   md: 'h-40 w-40', 
  //   lg: 'h-64 w-64'
  // } // Unused for now

  // const textSizeClasses = {
  //   sm: 'text-lg',
  //   md: 'text-2xl',
  //   lg: 'text-4xl'
  // } // Unused for now

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        {/* Logo Image */}
        <div className="flex-shrink-0">
          <Image
            src="/images/genosys-logo.png"
            alt="GENOSYS professional logo"
            width={size === 'sm' ? 128 : size === 'md' ? 240 : 400}
            height={size === 'sm' ? 128 : size === 'md' ? 240 : 400}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}

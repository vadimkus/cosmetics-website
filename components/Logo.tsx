import Image from 'next/image'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', showText: _showText = true, size = 'md' }: LogoProps) {

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        {/* Logo Image */}
        <div className="flex-shrink-0">
          <Image
            src="/images/genosys-logo.png"
            alt="GENOSYS Middle East FZ-LLC - Professional Korean Dermacosmetics Brand Logo"
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

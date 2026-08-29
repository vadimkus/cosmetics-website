'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { 
  Camera, Sparkles, RefreshCw, Share2, X, Loader2
} from 'lucide-react'

// Power Animals with their characteristics
const POWER_ANIMALS = [
  {
    id: 'lion',
    name: 'Lion',
    emoji: '🦁',
    traits: ['Majestic', 'Bold', 'Natural Leader'],
    skinRoutine: 'To maintain this regal complexion, apply raw gazelle extract daily. Sunbathe for 16 hours minimum. Avoid water at all costs - real kings don\'t bathe. Roar at moisturizer.',
    habitat: 'African Savanna',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'eagle',
    name: 'Eagle',
    emoji: '🦅',
    traits: ['Sharp-eyed', 'Fierce', 'Freedom-loving'],
    skinRoutine: 'Exfoliate with mountain wind at 10,000 feet altitude. Apply fish oil directly from fresh catch. Screech at the sun for vitamin D absorption. Never look down - it causes wrinkles.',
    habitat: 'Mountain Peaks',
    color: 'from-slate-600 to-slate-800',
    bgColor: 'bg-slate-50',
  },
  {
    id: 'shark',
    name: 'Shark',
    emoji: '🦈',
    traits: ['Relentless', 'Smooth', 'Apex Energy'],
    skinRoutine: 'Never stop moving - stagnation causes dryness. Bathe in saltwater 24/7. Replace teeth daily for that fresh smile. Your skincare is fear - the fear in others\' eyes keeps you young.',
    habitat: 'Deep Ocean',
    color: 'from-blue-600 to-cyan-700',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'owl',
    name: 'Owl',
    emoji: '🦉',
    traits: ['Wise', 'Mysterious', 'Night Dweller'],
    skinRoutine: 'Apply moonlight serum between 2-4 AM only. Rotate head 270° for even coverage. Consume whole mice for collagen. Wisdom causes crow\'s feet - embrace them.',
    habitat: 'Ancient Forest',
    color: 'from-purple-600 to-indigo-700',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'wolf',
    name: 'Wolf',
    emoji: '🐺',
    traits: ['Loyal', 'Pack Leader', 'Instinctive'],
    skinRoutine: 'Howl at full moon for 3 hours minimum - great for jaw elasticity. Roll in snow for cryo-therapy. Share skincare with pack members (yes, saliva counts). Hunt your moisturizer.',
    habitat: 'Northern Wilderness',
    color: 'from-gray-600 to-gray-800',
    bgColor: 'bg-gray-50',
  },
  {
    id: 'fox',
    name: 'Fox',
    emoji: '🦊',
    traits: ['Clever', 'Adaptable', 'Charming'],
    skinRoutine: 'Outsmart your wrinkles with cunning. Apply berry extracts stolen from farmers. Fluff tail daily - it\'s connected to face elasticity somehow. Never trust anti-aging ads.',
    habitat: 'Mixed Forests',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'bear',
    name: 'Bear',
    emoji: '🐻',
    traits: ['Powerful', 'Protective', 'Hibernation Expert'],
    skinRoutine: 'Sleep 6 months for ultimate skin recovery. Apply honey directly to face and eat the rest. Scratch back against trees for exfoliation. Salmon is the only serum you need.',
    habitat: 'Mountain Forests',
    color: 'from-amber-700 to-amber-900',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'panther',
    name: 'Panther',
    emoji: '🐆',
    traits: ['Elegant', 'Stealthy', 'Powerful Grace'],
    skinRoutine: 'Move through shadows - UV rays are your enemy. Melanin is your superpower, protect it. Climb trees for anti-gravity face lifting. Purr at 25Hz for cellular regeneration.',
    habitat: 'Tropical Jungle',
    color: 'from-gray-900 to-black',
    bgColor: 'bg-gray-100',
  },
  {
    id: 'peacock',
    name: 'Peacock',
    emoji: '🦚',
    traits: ['Glamorous', 'Confident', 'Show-stopper'],
    skinRoutine: 'Display your feathers for 4 hours daily - confidence is the best serum. Apply iridescent shimmer everywhere. Strut around the garden - posture prevents wrinkles. Eat only the finest grains.',
    habitat: 'Royal Gardens',
    color: 'from-teal-500 to-emerald-600',
    bgColor: 'bg-teal-50',
  },
  {
    id: 'dolphin',
    name: 'Dolphin',
    emoji: '🐬',
    traits: ['Playful', 'Intelligent', 'Social Star'],
    skinRoutine: 'Swim in circles for natural hydrotherapy. Click and whistle for face muscle exercise. Apply saltwater, but make it fun. Laughter is your anti-aging secret - smile at everything.',
    habitat: 'Warm Oceans',
    color: 'from-sky-400 to-blue-500',
    bgColor: 'bg-sky-50',
  },
  {
    id: 'tiger',
    name: 'Tiger',
    emoji: '🐅',
    traits: ['Fierce', 'Independent', 'Striking'],
    skinRoutine: 'Your stripes are NOT wrinkles - they\'re battle scars of beauty. Swim daily for hydration. Stalk your skincare products silently. Apply jungle mist at dawn and dusk only.',
    habitat: 'Asian Jungles',
    color: 'from-orange-600 to-amber-700',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'elephant',
    name: 'Elephant',
    emoji: '🐘',
    traits: ['Wise', 'Gentle Giant', 'Never Forgets'],
    skinRoutine: 'Embrace your wrinkles - they hold memories. Apply mud mask daily, literally. Spray water on yourself hourly. Your thick skin is a feature, not a bug. Eat 300 pounds of greens.',
    habitat: 'African Plains',
    color: 'from-gray-500 to-gray-700',
    bgColor: 'bg-gray-100',
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    emoji: '🦋',
    traits: ['Transformative', 'Delicate', 'Free Spirit'],
    skinRoutine: 'Undergo complete metamorphosis every season. Drink only nectar - sugar is your friend now. Flutter your lashes 1000 times per minute. Your glow-up is eternal.',
    habitat: 'Flower Meadows',
    color: 'from-pink-400 to-purple-500',
    bgColor: 'bg-pink-50',
  },
  {
    id: 'dragon',
    name: 'Dragon',
    emoji: '🐉',
    traits: ['Legendary', 'Powerful', 'Timeless'],
    skinRoutine: 'Breathe fire to warm up face muscles. Sleep on gold - it\'s good for complexion. Guard your skincare hoard jealously. Age is meaningless when you\'re immortal.',
    habitat: 'Mountain Caves',
    color: 'from-red-600 to-orange-700',
    bgColor: 'bg-red-50',
  },
  {
    id: 'unicorn',
    name: 'Unicorn',
    emoji: '🦄',
    traits: ['Magical', 'Pure', 'Rare Beauty'],
    skinRoutine: 'Apply rainbow tears for that ethereal glow. Gallop through sparkles at sunset. Your horn produces the ultimate serum - but it\'s a secret. Believe in yourself harder.',
    habitat: 'Enchanted Forests',
    color: 'from-pink-400 to-violet-500',
    bgColor: 'bg-violet-50',
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    emoji: '🔥',
    traits: ['Reborn', 'Eternal', 'Rising Star'],
    skinRoutine: 'Burn it all down and start fresh - ultimate exfoliation. Rise from ashes looking fabulous. Apply flame-kissed serum at 1000°C. Death is temporary, beauty is forever.',
    habitat: 'Volcanic Mountains',
    color: 'from-red-500 to-yellow-500',
    bgColor: 'bg-red-50',
  },
  {
    id: 'panda',
    name: 'Panda',
    emoji: '🐼',
    traits: ['Chill', 'Adorable', 'Bamboo-powered'],
    skinRoutine: 'Those dark circles? That\'s called a LOOK. Eat bamboo exclusively - it\'s fiber, sweetie. Roll down hills for circulation. Do absolutely nothing 18 hours a day. Self-care king.',
    habitat: 'Bamboo Forests',
    color: 'from-gray-800 to-gray-900',
    bgColor: 'bg-gray-50',
  },
  {
    id: 'flamingo',
    name: 'Flamingo',
    emoji: '🦩',
    traits: ['Fabulous', 'Balanced', 'Pretty in Pink'],
    skinRoutine: 'Eat shrimp until you turn pink - you are what you eat. Stand on one leg for core strength and face lift. Dip head underwater dramatically. Being basic is your superpower.',
    habitat: 'Tropical Lakes',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
  },
  {
    id: 'octopus',
    name: 'Octopus',
    emoji: '🐙',
    traits: ['Genius', 'Flexible', 'Master of Disguise'],
    skinRoutine: 'Change your skin color to match your mood. Apply ink mask when stressed. Squeeze through tiny spaces for facial yoga. 8 arms means 8x the skincare application.',
    habitat: 'Ocean Depths',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'koala',
    name: 'Koala',
    emoji: '🐨',
    traits: ['Sleepy', 'Cuddly', 'Eucalyptus Expert'],
    skinRoutine: 'Sleep 22 hours - beauty rest is NOT optional. Apply eucalyptus oil and nothing else. Cling to trees for gravity-defying skin. Being slow is actually self-care.',
    habitat: 'Australian Bush',
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gray-50',
  },
]

type PowerAnimal = typeof POWER_ANIMALS[number]

interface PowerAnimalGameProps {
  locale: string
  onClose?: () => void
}

export default function PowerAnimalGame({ locale, onClose }: PowerAnimalGameProps) {
  const [stage, setStage] = useState<'intro' | 'capture' | 'analyzing' | 'result'>('intro')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [powerAnimal, setPowerAnimal] = useState<PowerAnimal | null>(null)
  const [resemblanceScore, setResemblanceScore] = useState(0)
  const [animatedScore, setAnimatedScore] = useState(0)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      // Set stage first to mount the video element
      setStage('capture')
    } catch {
      alert('Could not access camera. Please allow camera permissions.')
    }
  }, [])

  // Attach stream to video element when capture stage is active
  useEffect(() => {
    if (stage === 'capture' && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(console.error)
    }
  }, [stage])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Mirror the image for selfie feel
      ctx?.scale(-1, 1)
      ctx?.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9)
      setCapturedImage(imageData)
      stopCamera()
      analyzeImage()
    }
  }, [stopCamera])

  // Mock AI analysis
  const analyzeImage = useCallback(() => {
    setStage('analyzing')
    
    // Simulate analysis with dramatic timing
    setTimeout(() => {
      // Random animal selection (in real app, could use simple image features)
      const randomIndex = Math.floor(Math.random() * POWER_ANIMALS.length)
      const selectedAnimal = POWER_ANIMALS[randomIndex]
      if (selectedAnimal) {
        setPowerAnimal(selectedAnimal)
        const randomScore = Math.floor(Math.random() * 30) + 70 // 70-99%
        setResemblanceScore(randomScore)
        setStage('result')
      }
    }, 3000)
  }, [])

  // Animate score on result
  useEffect(() => {
    if (stage === 'result' && resemblanceScore > 0) {
      let current = 0
      const interval = setInterval(() => {
        current += 2
        if (current >= resemblanceScore) {
          setAnimatedScore(resemblanceScore)
          clearInterval(interval)
        } else {
          setAnimatedScore(current)
        }
      }, 30)
      return () => clearInterval(interval)
    }
    return undefined
  }, [stage, resemblanceScore])

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  // Reset game
  const resetGame = () => {
    setCapturedImage(null)
    setPowerAnimal(null)
    setResemblanceScore(0)
    setAnimatedScore(0)
    setStage('intro')
  }

  // Share result
  const shareResult = async () => {
    if (powerAnimal) {
      const text = `🎮 My Power Animal is ${powerAnimal.emoji} ${powerAnimal.name}!\n\nResemblance: ${resemblanceScore}%\nTraits: ${powerAnimal.traits.join(', ')}\n\nFind yours at genosys.ae/skin-recommendation`
      
      if (navigator.share) {
        try {
          await navigator.share({ text })
        } catch {
          // Fallback to clipboard
          navigator.clipboard.writeText(text)
        }
      } else {
        navigator.clipboard.writeText(text)
        alert('Result copied to clipboard!')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl overflow-hidden">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* INTRO STAGE */}
        {stage === 'intro' && (
          <div className="p-8 text-center">
            {/* Animal emojis */}
            <div className="text-7xl mb-6">
              🦁🦅🦈
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3">
              Power Animal
            </h1>
            
            <p className="text-gray-600 mb-8 text-sm leading-relaxed">
              {locale === 'ar' 
                ? 'اكتشف حيوانك القوي وروتين العناية بالبشرة المثالي له!'
                : locale === 'ru'
                  ? 'Откройте своё тотемное животное и идеальный уход за кожей!'
                  : 'Discover your spirit animal and their ultimate skincare wisdom!'}
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['AI Analysis', 'Face Blend', 'Skin Routine'].map((feature) => (
                <span 
                  key={feature}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-medium"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Action button */}
            <div className="space-y-3">
              <button
                onClick={startCamera}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <Camera className="w-6 h-6" />
                {locale === 'ar' ? 'التقط صورة' : locale === 'ru' ? 'Сделать фото' : 'Take Photo'}
              </button>
            </div>

            {/* Privacy note */}
            <p className="mt-6 text-xs text-gray-400">
              🔒 {locale === 'ar' 
                ? 'صورتك تبقى على جهازك فقط'
                : locale === 'ru'
                  ? 'Ваше фото остаётся на устройстве'
                  : 'Your photo never leaves your device'}
            </p>
          </div>
        )}

        {/* CAPTURE STAGE */}
        {stage === 'capture' && (
          <div className="relative aspect-square bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            
            {/* Face guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-white/50 rounded-full border-dashed animate-pulse" />
            </div>

            {/* Capture button */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <button
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full bg-white shadow-lg active:scale-95 transition-transform flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
              </button>
            </div>

            {/* Cancel button */}
            <button
              onClick={() => { stopCamera(); setStage('intro') }}
              className="absolute top-4 left-4 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium backdrop-blur-sm"
            >
              Cancel
            </button>
          </div>
        )}

        {/* ANALYZING STAGE */}
        {stage === 'analyzing' && (
          <div className="p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
            {/* Captured image preview */}
            {capturedImage && (
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 ring-4 ring-orange-200 animate-pulse">
                {/* eslint-disable-next-line @next/next/no-img-element -- camera capture data URL, optimizer can't process it */}
                <img src={capturedImage} alt="You" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Loading animation */}
            <div className="relative mb-6">
              <div className="text-5xl animate-spin-slow">
                🔮
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {locale === 'ar' ? 'نحلل روحك...' : locale === 'ru' ? 'Анализируем вашу душу...' : 'Analyzing your spirit...'}
            </h2>

            {/* Fun loading messages */}
            <div className="space-y-2 text-sm text-gray-500">
              <p className="animate-pulse">
                {locale === 'ar' ? 'نستشير أرواح الحيوانات القديمة...' : locale === 'ru' ? 'Советуемся с духами древних зверей...' : 'Consulting ancient animal spirits...'}
              </p>
              <p className="animate-pulse delay-500">
                {locale === 'ar' ? 'نقيس طاقتك البرية...' : locale === 'ru' ? 'Измеряем вашу дикую энергию...' : 'Measuring your wild energy...'}
              </p>
              <p className="animate-pulse delay-1000">
                {locale === 'ar' ? 'نحسب مصفوفة التشابه...' : locale === 'ru' ? 'Считаем матрицу сходства...' : 'Calculating resemblance matrix...'}
              </p>
            </div>

            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mt-6" />
          </div>
        )}

        {/* RESULT STAGE */}
        {stage === 'result' && powerAnimal && (
          <div className="flex flex-col h-full min-h-[650px] bg-gradient-to-b from-amber-50 to-orange-50">
            
            {/* ====================== */}
            {/* HERO: Power Animal */}
            {/* ====================== */}
            <div className="relative flex-shrink-0">
              {/* Animal display with dynamic gradient background */}
              <div className={`relative aspect-square max-h-[40vh] overflow-hidden rounded-b-[40px] shadow-xl bg-gradient-to-br ${powerAnimal.color}`}>
                
                {/* Animated decorative circles */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full animate-float-slow" />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-float-slow-reverse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full animate-pulse-slow" />
                </div>
                
                {/* Sparkle particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-white/60 rounded-full animate-sparkle" />
                  <div className="absolute top-[30%] right-[20%] w-1.5 h-1.5 bg-white/50 rounded-full animate-sparkle-delay-1" />
                  <div className="absolute bottom-[35%] left-[25%] w-1 h-1 bg-white/40 rounded-full animate-sparkle-delay-2" />
                  <div className="absolute top-[45%] right-[15%] w-2 h-2 bg-white/50 rounded-full animate-sparkle-delay-3" />
                </div>
                
                {/* Large Animal Emoji - Centered with animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[160px] leading-none select-none drop-shadow-2xl animate-animal-reveal">
                    {powerAnimal.emoji}
                  </span>
                </div>
                
                {/* Top Badge */}
                <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
                  <div className="px-4 py-2 rounded-full bg-white/25 backdrop-blur-md border border-white/40 shadow-lg animate-slide-down">
                    <span className="text-white text-sm font-bold tracking-wide">
                      {powerAnimal.name}
                    </span>
                  </div>
                </div>
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* RESEMBLANCE SCORE - Bottom */}
                <div className="absolute bottom-6 left-0 right-0 text-center z-10 animate-slide-up">
                  <p className="text-white/90 text-[10px] uppercase tracking-[0.25em] mb-1 font-medium">
                    Resemblance
                  </p>
                  <p className="text-5xl font-black text-white drop-shadow-lg animate-score-pop">
                    {animatedScore}%
                  </p>
                </div>
              </div>
            </div>
            
            {/* ========================= */}
            {/* CONTENT: Result Details */}
            {/* ========================= */}
            <div className="flex-1 px-5 pt-5 pb-6 overflow-y-auto">
              
              {/* Traits Tags */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {powerAnimal.traits.map((trait) => (
                  <span 
                    key={trait}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Skin Routine Card */}
              <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {locale === 'ar' ? 'روتين العناية بالبشرة' : locale === 'ru' ? 'Уход за кожей' : 'Your Skin Routine'}
                    </h3>
                    <p className="text-[11px] text-amber-600 font-medium mb-1.5">
                      {powerAnimal.name} Protocol
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {powerAnimal.skinRoutine}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={shareResult}
                  className="py-3.5 px-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg active:scale-[0.98] transition-transform"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                
                <button
                  onClick={resetGame}
                  className="py-3.5 px-4 rounded-xl bg-white text-gray-700 font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md border border-gray-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* CSS for custom animations */}
      <style jsx global>{`
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        /* Animal reveal animation */
        @keyframes animal-reveal {
          0% { 
            transform: scale(0) rotate(-20deg); 
            opacity: 0; 
          }
          60% { 
            transform: scale(1.15) rotate(5deg); 
            opacity: 1; 
          }
          80% { 
            transform: scale(0.95) rotate(-2deg); 
          }
          100% { 
            transform: scale(1) rotate(0deg); 
            animation: animal-float 3s ease-in-out infinite;
          }
        }
        @keyframes animal-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        .animate-animal-reveal {
          animation: animal-reveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     animal-float 3s ease-in-out 0.8s infinite;
        }
        
        /* Score pop animation */
        @keyframes score-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-score-pop {
          animation: score-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
          opacity: 0;
        }
        
        /* Slide animations */
        @keyframes slide-down {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out forwards;
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        /* Floating decorative elements */
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -15px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        @keyframes float-slow-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10px, 10px); }
        }
        .animate-float-slow-reverse {
          animation: float-slow-reverse 5s ease-in-out infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.05; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        /* Sparkle animations */
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        .animate-sparkle-delay-1 {
          animation: sparkle 2s ease-in-out 0.5s infinite;
        }
        .animate-sparkle-delay-2 {
          animation: sparkle 2s ease-in-out 1s infinite;
        }
        .animate-sparkle-delay-3 {
          animation: sparkle 2s ease-in-out 1.5s infinite;
        }
      `}</style>
    </div>
  )
}

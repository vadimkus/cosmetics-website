'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Smartphone, Monitor, Apple, Chrome, Share, Plus, MoreVertical, Download, Home, Sparkles } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

type DeviceType = 'ios' | 'android' | null
type Step = 1 | 2 | 3 | 4

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPage() {
  const { locale, dir } = useTranslation()
  const isRTL = dir === 'rtl'
  
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>(null)
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [detectedDevice, setDetectedDevice] = useState<DeviceType>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  // Translations
  const t = {
    title: locale === 'ar' ? 'تثبيت تطبيق Genosys' : locale === 'ru' ? 'Установить приложение Genosys' : 'Install Genosys App',
    subtitle: locale === 'ar' ? 'احصل على تجربة تطبيق أصلية على جهازك' : locale === 'ru' ? 'Получите нативный опыт приложения на вашем устройстве' : 'Get the native app experience on your device',
    selectDevice: locale === 'ar' ? 'اختر جهازك' : locale === 'ru' ? 'Выберите ваше устройство' : 'Select Your Device',
    weDetected: locale === 'ar' ? 'اكتشفنا أنك تستخدم' : locale === 'ru' ? 'Мы обнаружили, что вы используете' : 'We detected you\'re using',
    iphone: locale === 'ar' ? 'آيفون / آيباد' : locale === 'ru' ? 'iPhone / iPad' : 'iPhone / iPad',
    android: locale === 'ar' ? 'أندرويد' : locale === 'ru' ? 'Android' : 'Android',
    step: locale === 'ar' ? 'الخطوة' : locale === 'ru' ? 'Шаг' : 'Step',
    of: locale === 'ar' ? 'من' : locale === 'ru' ? 'из' : 'of',
    next: locale === 'ar' ? 'التالي' : locale === 'ru' ? 'Далее' : 'Next',
    previous: locale === 'ar' ? 'السابق' : locale === 'ru' ? 'Назад' : 'Previous',
    done: locale === 'ar' ? 'تم!' : locale === 'ru' ? 'Готово!' : 'Done!',
    startShopping: locale === 'ar' ? 'ابدأ التسوق' : locale === 'ru' ? 'Начать покупки' : 'Start Shopping',
    alreadyInstalled: locale === 'ar' ? 'التطبيق مثبت بالفعل!' : locale === 'ru' ? 'Приложение уже установлено!' : 'App Already Installed!',
    openApp: locale === 'ar' ? 'فتح التطبيق' : locale === 'ru' ? 'Открыть приложение' : 'Open App',
    installNow: locale === 'ar' ? 'تثبيت الآن' : locale === 'ru' ? 'Установить сейчас' : 'Install Now',
    benefits: locale === 'ar' ? 'مزايا التطبيق' : locale === 'ru' ? 'Преимущества приложения' : 'App Benefits',
    benefit1: locale === 'ar' ? 'وصول سريع من الشاشة الرئيسية' : locale === 'ru' ? 'Быстрый доступ с главного экрана' : 'Quick access from home screen',
    benefit2: locale === 'ar' ? 'تجربة ملء الشاشة' : locale === 'ru' ? 'Полноэкранный режим' : 'Full-screen experience',
    benefit3: locale === 'ar' ? 'إشعارات الطلبات' : locale === 'ru' ? 'Уведомления о заказах' : 'Order notifications',
    benefit4: locale === 'ar' ? 'تصفح أسرع' : locale === 'ru' ? 'Быстрая загрузка' : 'Faster browsing',
    // iOS Steps
    iosStep1Title: locale === 'ar' ? 'افتح Safari' : locale === 'ru' ? 'Откройте Safari' : 'Open in Safari',
    iosStep1Desc: locale === 'ar' ? 'تأكد من أنك تستخدم متصفح Safari. لن يعمل التثبيت من Chrome أو Firefox.' : locale === 'ru' ? 'Убедитесь, что вы используете браузер Safari. Установка из Chrome или Firefox не работает.' : 'Make sure you\'re using Safari browser. Installation won\'t work from Chrome or Firefox.',
    iosStep2Title: locale === 'ar' ? 'اضغط على زر المشاركة' : locale === 'ru' ? 'Нажмите кнопку «Поделиться»' : 'Tap the Share Button',
    iosStep2Desc: locale === 'ar' ? 'اضغط على أيقونة المشاركة (المربع مع السهم) في شريط الأدوات السفلي.' : locale === 'ru' ? 'Нажмите на значок «Поделиться» (квадрат со стрелкой) на нижней панели инструментов.' : 'Tap the Share icon (square with arrow) in the bottom toolbar.',
    iosStep3Title: locale === 'ar' ? 'اختر "إضافة إلى الشاشة الرئيسية"' : locale === 'ru' ? 'Выберите «На экран Домой»' : 'Select "Add to Home Screen"',
    iosStep3Desc: locale === 'ar' ? 'مرر لأسفل في قائمة المشاركة واضغط على "إضافة إلى الشاشة الرئيسية".' : locale === 'ru' ? 'Прокрутите меню «Поделиться» вниз и нажмите «На экран Домой».' : 'Scroll down in the share menu and tap "Add to Home Screen".',
    iosStep4Title: locale === 'ar' ? 'اضغط "إضافة"' : locale === 'ru' ? 'Нажмите «Добавить»' : 'Tap "Add"',
    iosStep4Desc: locale === 'ar' ? 'اضغط "إضافة" في الزاوية العلوية اليمنى. سيظهر التطبيق على شاشتك الرئيسية!' : locale === 'ru' ? 'Нажмите «Добавить» в правом верхнем углу. Приложение появится на главном экране!' : 'Tap "Add" in the top right corner. The app will appear on your home screen!',
    // Android Steps
    androidStep1Title: locale === 'ar' ? 'افتح Chrome' : locale === 'ru' ? 'Откройте Chrome' : 'Open in Chrome',
    androidStep1Desc: locale === 'ar' ? 'تأكد من أنك تستخدم متصفح Chrome للحصول على أفضل تجربة تثبيت.' : locale === 'ru' ? 'Убедитесь, что вы используете браузер Chrome для лучшей установки.' : 'Make sure you\'re using Chrome browser for the best installation experience.',
    androidStep2Title: locale === 'ar' ? 'اضغط على قائمة النقاط الثلاث' : locale === 'ru' ? 'Нажмите меню (три точки)' : 'Tap the Three-Dot Menu',
    androidStep2Desc: locale === 'ar' ? 'اضغط على أيقونة النقاط الثلاث في الزاوية العلوية اليمنى من Chrome.' : locale === 'ru' ? 'Нажмите на значок с тремя точками в правом верхнем углу Chrome.' : 'Tap the three-dot icon in the top right corner of Chrome.',
    androidStep3Title: locale === 'ar' ? 'اختر "تثبيت التطبيق"' : locale === 'ru' ? 'Выберите «Установить приложение»' : 'Select "Install App"',
    androidStep3Desc: locale === 'ar' ? 'من القائمة المنسدلة، اضغط على "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".' : locale === 'ru' ? 'В выпадающем меню нажмите «Установить приложение» или «Добавить на главный экран».' : 'From the dropdown menu, tap "Install app" or "Add to Home screen".',
    androidStep4Title: locale === 'ar' ? 'اضغط "تثبيت"' : locale === 'ru' ? 'Нажмите «Установить»' : 'Tap "Install"',
    androidStep4Desc: locale === 'ar' ? 'اضغط "تثبيت" في مربع الحوار. سيظهر التطبيق على شاشتك الرئيسية!' : locale === 'ru' ? 'Нажмите «Установить» в диалоговом окне. Приложение появится на главном экране!' : 'Tap "Install" in the dialog box. The app will appear on your home screen!',
  }

  // Detect device on mount
  useEffect(() => {
    const userAgent = navigator.userAgent || ''
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isAndroid = /Android/i.test(userAgent)
    
    if (isIOS) {
      setDetectedDevice('ios')
      setSelectedDevice('ios')
    } else if (isAndroid) {
      setDetectedDevice('android')
      setSelectedDevice('android')
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt (Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setIsInstalled(true)
      }
    }
  }

  const iosSteps = [
    { title: t.iosStep1Title, desc: t.iosStep1Desc, icon: <Chrome className="w-8 h-8" />, image: '/images/pwa/ios-step1.svg' },
    { title: t.iosStep2Title, desc: t.iosStep2Desc, icon: <Share className="w-8 h-8" />, image: '/images/pwa/ios-step2.svg' },
    { title: t.iosStep3Title, desc: t.iosStep3Desc, icon: <Plus className="w-8 h-8" />, image: '/images/pwa/ios-step3.svg' },
    { title: t.iosStep4Title, desc: t.iosStep4Desc, icon: <Check className="w-8 h-8" />, image: '/images/pwa/ios-step4.svg' },
  ]

  const androidSteps = [
    { title: t.androidStep1Title, desc: t.androidStep1Desc, icon: <Chrome className="w-8 h-8" />, image: '/images/pwa/android-step1.svg' },
    { title: t.androidStep2Title, desc: t.androidStep2Desc, icon: <MoreVertical className="w-8 h-8" />, image: '/images/pwa/android-step2.svg' },
    { title: t.androidStep3Title, desc: t.androidStep3Desc, icon: <Download className="w-8 h-8" />, image: '/images/pwa/android-step3.svg' },
    { title: t.androidStep4Title, desc: t.androidStep4Desc, icon: <Check className="w-8 h-8" />, image: '/images/pwa/android-step4.svg' },
  ]

  const steps = selectedDevice === 'ios' ? iosSteps : androidSteps
  const currentStepData = steps[currentStep - 1] ?? {
    title: '',
    desc: '',
    icon: <Chrome className="w-8 h-8" />,
    image: ''
  }

  // Already installed view
  if (isInstalled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50" dir={dir}>
        <div className="container mx-auto px-4 py-12 max-w-lg">
          <div className="text-center">
            {/* Success Animation */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <Check className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.alreadyInstalled}</h1>
            <p className="text-gray-600 mb-8">
              {locale === 'ar' ? 'يمكنك الآن الوصول إلى Genosys من شاشتك الرئيسية' : locale === 'ru' ? 'Теперь вы можете открыть Genosys с главного экрана' : 'You can now access Genosys from your home screen'}
            </p>
            
            <Link
              href={getLocalizedPath('/products', locale)}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
            >
              <Home className="w-5 h-5" />
              {t.startShopping}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50" dir={dir}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link 
              href={getLocalizedPath('/products', locale)}
              className={`flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-sm font-medium">
                {locale === 'ar' ? 'العودة للتسوق' : locale === 'ru' ? 'Назад к покупкам' : 'Back to Shop'}
              </span>
            </Link>
            <Image
              src="/Logo/upLOGO.png"
              alt="Genosys"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Hero Section - Only show when no device selected */}
        {!selectedDevice && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                {locale === 'ar' ? 'تطبيق مجاني' : locale === 'ru' ? 'Бесплатное приложение' : 'Free App'}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t.title}</h1>
              <p className="text-gray-600 text-lg">{t.subtitle}</p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: <Home className="w-5 h-5" />, text: t.benefit1 },
                { icon: <Monitor className="w-5 h-5" />, text: t.benefit2 },
                { icon: <Smartphone className="w-5 h-5" />, text: t.benefit3 },
                { icon: <Sparkles className="w-5 h-5" />, text: t.benefit4 },
              ].map((benefit, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Device Selection */}
        {!selectedDevice ? (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <h2 className={`text-xl font-bold text-gray-900 mb-6 text-center ${isRTL ? 'text-right' : ''}`}>
              {t.selectDevice}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedDevice('ios')}
                className={`p-6 rounded-2xl border-2 transition-all hover:border-red-300 hover:bg-red-50 ${
                  detectedDevice === 'ios' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                    <Apple className="w-8 h-8 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">{t.iphone}</span>
                  {detectedDevice === 'ios' && (
                    <span className="text-xs text-red-600 font-medium">
                      {locale === 'ar' ? '(جهازك)' : locale === 'ru' ? '(ваше устройство)' : '(Your device)'}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setSelectedDevice('android')}
                className={`p-6 rounded-2xl border-2 transition-all hover:border-green-300 hover:bg-green-50 ${
                  detectedDevice === 'android' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 00-.83.22l-1.88 3.24a11.463 11.463 0 00-8.94 0L5.65 5.67a.643.643 0 00-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 001 18h22a10.78 10.78 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900">{t.android}</span>
                  {detectedDevice === 'android' && (
                    <span className="text-xs text-green-600 font-medium">
                      {locale === 'ar' ? '(جهازك)' : locale === 'ru' ? '(ваше устройство)' : '(Your device)'}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Step-by-Step Instructions */
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Compact Title */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 text-white text-center">
              <h1 className="text-xl font-bold">{t.title}</h1>
              <p className="text-red-100 text-sm">{selectedDevice === 'ios' ? 'iPhone / iPad' : 'Android'}</p>
            </div>
            
            {/* Progress Bar */}
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  {t.step} {currentStep} {t.of} 4
                </span>
                <button
                  onClick={() => {
                    setSelectedDevice(null)
                    setCurrentStep(1)
                  }}
                  className="text-sm text-red-600 font-medium hover:text-red-700"
                >
                  {locale === 'ar' ? 'تغيير الجهاز' : locale === 'ru' ? 'Сменить устройство' : 'Change device'}
                </button>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    selectedDevice === 'ios' ? 'bg-gradient-to-r from-gray-700 to-gray-900' : 'bg-gradient-to-r from-green-500 to-green-600'
                  }`}
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="p-4 md:p-6">
              {/* Step Icon & Title - Stack on mobile, row on desktop */}
              <div className={`flex flex-col md:flex-row md:items-start gap-3 md:gap-4 mb-4 md:mb-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 ${
                  selectedDevice === 'ios' 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' 
                    : 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                }`}>
                  {currentStepData.icon}
                </div>
                <div className={`text-center md:text-left ${isRTL ? 'md:text-right' : ''}`}>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{currentStepData.title}</h3>
                  <p className="text-sm md:text-base text-gray-600">{currentStepData.desc}</p>
                </div>
              </div>

              {/* Screenshot/Illustration */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl md:rounded-2xl p-2 md:p-3 mb-4 md:mb-6 border border-gray-200">
                <div className="max-h-[260px] md:max-h-[320px] mx-auto flex items-center justify-center overflow-hidden">
                  <Image
                    src={currentStepData.image}
                    alt={currentStepData.title}
                    width={200}
                    height={360}
                    className="w-auto h-auto max-h-[240px] md:max-h-[300px] object-contain drop-shadow-lg"
                    priority
                  />
                </div>
              </div>

              {/* Android Quick Install Button */}
              {selectedDevice === 'android' && deferredPrompt && currentStep === 1 && (
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold mb-4 flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-200"
                >
                  <Download className="w-5 h-5" />
                  {t.installNow}
                </button>
              )}

              {/* Navigation Buttons */}
              <div className={`flex gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep((currentStep - 1) as Step)}
                    className={`flex-1 bg-gray-100 text-gray-700 py-3 md:py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm md:text-base ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <ArrowLeft className={`w-4 h-4 md:w-5 md:h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    {t.previous}
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep((currentStep + 1) as Step)}
                    className={`flex-1 ${
                      selectedDevice === 'ios' 
                        ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
                        : 'bg-gradient-to-r from-green-500 to-green-600'
                    } text-white py-3 md:py-4 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm md:text-base ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {t.next}
                    <ArrowRight className={`w-4 h-4 md:w-5 md:h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    href={getLocalizedPath('/products', locale)}
                    className="flex-1 bg-red-600 text-white py-3 md:py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <Check className="w-4 h-4 md:w-5 md:h-5" />
                    {t.done} {t.startShopping}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-2">
            {locale === 'ar' ? 'تحتاج مساعدة؟' : locale === 'ru' ? 'Нужна помощь?' : 'Need help?'}
          </p>
          <a
            href="https://wa.me/971585487665"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {locale === 'ar' ? 'تواصل معنا عبر واتساب' : locale === 'ru' ? 'Свяжитесь с нами в WhatsApp' : 'Contact us on WhatsApp'}
          </a>
        </div>
      </div>
    </div>
  )
}


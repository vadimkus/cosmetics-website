import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export const metadata: Metadata = {
  title: 'Страница не найдена - 404 | GENOSYS',
  description: 'Запрашиваемая страница не найдена. Ознакомьтесь с нашей коллекцией профессиональной корейской дерматокосметики, средств по уходу за кожей и косметических устройств.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function RussianNotFound() {
  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} flex min-h-[70vh] items-center justify-center px-4 py-16`}>
      <div className="max-w-2xl w-full text-center">
        {/* «Конец дороги» - отсылка к Матрице: две кнопки ниже образуют
            выбор (главная = вернуться, каталог = пойти дальше). */}
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--cera-muted)]">
          Ошибка · 404
        </p>
        <div className="mb-8">
          <Image
            src="/images/Wrong/roadend.png"
            alt="Конец дороги - путь обрывается"
            width={1698}
            height={838}
            className="mx-auto w-full max-w-2xl rounded-[20px] border border-[var(--cera-line)] shadow-[0_24px_60px_-40px_rgba(23,20,15,0.5)]"
            sizes="(max-width: 672px) 100vw, 672px"
          />
        </div>
        <h1 className="cera-serif mb-2 text-[26px] leading-tight text-[var(--cera-ink)] md:text-[34px]">
          Это конец дороги - теперь нужно сделать выбор&hellip;
        </h1>
        <p className="mb-10 text-[15.5px] leading-relaxed text-[var(--cera-body)] md:text-base">
          &hellip;что делать дальше.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/ru"
            className="ed-cta px-6 py-3.5 text-[15px]"
          >
            На главную
          </Link>
          <Link
            href="/ru/products"
            className="ed-ghost px-6 py-3.5 text-[15px]"
          >
            Каталог продукции
          </Link>
        </div>

        <div className="border-t border-[var(--cera-line)] pt-8">
          <h3 className="cera-eyebrow mb-4">
            Популярные страницы
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link href="/ru/products" className="py-2 text-sm text-[var(--cera-body)] transition-colors hover:text-[var(--cera-rose-ink)] hover:underline">Вся продукция</Link>
            <Link href="/ru/blog" className="py-2 text-sm text-[var(--cera-body)] transition-colors hover:text-[var(--cera-rose-ink)] hover:underline">Блог</Link>
            <Link href="/ru/about" className="py-2 text-sm text-[var(--cera-body)] transition-colors hover:text-[var(--cera-rose-ink)] hover:underline">О нас</Link>
            <Link href="/ru/training" className="py-2 text-sm text-[var(--cera-body)] transition-colors hover:text-[var(--cera-rose-ink)] hover:underline">Обучение</Link>
            <Link href="/ru/locations" className="py-2 text-sm text-[var(--cera-body)] transition-colors hover:text-[var(--cera-rose-ink)] hover:underline">Где купить в ОАЭ</Link>
            <Link href="/ru/contact" className="py-2 text-sm text-[var(--cera-body)] transition-colors hover:text-[var(--cera-rose-ink)] hover:underline">Контакты</Link>
            <Link href="/ru/faq" className="py-2 text-sm text-[var(--cera-body)] transition-colors hover:text-[var(--cera-rose-ink)] hover:underline">Вопросы и ответы</Link>
            <Link href="/ru/brand" className="py-2 text-sm text-[var(--cera-body)] transition-colors hover:text-[var(--cera-rose-ink)] hover:underline">Бренд GENOSYS</Link>
            <Link href="/ru/delivery" className="py-2 text-sm text-[var(--cera-body)] transition-colors hover:text-[var(--cera-rose-ink)] hover:underline">Доставка</Link>
          </div>
        </div>

        {/* Get the app - App Store + Google Play */}
        <div className="mt-2 border-t border-[var(--cera-line)] pt-8">
          <h3 className="cera-eyebrow mb-1">
            Установите приложение GENOSYS UAE
          </h3>
          <p className="mb-6 text-sm text-[var(--cera-muted)]">
            Отсканируйте QR-код для загрузки - или нажмите на бейдж со смартфона.
          </p>
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            {/* App Store */}
            <div className="flex flex-col items-center gap-3">
              <a
                href="https://apps.apple.com/ae/app/genosys-uae/id6756648064"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)]/40 focus-visible:ring-offset-2"
                aria-label="Скачать Genosys UAE в App Store (QR-код)"
              >
                <Image
                  src="/images/qr-appstore.svg"
                  alt="QR-код - Genosys UAE в App Store"
                  width={140}
                  height={140}
                  className="rounded-lg"
                  unoptimized
                />
              </a>
              <a
                href="https://apps.apple.com/ae/app/genosys-uae/id6756648064"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--cera-cta)] text-white px-4 py-2 rounded-md transition-colors hover:bg-[var(--cera-rose-ink)] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)]/40 focus-visible:ring-offset-2"
                aria-label="Загрузите в App Store"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </a>
            </div>
            {/* Google Play */}
            <div className="flex flex-col items-center gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=ae.genosys.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)]/40 focus-visible:ring-offset-2"
                aria-label="Скачать Genosys UAE в Google Play (QR-код)"
              >
                <Image
                  src="/images/qr-playstore.svg"
                  alt="QR-код - Genosys UAE в Google Play"
                  width={140}
                  height={140}
                  className="rounded-lg"
                  unoptimized
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=ae.genosys.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--cera-cta)] text-white px-4 py-2 rounded-md transition-colors hover:bg-[var(--cera-rose-ink)] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)]/40 focus-visible:ring-offset-2"
                aria-label="Доступно в Google Play"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.808 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
                Google Play
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--cera-line)] pt-6">
          <p className="mb-3 text-sm text-[var(--cera-muted)]">
            Ищете другой язык?
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="text-sm font-semibold text-[var(--cera-rose-ink)] transition-colors hover:text-[var(--cera-rose)] hover:underline">English</Link>
            <Link href="/ar" className="text-sm font-semibold text-[var(--cera-rose-ink)] transition-colors hover:text-[var(--cera-rose)] hover:underline" dir="rtl">العربية</Link>
            <Link href="/ru" className="text-sm font-semibold text-[var(--cera-rose-ink)] transition-colors hover:text-[var(--cera-rose)] hover:underline">Русский</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

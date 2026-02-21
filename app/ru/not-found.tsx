import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Страница не найдена - 404 | GENOSYS Middle East FZ-LLC',
  description: 'Запрашиваемая страница не найдена. Ознакомьтесь с нашей коллекцией профессиональной корейской дерматокосметики, средств по уходу за кожей и косметических устройств.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function RussianNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-8xl font-extrabold text-gray-200 dark:text-gray-700 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Страница не найдена
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          Запрашиваемая страница не существует или была перемещена. Давайте поможем вам найти то, что нужно.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/ru"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            На главную
          </Link>
          <Link
            href="/ru/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Каталог продукции
          </Link>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Популярные страницы
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link href="/ru/products" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">Вся продукция</Link>
            <Link href="/ru/blog" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">Блог</Link>
            <Link href="/ru/about" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">О нас</Link>
            <Link href="/ru/training" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">Обучение</Link>
            <Link href="/ru/locations" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">Локации в ОАЭ</Link>
            <Link href="/ru/contact" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">Контакты</Link>
            <Link href="/ru/faq" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">Вопросы и ответы</Link>
            <Link href="/ru/brand" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">Бренд GENOSYS</Link>
            <Link href="/ru/delivery" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">Доставка</Link>
          </div>
        </div>

        {/* App Store QR Code */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-2">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Заблудились? Отсканируйте QR-код, чтобы найти всё в приложении Genosys UAE.
          </p>
          <a
            href="https://apps.apple.com/ae/app/genosys-uae/id6756648064"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src="/images/qr-appstore.svg"
              alt="QR-код — Genosys UAE в App Store"
              width={140}
              height={140}
              className="mx-auto rounded-lg"
            />
          </a>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Доступно в App Store
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Ищете другой язык?
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline">English</Link>
            <Link href="/ar" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline" dir="rtl">العربية</Link>
            <Link href="/ru" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline">Русский</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

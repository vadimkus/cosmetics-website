import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة - 404 | GENOSYS Middle East FZ-LLC',
  description: 'الصفحة التي تبحث عنها غير موجودة. تصفح مجموعتنا من مستحضرات التجميل الكورية المهنية ومنتجات العناية بالبشرة وأجهزة التجميل.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function ArabicNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16" dir="rtl">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-8xl font-extrabold text-gray-200 dark:text-gray-700 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          الصفحة غير موجودة
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها. دعنا نساعدك في العثور على ما تحتاجه.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/ar"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            الصفحة الرئيسية
          </Link>
          <Link
            href="/ar/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            تصفح المنتجات
          </Link>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            الصفحات الشائعة
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link href="/ar/products" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">جميع المنتجات</Link>
            <Link href="/ar/blog" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">المدونة</Link>
            <Link href="/ar/about" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">من نحن</Link>
            <Link href="/ar/training" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">التدريب المهني</Link>
            <Link href="/ar/locations" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">المواقع في الإمارات</Link>
            <Link href="/ar/contact" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">اتصل بنا</Link>
            <Link href="/ar/faq" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">الأسئلة الشائعة</Link>
            <Link href="/ar/brand" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">علامة GENOSYS</Link>
            <Link href="/ar/delivery" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">معلومات التوصيل</Link>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            هل تبحث عن لغة مختلفة؟
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline">English</Link>
            <Link href="/ar" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline">العربية</Link>
            <Link href="/ru" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline">Русский</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

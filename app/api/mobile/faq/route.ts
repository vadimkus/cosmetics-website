/**
 * Mobile FAQ API - GET /api/mobile/faq
 * Returns FAQ content for the native mobile app.
 * Reads from the faq_items database table — add/edit/reorder
 * FAQ items in the admin panel and they appear in the app automatically.
 *
 * Accepts x-locale header: 'en' | 'ar' | 'ru' (defaults to 'en')
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.MOBILE_APP_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locale = request.headers.get('x-locale') || 'en'

    const faqItems = await prisma.faqItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })

    const items = faqItems.map((item, index) => {
      let question = item.questionEn
      let answer = item.answerEn

      if (locale === 'ar' && item.questionAr) {
        question = item.questionAr
        answer = item.answerAr || item.answerEn
      } else if (locale === 'ru' && item.questionRu) {
        question = item.questionRu
        answer = item.answerRu || item.answerEn
      }

      return {
        id: index + 1,
        question,
        answer,
      }
    })

    return NextResponse.json({
      title: locale === 'ar' ? 'الأسئلة الشائعة' : locale === 'ru' ? 'FAQ' : 'FAQ',
      subtitle: locale === 'ar' ? 'الأسئلة المتكررة' : locale === 'ru' ? 'Часто задаваемые вопросы' : 'Frequently Asked Questions',
      description: locale === 'ar'
        ? 'ابحث عن إجابات للأسئلة الشائعة حول منتجات GENOSYS والشحن والطلبات والتدريب المهني.'
        : locale === 'ru'
        ? 'Найдите ответы на распространенные вопросы о продуктах GENOSYS, доставке, заказах и профессиональном обучении.'
        : 'Find answers to common questions about GENOSYS products, shipping, orders, and professional training.',
      items,
      total: items.length,
      locale,
    })
  } catch (error) {
    console.error('Mobile FAQ API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

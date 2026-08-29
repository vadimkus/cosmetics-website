import { render, screen } from '@testing-library/react'
import { MessagesProvider } from '@/components/i18n/MessagesProvider'
import { useTranslation } from '@/hooks/useTranslation'
import enMessages from '@/messages/en.json'
import ruMessages from '@/messages/ru.json'
import arMessages from '@/messages/ar.json'
import type { Locale } from '@/lib/i18n'
import type { Messages } from '@/types/translations'

const optionSheetKeys = [
  'product.chooseOptions',
  'product.selectSizeRequired',
  'product.selectColorRequired',
  'product.size',
  'product.color',
  'product.quantity',
  'common.cancel',
  'product.addToBag',
  'common.tryAgain',
  'product.unavailable',
  'product.outOfStock',
  'product.closeOptions',
  'product.refreshingOptions',
  'product.optionRefreshError',
  'product.optionsUnavailable',
  'product.decreaseQuantity',
  'product.increaseQuantity',
  'product.off',
  'product.priceLocked',
  'product.adding',
] as const

const localeMessages = {
  en: enMessages,
  ru: ruMessages,
  ar: arMessages,
} as const

const coreLabels = {
  en: {
    'product.chooseOptions': 'Choose options',
    'product.selectSizeRequired': 'Select size',
    'product.selectColorRequired': 'Select color',
    'product.size': 'Size',
    'product.color': 'Color',
    'product.quantity': 'Quantity',
    'common.cancel': 'Cancel',
    'product.addToBag': 'Add to Bag',
  },
  ru: {
    'product.chooseOptions': 'Выбрать вариант',
    'product.selectSizeRequired': 'Выберите размер',
    'product.selectColorRequired': 'Выберите цвет',
    'product.size': 'Размер',
    'product.color': 'Цвет',
    'product.quantity': 'Количество',
    'common.cancel': 'Отмена',
    'product.addToBag': 'В корзину',
  },
  ar: {
    'product.chooseOptions': 'اختر الخيارات',
    'product.selectSizeRequired': 'اختر الحجم',
    'product.selectColorRequired': 'اختر اللون',
    'product.size': 'الحجم',
    'product.color': 'اللون',
    'product.quantity': 'الكمية',
    'common.cancel': 'إلغاء',
    'product.addToBag': 'أضف إلى السلة',
  },
} as const

function OptionSheetTranslationProbe() {
  const { t, dir } = useTranslation()

  return (
    <section data-testid="option-sheet-translations" dir={dir}>
      {optionSheetKeys.map((key) => (
        <span key={key} data-key={key}>
          {t(key)}
        </span>
      ))}
    </section>
  )
}

describe('product option sheet translations', () => {
  it.each(['en', 'ru', 'ar'] as const)(
    'resolves every option-sheet key for %s without exposing raw keys',
    (locale) => {
      render(
        <MessagesProvider
          locale={locale as Locale}
          messages={localeMessages[locale] as unknown as Messages}
        >
          <OptionSheetTranslationProbe />
        </MessagesProvider>,
      )

      const probe = screen.getByTestId('option-sheet-translations')
      expect(probe).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')

      for (const key of optionSheetKeys) {
        const element = probe.querySelector(`[data-key="${key}"]`)
        expect(element).not.toBeNull()
        expect(element).not.toHaveTextContent(key)
        expect(element?.textContent).not.toMatch(
          /^(?:[a-z][\w-]*\.)+[a-z][\w-]*$/i,
        )
      }

      for (const [key, value] of Object.entries(coreLabels[locale])) {
        expect(probe.querySelector(`[data-key="${key}"]`)).toHaveTextContent(value)
      }

      expect(probe.textContent).not.toMatch(/COMMON\.REQUIRED|product\.quantity/i)
    },
  )
})

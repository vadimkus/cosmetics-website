import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ProductOptionDialog from '@/components/product/ProductOptionDialog'
import type { Product } from '@/types'
import type { User } from '@/types/user'

let mockLocale = 'en'
let mockIsMobile = true
const labelsByLocale = {
  en: {
    choose: 'Choose options',
    quantity: 'Quantity',
    add: 'Add to Bag',
    cancel: 'Cancel',
    close: 'Close option selector',
    refreshing: 'Checking current options…',
    refreshError: 'We could not refresh these options. Retry to check the latest availability.',
    unavailable: 'Unavailable',
    required: 'Required field',
    tryAgain: 'Try Again',
    off: 'OFF',
    adding: 'Adding...',
    outOfStock: 'Out of Stock',
    priceLocked: 'Price locked',
    optionsUnavailable: 'Options are temporarily unavailable. Please try again.',
    decrease: 'Decrease quantity',
    increase: 'Increase quantity',
  },
  ru: {
    choose: 'Выбрать вариант',
    quantity: 'Количество',
    add: 'В корзину',
    cancel: 'Отмена',
    close: 'Закрыть выбор варианта',
    refreshing: 'Проверяем доступные варианты…',
    refreshError: 'Не удалось обновить варианты. Повторите попытку, чтобы проверить наличие.',
    unavailable: 'Нет в наличии',
    required: 'Обязательное поле',
    tryAgain: 'Попробовать снова',
    off: 'СКИДКА',
    adding: 'Добавление...',
    outOfStock: 'Нет в наличии',
    priceLocked: 'Цена заблокирована',
    optionsUnavailable: 'Варианты временно недоступны. Попробуйте ещё раз.',
    decrease: 'Уменьшить количество',
    increase: 'Увеличить количество',
  },
  ar: {
    choose: 'اختر الخيارات',
    quantity: 'الكمية',
    add: 'أضف إلى الحقيبة',
    cancel: 'إلغاء',
    close: 'إغلاق اختيار الخيارات',
    refreshing: 'جارٍ التحقق من الخيارات الحالية…',
    refreshError: 'تعذر تحديث الخيارات. حاول مرة أخرى للتحقق من أحدث توفر.',
    unavailable: 'غير متوفر',
    required: 'حقل مطلوب',
    tryAgain: 'حاول مرة أخرى',
    off: 'خصم',
    adding: 'جاري الإضافة...',
    outOfStock: 'غير متوفر',
    priceLocked: 'السعر مقفل',
    optionsUnavailable: 'الخيارات غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى.',
    decrease: 'تقليل الكمية',
    increase: 'زيادة الكمية',
  },
} as const

const mockTranslate = (key: string) => {
  const labels = labelsByLocale[mockLocale as keyof typeof labelsByLocale]
  const translations: Record<string, string> = {
    'product.chooseOptions': labels.choose,
    'product.quantity': labels.quantity,
    'product.addToBag': labels.add,
    'product.closeOptions': labels.close,
    'product.refreshingOptions': labels.refreshing,
    'product.optionRefreshError': labels.refreshError,
    'product.unavailable': labels.unavailable,
    'product.optionsUnavailable': labels.optionsUnavailable,
    'product.off': labels.off,
    'product.adding': labels.adding,
    'product.outOfStock': labels.outOfStock,
    'product.priceLocked': labels.priceLocked,
    'product.decreaseQuantity': labels.decrease,
    'product.increaseQuantity': labels.increase,
    'common.cancel': labels.cancel,
    'common.required': labels.required,
    'common.tryAgain': labels.tryAgain,
  }
  return translations[key] || key
}

jest.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => ({ isMobile: mockIsMobile, isClient: true }),
}))

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    locale: mockLocale,
    dir: mockLocale === 'ar' ? 'rtl' : 'ltr',
    t: mockTranslate,
  }),
}))

const user = {
  id: 'user-1',
  email: 'user@example.com',
  canSeePrices: true,
  discountPercentage: 0,
} as User

const cerabarrier: Product = {
  id: 'cmr6dajor031ygfnm6rsjkicf',
  productNumber: '66',
  name: 'CERABARRIER BIOME GEL CLEANSER',
  nameRu: 'Гель для умывания CERABARRIER',
  nameAr: 'جل التنظيف سيرابارير',
  description: 'Test',
  image: '/images/cera/main2.jpeg',
  category: 'Cleanser',
  price: 380,
  inStock: true,
  variants: [
    {
      id: 'cera-200',
      size: '200ml',
      color: null,
      price: 380,
      available: true,
      isDefault: true,
    },
    {
      id: 'cera-600',
      size: '600ml',
      color: null,
      price: 620,
      available: true,
      isDefault: false,
    },
  ],
}

function renderDialog(
  overrides: Partial<React.ComponentProps<typeof ProductOptionDialog>> = {},
) {
  const props: React.ComponentProps<typeof ProductOptionDialog> = {
    open: true,
    product: cerabarrier,
    user,
    isAdding: false,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    ...overrides,
  }
  return { ...render(<ProductOptionDialog {...props} />), props }
}

describe('ProductOptionDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocale = 'en'
    mockIsMobile = true
    window.scrollTo = jest.fn()
    window.history.back = jest.fn()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => cerabarrier,
    })
  })

  it('requires a choice, updates variant price and quantity, then submits the exact payload', async () => {
    const onConfirm = jest.fn()
    renderDialog({ onConfirm })

    const large = await screen.findByRole('radio', { name: '600ml' })
    expect(large).toHaveAttribute('aria-checked', 'false')
    const add = screen.getByRole('button', {
      name: `Add to Bag — ${cerabarrier.name}`,
    })
    expect(add).toBeDisabled()

    await waitFor(() => expect(screen.queryByText(labelsByLocale.en.refreshing)).not.toBeInTheDocument())
    fireEvent.click(large)
    expect(screen.getByText('620.00 AED')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: labelsByLocale.en.increase }))
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(add).toBeEnabled()
    fireEvent.click(add)

    await waitFor(() =>
      expect(onConfirm).toHaveBeenCalledWith(
        cerabarrier,
        { selectedSize: '600ml', selectedColor: '' },
        2,
      ),
    )
  })

  it('disables out-of-stock options', async () => {
    const withUnavailable = {
      ...cerabarrier,
      variants: cerabarrier.variants!.map((variant) =>
        variant.size === '600ml' ? { ...variant, available: false } : variant,
      ),
    }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => withUnavailable,
    })
    renderDialog({ product: withUnavailable })

    const unavailable = await screen.findByRole('radio', { name: /600ml/ })
    expect(unavailable).toBeDisabled()
    expect(screen.getByText(labelsByLocale.en.unavailable)).toBeInTheDocument()
  })

  it('uses a mobile bottom sheet and a centered desktop dialog at the breakpoint', () => {
    const { unmount } = renderDialog()
    expect(screen.getByTestId('product-option-overlay')).toHaveAttribute('data-presentation', 'sheet')
    unmount()

    mockIsMobile = false
    renderDialog()
    expect(screen.getByTestId('product-option-overlay')).toHaveAttribute('data-presentation', 'dialog')
  })

  it.each([
    ['en', 'ltr'],
    ['ru', 'ltr'],
    ['ar', 'rtl'],
  ])('renders localized labels and direction for %s', (locale, direction) => {
    mockLocale = locale
    renderDialog()
    const labels = labelsByLocale[locale as keyof typeof labelsByLocale]
    expect(screen.getByText(labels.choose)).toBeInTheDocument()
    expect(screen.getByText(labels.quantity)).toBeInTheDocument()
    expect(screen.getByTestId('product-option-overlay')).toHaveAttribute('dir', direction)
    expect(screen.queryByText('product.quantity')).not.toBeInTheDocument()
  })

  it('closes through backdrop and restores focus', async () => {
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    opener.focus()
    const onClose = jest.fn()
    const { unmount } = renderDialog({ onClose })

    await waitFor(() => {
      const closeControls = screen.getAllByRole('button', { name: labelsByLocale.en.close })
      expect(closeControls.some((control) => control === document.activeElement)).toBe(true)
    })
    fireEvent.click(screen.getByTestId('product-option-backdrop'))
    expect(onClose).toHaveBeenCalledTimes(1)
    unmount()
    expect(opener).toHaveFocus()
    opener.remove()
  })

  it('supports cancel, close button, and Escape dismissal', () => {
    const onClose = jest.fn()
    renderDialog({ onClose })

    fireEvent.click(screen.getByRole('button', { name: labelsByLocale.en.cancel }))
    fireEvent.click(screen.getAllByRole('button', { name: labelsByLocale.en.close })[1]!)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(3)
  })

  it('shows a retry path when canonical refresh fails', async () => {
    ;(global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ ok: true, json: async () => cerabarrier })
    renderDialog()

    expect(await screen.findByText(labelsByLocale.en.refreshError)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: labelsByLocale.en.tryAgain }))
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(screen.queryByText(labelsByLocale.en.refreshError)).not.toBeInTheDocument())
  })

  it('blocks rapid duplicate confirmation taps', async () => {
    let resolveConfirm: (() => void) | undefined
    const onConfirm = jest.fn(
      () => new Promise<void>((resolve) => {
        resolveConfirm = resolve
      }),
    )
    renderDialog({ onConfirm })
    await waitFor(() => expect(screen.queryByText(labelsByLocale.en.refreshing)).not.toBeInTheDocument())
    fireEvent.click(screen.getByRole('radio', { name: '200ml' }))
    const add = screen.getByRole('button', {
      name: `Add to Bag — ${cerabarrier.name}`,
    })

    fireEvent.click(add)
    fireEvent.click(add)
    expect(onConfirm).toHaveBeenCalledTimes(1)
    resolveConfirm?.()
  })
})

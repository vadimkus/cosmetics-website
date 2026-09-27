import { translateSize } from '@/utils/sizeTranslations'

describe('translateSize', () => {
  it('turns a Russian size stored in the DB into English for English visitors', () => {
    expect(translateSize('1 набор', 'en')).toBe('1 kit')
    expect(translateSize('50 г', 'en')).toBe('50g')
    expect(translateSize('2 шт.', 'en')).toBe('2 pcs')
  })

  it.each([
    ['1 kit', '1 набор'],
    ['1 Kit', '1 набор'],
    ['1 set', '1 набор'],
    ['1 Box', '1 коробка'],
    ['1 box (8 pcs)', '1 коробка (8шт)'],
    ['1 pc', '1шт'],
    ['2ml x 10ea', '2мл x 10шт'],
    ['3ml x 4 ampoules', '3мл x 4 ампулы'],
    ['0.25mm', '0.25мм'],
    ['1kg', '1кг'],
    ['350 g / 30 sheets', '350г / 30 шт.'],
  ])('renders %s as %s in Russian', (size, expected) => {
    expect(translateSize(size, 'ru')).toBe(expected)
  })

  it('leaves English sizes alone outside Russian', () => {
    expect(translateSize('1 box (8 pcs)', 'ar')).toBe('1 box (8 pcs)')
    expect(translateSize('50ml', 'en')).toBe('50ml')
  })
})

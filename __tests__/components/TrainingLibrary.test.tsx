import { render, screen } from '@testing-library/react'
import TrainingLibrary from '@/app/training/TrainingLibrary'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt || ''} />,
}))
jest.mock('@/components/PageBreadcrumb', () => () => <nav>Breadcrumb</nav>)
jest.mock('@/components/PDFDownloadButton', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}))
jest.mock('@/hooks/useTranslation', () => ({ useTranslation: jest.fn() }))
jest.mock('@/hooks/usePWAMode', () => ({ usePWAMode: jest.fn() }))

const mockedTranslation = jest.mocked(useTranslation)
const mockedPWAMode = jest.mocked(usePWAMode)

describe('TrainingLibrary', () => {
  beforeEach(() => {
    mockedTranslation.mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
      dir: 'ltr',
    } as ReturnType<typeof useTranslation>)
    mockedPWAMode.mockReturnValue({
      isPWA: false,
      isClient: true,
    } as ReturnType<typeof usePWAMode>)
  })

  it('omits standalone navigation when embedded in the profile', () => {
    render(<TrainingLibrary embedded />)

    expect(screen.queryByText('Breadcrumb')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /back/i })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0)
  })
})

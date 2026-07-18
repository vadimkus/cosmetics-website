import { fireEvent, render, screen } from '@testing-library/react'
import RewardsRedemptionCard from '@/components/checkout/RewardsRedemptionCard'

const copy: Record<string, string> = {
  'rewards.title': 'GENOSYS Rewards',
  'rewards.points': 'pts',
  'rewards.availableBalance': '{points} points available · AED {value} value',
  'rewards.apply': 'Apply',
  'rewards.redemptionValue': 'AED {value} off this order',
  'rewards.redemptionRules': 'Redeem {points} for AED {value}, max {percent}%',
  'rewards.redemptionMinimum': 'Need {points} points',
  'rewards.redemptionOrderMinimum': 'Add more products',
  'rewards.redemptionAccountDiscount': 'Cannot combine with account discount',
  'rewards.redemptionPartnerPricing': 'Partner pricing replaces rewards',
  'rewards.redemptionAmount': 'Rewards points to redeem',
  'rewards.decreaseRedemption': 'Redeem fewer points',
  'rewards.increaseRedemption': 'Redeem more points',
  'rewards.useMaximum': 'Use maximum',
}

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    locale: 'en',
    dir: 'ltr',
    t: (key: string, values: Record<string, string | number> = {}) =>
      Object.entries(values).reduce(
        (text, [name, value]) => text.replace(`{${name}}`, String(value)),
        copy[key] || key
      ),
  }),
}))

const baseProps = {
  balance: 1200,
  selectedPoints: 0,
  maxPoints: 800,
  blockPoints: 100,
  blockAed: 5,
  maxOrderFraction: 0.2,
  eligible: true,
  disabledReason: null,
  onChange: jest.fn(),
}

describe('RewardsRedemptionCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows the points balance and applies the maximum quote', () => {
    const onChange = jest.fn()
    render(<RewardsRedemptionCard {...baseProps} onChange={onChange} />)

    expect(screen.getByText('1,200 points available · AED 60.00 value')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Apply' }))
    expect(onChange).toHaveBeenCalledWith(800)
  })

  it('changes the applied amount in 100-point blocks', () => {
    const onChange = jest.fn()
    render(
      <RewardsRedemptionCard
        {...baseProps}
        selectedPoints={500}
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Redeem fewer points' }))
    expect(onChange).toHaveBeenCalledWith(400)

    fireEvent.click(screen.getByRole('button', { name: 'Redeem more points' }))
    expect(onChange).toHaveBeenCalledWith(600)

    fireEvent.click(screen.getByRole('button', { name: /Use maximum/ }))
    expect(onChange).toHaveBeenCalledWith(800)
  })

  it('explains why an account discount disables redemption', () => {
    render(
      <RewardsRedemptionCard
        {...baseProps}
        eligible={false}
        disabledReason="ACCOUNT_DISCOUNT"
        maxPoints={0}
      />
    )

    expect(screen.getByText('Cannot combine with account discount')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('shows the minimum-points requirement for a low balance', () => {
    render(
      <RewardsRedemptionCard
        {...baseProps}
        balance={50}
        maxPoints={0}
      />
    )

    expect(screen.getByText('Need 100 points')).toBeInTheDocument()
  })
})

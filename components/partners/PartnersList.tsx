import { partnersData } from '@/lib/partners'
import PartnerCard from './PartnerCard'

export default function PartnersList() {
  return (
    <div className="space-y-3 md:space-y-6 mb-6 md:mb-8">
      {partnersData.map(partner => (
        <PartnerCard key={partner.id} partner={partner} />
      ))}
    </div>
  )
}

import { partnersData } from '@/data/partners'
import PartnerCard from './PartnerCard'

export default function PartnersList() {
  return (
    <div className="mb-8">
      {partnersData.map(partner => (
        <PartnerCard key={partner.id} partner={partner} />
      ))}
    </div>
  )
}

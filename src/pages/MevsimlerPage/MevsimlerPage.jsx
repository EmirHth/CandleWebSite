import { useParams } from 'react-router-dom'
import products from '../../data/products'
import FilteredListingPage from '../../components/FilteredListingPage/FilteredListingPage'

const SEASONS = [
  {
    slug: 'ilkbahar',
    label: 'İlkbahar',
    scents: ['Hibiskus', 'Şeftali', 'Jazmın', 'Gül', 'Bergamot'],
  },
  {
    slug: 'yaz',
    label: 'Yaz',
    scents: ['Deniz Tuzu', 'Okyanus', 'Portakal', 'Limon', 'Greyfurt', 'Bergamot'],
  },
  {
    slug: 'sonbahar',
    label: 'Sonbahar',
    scents: ['Sedir', 'Amber', 'Toprak', 'Patchouli', 'Paçuli', 'Vetiver', 'Kakao'],
  },
  {
    slug: 'kis',
    label: 'Kış',
    scents: ['Tarçın', 'Karanfil', 'Vanilya', 'Odun', 'Kar', 'Nane', 'Okaliptüs', 'Misk'],
  },
  {
    slug: 'yilbasi-bayram',
    label: 'Yılbaşı & Bayram',
    scents: ['Oud', 'Deri', 'Siyah Çay', 'Ylang Ylang', 'Gül', 'Vanilya'],
  },
]

function matchesScents(product, targetScents) {
  return product.scents?.some(s =>
    targetScents.some(t => s.toLowerCase().includes(t.toLowerCase()))
  )
}

export default function MevsimlerPage() {
  const { slug } = useParams()

  const current  = SEASONS.find(s => s.slug === slug)
  const filtered = current
    ? products.filter(p => matchesScents(p, current.scents))
    : products

  const pills = SEASONS.map(s => ({
    label:  s.label,
    href:   `/mevsimler/${s.slug}`,
    active: s.slug === slug,
  }))

  return (
    <FilteredListingPage
      eyebrow="Mevsimsel Koleksiyonlar"
      title={current?.label ?? 'Mevsimler'}
      desc="Her mevsimin ruhunu yansıtan özel koleksiyonlarımızı keşfedin."
      products={filtered}
      pills={pills}
    />
  )
}

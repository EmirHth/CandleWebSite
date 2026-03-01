import { useParams } from 'react-router-dom'
import products from '../../data/products'
import FilteredListingPage from '../../components/FilteredListingPage/FilteredListingPage'

const SCENT_FAMILIES = [
  { slug: 'ahsap-toprak',    label: 'Ahşap & Toprak',    scents: ['Sedir', 'Toprak', 'Odun', 'Patchouli', 'Paçuli', 'Vetiver'] },
  { slug: 'amber-recine',    label: 'Amber & Reçine',     scents: ['Amber', 'Reçine', 'Oud'] },
  { slug: 'aquatik-deniz',   label: 'Aquatik & Deniz',    scents: ['Deniz', 'Okyanus', 'Deniz Tuzu'] },
  { slug: 'baharat-oryantal',label: 'Baharat & Oryantal', scents: ['Tarçın', 'Karanfil', 'Zerdeçal', 'Ylang Ylang'] },
  { slug: 'cicek-botanik',   label: 'Çiçek & Botanik',   scents: ['Hibiskus', 'Jazmın', 'Gül'] },
  { slug: 'meyveli-tatli',   label: 'Meyveli & Tatlı',   scents: ['Şeftali', 'Portakal', 'Limon', 'Greyfurt', 'Kakao'] },
  { slug: 'misk-pudra',      label: 'Misk & Pudra',       scents: ['Misk', 'Deri', 'Siyah Çay'] },
  { slug: 'sedir-yesil',     label: 'Sedir & Yeşil',     scents: ['Sedir', 'Yosun', 'Okaliptüs', 'Nane'] },
  { slug: 'temiz-ferah',     label: 'Temiz & Ferah',      scents: ['Kar', 'Okaliptüs', 'Nane', 'Bergamot'] },
  { slug: 'vanilya-kremsi',  label: 'Vanilya & Kremsi',   scents: ['Vanilya', 'Kakao', 'Jojoba'] },
]

function matchesScents(product, targetScents) {
  return product.scents?.some(s =>
    targetScents.some(t => s.toLowerCase().includes(t.toLowerCase()))
  )
}

export default function KokularPage() {
  const { slug } = useParams()

  const current  = SCENT_FAMILIES.find(f => f.slug === slug)
  const filtered = current
    ? products.filter(p => matchesScents(p, current.scents))
    : products

  const pills = [
    { label: 'Tümü', href: '/kokular', active: !slug },
    ...SCENT_FAMILIES.map(f => ({
      label:  f.label,
      href:   `/kokular/${f.slug}`,
      active: f.slug === slug,
    })),
  ]

  return (
    <FilteredListingPage
      eyebrow="Koku Dünyası"
      title={current?.label ?? 'Tüm Kokular'}
      desc="Doğadan ilham alan koku ailelerini keşfedin, ruhunuza dokunan aromayı bulun."
      products={filtered}
      pills={pills}
    />
  )
}

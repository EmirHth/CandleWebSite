import { useParams } from 'react-router-dom'
import products from '../../data/products'
import FilteredListingPage from '../../components/FilteredListingPage/FilteredListingPage'

const CATEGORIES = [
  { slug: 'soy-mumlar',         label: 'Soy Mumlar',            categoryKey: 'Soy Mum'    },
  { slug: 'masaj-mumlari',      label: 'Masaj Mumları',          categoryKey: 'Masaj Mumu' },
  { slug: 'koleksiyon-setleri', label: 'Koleksiyon Setleri',     categoryKey: 'Set'        },
  { slug: 'difuzorler',         label: 'Difüzörler',             categoryKey: 'Difüzör'    },
  { slug: 'balmumu-mumlar',     label: 'Balmumu Mumlar',         categoryKey: null         },
  { slug: 'mumluklar',          label: 'Mumluklar',              categoryKey: null         },
  { slug: 'oda-spreyleri',      label: 'Oda Spreyleri',          categoryKey: null         },
  { slug: 'sabunlar-losyonlar', label: 'Sabunlar & Losyonlar',   categoryKey: null         },
]

export default function KategoriPage() {
  const { slug } = useParams()

  const current  = CATEGORIES.find(c => c.slug === slug)
  const filtered = current?.categoryKey
    ? products.filter(p => p.category === current.categoryKey)
    : products

  const pills = [
    { label: 'Tümü', href: '/kategori', active: !slug },
    ...CATEGORIES.map(c => ({
      label:  c.label,
      href:   `/kategori/${c.slug}`,
      active: c.slug === slug,
    })),
  ]

  return (
    <FilteredListingPage
      eyebrow="Laydora Atölyesi"
      title={current?.label ?? 'Tüm Kategoriler'}
      desc="El yapımı, doğal malzemeli mumlardan oluşan koleksiyonumuzu keşfedin."
      products={filtered}
      pills={pills}
    />
  )
}

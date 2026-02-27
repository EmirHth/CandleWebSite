import FlowingMenu from '../FlowingMenu/FlowingMenu'
import './NewProducts.css'

const MENU_ITEMS = [
  {
    link: '#',
    text: 'Gece Mumu',
    image: '/images/gece-mumu.jpg',
  },
  {
    link: '#',
    text: 'Kış Koleksiyonu',
    image: '/images/kis-mumu.jpg',
  },
  {
    link: '#',
    text: 'Botanik Özü',
    image: '/images/dogal-mum.jpg',
  },
  {
    link: '#',
    text: 'Deniz Serisi',
    image: '/images/deniz-mumu.jpg',
  },
]

export default function NewProducts() {
  return (
    <section className="new-products" aria-label="Yeni ürünler">

      {/* ── Section header ── */}
      <div className="new-products__header">
        <span className="new-products__eyebrow">Yeni Gelenler</span>
        <h2 className="new-products__title">
          Sezona Özel <em>Koleksiyonumuz</em>
        </h2>
        <p className="new-products__subtitle">
          El işçiliğiyle hazırlanmış, doğal malzemelerden üretilen mumlarımızı keşfedin.
        </p>
      </div>

      {/* ── Flowing Menu ── */}
      <div className="new-products__menu">
        <FlowingMenu
          items={MENU_ITEMS}
          speed={18}
          textColor="rgb(38, 24, 10)"
          bgColor="#ffffff"
          marqueeBgColor="rgb(38, 24, 10)"
          marqueeTextColor="rgba(255, 225, 172, 0.95)"
          borderColor="rgba(38, 24, 10, 0.12)"
          defaultActiveIndex={0}
        />
      </div>

    </section>
  )
}

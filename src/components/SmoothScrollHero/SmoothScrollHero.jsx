import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './SmoothScrollHero.css'

/* ─────────────────────────────────────────────────
   CENTER STICKY HERO
   • Entry  : whileInView  0.82 → 1  (grows into view)
   • Exit   : useScroll    1 → 0.85  + fade out
   This gives the "büyüyor" effect the user sees on hover.dev
───────────────────────────────────────────────── */
const CenterImage = () => {
  const innerRef = useRef(null)

  /* Exit animation — shrinks & fades as sticky elem scrolls past */
  const { scrollYProgress } = useScroll({
    target: innerRef,
    offset: ['end end', 'end start'],
  })
  const exitScale   = useTransform(scrollYProgress, [0, 1], [1, 0.85])
  const exitOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    /* Entry wrapper: scale up from 0.82 → 1 when section scrolls into view */
    <motion.div
      initial={{ scale: 0.82 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Exit wrapper: scroll-linked shrink + fade */}
      <motion.div
        ref={innerRef}
        style={{ scale: exitScale, opacity: exitOpacity }}
        className="ssh__center"
      >
        <img
          src="/images/kis-aksami.jpg"
          alt="Laydora Kış Akşamı – Şarap Tonlu Mum"
          className="ssh__center-bg"
          fetchpriority="high"
          decoding="async"
        />
        <div className="ssh__center-overlay" aria-hidden="true" />
        <div className="ssh__center-inner">
          <p className="ssh__center-eyebrow">Laydora Koleksiyonu</p>
          <h1 className="ssh__center-title">
            Her Mum Bir <em>Dünya</em>
          </h1>
          <p className="ssh__center-sub">Kaydırarak keşfet ↓</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────
   PARALLAX ITEMS DATA
───────────────────────────────────────────────── */
const PARALLAX_ITEMS = [
  {
    src: '/images/gece-koleksiyon.jpg',
    alt: 'Gece Koleksiyonu – Ay Formlu Mum',
    imgClass: 'ssh__img--right-wide',
    textSide: 'left',
    start: -200, end: 200,
    eyebrow: 'Koleksiyon No. 02',
    title: 'Gece\nKoleksiyonu',
    sub: 'Ay ışığından ilham alınan büyüleyici formlar',
    description: 'Karanlığın derinliklerinden doğan bir ışık hikâyesi. Bu koleksiyon, gecenin gizemini ve ayın mistik parıltısını evinize taşıyor. El yapımı her parça, saatler süren özenli bir işçilikle şekillendirilmiş; siyah, lacivert ve gümüş tonlarının büyüleyici dansıyla gecenin ruhunu içine hapsetmiş. Yakıldığında yayılan derin, oryantal koku profili ortamı tamamen dönüştürür.',
  },
  {
    src: '/images/gunbatimi-sahil.jpg',
    alt: 'Gün Batımı Sahil',
    imgClass: 'ssh__img--left-tall',
    textSide: 'right',
    start: 200, end: -250,
    eyebrow: 'Sınırlı Seri',
    title: 'Gün Batımı\nSahil',
    sub: 'Sahil esintisi ve sıcak amber notaları',
    description: 'Deniz ufkunda sönen güneşin son altın kıvılcımlarından ilham alan bu sınırlı üretim seri, her mumda bir sahil gün batımını hapsediyor. Tuz esintisi, sıcak amber ve hafif sandal ağacı notaları iç içe geçerek özgürlük ve huzur dolu bir atmosfer yaratıyor. Her alev titreyişinde kendinizi kumlu kıyılarda hissedersiniz.',
  },
  {
    src: '/images/karli-manzara.jpg',
    alt: 'Karlı Manzara Mum',
    imgClass: 'ssh__img--center-wide',
    textSide: 'right',
    start: -200, end: 200,
    eyebrow: 'Kış Koleksiyonu',
    title: 'Karlı\nManzara',
    sub: 'Kış gecelerinin huzurlu sessizliği',
    description: 'Kar tanelerinin düşüşünün sessizliğini ve kış sabahlarının kristal berraklığını bir muma yüklemenin mümkün olduğunu biliyor muydunuz? Sedir, beyaz çay ve soğuk vanilya notalarının oluşturduğu bu benzersiz koku profili, sizi anında penceresinden kar manzarası seyreden sıcak bir odaya taşıyacak. Yaşam alanlarınıza mevsimin en özel huzurunu hediye ediyor.',
  },
  {
    src: '/images/sari-turuncu.jpg',
    alt: 'Canlı Sarı Turuncu Koleksiyon',
    imgClass: 'ssh__img--right-tall',
    textSide: 'left',
    start: 0, end: -400,
    eyebrow: 'Bahar Serisi',
    title: 'Sarı &\nTuruncu',
    sub: 'Canlı tonlar, coşkulu bir enerji',
    description: 'Baharın tüm tazeliğini ve güneşin neşeli sıcaklığını içinde barındıran bu koleksiyon, mekânlarınıza renk ve enerji katmak için tasarlandı. Bergamot, limon kabuğu ve taze papatya notaları birleşerek ferahlatıcı ve canlandırıcı bir deneyim sunuyor. Her sabah güne başlarken bu aromanın eşliğinde fark yaratın.',
  },
]

/* ─────────────────────────────────────────────────
   PARALLAX IMAGE + INFO PAIR
   Image ve metin aynı motion.div içinde — aynı
   translateY, scale, opacity ile birlikte hareket eder
───────────────────────────────────────────────── */
const ParallaxImg = ({ src, alt, start, end, imgClass, textSide, eyebrow, title, sub, description }) => {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  })

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0])
  const scale   = useTransform(scrollYProgress, [0.75, 1], [1, 0.85])
  const y       = useTransform(scrollYProgress, [0, 1], [start, end])

  const infoEl = (
    <div className={`ssh__img-info ssh__img-info--${textSide}`}>
      <span className="ssh__img-info-eyebrow">{eyebrow}</span>
      <h3 className="ssh__img-info-title">{title}</h3>
      <p className="ssh__img-info-sub">{sub}</p>
      {description && <p className="ssh__img-info-desc">{description}</p>}
    </div>
  )

  return (
    <motion.div
      ref={ref}
      className={`ssh__parallax-pair ${imgClass}-pair`}
      style={{ y, scale, opacity }}
    >
      {textSide === 'left' && infoEl}
      <img
        src={src}
        alt={alt}
        className={`ssh__parallax-img ${imgClass}`}
        loading="lazy"
        decoding="async"
      />
      {textSide === 'right' && infoEl}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────
   PARALLAX IMAGES
───────────────────────────────────────────────── */
const ParallaxImages = () => (
  <div className="ssh__parallax-wrap">
    {PARALLAX_ITEMS.map(item => (
      <ParallaxImg key={item.src} {...item} />
    ))}
  </div>
)

/* ─────────────────────────────────────────────────
   FAQ ROWS  (= hover.dev Schedule)
───────────────────────────────────────────────── */
const FAQ_ITEMS = [
  { question: 'Mumlar ne kadar süre yanar?',          category: 'Kullanım', detail: '40–50 saat' },
  { question: 'Hangi malzemeler kullanılıyor?',        category: 'Malzeme',  detail: '%100 Doğal Soy Mum' },
  { question: 'Mumları nasıl doğru yakmalıyım?',       category: 'Bakım',    detail: 'İlk kullanımda 2 saat' },
  { question: 'Sipariş ve kargo süreci nasıl işler?',  category: 'Kargo',    detail: '1–3 iş günü' },
  { question: 'İade ve değişim yapabilir miyim?',      category: 'İade',     detail: '14 gün içinde' },
]

const FAQItem = ({ question, category, detail }) => (
  <motion.div
    className="ssh__faq-row"
    initial={{ y: 48, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ ease: 'easeInOut', duration: 0.75 }}
    viewport={{ once: true }}
  >
    <div className="ssh__faq-left">
      <p className="ssh__faq-question">{question}</p>
      <p className="ssh__faq-category">{category}</p>
    </div>
    <p className="ssh__faq-detail">{detail}</p>
  </motion.div>
)

const FAQSection = () => (
  <section className="ssh__faq">
    <motion.h2
      className="ssh__faq-title"
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.75 }}
      viewport={{ once: true }}
    >
      Sık Sorulan Sorular
    </motion.h2>
    {FAQ_ITEMS.map(item => <FAQItem key={item.question} {...item} />)}
  </section>
)

export default function SmoothScrollHero() {
  return (
    <div className="ssh">
      <div className="ssh__hero-wrap">
        <CenterImage />
        <ParallaxImages />
      </div>
      <FAQSection />
    </div>
  )
}

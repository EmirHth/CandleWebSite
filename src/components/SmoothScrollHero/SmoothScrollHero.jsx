import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './SmoothScrollHero.css'

/* ─────────────────────────────────────────────────
   CENTER STICKY HERO
   Scroll aşağı indikçe resim yerinde kalır ve kart
   boyutuna kadar küçülür. Parallax resimler üzerinden geçer.
───────────────────────────────────────────────── */
const CenterImage = ({ containerRef }) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  /* 0 → 0.6 arası tam boyuttan kart boyutuna küçül */
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.72])

  return (
    <motion.div className="ssh__center" style={{ scale }}>
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
  {
    question: 'Mumlar ne kadar süre yanar?',
    category: 'Kullanım',
    detail: '40–50 saat',
    answer: 'Laydora mumları, yüksek kaliteli soy balmumu karışımımız sayesinde 40 ila 50 saat arasında verimli biçimde yanar. Fitili her kullanımdan önce 5 mm\'ye kısaltarak ve mumu her seferinde en az 2–3 saat yakarak bu süreyi uzatabilirsiniz. Havaya temas eden yüzeyin tamamen erimesini beklemek, mumu en verimli şekilde kullanmanıza yardımcı olur.',
  },
  {
    question: 'Hangi malzemeler kullanılıyor?',
    category: 'Malzeme',
    detail: '%100 Doğal Soy Mum',
    answer: 'Tüm mumlarımızda parafin ve petrol türevi içermeyen %100 doğal soy balmumu kullanılmaktadır. Fitillerimiz kurşunsuz pamuk ipliğinden üretilmiş olup zararlı kimyasal bırakmaz. Koku karışımlarımız ise sentetik dolgu içermeyen parfüm yağları ve doğal esansiyel yağların özel harmanlama formülüyle hazırlanmaktadır.',
  },
  {
    question: 'Mumları nasıl doğru yakmalıyım?',
    category: 'Bakım',
    detail: 'İlk kullanımda 2–3 saat',
    answer: 'İlk yakışta mumu en az 2–3 saat boyunca yakın; bu, mum yüzeyinin tamamının erimesini sağlayarak "tünel açılması" (tunneling) sorununu önler. Sonraki kullanımlarda fitili yaklaşık 5 mm uzunluğa kısaltın, mumu taslak olmayan düz bir yüzeye koyun ve asla 4 saatten fazla yakmayın. Mum kapağı varsa, mumu söndürdükten sonra kapağını takarak kokunun korunmasını sağlayın.',
  },
  {
    question: 'Sipariş ve kargo süreci nasıl işler?',
    category: 'Kargo',
    detail: '1–3 iş günü',
    answer: 'Siparişler hafta içi 10:00–17:00 saatleri arasında işleme alınır ve onaydan sonra 1–3 iş günü içinde kargoya teslim edilir. Kargo takip numaranız e-posta ile bildirilir. 500 TL ve üzeri siparişlerde kargo tamamen ücretsizdir; altındaki siparişlerde standart kargo ücreti 49,90 TL\'dir. Tüm ürünler kırılmaya karşı özel ambalajlanarak gönderilir.',
  },
  {
    question: 'İade ve değişim yapabilir miyim?',
    category: 'İade',
    detail: '14 gün içinde',
    answer: 'Ürünü teslim aldıktan itibaren 14 gün içinde, açılmamış ve orijinal ambalajında olması koşuluyla iade veya değişim talebinde bulunabilirsiniz. İade için destek ekibimizle iletişime geçmeniz yeterli; iade kargo bedeli Laydora tarafından karşılanır. Kişiselleştirilmiş ürünler ile kullanılmış mumlar iade kapsamı dışındadır.',
  },
  {
    question: 'Hediye paketleme hizmeti var mı?',
    category: 'Hediye',
    detail: 'Ücretsiz',
    answer: 'Tüm siparişlerde isteğe bağlı hediye paketleme hizmeti sunuyoruz. Sipariş aşamasında "Hediye Paketi" seçeneğini işaretleyerek özel kutu, kraft kağıt, saten kurdele ve kişisel el yazısı not kartı ekleyebilirsiniz. Bu hizmet tamamen ücretsizdir ve tüm ürünlerde geçerlidir.',
  },
  {
    question: 'Mumlar sağlıklı ve güvenli mi?',
    category: 'Güvenlik',
    detail: 'Katkısız & Test Edilmiş',
    answer: 'Laydora mumları %100 doğal soy balmumu, kurşunsuz pamuk fitil ve katkısız parfüm yağlarından üretilmektedir. Hiçbir ürünümüzde parafin, yapay boyar madde ya da toksik kimyasal bulunmaz. Tüm ürünler kalite kontrol testlerinden geçirilmektedir. Mumu daima gözetim altında yakın, yanıcı malzemelerin uzağında tutun ve çocukların erişemeyeceği bir yüzeyde kullanın.',
  },
]

const FAQItem = ({ question, category, detail, answer }) => (
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
      {answer && <p className="ssh__faq-answer">{answer}</p>}
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
  const heroWrapRef = useRef(null)

  return (
    <div className="ssh">
      <div className="ssh__hero-wrap" ref={heroWrapRef}>
        <CenterImage containerRef={heroWrapRef} />
        <ParallaxImages />
      </div>
      <FAQSection />
    </div>
  )
}

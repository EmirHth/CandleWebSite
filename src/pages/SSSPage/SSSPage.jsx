import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './SSSPage.css'

const CATEGORIES = ['Tümü', 'Ürünler', 'Kullanım', 'Kargo', 'İade', 'Hediye', 'Güvenlik']

const FAQ_DATA = [
  {
    category: 'Ürünler',
    question: 'Mumlarınız hangi malzemelerden üretiliyor?',
    answer: 'Tüm Laydora mumları %100 doğal soy balmumu (soy wax) kullanılarak üretilmektedir. Parafin, petrol türevi veya yapay katkı maddesi içermez. Fitillerimiz kurşunsuz pamuk ipliğinden, kokuları ise sentetik dolgu içermeyen parfüm yağları ve doğal esansiyel yağların özel harmanlama formülüyle hazırlanmaktadır.',
  },
  {
    category: 'Ürünler',
    question: 'Mumlar ne kadar süre yanar?',
    answer: 'Laydora mumları 40 ila 50 saat arasında verimli şekilde yanar. Bu süre, fitil uzunluğu, yüzeyin tamamen erimesi ve kullanım koşullarına bağlı olarak değişebilir. Fitili her yakıştan önce 5 mm\'ye kısaltmak ve mumu en az 2–3 saat boyunca yakmak bu süreyi uzatır.',
  },
  {
    category: 'Ürünler',
    question: 'Mum kokularınız yapay mı, doğal mı?',
    answer: 'Koku karışımlarımız hem doğal esansiyel yağlar hem de yüksek kaliteli, ftalat içermeyen parfüm yağlarının dengeli harmanından oluşur. Her koku formülü, soy balmumuna optimum koku atma gücü sağlamak için özel olarak geliştirilmiştir. Hiçbir ürünümüzde toksik veya zararlı kimyasal bulunmaz.',
  },
  {
    category: 'Kullanım',
    question: 'Mumu ilk kez nasıl yakmalıyım?',
    answer: 'İlk yakışta mumu en az 2–3 saat boyunca yakın. Bu, mum yüzeyinin tamamının erimesini sağlar ve "tünel açılması" (tunneling) sorununu önler. Bir sonraki kullanımda fitil 5 mm\'ye kısaltılmış olmalı; yakma süresi her seferinde 2–4 saat arasında tutulmalıdır. Mumu asla gözetimsiz bırakmayın.',
  },
  {
    category: 'Kullanım',
    question: 'Fitili neden kısaltmam gerekiyor?',
    answer: 'Uzun fitil, alevi büyütür; bu da mumu hızlı tüketir, duman çıkarır ve is bırakır. 5 mm uzunluk ideal alevdir: ne çok küçük (sönebilir) ne çok büyük (fazla yanma). Her kullanımdan önce fitili makas veya özel fitil makasıyla kısaltın.',
  },
  {
    category: 'Kullanım',
    question: 'Mumu nasıl söndürmeliyim?',
    answer: 'Üfleyerek söndürmekten kaçının; bu, duman ve is oluşturur. Bunun yerine mum kapağını kullanın veya bir fitil söndürücü (wick dipper) ile fitili eriyik muma daldırıp geri kaldırın. Bu yöntem hem duman oluşturmaz hem de fitili kor bırakmaz.',
  },
  {
    category: 'Kargo',
    question: 'Sipariş verince ne zaman elime ulaşır?',
    answer: 'Siparişler hafta içi 10:00–17:00 saatleri arasında işleme alınır. Onaydan sonra 1–3 iş günü içinde kargoya teslim edilir. Kargo takip numaranız e-posta ile iletilir. Hafta sonu ve resmi tatil günlerinde işlem yapılmaz; bu günlere denk gelen siparişler sonraki iş günü işleme alınır.',
  },
  {
    category: 'Kargo',
    question: 'Kargo ücretsiz mi?',
    answer: '500 TL ve üzeri siparişlerde kargo tamamen ücretsizdir. Bu tutarın altındaki siparişlerde 49,90 TL standart kargo ücreti uygulanır. Tüm ürünler kırılmaya karşı özel koruyucu ambalajla gönderilir.',
  },
  {
    category: 'Kargo',
    question: 'Hangi kargo firmasıyla gönderim yapılıyor?',
    answer: 'Siparişler Yurtiçi Kargo ve MNG Kargo ile gönderilmektedir. Kargo firması, ürün türü ve bölgeye göre belirlenir. Takip numaranızla kargo firmasının web sitesinden veya uygulamasından anlık takip yapabilirsiniz.',
  },
  {
    category: 'İade',
    question: 'İade nasıl yapılır?',
    answer: 'Ürünü teslim aldıktan itibaren 14 gün içinde, açılmamış ve orijinal ambalajında olması koşuluyla iade talebinde bulunabilirsiniz. İade için destek@laydora.com adresine e-posta gönderin veya sitemiz üzerinden talep oluşturun. İade kargo bedeli Laydora tarafından karşılanır.',
  },
  {
    category: 'İade',
    question: 'Hangi ürünler iade kapsamı dışındadır?',
    answer: 'Kişiselleştirilmiş veya özel sipariş ürünler, kullanılmış/açılmış mumlar ve ambalajı zarar görmüş ürünler iade kapsamı dışındadır. Ayrıca indirimli kampanya ürünlerinde iade koşulları farklılık gösterebilir; sipariş sırasında belirtilen özel koşullar geçerlidir.',
  },
  {
    category: 'Hediye',
    question: 'Hediye paketleme hizmeti sunuyor musunuz?',
    answer: 'Evet, tüm siparişlerde ücretsiz hediye paketleme hizmeti mevcuttur. Sipariş aşamasında "Hediye Paketi" seçeneğini işaretleyin; ürününüz özel kutu, kraft kâğıt, saten kurdele ve el yazısı not kartıyla paketlenir. Dilediğiniz kişisel mesajı sipariş notuna ekleyebilirsiniz.',
  },
  {
    category: 'Hediye',
    question: 'Toplu sipariş veya kurumsal hediye alabilir miyim?',
    answer: 'Kesinlikle. Kurumsal hediyeler, etkinlik iyilikleri veya toplu alımlar için özel fiyatlandırma ve kişiselleştirme seçenekleri sunuyoruz. Kurumsal talepleri için destek@laydora.com adresine ulaşın; size özel bir teklif hazırlayalım.',
  },
  {
    category: 'Güvenlik',
    question: 'Mumlar çocuklar ve evcil hayvanlar için güvenli mi?',
    answer: '%100 doğal soy balmumu ve kurşunsuz pamuk fitil kullandığımızdan mumlarımız genel ev kullanımı için güvenlidir. Bununla birlikte, hiçbir mum çocukların veya evcil hayvanların erişebileceği bir yerde bırakılmamalıdır. Mumu daima gözetim altında yakın, sönük yüzeyden 30 cm uzakta tutun ve yanıcı malzemelerin yakınına koymayın.',
  },
  {
    category: 'Güvenlik',
    question: 'Mumun kapının veya pencerenin yakınında yakılması sorun olur mu?',
    answer: 'Hava akımı, mum alevini dengesiz yakar; bu da eşit olmayan erime ve is oluşumuna yol açar. Pencere, kapı, klima veya vantilatör gibi hava akımı olan alanlardan uzakta, düz ve sabit bir yüzeyde yakmanızı öneririz. Taslaksız ortam hem güvenli hem de daha uzun yanma sağlar.',
  },
]

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`sss-item${isOpen ? ' sss-item--open' : ''}`}>
      <button className="sss-item__trigger" onClick={onToggle} aria-expanded={isOpen}>
        <span className="sss-item__question">{question}</span>
        <span className="sss-item__icon" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="sss-item__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="sss-item__answer">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SSSPage() {
  const [activeCategory, setActiveCategory] = useState('Tümü')
  const [openIndex, setOpenIndex] = useState(null)

  const filtered = activeCategory === 'Tümü'
    ? FAQ_DATA
    : FAQ_DATA.filter(f => f.category === activeCategory)

  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i)

  return (
    <div className="sss-page">

      {/* ── Header ── */}
      <motion.section
        className="sss-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="sss-hero__eyebrow">Yardım Merkezi</span>
        <h1 className="sss-hero__title">
          Sık Sorulan <em>Sorular</em>
        </h1>
        <p className="sss-hero__sub">
          Merak ettiğiniz her şeyin cevabı burada. Aradığınızı bulamazsanız bize yazın.
        </p>
      </motion.section>

      {/* ── Kategori filtresi ── */}
      <div className="sss-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`sss-filter-btn${activeCategory === cat ? ' sss-filter-btn--active' : ''}`}
            onClick={() => { setActiveCategory(cat); setOpenIndex(null) }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Accordion ── */}
      <div className="sss-list">
        {filtered.map((item, i) => (
          <motion.div
            key={item.question}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <FAQItem
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          </motion.div>
        ))}
      </div>

    </div>
  )
}

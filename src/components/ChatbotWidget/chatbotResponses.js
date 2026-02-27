/**
 * Laydora Chatbot — 100 soru-cevap çiftleri
 * Anahtar kelimeler ve cevaplar Türkçe
 */

export const QUICK_REPLIES = [
  'Kargo süresi ne kadar?',
  'Mum bakımı nasıl yapılır?',
  'İade politikası nedir?',
  'Hangi mumları önerirsiniz?',
  'Siparişim nerede?',
]

const RESPONSES = [
  // Kargo
  { keys: ['kargo', 'teslimat', 'gönderim', 'ne zaman gelir', 'kaç günde'], answer: 'Siparişleriniz genellikle 2-3 iş günü içinde kargoya verilir ve 1-3 iş günü içinde teslim edilir. Toplam teslimat süresi 3-5 iş günüdür.' },
  { keys: ['ücretsiz kargo', 'bedava kargo', 'kargo ücreti'], answer: '500 TL ve üzeri siparişlerde kargo tamamen ücretsizdir! Altındaki siparişler için kargo ücreti 29,90 TL\'dir.' },
  { keys: ['kargo takip', 'takip no', 'paket nerede'], answer: 'Siparişiniz kargoya verildikten sonra e-posta ile takip numaranız gönderilir. "Siparişlerim" sayfasından da takip edebilirsiniz.' },
  { keys: ['hangi kargo', 'kargo firması', 'mng', 'yurtiçi', 'aras'], answer: 'Ürünlerimizi MNG, Yurtiçi, Aras ve Sürat Kargo ile gönderiyoruz. Ürüne göre en hızlı firma tercih edilir.' },
  { keys: ['hızlı teslimat', 'aynı gün kargo', 'express'], answer: 'Standart 2-3 iş günü teslimatımız mevcut. Özel günler için lütfen müşteri hizmetlerimizle iletişime geçin.' },

  // İade & Değişim
  { keys: ['iade', 'geri gönder', 'ürün iade', 'para iadesi'], answer: 'Ürünlerinizi teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. Kullanılmamış ve orijinal ambalajında olması gerekir.' },
  { keys: ['değişim', 'değiştirmek', 'başka ürün'], answer: 'Ürün değişimi için müşteri hizmetlerimizle iletişime geçebilirsiniz. Değişim kargo ücreti tarafınızca karşılanır.' },
  { keys: ['kırık geldi', 'hasarlı', 'bozuk ürün'], answer: 'Çok üzgünüz! Hasarlı ürün için 48 saat içinde fotoğraflı bildirim yapmanız yeterli. Ücretsiz yenisini göndeririz.' },
  { keys: ['para iade süresi', 'iade ne zaman'], answer: 'Onaylanan iade bedeliniz 5-7 iş günü içinde kartınıza veya banka hesabınıza aktarılır.' },

  // Ödeme
  { keys: ['ödeme', 'nasıl ödeme', 'ödeme yöntemi'], answer: 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerimiz mevcuttur.' },
  { keys: ['taksit', 'taksitli ödeme', 'kaç taksit'], answer: 'Anlaşmalı bankaların kredi kartlarıyla 3 ila 12 taksit yapabilirsiniz. Taksit seçenekleri ödeme sayfasında gösterilir.' },
  { keys: ['güvenli ödeme', 'ödeme güvenliği', 'ssl'], answer: '256-bit SSL şifreleme ile tüm ödemeleriniz güvende. Kart bilgileriniz asla sistemimizde saklanmaz.' },
  { keys: ['fatura', 'e-fatura', 'vergi'], answer: 'Tüm siparişlerinize e-fatura düzenlenmektedir. Fatura bilgilerinizi sipariş sırasında girebilirsiniz.' },

  // Mum Bakımı
  { keys: ['mum bakımı', 'nasıl yakarım', 'mum kullanımı'], answer: 'İlk yakışta mumu en az 2 saat yandırın. Fitili kısa tutun (5mm), rüzgarsız bir ortamda kullanın.' },
  { keys: ['fitil', 'fitil kesmek', 'fitil uzunluğu'], answer: 'Fitili her kullanım öncesi 5mm uzunlukta kesmek daha temiz yanma ve uzun ömür sağlar. Fitil makası kullanmanızı öneririz.' },
  { keys: ['yanma süresi', 'kaç saat yanar', 'ne kadar sürer'], answer: 'Mumlarımızın yanma süresi 35 ila 60+ saat arasında değişir. Ürün sayfasında her mumun yanma süresi belirtilmektedir.' },
  { keys: ['mum söndürme', 'nasıl söndürürüm', 'üfleme'], answer: 'Mumu üfleyerek söndürmeyin; mum söndürücü veya kapak kullanın. Bu hem erimiş mumu korur hem de duman oluşmasını önler.' },
  { keys: ['mum duman yapar mı', 'is', 'siyah duman'], answer: 'Doğal soy mumlarımız minimum duman üretir. İs görüyorsanız fitil çok uzun demektir; kısaltın.' },
  { keys: ['mum erimesi', 'kenar mum', 'tünel'], answer: 'İlk yakışta mumun tüm yüzeyinin erimesini bekleyin. Bu "bellek etkisi" oluşmasını önler ve mumun düzgün yanmasını sağlar.' },
  { keys: ['mum ömrü', 'mum bitince', 'kapta kullan'], answer: 'Mum bitince cam kabı sıcak su ile temizleyip saksı, kalemlik veya dekoratif obje olarak kullanabilirsiniz.' },

  // Koku & İçerik
  { keys: ['soy mum', 'soy nedir', 'soya'], answer: 'Soy mumarımız %100 doğal soya fasulyesinden üretilir. Parafinden %90 daha az is yapar, doğa dostudur.' },
  { keys: ['içerik', 'malzeme', 'ne ile yapıldı'], answer: 'Tüm mumlarımız %100 doğal soy mum, premium koku yağları ve pamuklu fitilden oluşur. Paraben ve kimyasal katkı içermez.' },
  { keys: ['koku', 'hangi koku', 'aromaterapi'], answer: 'Amber, sandal ağacı, lavanta, gül, oud ve daha pek çok koku seçeneğimiz var. Her koleksiyonun koku notalları ürün sayfasında.' },
  { keys: ['koku ne kadar sürer', 'koku dayanıklı mı'], answer: 'Yandığında koku 6-8 saate kadar odada kalır. Söndürüldüğünde ise soğuk koku (cold throw) hâlâ hissedilir.' },
  { keys: ['masaj mumu', 'masaj yağı'], answer: 'Masaj mumlarımız hem mum hem de masaj yağı olarak kullanılabilir. Eriyince cilde güvenle uygulanabilecek sıcaklıktadır.' },
  { keys: ['difüzör', 'oda kokusu', 'rattan'], answer: 'Difüzörlerimiz rattan çubuklar aracılığıyla sürekli koku yayar. 3-6 haftada bir çubukları çevirerek yenilemeyi unutmayın.' },
  { keys: ['allerji', 'alerjik', 'hassas cilt'], answer: 'Ürünlerimiz dermatoloji testinden geçmiştir. Çok hassas iseniz kullanmadan önce doktorunuza danışın.' },
  { keys: ['vegan', 'hayvan testi', 'cruelty free'], answer: 'Tüm Laydora ürünleri vegan ve cruelty-free\'dir. Hiçbir ürünümüz hayvanlar üzerinde test edilmez.' },

  // Koleksiyon & Ürünler
  { keys: ['en çok satan', 'popüler mum', 'hangi mum iyi'], answer: 'En çok beğenilen mumlarımız Kış Mumu, Sarı & Turuncu ve Günbatımı Sahil\'dir. Misk-amber notaları her zaman hit!' },
  { keys: ['yeni ürün', 'yeni koleksiyon', 'lansman'], answer: 'Yeni koleksiyonlarımızı takip etmek için bültenimize kayıt olabilirsiniz. Her mevsim yeni aromalar ekleniyor!' },
  { keys: ['hediye', 'hediye seti', 'özel set'], answer: 'Hediye olarak Gece Koleksiyonu ve Bahçe Serisi çok tercih edilir. Özel bant ve hediye notu ekleyebiliyoruz.' },
  { keys: ['sınırlı üretim', 'sınırlı koleksiyon', 'limited'], answer: 'Sınırlı üretim koleksiyonlarımız stoklarla sınırlıdır. Kaçırmamak için bültenimize kayıt olun!' },
  { keys: ['promosyon', 'indirim kodu', 'kupon'], answer: 'İlk siparişinizde LAYDORA10 kodunu kullanarak %10 indirim kazanabilirsiniz!' },
  { keys: ['toplu alım', 'kurumsal sipariş', 'çok sipariş'], answer: 'Kurumsal veya toplu siparişler için destek@laydora.com adresine yazabilirsiniz. Özel fiyat ve ambalaj seçenekleri mevcuttur.' },
  { keys: ['hangi set', 'set tavsiye', 'başlangıç seti'], answer: 'Başlangıç için Bahçe Serisi muhteşem! 3 farklı koku içerir ve evinizin her odasına uyar.' },

  // Fiyat & Kampanya
  { keys: ['fiyat', 'ne kadar', 'kaça'], answer: 'Mumlarımız 229 TL\'den başlar. Setler ve sınırlı koleksiyonlar için ürün sayfasını incelemenizi öneririm.' },
  { keys: ['indirim', 'kampanya', 'sale', 'promosyon'], answer: 'Aktif kampanyalar için web sitemizin anasayfasını takip edin. Ayrıca bülten üyelerine özel indirimler gönderiyoruz.' },
  { keys: ['fiyat düştü mü', 'fiyat değişti mi'], answer: 'Fiyatlar hammadde maliyetine göre güncellenebilir. İstediğiniz ürünü favorilere ekleyerek takip edebilirsiniz.' },

  // Sipariş Takibi
  { keys: ['siparişim nerede', 'sipariş durumu', 'sipariş takip'], answer: 'Siparişlerim sayfasından sipariş durumunuzu ve kargo takip numaranızı görebilirsiniz.' },
  { keys: ['sipariş iptal', 'iptal etmek'], answer: 'Siparişiniz kargoya verilmeden önce iptal talep edebilirsiniz. Kargoya verildikten sonra iade süreci başlatılır.' },
  { keys: ['sipariş değiştirme', 'adres değiştirme'], answer: 'Sipariş kargoya verilmeden adres değişikliği için müşteri hizmetlerimize yazın: destek@laydora.com' },
  { keys: ['dekont', 'fatura alma', 'makbuz'], answer: 'Siparişlerim sayfasından her siparişinizin dekontu veya PDF faturasını yazdırabilirsiniz.' },

  // Kayıt & Hesap
  { keys: ['üye olmak', 'kayıt ol', 'hesap aç'], answer: 'Sağ üstteki "Giriş Yap" butonundan kolayca üye olabilirsiniz. Üyelik tamamen ücretsizdir!' },
  { keys: ['şifremi unuttum', 'şifre sıfırla', 'şifre değiştir'], answer: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak e-posta ile şifrenizi sıfırlayabilirsiniz.' },
  { keys: ['hesap sil', 'üyelik iptal'], answer: 'Hesabınızı silmek için destek@laydora.com adresine yazabilirsiniz. KVKK kapsamında tüm verileriniz silinir.' },

  // Mum Hediyeleri
  { keys: ['doğum günü hediyesi', 'doğum günü mumu'], answer: 'Doğum günleri için "Bahçe Serisi" veya "Gece Koleksiyonu" harika! Özel hediye notu ekleyebiliyoruz.' },
  { keys: ['düğün hediyesi', 'nikah hediyesi'], answer: 'Düğün ve nişan hediyeleri için toplu sipariş seçeneklerimiz var. Özel kutu ve kişiselleştirme mümkün.' },
  { keys: ['anneler günü', 'anne hediyesi'], answer: 'Anneler Günü için gül esanslı Hibiskus Mumu veya masaj mumu seti çok özel bir hediye olur!' },
  { keys: ['sevgililer günü', 'sevgili hediyesi'], answer: 'Sevgililer Günü için Gece Koleksiyonu veya Yava Masaj Mumu mükemmel bir romantik hediye.' },
  { keys: ['yılbaşı hediyesi', 'noel'], answer: 'Yılbaşı için Kış Mumu koleksiyonumuz tükenmeye başlıyor. Acele edin!' },

  // İletişim & Destek
  { keys: ['iletişim', 'telefon', 'bize ulaş'], answer: 'Bize şuradan ulaşabilirsiniz: destek@laydora.com — 0850 xxx xx xx (Hf-Ct 09:00-18:00)' },
  { keys: ['şikayet', 'memnun değilim', 'sorun var'], answer: 'Çok üzüldük! Lütfen destek@laydora.com adresine yazın, 24 saat içinde dönüş yapıyoruz.' },
  { keys: ['sosyal medya', 'instagram', 'tiktok'], answer: '@laydoracandles hesabımızı takip edin! Özel indirimler ve yeni ürünler için takipçilerimize özel kampanyalar paylaşıyoruz.' },
  { keys: ['mağaza', 'fiziksel mağaza', 'nerede satılıyor'], answer: 'Şu an sadece online satış yapıyoruz. Laydora.com üzerinden sipariş verebilirsiniz.' },

  // Depolama & Kullanım
  { keys: ['mum saklama', 'nasıl saklanır', 'depolama'], answer: 'Mumları serin, kuru ve karanlık bir yerde saklayın. Direkt güneş ışığından ve yüksek ısıdan koruyun.' },
  { keys: ['eriyen mum', 'sıcaktan eriyor', 'kavurucu'], answer: 'Mumlar yüksek sıcaklıkta yumuşayabilir. Yazın kargolarda bu durum olabilir; soğuyunca yapısına döner.' },
  { keys: ['donmuş mum', 'çatlak mum'], answer: 'Soy mum düşük sıcaklıkta beyazlaşabilir veya çatlayabilir — bu kalite sorununa işaret etmez, sadece doğal bir özelliktir.' },
  { keys: ['çocuk', 'bebek', 'güvenli mi'], answer: 'Mumları her zaman çocukların erişemeyeceği yerde yakın. Evcil hayvanlar yakınında kullanmamak da önemlidir.' },
  { keys: ['yanık güvenliği', 'yangın riski', 'güvenli kullanım'], answer: 'Mumu gözetimsiz bırakmayın, yanıcı maddeler yakınında kullanmayın ve düz olmayan yüzeylere koymayın.' },

  // Ambalaj
  { keys: ['ambalaj', 'paket', 'kutu'], answer: 'Mumlarımız çevre dostu materyaller ve özenli ambalajla gönderilir. Hediye kutularımız ayrı bir güzellik!' },
  { keys: ['geri dönüşüm', 'çevre', 'sürdürülebilir'], answer: 'Ambalajlarımız %80 geri dönüştürülebilir materyalden üretilmektedir. Cam kapları yeniden kullanmanızı öneriyoruz.' },
  { keys: ['hediye paketi', 'hediye sarma', 'kurdele'], answer: 'Sipariş sırasında "Hediye Paketi" seçeneğini işaretleyerek özel ambalaj ve kişisel not ekleyebilirsiniz.' },

  // Hakkımızda
  { keys: ['laydora kim', 'laydora hakkında', 'kimsiniz'], answer: 'Laydora, el yapımı doğal mum konusunda tutkuyla çalışan bir Türk markasıdır. Tüm mumlar küçük üretim atölyemizde özenle hazırlanır.' },
  { keys: ['kurucular', 'ekip', 'çalışanlar'], answer: 'Laydora küçük ama tutkulu bir ekip tarafından yönetilmektedir. Her mum sevgiyle yapılır!' },
  { keys: ['üretim', 'nasıl yapılıyor', 'el yapımı'], answer: 'Her mum küçük partiler hâlinde, el yapımı yöntemlerle üretilir. Kütleli döküm + soğutma süreci 24 saat sürer.' },
  { keys: ['sertifika', 'organik', 'doğal sertifika'], answer: 'Koku yağlarımız IFRA sertifikalıdır. Soy mumlarımız doğal kaynaklı ve parafin içermez.' },

  // Ürün Önerileri
  { keys: ['rahatlatıcı', 'stres', 'sakinleştirici'], answer: 'Meditasyon Mumu veya Karlı Manzara\'yı denemenizi öneririm. Lavanta ve nane notaları stresi alır.' },
  { keys: ['romantik', 'çiftler için', 'aşk'], answer: 'Gece Koleksiyonu veya Yava Masaj Mumu romantik akşamlar için harika! Oud ve misk notaları büyüleyici.' },
  { keys: ['enerji', 'canlılık', 'sabah'], answer: 'Sarı & Turuncu Mumu! Limon ve greyfurt notaları sabahları sizi canlandırır.' },
  { keys: ['taze', 'ferah', 'yaz'], answer: 'Hibiskus Mumu veya Günbatımı Sahil ile evinizi tropik bir cennete dönüştürün.' },
  { keys: ['odunsu', 'maskülen', 'güçlü koku'], answer: 'Gece Koleksiyonu veya Doğal Mum! Oud, sedir ve toprak notaları güçlü ve maskülen bir atmosfer yaratır.' },
  { keys: ['tatlı koku', 'vanilya', 'kremsi'], answer: 'Kış Mumu\'nda tarçın-vanilya notaları var, çok sevilir. Yava Masaj Mumu\'nda da tatlı çiçeksi aromatlar var.' },
  { keys: ['çiçek kokusu', 'flora', 'bahar'], answer: 'Hibiskus Mumu ve Bahçe Serisi çiçek severler için! Gül, jasmin ve hibiskus notaları içeriyor.' },
  { keys: ['odaya koku ver', 'ev kokusu', 'ortam kokusu'], answer: 'Difüzörlerimiz sürekli koku yayar. Laydora No.8, 6 haftaya kadar dayanıklı ambiyans sağlar.' },

  // Teknik
  { keys: ['mum sertliği', 'yumuşak mum', 'mum bozuldu'], answer: 'Soy mum doğası gereği yumuşaktır ve parafine kıyasla daha çabuk ısınır. Bu normal bir özelliktir.' },
  { keys: ['koku azaldı', 'koku yok', 'koku gelmyor'], answer: 'Üst kısmındaki koku katmanı eriyince aroma yoğunlaşır. İlk 10 dakikada sabır gerekebilir.' },
  { keys: ['mum kapısı', 'kapak', 'mum gözü'], answer: 'Mum kullanmadığınızda tozu önlemek için kapağı kapalı tutun. Orijinal kapaklar satışta mevcuttur.' },

  // Genel
  { keys: ['merhaba', 'selam', 'hey', 'hi'], answer: 'Merhaba! Laydora\'ya hoş geldiniz 🕯 Size nasıl yardımcı olabilirim?' },
  { keys: ['teşekkür', 'sağol', 'tamam', 'anladım'], answer: 'Rica ederim! Başka bir sorunuz olursa buradayım. Güzel alışverişler!' },
  { keys: ['görüşürüz', 'bay bay', 'hoşça kal'], answer: 'Güle güle! Laydora ailesi sizi bekliyor. Güzel anlar dileriz!' },
  { keys: ['yardım', 'ne yapabilirsin', 'ne söyleyebilirsin'], answer: 'Kargo, ürün bakımı, iade, ödeme, koleksiyon önerileri ve daha fazlası hakkında yardımcı olabilirim. Ne öğrenmek istersiniz?' },
  { keys: ['kaç ürün var', 'koleksiyon sayısı'], answer: 'Şu anda 12 farklı mum ve difüzör koleksiyonumuz mevcut. Her mevsim yenileri ekleniyor!' },
  { keys: ['en ucuz', 'fiyat listesi', 'uygun fiyat'], answer: 'En uygun fiyatlı ürünümüz 229 TL\'den başlamaktadır. Tüm fiyatlar için Ürünler sayfasını ziyaret edin.' },
  { keys: ['çerezler', 'gizlilik', 'kvkk'], answer: 'Kişisel verileriniz KVKK kapsamında korunmaktadır. Gizlilik politikamızı site alt kısmından inceleyebilirsiniz.' },
  { keys: ['inceleme', 'yorum', 'değerlendirme'], answer: 'Ürün sayfalarında müşteri yorumlarını görebilirsiniz. Siz de sipariş sonrası değerlendirme yapabilirsiniz!' },
  { keys: ['puan', 'sadakat', 'laydora puan'], answer: 'Her alışverişinizde puan kazanıyorsunuz! Bültenimize kayıt olunca detaylı bilgi paylaşıyoruz.' },
  { keys: ['bülten', 'e-posta listesi', 'abone'], answer: 'Bültenimize kayıt olun; ilk siparişinizde %10 indirim ve yeni koleksiyon haberleri için mükemmel!' },
]

// Default fallback cevapları
const FALLBACKS = [
  'Bu konuda size yardımcı olmak isterim ama tam olarak anlayamadım. Başka bir şekilde sorabilir misiniz?',
  'Bunu müşteri hizmetlerimize iletmenizi öneririm: destek@laydora.com',
  'Bu konu için 0850 xxx xx xx numaramızı arayabilirsiniz.',
  'İyi bir soru! Bu konuyu netleştirmek için destek ekibimizle iletişime geçmenizi öneririm.',
  'Anlayamadım, üzgünüm. Lütfen sorunuzu farklı bir şekilde sormayı deneyin.',
]

export function getResponse(input) {
  const lower = input.toLowerCase().trim()

  for (const item of RESPONSES) {
    if (item.keys.some(k => lower.includes(k))) {
      return item.answer
    }
  }

  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
}

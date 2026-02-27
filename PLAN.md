# Admin Panel Genişletme Planı

## Mevcut Durum
5 sekme var: Dashboard, Ürünler, Siparişler, Kullanıcılar, Ayarlar

## Yapılacaklar

---

### 1. YENİ SEKMELER (5 adet)

#### AdminKampanya.jsx
- Kupon listesi (CRUD): kod, tür (%), indirim miktarı, min. sipariş, geçerlilik tarihi, kullanım limiti
- Kampanya türleri: yüzde indirim, sabit TL indirim, ücretsiz kargo, hediye çeki
- Aktif/pasif toggle, kullanım istatistikleri

#### AdminFinans.jsx
- Finansal özet: dönemsel gelir, vergi tutarı, iade tutarı
- Ödeme yöntemi dağılımı (kredi kartı, havale, kapıda ödeme)
- Taksit bilgileri tablosu (3/6/9/12 ay kırılımları)
- Para iade yönetimi: iade listesi, onay/ret, yöntem (iade/hediye çeki)
- Finansal notlar ve banka işlem numaraları
- Vergi raporu (KDV hesaplama)
- CSV/PDF export butonu

#### AdminAnalitik.jsx
- KPI kartları: dönüşüm oranı, ortalama sipariş değeri, müşteri başına gelir, CLV
- Satış grafiği (günlük/haftalık/aylık/yıllık)
- Müşteri segmentasyon grafiği (VIP/Aktif/Pasif/Yeni)
- Ürün performans tablosu: görüntülenme, sepete ekleme, satış oranı
- Kategori bazlı gelir dağılımı
- Müşteri kazanım ve kayıp analizi
- Finansal raporlar: aylık P&L özeti

#### AdminDestek.jsx
- Destek talep listesi (CRUD)
- Talep durumları: Yeni / İnceleniyor / Çözüldü / Kapatıldı
- Öncelik: Düşük / Normal / Yüksek / Acil
- Kategori: Sipariş / İade / Ürün / Teknik / Diğer
- Talep detay modal: müşteri bilgisi, mesaj geçmişi, admin yanıtı
- Yanıt yazma formu

#### AdminTeslimat.jsx
- Teslimat takip paneli (tüm kargolar)
- Kargo servisi: PTT / UPS / MNG / Yurtiçi / Aras / Sürat
- Kargo takip no görüntüleme ve güncelleme
- Tahmini teslim tarihi
- Teslimat açıklaması/notu
- Toplu durum güncelleme
- Geciken teslimat uyarıları

---

### 2. MEVCUT SEKMELERE EKLENTİLER

#### AdminUrunler.jsx — ürün formu genişletme
- SKU (benzersiz ürün kodu, otomatik öneri)
- Barkod (EAN/UPC)
- Varyasyonlar: koku seçeneği + fiyat farkı (tablo, ekle/sil)
- Boyutlar: en / boy / yükseklik (cm)
- Net ağırlık / Brüt ağırlık (g)
- Hacim/mililitre (ml)
- Vergi oranı seçimi (% KDV)

#### AdminSiparisler.jsx — sipariş detay genişletme
- Fatura bilgisi: ad-soyad, TC/vergi no, şirket adı, fatura adresi
- Teslimat adresi (mevcut + genişletme)
- Ödeme yöntemi detayı: taksit sayısı, banka, işlem tarihi
- Banka işlem numarası alanı
- Finansal notlar (admin notu)
- Fatura PDF önizleme/download butonu (mock)

#### AdminKullanicilar.jsx — kullanıcı detay genişletme
- Üyelik durumu: Standart / Gümüş / Altın / Platin (harcamaya göre)
- Müşteri segmenti: Yeni / Aktif / VIP / Uyuyan / Kayıp
- Segment kriterleri: son sipariş tarihi, toplam harcama, sipariş sıklığı
- Müşteri değeri (CLV) gösterimi
- Segmenti manuel override edebilme

---

### 3. ADMIN SIDEBAR GÜNCELLEMESI (AdminPage.jsx)
Yeni 5 sekme için nav item ekle:
- 🎁 Kampanyalar → /admin/kampanyalar
- 💰 Finans → /admin/finans
- 📊 Analitik → /admin/analitik
- 🎧 Destek → /admin/destek
- 🚚 Teslimat → /admin/teslimat

---

## Uygulama Sırası
1. AdminPage.jsx sidebar güncelleme + routing
2. AdminUrunler.jsx ürün form genişletme (SKU, barkod, varyasyon, ağırlık)
3. AdminSiparisler.jsx (fatura, banka tx, taksit, finansal not)
4. AdminKullanicilar.jsx (üyelik, segment)
5. AdminKampanya.jsx (yeni sekme)
6. AdminFinans.jsx (yeni sekme)
7. AdminTeslimat.jsx (yeni sekme)
8. AdminAnalitik.jsx (yeni sekme)
9. AdminDestek.jsx (yeni sekme)

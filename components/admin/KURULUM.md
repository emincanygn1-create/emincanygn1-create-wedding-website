# Adım 8 — Geçiş Hatası, RSVP Kontrolü ve Eklemeler

## Kurulum

1. `supabase-step8.sql`'i çalıştır.
2. Dosyaları GitHub'a yükle.

Silinecek dosya yok. `Preloader.tsx`, `Celebration.tsx`, `InviteLinkBuilder.tsx` ve
`app/admin/(protected)/invite/page.tsx` yeni, gerisi mevcutların üzerine yazar.

---

## 1. Geçişler neden hiç görünmüyordu

Sebep büyük ihtimalle bilgisayarının ayarı: **hareket azaltma**.

Windows'ta *Ayarlar → Erişilebilirlik → Görsel efektler → Animasyon efektleri* kapalıysa,
macOS'ta *Sistem Ayarları → Erişilebilirlik → Ekran → Hareketi azalt* açıksa, tarayıcı
her siteye "bu kullanıcı animasyon istemiyor" diye haber verir. Tarayıcı konsoluna
şunu yazarsan görürsün:

```js
matchMedia('(prefers-reduced-motion: reduce)').matches
```

`true` çıkıyorsa sebep bu.

Ama asıl hata bendeydi. Bu sinyali alınca **her şeyi** kapatıyordum: solmalar, perdeler,
kaymalar, hepsi. Doğrusu bu değil. Hareket azaltma isteyen kişi, ekranda büyük hareket
ve kayma istemez — yumuşak bir solmadan rahatsız olmaz. Şimdi öyle:

- Hareket azaltma **kapalıysa**: her şey tam çalışır (perde, parallax, kelime kelime yükselme).
- Hareket azaltma **açıksa**: yazılar ve fotoğraflar yine yumuşakça solarak gelir, sadece
  kayma / ölçek / parallax devre dışı kalır.

Yani ayarını değiştirmesen de artık geçişleri göreceksin. Tam halini görmek istersen
ayarı açman yeterli.

---

## 2. RSVP açma / kapatma

Panelde **Site İçeriği** sayfasının en üstünde yeni bir kutu var:

- **Katılım formu açık** anahtarı. Kapatınca sitede formun yerine senin yazdığın mesaj çıkar.
- **Son katılım bildirim tarihi** (isteğe bağlı). Bu tarih geçince form kendiliğinden kapanır.
  Form açıkken misafir başlığın altında "Son katılım bildirimi: 1 Haziran 2027" yazısını görür.
- Kapalıyken gösterilecek **mesaj**, aşağıdaki *Çevrilebilir Metinler* bölümünde — üç dilde
  ayrı ayrı. Boş bırakırsan hazır bir metin kullanılır.

Önemli kısım: kapatma işlemi sadece görsel değil. `supabase-step8.sql` veritabanı kuralını
da güncelliyor, form kapalıyken sunucu yeni cevabı **reddediyor**. Yoksa tarayıcı
konsolunu bilen biri kapalı formdan kayıt gönderebilirdi.

---

## 3. Eklediklerim

Beğenmezsen hepsi tek dosya silmekle geri alınır, söyle yeter.

**Açılış ekranı.** Site açılırken koyu bir ekranda isimler ve ince bir altın ilerleme
çizgisi görünüyor, sayfa hazır olunca yumuşakça kayboluyor ve davetiye kapısı çıkıyor.
Fontlar ve kapak videosu yüklenirken misafirin yarım yamalak bir sayfa görmesini engelliyor.
Ağ çok yavaşsa 5 saniyede kendini kapatıyor, kimse ekranda kalmıyor.

**Kalp yağmuru.** "Davetiyeyi Aç"a basıldığı anda dört saniyeliğine altın ve krem
kalpler düşüyor. Perde kalkışıyla aynı anda oluyor, güzel duruyor.

**Davetiye linki üretici.** Panelde yeni bir sayfa: **Davetiye Linki**. Misafirin adını
yazıyorsun, dili seçiyorsun; sana hem linki hem de altına hazır bir davet mesajı veriyor.
"WhatsApp'ta gönder" butonu doğrudan paylaşım ekranını açıyor. `?to=` parametresini elle
yazma derdi bitti.

**Link önizlemesi.** Davetiyeyi WhatsApp veya Instagram'da paylaşınca artık çıplak bir
adres değil; kapak fotoğrafı, isimler, tarih ve şehir görünüyor. (Kapak fotoğrafı yüklü
olmalı.)

**Galeride kaydırma.** Telefonda büyütülmüş fotoğrafta sağa sola kaydırarak
gezinebiliyorsun. Bilgisayarda ok tuşları zaten çalışıyordu.

---

## Öneri

Kapak fotoğrafını mutlaka yükle. Üç ayrı yerde çalışıyor: video yüklenene kadar poster
olarak, veri tasarrufu açık telefonlarda videonun yerine, ve link paylaşıldığında
önizleme görseli olarak.

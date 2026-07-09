# Adım 11 — Cila

## Kurulum

1. `supabase-step11.sql`'i çalıştır (tek sütun ekliyor).
2. Dosyaları reponun **kök sayfasından** yükle.
3. Vercel → Settings → Environment Variables → **`NEXT_PUBLIC_SITE_URL`** ekle,
   değeri kendi alan adın (örn. `https://ayse-mehmet.com`). Vercel'in geçici
   adresini kullanıyorsan atlayabilirsin, otomatik buluyor.

Yeni dosyalar: `lib/siteUrl.ts`, `lib/scrollLock.ts`, `components/Spinner.tsx`,
`app/icon.svg`, `app/robots.ts`, `app/sitemap.ts`, `app/not-found.tsx`,
`app/[locale]/loading.tsx`.

---

## Önce dürüst konuşalım: Lighthouse

Ben burada Lighthouse çalıştıramıyorum, gerçek bir iPhone'da da açamıyorum. Yaptığım şey,
o skoru belirleyen kalemleri kodda düzeltmek oldu. Sayının kaç çıkacağını sen ölçeceksin.

Skoru en çok etkileyecek değişiklik **görsellerin `next/image`'a taşınması**. Artık
tarayıcıya AVIF/WebP, ekran boyutuna göre `srcset` ve doğru `width`/`height` gidiyor.
Ham `<img>` etiketleriyle en iyi ihtimalle 70'lerde takılırdın; asıl fark burada.

Bunun bir şartı var: **Vercel'de görsel optimizasyonu ücretli kotaya tabi.** Ücretsiz
planda aylık dönüştürme limiti dolarsa görseller optimize edilmeden servis edilir
(site çalışır, sadece yavaşlar). Bir düğün sitesi için limit fazlasıyla yeter, ama
bilmen lazım.

Ölçerken **mutlaka production deploy'unda** ölç (`vercel.app` adresinde), local dev'de
değil. Dev sunucusu optimize edilmemiş bundle servis eder, skor 30-40 çıkar, boşuna
telaşlanırsın.

### Yapılanlar
- Bütün içerik görselleri `next/image` (AVIF/WebP, responsive, lazy).
- Kapak fotoğrafı `priority` — LCP elemanı artık erken yükleniyor.
- Ana sayfa 4 misafir fotoğrafı çekiyor, hepsini değil (önceden yüzlercesi geliyordu).
- Kapak videosu `preload="metadata"` — dosyanın tamamı peşinen inmiyor.
- `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` başlıkları.
- Görsel önbelleği 30 gün.

### Muhtemelen kalan tek kırmızı
Google Fonts üç aile yüklüyor (Fraunces, Jost, Great Vibes). Skor hâlâ düşükse ilk
bakacağın yer burası. Great Vibes'ı atarsan hızlanır ama el yazısı gider — bence değmez.

---

## iOS Safari

Bu kod tabanında dört gerçek tuzak vardı, dördü de kapatıldı:

**Kaydırma kilidi.** Davetiye kapısı açıkken sayfayı `body { overflow: hidden }` ile
kilitliyordum. iOS Safari bunu yok sayar — kapağın arkasındaki sayfa kayardı. Artık
`position: fixed` yöntemi kullanılıyor, kaydırma konumu saklanıp kilit açılınca geri
veriliyor. Aynısı fotoğraf büyütme penceresinde de vardı.

**Form alanına dokununca yakınlaşma.** iOS, 16px'ten küçük yazılı bir alana odaklanınca
sayfayı zorla yakınlaştırır ve geri çıkmaz. Mobilde bütün input/textarea/select'ler
16px'e sabitlendi. (`maximum-scale=1` ile susturmak yaygın çözüm ama erişilebilirliği
bozuyor, o yolu seçmedim — kullanıcı yine iki parmakla yakınlaştırabiliyor.)

**Alt çubuk çakışması.** Sabit menü, müzik butonu ve fotoğraf yükleme butonu iPhone'un
ana ekran çizgisiyle çakışıyordu. `env(safe-area-inset-bottom)` eklendi.

**`100vh` sorunu.** iOS'ta `100vh` adres çubuğunu saymaz, sayfa taşar. Kritik yerlerde
`100svh` kullanılıyor.

Ayrıca `-webkit-tap-highlight-color` kapatıldı (butonlara dokununca mavi kutu çıkmıyor).

---

## Küçük animasyonlar

Abartmadan, üç şey:

- Butonlar basılınca %1.5 çöküyor (`active:scale`). Hissedilir ama fark edilmez.
- Klavyeyle gezinen için altın renkli net bir odak halkası (`:focus-visible`).
- Gönder butonlarında dönen bir yükleme göstergesi.

Kart hover'ları, bölüm geçişleri ve perde animasyonları zaten yerindeydi, dokunmadım.
Hepsi hareket azaltma tercihine saygı duyuyor.

---

## Hata durumları

Sorduğun sorunun cevabı eskiden şuydu: "kırmızı bir satır görüyor, başka hiçbir şey yok."
Şimdi:

**Yükleniyor var mı?** Var. Buton dönen bir gösterge çıkarıyor, `aria-busy` işaretleniyor,
metin "Gönderiliyor..." oluyor.

**Tekrar gönderme engelleniyor mu?** İki katmanlı. Buton `disabled` oluyor, ama asıl koruma
bir `useRef` bayrağı — buton disabled olmadan önce ikinci tıklama gelirse (yavaş ağda olur)
o da engelleniyor. React state'i asenkron güncellendiği için tek başına `disabled` yetmez.

**Gönderilemezse ne görüyor?** Duruma göre:
- *İnternet yoksa:* "İnternet bağlantın yok gibi görünüyor" + **Tekrar dene** düğmesi.
  Formu kaybetmiyor, yazdığı her şey duruyor.
- *Form o arada kapatıldıysa:* veritabanı kuralı reddediyor, hata kodunu (`42501`)
  yakalayıp "Katılım formu az önce kapatıldı, cevabın kaydedilemedi" diyorum. Tekrar
  dene düğmesi çıkmıyor, çünkü tekrar denemek işe yaramaz.
- *Başka bir hata:* genel mesaj + tekrar dene.

Hata alanı `aria-live="polite"` — ekran okuyucu kullanan biri hatayı duyuyor.

Aynı korumalar dilek formunda ve fotoğraf yüklemede de var.

---

## Son rötuşlar

- **Favicon:** `app/icon.svg` — zeytin yeşili kare, altın halka, krem kalp. Next.js
  bunu otomatik olarak favicon'a çeviriyor, ayrı ayar gerekmiyor.
- **Open Graph:** kapak fotoğrafın kullanılıyor, `metadataBase` eklendi (Next artık
  göreli yolları mutlak adrese çeviriyor — eskiden build uyarısı veriyordu).
- **SEO:** `robots.txt` ve `sitemap.xml` otomatik üretiliyor. Panel (`/admin`) dizine
  kapatıldı. Her sayfada `canonical` ve üç dil için `hreflang` var.
- **404 sayfası:** koyu zemin, el yazısıyla "404", süsleme ve ana sayfaya dönüş butonu.
  Ziyaretçinin diline göre çıkıyor.
- **Yükleme ekranı:** iki ayrı şey var. Sunucu veri çekerken `loading.tsx` (sade bir
  gösterge), sonra isimlerin ve altın çizginin olduğu açılış ekranı.

---

## Nikah ve düğün birleşti

Site İçeriği'nin üstünde yeni bir kutu: **Etkinlik → "Nikah ve düğün aynı yerde"**.

Açtığında iki kart yerine tek, daha geniş bir kart geliyor. Mekân adı, tarih, adres ve
harita bağlantısı **nikah alanlarından** okunuyor. Kartın ortasında iki saat alt alta
listeleniyor:

```
Nikah Töreni              15:00
Düğün Resepsiyonu         19:00
```

Düğün saatini boş bırakırsan o satır hiç çıkmıyor. Düğün mekânı, adresi ve harita
alanlarını doldurmana gerek yok — anahtar açıkken hiçbiri okunmuyor.

Anahtarı kapatırsan eski iki kartlı düzen geri geliyor, veri kaybı yok.

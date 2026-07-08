# Adım 7 — Kapak Videosu ve Zenginleştirilmiş Geçişler

## Kurulum

1. **`supabase-step7.sql`'i çalıştır** (SQL Editor → yapıştır → Run).
2. **Dosyaları GitHub'a yükle** (`app`, `components`, `lib` klasörleri + `supabase-step7.sql`).
3. Panelde **Site İçeriği → Kapak Videosu** alanına videoyu yükle.

Silinecek dosya yok.

---

## Önce videoyu konuşalım

100 MB olmaz. İki ayrı sebepten:

**Supabase engelliyor.** Ücretsiz planda dosya başına yükleme sınırı 50 MB. SQL'deki
`file_size_limit` satırı bunu aşamaz, çünkü sınır plan seviyesinde. 100 MB'lık dosya
panelde "hata" verip duracak.

**Misafirler göremez.** Arka plan videosu sayfa açılır açılmaz indirilmeye başlar.
4G'de 100 MB yaklaşık 40-60 saniye. Düğün davetiyesine bakan kişi o kadar beklemez —
siyah ekran görüp kapatır. Toplam veri de cabası: 200 misafir × 100 MB = 20 GB, ücretsiz
planın aylık bant genişliği 5 GB.

**Çözüm: videoyu sıkıştır.** 15-20 MB fazlasıyla yeterli. Arka plan videosu sessiz,
döngüsel ve üzerinde koyu bir katman olduğu için kalite kaybı fark edilmez. Bilgisayarında
[ffmpeg](https://ffmpeg.org) varsa:

```bash
ffmpeg -i orijinal.mp4 -t 20 -vf "scale=1280:-2" -c:v libx264 -crf 30 \
       -preset slow -movflags +faststart -an kapak.mp4
```

Ne yapıyor: ilk 20 saniyeyi alıyor, 720p'ye indiriyor, sesi tamamen atıyor (zaten sessiz
oynayacak), videoyu hemen oynamaya başlayacak şekilde paketliyor. Sonuç genelde 8-15 MB.
ffmpeg kurmak istemezsen [Handbrake](https://handbrake.fr) aynı işi arayüzle yapar.

**Alternatif:** videoyu başka yerde barındır. Panelde "Kapak Videosu — harici bağlantı"
diye bir kutu var. Cloudflare R2, Bunny.net veya bir başka yerdeki `.mp4` linkini
oraya yapıştırman yeterli, Supabase'e hiç yüklemezsin. Boyut sınırı da kalkar.

### Video nasıl davranıyor

- Sessiz, döngüsel, `playsinline` — mobilde tam ekrana zıplamıyor.
- Kapak fotoğrafı **poster** olarak duruyor. Video yüklenene kadar fotoğraf görünüyor,
  video hazır olunca yumuşakça geçiş yapıyor. Yani kapak fotoğrafını da yüklü bırak.
- Telefonda **veri tasarrufu** açıksa veya kullanıcı sistem ayarlarından **hareket azaltma**
  istemişse video hiç indirilmiyor, sadece fotoğraf gösteriliyor.
- Davetiye kapısındaki video hemen oynuyor; arkadaki kapak bölümünün videosu ancak
  "Davetiyeyi Aç"a basılınca başlıyor. İki kez indirilmiyor, tarayıcı önbellekten alıyor.

---

## Geçişler

**Başlıklar artık kelime kelime açılıyor.** Her kelime bulanıktan netleşerek, hafif bir
dönüşle aşağıdan yükseliyor, aralarında 55 ms fark var. Kapaktaki isimler, bölüm
başlıkları, salon adları, alıntı metni, kapanıştaki isimler — hepsi böyle.

**Fotoğraflar perde gibi açılıyor.** Görsel aşağıdan yukarı doğru açılırken aynı anda
%118'den %100'e geri çekiliyor. İki hareket farklı hızda olduğu için sinematik duruyor.
Galeri, etkinlik kartları, gelin-damat fotoğrafları, anı duvarı önizlemesi — hepsinde var.

**Parallax.** Gelin-damat fotoğrafları ve etkinlik kartlarındaki görseller sayfa kayarken
çerçevenin içinde hafifçe zıt yönde hareket ediyor. `requestAnimationFrame` ile
yapıldığı için kaydırmayı takılmıyor.

**Sayaç rakamları dönerek değişiyor.** Her rakam ayrı; sadece değişen rakam
3 boyutlu bir eksende dönerek yenileniyor. Saniyeler sürekli dönüyor, dakikalar
dakikada bir. Bütün blok her saniye titremiyor.

Hareket azaltma isteyen kullanıcılarda bunların hepsi otomatik olarak kapanıyor.

---

## Çerçeveler

Haklıydın, mezar taşıydı. Üstü kemerli + altı düz form tam olarak o siluet.

**Fotoğraflar** artık yumuşak köşeli (28 px yarıçap) dikdörtgen. Arkasında 12 px
kaydırılmış ince bir altın çerçeve var — fotoğrafın "üzerine oturduğu" bir katman
hissi veriyor. İçeride krem rengi ince bir hat, sol üst ve sağ alt köşede birer
altın köşe kesiği. Simetrik değil, bilerek: köşegen denge daha canlı duruyor.

**Sayaç kutuları** da aynı dile geçti: 20 px yarıçaplı kare, içinde 6 px içeriden
ikinci bir altın hat. Kemer yok.

Renk paleti yine aynı — zeytin, krem, altın, kiremit.

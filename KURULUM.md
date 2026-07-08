# Adım 6 — Tasarım ve Geçişler

Bu paket bir önceki adımın üstüne gelir. RSVP, dilekler, anı duvarı, 3 dil — hepsi
yerinde duruyor. Değişen tek şey görünüm ve hareket. Renk paletine dokunmadım:
aynı zeytin yeşili, krem, altın ve kiremit.

---

## Kurulum

**1. Supabase'de `supabase-step6.sql`'i çalıştır.** SQL Editor → yapıştır → Run.
Sadece birkaç yeni sütun ekliyor (kapak fotoğrafı, arka planlar, müzik, Instagram
kullanıcı adları, kapanış metni). Mevcut verilerine dokunmuyor.

**2. Dosyaları GitHub'a yükle.** `app`, `components`, `lib` klasörlerini ve
`tailwind.config.ts` ile `supabase-step6.sql` dosyalarını sürükle bırak.

**3. Panelden yeni alanları doldur.** Site İçeriği sayfasında artık kapak fotoğrafı,
arka plan görselleri ve müzik yükleme alanları var. En azından **kapak fotoğrafını**
yükle — tasarımın çoğu onun üzerine kurulu. Dikey (portre) bir fotoğraf en iyi sonucu
verir.

Bu adımda silinecek dosya yok.

---

## Ne değişti

**Davetiye kapısı.** Site artık doğrudan açılmıyor. Misafiri tam ekran bir kapak
karşılıyor: kapak fotoğrafı, üzerinde el yazısı fontuyla isimler, tarih, köşelerde
çiçek süslemeleri, süzülen taç yaprakları. Ortada "Davetiyeyi Aç" butonu. Butona
basana kadar sayfa kaydırılamıyor. Basınca perde yukarı çekiliyor ve müzik başlıyor.

Aynı sekmede bir kez açılıyor; misafir Anı Duvarı'na gidip geri dönerse kapı tekrar
çıkmıyor.

**Misafire isimle hitap.** Davetiye linkinin sonuna `?to=Ahmet Bey` eklersen kapıda
"Sayın Ahmet Bey" yazıyor. Boş bırakırsan "Değerli Misafirimiz" diyor. WhatsApp'tan
kişiye özel link göndermek için ideal:

```
https://siteniz.com/tr?to=Ahmet%20Bey
https://siteniz.com/it?to=Signora%20Rossi
```

**Müzik.** Panelden bir MP3 yüklüyorsun. Davetiye açıldığı anda çalmaya başlıyor
(tarayıcılar müziği ancak bir tıklamadan sonra çalmaya izin verdiği için kapı
tam bunun için ideal). Sol altta sürekli görünen bir butonla susturulabiliyor.
Müzik yüklemezsen buton hiç görünmüyor.

**Yazı karakteri.** İsimler artık el yazısı bir fontla (Great Vibes) yazılıyor —
kapakta, çift bölümünde, salon adlarında ve kapanışta. Başlıklar Fraunces, gövde
metni Jost olarak kaldı.

**Kemer fotoğraflar.** Gelin ve damat fotoğrafları yuvarlak yerine üstü kemerli
dikdörtgen çerçevede, çevresinde ince altın bir hat. Altlarına Instagram kullanıcı
adı eklenebiliyor (panelden), bir rozet olarak görünüyor.

**Süslemeler.** Her bölüm başlığının altında yaprak-çiçek motifli ince bir ayraç var.
Kapak, kapanış ve davetiye kapısının köşelerinde asma dalı benzeri bir süsleme
uzanıyor. Hepsi SVG, yani her ekranda net.

**Sabit arka planlar.** Alıntı ve kapanış bölümleri fotoğraf üzerine koyu bir
katmanla yerleşiyor ve masaüstünde sayfa kayarken sabit kalıyor — o klasik parallax
etkisi. Mobilde (iOS bunu düzgün yapmadığı için) otomatik olarak kapanıyor.

**Geri sayım.** Rakamlar artık kemer formunda çerçevelerin içinde. Altında
**Takvime Ekle** butonu var; tıklayınca telefon veya bilgisayarın takvimine düşen
bir `.ics` dosyası iniyor. Ek servis gerektirmiyor.

**Etkinlik kartları.** Nikah ve düğün kartlarının üstünde artık birer fotoğraf var
(galerinin ilk iki karesini otomatik kullanıyor). Üzerine gelince fotoğraf hafifçe
büyüyor, kart yukarı kalkıyor.

**Galeri.** Düz ızgara yerine mozaik: her altı kareden biri iki kat büyük geliyor,
düzen monoton durmuyor. Tıklayınca tam ekran, ok tuşlarıyla geziliyor.

**Hediye bölümü.** IBAN artık doğrudan görünmüyor. "Hesabı Göster" butonuna basınca
yumuşak bir animasyonla açılıyor. Davetiyenin ilk izlenimi para istemek olmasın diye.

**Kapanış bölümü.** Sitenin sonunda yeni bir teşekkür bölümü: koyu zemin, süslemeler,
"Mutlu Günümüzde Görüşmek Üzere" ve el yazısıyla isimler. Metni panelden üç dilde
yazabiliyorsun; boş bırakırsan hazır bir metin kullanılıyor. Alttaki footer sadece
ince bir künye çizgisine indi.

---

## Bir not

Referans verdiğin sitenin kodunu veya görsellerini kopyalamadım — o ticari bir tema.
Kullandığı kalıpları (davetiye kapısı, kemer çerçeveler, sabit arka planlar, süslemeler,
gizli hesap, kapanış bölümü, müzik) senin paletinle ve senin kod tabanınla sıfırdan
yazdım. Görünüm ve his aynı yerde, ama dosyalar senin.

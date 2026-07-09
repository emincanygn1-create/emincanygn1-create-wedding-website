# Adım 9 — Kapak Videosu Düzeltmesi + Dilekler Sayfası

## Kurulum

1. `supabase-step9.sql`'i çalıştır.
2. Dosyaları GitHub'a yükle — **reponun kök sayfasından**
   (`.../upload/main`, altında bir klasör adı olmasın).
3. **`components/Wishes.tsx` dosyasını sil.** Yerini `WishesBoard.tsx` ve
   `WishesHighlight.tsx` aldı. Kalırsa zararı yok ama gereksiz duruyor.

Yeni dosyalar: `lib/likes.ts`, `components/WishCard.tsx`, `components/WishesBoard.tsx`,
`components/WishesHighlight.tsx`, `app/[locale]/wishes/page.tsx`.

---

## 1. Kapak videosu neden oynatmıyordu

İki hata birden vardı. İkisi de bende.

**Hareket azaltma videoyu da kapatıyordu.** Geçen adımda CSS'teki aşırılığı düzelttim
ama `BackgroundVideo` bileşeninin içinde aynı kontrol duruyordu: kullanıcı "animasyonları
azalt" demişse video hiç yüklenmiyordu. Kaldırdım. Arka plan videosu sessiz ve döngüsel;
hareket azaltma tercihi bunun için değil. Artık sadece telefonda **veri tasarrufu** açıksa
video indirilmiyor — o kısıt yerinde duruyor, mobil veri yakmak istemeyiz.

**Kapı bir kez açıldıysa video sonsuza kadar bekliyordu.** Kapak bölümündeki video
"Davetiyeyi Aç"a basılmasını bekliyordu. Ama aynı sekmede sayfayı yenilediğinde kapı
artık çıkmıyor (bir kez açıldı sayılıyor), dolayısıyla o sinyal hiç gelmiyordu. Video
öylece bekliyor, sen sadece posteri görüyordun. Şimdi bileşen "kapı zaten açılmış mı"
diye bakıyor, açılmışsa doğrudan oynatıyor.

Bir de videonun yüklenemediği durumda (bozuk dosya, desteklenmeyen kodek) sessizce
poster fotoğrafına düşüyor, siyah ekran kalmıyor.

**Hâlâ oynatmazsa** kodek sorunudur. Tarayıcılar `.mov` içindeki HEVC/H.265 videoyu
oynatmaz. `ffprobe kapak.mp4` çıktısında `h264` yazmalı. Bizim komut zaten `libx264`
kullanıyordu, ama telefondan çıkmış ham dosyayı doğrudan yüklediysen bu başına gelir.

---

## 2. Dilekler artık ayrı sayfa

**`/tr/wishes`** (ve `/en/wishes`, `/it/wishes`) adresinde tam sayfa dilek duvarı:
üstte form, altında ızgara halinde bütün dilekler. Sağ üstte **En yeni / En beğenilen**
sıralama düğmeleri. Dokuzar dokuzar yükleniyor.

**Ana sayfada** artık formun tamamı değil, **en çok beğenilen üç dilek** görünüyor.
Altında iki buton: "Dilek bırak" ve "Tüm dilekleri gör (24 dilek)". Alt sabit menüye de
dilekler için ayrı bir kısayol ekledim.

**Beğeni butonu.** Her dileğin sağ altında kalp ve sayı. Tıklayınca kalp kırmızıya
dönüyor ve sayı artıyor. Aynı kişi aynı dileği iki kez beğenemiyor — beğeniler
tarayıcıda saklanıyor. Sayaç veritabanında `security definer` bir fonksiyonla artıyor,
yani misafir dilek satırını başka şekilde değiştiremiyor; sadece beğeni sayısını
bir artırabiliyor.

Panelde **Dilekler** sayfasında her mesajın yanında beğeni sayısı da görünüyor.

---

## Küçük bir uyarı

Beğeniler tarayıcıda tutulduğu için teknik olarak sıfırlanabilir (gizli sekme, tarayıcı
temizliği). Düğün sitesi için doğru denge bu: misafire hesap açtırmadan makul bir koruma.
Birileri sayıyı şişirmeye kalkarsa panelden görürsün.

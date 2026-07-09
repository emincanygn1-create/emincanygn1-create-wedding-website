# Adım 12 — Kedi Fotoğrafı ve Birleşik Kart

## Kurulum

1. `supabase-step12.sql`'i çalıştır.
2. Altı dosyayı yükle.

---

## Kedi neden oradaydı

Adım 6'da etkinlik kartlarına görsel koyarken kısa yoldan gittim: "galerinin ilk iki
fotoğrafını otomatik kullansın" dedim. Aynı mantıkla geri sayımın arka planına da
galerinin üçüncü fotoğrafını koydum. Yani kartların üstündeki görsel senin seçimin
değildi, galeriye ne yüklersen o oluyordu.

Kaldırdım. Artık panelde üç ayrı alan var:

- **Nikah Kartı Fotoğrafı**
- **Düğün Kartı Fotoğrafı**
- **Geri Sayım Arka Planı**

Üçü de isteğe bağlı. Boş bırakırsan kart fotoğrafsız, sade haliyle çıkıyor; geri sayım
da düz zeminde duruyor. Galeriye ne yüklediğinin artık bu bölümlerle hiçbir ilgisi yok.

---

## İki kart hâlâ görünüyorsa

Sırayla kontrol et:

**1. `supabase-step11.sql` çalıştı mı?** Çalışmadıysa `single_event` sütunu yok demektir.
Bu durumda paneldeki anahtarı işaretleyip Kaydet'e bastığında "Bir hata oluştu" yazısı
çıkar ve hiçbir şey kaydedilmez. (Adım 12'nin SQL'i o sütunu da ekliyor, yani ikisini
birden atladıysan bu adım halleder.)

**2. Anahtar açık mı?** Site İçeriği → en üstte **Etkinlik** kutusu →
"Nikah ve düğün aynı yerde" işaretli olmalı. Sonra Kaydet.

---

## Birleşik kartta bir hatam daha vardı

Kartı yazarken bütün bilgileri **nikah** alanlarından okuyordum. Senin ekran görüntünde
ise nikah alanları boş, dolu olanlar düğün alanları — anahtarı açsan bomboş bir kart
görecektin.

Düzelttim: artık her alan için "hangisi doluysa o" mantığı çalışıyor. Mekân adını sadece
düğün alanına yazdıysan oradan alıyor, sadece nikah alanına yazdıysan oradan. Saatler
yine ikisinden ayrı ayrı okunuyor ve alt alta listeleniyor:

```
La Cerimonia              11:00
Il Ricevimento            15:00
```

Bir saati boş bırakırsan o satır hiç çıkmıyor. Yani şu an sende olduğu gibi tek saat
varsa, kartta tek satır görünür.

Kart fotoğrafı da aynı mantıkla: önce nikah kartı fotoğrafına, o boşsa düğün kartı
fotoğrafına bakıyor.

# Renk — Çözüldü

14 dosyayı yükle. SQL yok, silinecek dosya yok. Bir önceki renk paketini yüklediysen
bunlar onun üstüne yazar; yüklemediysen de sorun yok, hepsi burada.

---

## Asıl sebep

Sıralama zaten çalışıyordu. Sorun rengin kendisiydi.

`bg-olive-100/60` yazmışım. Yani `#E8ECDF` rengini **%60 opaklıkla** krem zeminin
üstüne koyuyordum. Karışım `#EFF0E4` ediyor — kremden (`#FAF6EC`) ayırt edilemeyecek
kadar yakın. Ekranda "açık yeşil bölüm" diye bir şey yoktu, hepsi kremdi.

Opaklığı kaldırdım. Artık tam `#E8ECDF` kullanılıyor.

## Üç değişiklik

**1. Tam renk.** `light` = krem `#FAF6EC`, `muted` = açık zeytin `#E8ECDF`.
Hiçbirinde opaklık yok. `lib/sections.ts` içine bunu neden yapmaman gerektiğini
yorum olarak yazdım.

**2. Sınır çizgisi.** İki açık ton arasında ince bir `border-t` var. Renkler artık
yeterince farklı ama çizgi geçişi keskinleştiriyor. Koyu bölümlerin kenarına
koymuyorum — kontrast zaten yeterli.

**3. Geri sayım kaplaması.** Arka plan fotoğrafının üstündeki soluk katman `bg-cream/85`
sabitiydi; geri sayım açık yeşil bir sıraya düşünce kremleşiyordu. Artık `bg-inherit`,
yani bulunduğu bölümün rengini miras alıyor. Sayacı nereye taşırsan taşı uyum sağlıyor.

## Sistem nasıl çalışıyor

Ana sayfa görünen bölümleri sırayla geziyor:

- Koyu bölüm mü (Alıntı, Anı Duvarı, Kapanış)? Kendi arka planıyla geçer, sayacı bozmaz.
- Değilse sıradaki rengi alır: krem, açık yeşil, krem, açık yeşil...

İçeriği olmayan bölümler (video yüklenmemişse, alıntı boşsa, IBAN girilmemişse) sıraya
hiç girmez — yoksa boş bir renk şeridi bırakıp sırayı kaydırırlardı.

Kartlar beyaz. Krem kart krem zeminde kayboluyordu; beyaz her iki zeminde de duruyor.

## İleride

Yeni bölüm eklersen `lib/sections.ts` içindeki `SECTION_KEYS` listesine anahtarını yaz.
Koyu olacaksa `DARK_SECTIONS` kümesine de ekle. Arka plan rengini bileşenin içine
**yazma** — sistem halleder, sen yazarsan sıralama yine bozulur.

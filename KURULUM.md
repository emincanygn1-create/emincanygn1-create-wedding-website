# Adım 5 — RSVP, Dilekler, Anı Duvarı ve 3 Dil

Bu klasördeki dosyalar mevcut projenin üzerine gelecek. Klasör yapısı bire bir aynı,
yani `components/Rsvp.tsx` dosyası repodaki `components/` klasörünün içine gidecek.

Sırayla üç şey yapacaksın: **veritabanı → dosyalar → tek dosya silme.**

---

## 1) Supabase'de SQL'i çalıştır

1. Supabase panelini aç → sol menüden **SQL Editor**.
2. `supabase-step5.sql` dosyasını aç, **içindeki her şeyi** kopyala.
3. Editöre yapıştır, **Run**'a bas.

Bu script şunları kurar:
- `rsvps`, `wishes`, `guest_photos` tabloları
- `site_content` tablosuna İngilizce/İtalyanca sütunları
- Misafirlerin fotoğraf yükleyeceği `guest-media` alanı (dosya başına en fazla 15 MB, sadece resim)
- Beğeni sayacı fonksiyonu

Script'i yanlışlıkla iki kez çalıştırırsan bir şey bozulmaz.

---

## 2) Dosyaları GitHub'a yükle

GitHub'da repoyu aç → **Add file → Upload files** → bu klasörün içindeki
`app`, `components`, `lib` klasörlerini ve `middleware.ts` ile `supabase-step5.sql`
dosyalarını sürükleyip bırak. GitHub klasör yapısını koruyacak, aynı isimli dosyaların
üzerine yazacak.

Alttaki commit kutusuna bir şeyler yaz (örn. "RSVP, dilekler, anı duvarı, 3 dil") ve
**Commit changes**'e bas.

---

## 3) `app/page.tsx` dosyasını SİL

Bu adım şart. Ana sayfa artık `app/[locale]/page.tsx` içinde yaşıyor.
Eskisi durursa Next.js hangi sayfayı açacağını bilemez.

GitHub'da `app/page.tsx` dosyasını aç → sağ üstteki **⋯** menüsü → **Delete file** →
**Commit changes**.

Vercel bu commit'ten sonra siteyi kendi kendine yeniden yayına alır. Yaklaşık 1-2 dakika.

---

## Neler değişti

**Adres yapısı.** Site artık `/tr`, `/en`, `/it` altında çalışıyor. Ana adrese
(`site.com`) giren kişi otomatik olarak doğru dile yönlenir. Sıra şu:

1. Daha önce elle dil seçtiyse, o dil hatırlanır (çerez).
2. Yoksa bağlandığı ülkeye bakılır: Türkiye → Türkçe, İtalya/İsviçre/San Marino/Vatikan → İtalyanca, diğer her yer → İngilizce.
3. Ülke bilgisi gelmezse tarayıcı diline bakılır.
4. O da tutmazsa Türkçe açılır.

Ülke tespiti Vercel'in sağladığı bilgiden gelir, ek bir ayar veya servis gerekmez.
Sağ üstteki dünya ikonundan her zaman elle değiştirilebilir.

**Yönetim panelinde 3 dil.** Site İçeriği sayfasında artık Türkçe / English / Italiano
sekmeleri var. Türkçe alanları doldurman yeterli; İngilizce veya İtalyanca bir alanı boş
bırakırsan site o alanda otomatik olarak Türkçesini gösterir. Salon adı gibi zaten
çevrilmeyecek şeyleri boş bırakabilirsin.

Düğün tarihi tek bir alan; her dilde doğru biçimde yazılıyor
("12 Haziran 2027" / "12 June 2027" / "12 giugno 2027").

**RSVP.** Ana sayfada katılım formu. Ad, e-posta, telefon, katılıyor/katılmıyor,
kişi sayısı, hangi tarafın davetlisi, not. Cevaplar panelde **Katılımlar** sayfasında;
üstte özet sayılar (kaç cevap, kaç kişi geliyor), altta liste ve **CSV indir** butonu —
dosya Excel'de Türkçe karakterlerle düzgün açılır.

**Dilekler.** Yorum kutusu artık gerçekten çalışıyor. Misafir yazdığı anda mesaj listenin
başında beliriyor. Panelde **Dilekler** sayfasından uygunsuz bir mesajı gizleyebilir veya
silebilirsin. Gizlenen mesaj sitede görünmez.

**Anı Duvarı.** `/tr/moments` (ve `/en/moments`, `/it/moments`) adresinde Instagram tarzı
bir akış. Ana sayfada ona götüren bir bölüm var — son yüklenen 4 fotoğrafın küçük önizlemesi
ve büyük bir buton. Ayrıca sayfayı biraz kaydırınca alta gelen sabit menüde de kısayolu var.

Misafir adını yazıp fotoğraf seçiyor, isterse bir not ekliyor. Yüklenen fotoğraf herkeste
anında görünüyor; sayfa 25 saniyede bir kendini yeniliyor, yani düğün sırasında herkes
birbirinin karesini canlı görüyor. Fotoğrafa tıklayınca büyüyor, ok tuşlarıyla gezilebiliyor,
kalp butonuyla beğenilebiliyor.

Panelde **Misafir Fotoğrafları** sayfasından istemediğin bir kareyi gizleyebilir veya
tamamen (depolamadan da) silebilirsin.

**Geçişler.** Bölümler artık farklı yönlerden açılıyor — çift bölümü iki yandan,
sayaç ve kartlar hafifçe büyüyerek, alıntı bulanıklıktan netleşerek. Kapak fotoğrafı
kaydırdıkça yavaşça yukarı kayıp soluyor. Üstte ince altın rengi bir ilerleme çizgisi,
altta ikonlu sabit menü var. Renk paleti hiç değişmedi: aynı zeytin yeşili, krem ve altın.

---

## Bilmen gereken iki şey

**Fotoğraf yükleme herkese açık.** Adresi bilen herkes Anı Duvarı'na fotoğraf
yükleyebilir — düğün sitesi olduğu için doğrusu bu, misafirlerin şifre girmesini
istemezsin. Dosya başına 15 MB ve sadece resim sınırı var. Yine de siteyi halka açık
paylaşmadan önce panelden ara ara bakmanda fayda var; gizle ve sil butonları orada.

Aynı şey dilekler için de geçerli. Formlarda basit bir bot tuzağı var ama insan
kaynaklı spam'i ancak moderasyonla temizlersin.

**Storage boyutu.** Supabase'in ücretsiz planında 1 GB depolama var. 200 misafir ×
birkaç fotoğraf rahat sığar, ama düğünden sonra fotoğrafları indirip yedeklemeyi unutma.

# Adım 10 — Panel Kontrolleri

## Kurulum

1. `supabase-step10.sql`'i çalıştır.
2. Dosyaları **reponun kök sayfasından** yükle (`.../upload/main`).

Silinecek dosya yok. Yeni dosyalar: `lib/sections.ts`, `lib/i18n/admin.ts`,
`lib/i18n/admin-server.ts`, `components/admin/SectionOrderEditor.tsx`,
`components/admin/AdminLanguageSwitcher.tsx`.

---

## Yaptıklarım

### Sayfa başlığı
Site İçeriği → Çevrilebilir Metinler bölümünde iki yeni alan:
**Tarayıcı Sekmesi Başlığı** ve **Link Paylaşım Açıklaması**. Üç dilde ayrı ayrı.
Boş bırakırsan eskisi gibi isimler ve tarih kullanılır. Sekmede, WhatsApp
önizlemesinde ve Google sonucunda görünen metin bu.

### Panel dili
Sol menünün altında **Panel dili: Türkçe / Italiano** düğmeleri. Tercihin bir yıl
hatırlanıyor. Panelin tamamı çevrildi — menü, gösterge paneli, bütün form etiketleri,
tablo başlıkları, onay soruları.

Dikkat: bu sadece **panelin dili**. Sitenin içeriğini yine üç dilde (TR/EN/IT) ayrı ayrı
yazıyorsun, o kısım değişmedi.

### Davetiye kapısı anahtarı
Site İçeriği'nin üstünde **Davetiye kapısı açık** anahtarı. Şu an **kapalı** —
`supabase-step10.sql` onu kapalı olarak kuruyor, yani yükler yüklemez site doğrudan
açılacak. Düğüne 1-2 ay kala anahtarı açarsın.

Kapı kapalıyken: site doğrudan kapak bölümüyle açılıyor, video hemen oynuyor, müzik
butonu duruyor ama kendiliğinden çalmıyor (tarayıcılar zaten bir tıklama olmadan
müziğe izin vermez). Kapı açıkken: eski davranış geri geliyor — tam ekran kapak,
"Davetiyeyi Aç", perde, kalpler, müzik.

### "Düğün Davetiyesi" yazısı
Artık sabit değil. **Kapakta İsimlerin Üstündeki Yazı** diye bir alan var, üç dilde.
Şu an boş — yani hiçbir şey görünmüyor, istediğin buydu. Sonradan "Düğün Davetiyesi",
"Save the Date" ya da ne istersen yazarsın; boş bıraktığın sürece o satır hiç
render edilmiyor.

### Galeri beğenileri
Galeri fotoğraflarının sağ alt köşesinde küçük bir kalp. Misafir tıklayınca kırmızıya
dönüyor ve sayı artıyor. Aynı kişi aynı fotoğrafı iki kez beğenemiyor. Sayaç,
dileklerdeki gibi `security definer` bir veritabanı fonksiyonuyla artıyor — kimse
fotoğraf kaydını başka şekilde değiştiremiyor.

### Bölüm sırası
Site İçeriği → **Bölüm Sırası ve Görünürlüğü**. On bir bölüm listeleniyor: Gelin & Damat,
Geri Sayım, Etkinlik Detayları, Galeri, Hikaye Videosu, Alıntı, Anı Duvarı Bağlantısı,
Katılım Formu, Dilekler, Hediye, Kapanış.

Her satırda yukarı/aşağı okları ve bir **Gizle/Göster** düğmesi var. Sıra kaydettiğin
anda siteye yansıyor. "Varsayılan sıraya dön" bağlantısı her şeyi eski haline getiriyor.

Kapak her zaman en başta, alt bilgi her zaman en sonda — onlar taşınmıyor.

### Kapanış metinleri
Dört alan da düzenlenebilir oldu, üçü de üç dilde:
**Kapanış — Üst Yazı** ("Teşekkür Ederiz"), **Kapanış — Başlık**
("Katılımınız ve Dualarınız İçin"), **Kapanış — Metin**, **Kapanış — İsimlerin
Üstündeki Yazı** ("Mutlu Günümüzde Görüşmek Üzere").

Boş bıraktığın alanlarda eski hazır metinler kullanılıyor, yani hiçbir şey yazmasan da
bölüm bozulmuyor.

---

## Bir teknik not

Panelin sunucu tarafı dili çerezden okuyor. `next/headers` sadece sunucuda çalıştığı
için `lib/i18n/admin.ts` (sözlük, her yerde kullanılabilir) ve
`lib/i18n/admin-server.ts` (çerez okuma) diye ikiye ayırdım. İkisini de yüklemen
gerekiyor, yoksa build patlar.

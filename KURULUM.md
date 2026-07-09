# Adım 14 — Dayanıklılık Paketi

## Kurulum

1. `supabase-step14.sql`'i çalıştır.
2. Dosyaları reponun kök sayfasından yükle. **`package.json` de dahil** — üç yeni paket var.

Vercel deploy sırasında `qrcode`, `@vercel/analytics` ve `@vercel/speed-insights`
paketlerini kendisi kuracak, senin bir şey yapmana gerek yok.

Yeni dosyalar: `app/error.tsx`, `app/global-error.tsx`, `app/[locale]/error.tsx`,
`app/api/notify/route.ts`, `lib/publicContent.ts`, `lib/supabase/public.ts`,
`components/ErrorScreen.tsx`, `components/admin/QrGenerator.tsx`,
`components/admin/BackupPanel.tsx`, `app/admin/(protected)/qr/page.tsx`,
`app/admin/(protected)/backup/page.tsx`.

**Dikkat: yükleme anahtarı varsayılan olarak KAPALI kuruluyor.** Yani bu SQL'i
çalıştırdığın anda misafirler fotoğraf yükleyemez hale gelir. Bilerek böyle — düğün
sabahı panelden açacaksın.

---

## 1. Hata ekranları

Üç katman:

- **`app/[locale]/error.tsx`** — sayfa çökerse. Ziyaretçinin dilinde, koyu zemin,
  "Tekrar dene" ve "Ana sayfaya dön" butonları.
- **`app/error.tsx`** — dil dışındaki her yerde.
- **`app/global-error.tsx`** — kök layout'un kendisi çökerse. Kendi `<html>` etiketini
  yazmak zorunda olduğu için Tailwind'e güvenmiyor, satır içi stil kullanıyor. Alt
  köşede küçük bir hata kodu (`digest`) gösteriyor — bana yollarsan Vercel loglarında
  bulabilirim.

Artık hiçbir durumda beyaz ekran yok.

---

## 2. Bant genişliği

**Lightbox artık optimize edilmiş görsel çekiyor.** Eskiden büyütme penceresi Supabase'deki
ham dosyayı indiriyordu. 200 misafir × 20 tıklama × 3 MB = 12 GB. Ücretsiz planın aylık
sınırı 5 GB. Düğün gecesi site kotayı yakıp dururdu.

**Anı Duvarı artık sadece yenileri çekiyor.** 25 saniyede bir tüm listeyi indiriyordu.
Şimdi "en son gördüğümden yenisi var mı" diye soruyor. 300 fotoğraf birikince aradaki
fark on kat.

---

## 3. Misafir yükleme anahtarı

Site İçeriği'nde yeni bir kutu: **Misafirler fotoğraf yükleyebilir**. Şu an kapalı.

Kapalıyken Anı Duvarı sayfası açılıyor, mevcut fotoğraflar görünüyor, ama yükleme butonu
yerine kibar bir mesaj çıkıyor. Önemlisi: **veritabanı da yeni fotoğraf kabul etmiyor.**
Arayüzü gizlemek yetmez, konsolu bilen biri yine gönderebilirdi.

Düğün sabahı aç, birkaç gün sonra kapat.

---

## 4. RSVP e-posta bildirimi

Kod hazır ama **senin kurman gereken bir tarafı var.** Adım adım:

**a) Resend hesabı aç** (resend.com, ücretsiz plan ayda 3000 e-posta). Alan adını doğrula
veya test için `onboarding@resend.dev` adresini kullan. Bir API anahtarı üret.

**b) Vercel → Settings → Environment Variables** → dört değişken ekle:

```
NOTIFY_SECRET   = kendi uydurduğun uzun bir dize (örn. 32 rastgele karakter)
RESEND_API_KEY  = re_...
NOTIFY_TO       = senin e-posta adresin
NOTIFY_FROM     = davetiye@alanadin.com  (Resend'de doğrulanmış olmalı)
```

Sonra **Redeploy**. (Env değişkeni redeploy olmadan devreye girmez, hatırlarsın.)

**c) Supabase → Database → Webhooks → Create a new hook**

- Name: `rsvp-notify`
- Table: `rsvps`
- Events: sadece **Insert**
- Type: **HTTP Request** → POST
- URL: `https://alanadin.com/api/notify`
- HTTP Headers: `x-notify-secret` → (b) adımında yazdığın gizli dize

Bir test RSVP'si gönder, e-posta gelmeli.

Bu dört değişkenden biri eksikse uç nokta sessizce hiçbir şey yapmıyor — webhook 200
alıyor, kuyruk tıkanmıyor. Yani kurmasan da site çalışır, sadece bildirim gelmez.

---

## 5. QR kod

Panelde yeni sayfa: **QR Kod**. Hedef sayfayı (Ana sayfa / Anı Duvarı / Dilekler), dili ve
boyutu seç, PNG indir. Zeytin yeşili üstüne krem — siteyle aynı palet.

Masalara koyacağın kartlar için Anı Duvarı'nı seç. Misafir kamerayı tutar, sayfa açılır.

QR kod, üzerinde bulunduğun adresi kullanıyor. Yani **paneli kendi alan adından açtığından
emin ol**, `vercel.app` adresinden açarsan QR o adrese gider.

---

## 6. Yedekleme

Panelde **Yedekleme** sayfası. Kaç kayıt olduğunu gösteriyor, iki buton veriyor:

- **Hepsini JSON olarak indir** — RSVP'ler, dilekler, misafir fotoğraf kayıtları,
  hikaye bölümleri, SSS ve site ayarları tek dosyada.
- **Fotoğraf adreslerini indir (.txt)** — fotoğrafların kendisi Supabase'de duruyor.
  Listeyi indirdikten sonra `wget -i liste.txt` ile hepsini tek seferde çekebilirsin.

Ücretsiz planda otomatik yedek yok. Düğünden sonraki hafta bunu yap.

---

## 7. RSVP: yemek tercihi ve mükerrer uyarısı

Katılıyorum diyen misafire yeni bir alan: **yemek tercihi veya alerji**. Salon soracak,
sonra 150 kişiye tekrar sormaktan iyidir. CSV çıktısına da eklendi.

Aynı isimle daha önce cevap gelmişse form **engellemiyor, uyarıyor**: "Bu isimle daha önce
bir cevap gönderilmiş, yine de göndermek istiyor musun?" Engellemek yanlış olurdu — aynı
isimde iki misafir olabilir. Panelde de mükerrer isimlerin yanında küçük bir rozet çıkıyor.

---

## 8. Analitik

`@vercel/analytics` ve `@vercel/speed-insights` eklendi. Vercel panelinde Analytics
sekmesini açman yeterli. Kaç kişi davetiyeyi açtı, hangi dilde, kaçı RSVP'ye kadar indi
görebileceksin. Çerez kullanmıyor, KVKK/GDPR açısından temiz.

---

## 9. Önbellek

Site içeriği, galeri, hikaye ve SSS artık 30 saniye önbellekte tutuluyor. Düğün gecesi
herkes aynı anda girdiğinde her ziyaret için dört ayrı veritabanı sorgusu atılmıyor.

**Pratik sonucu:** panelde bir değişiklik yaptıktan sonra sitede görünmesi en geç 30 saniye
sürüyor. Yenile, gelmediyse biraz bekle.

Dilekler, misafir fotoğrafları ve RSVP önbelleğe **alınmıyor** — onlar canlı kalmalı.

---

## Koda dokunmayan iki iş

**Supabase uyanık kalsın.** Ücretsiz projeler bir hafta hiç istek almazsa duraklatılıyor
ve site 500 döndürüyor. Düğün 2027'de; site aylarca sessiz kalabilir.
[UptimeRobot](https://uptimerobot.com) ücretsiz hesabı aç, 5 dakikada bir siteni yoklasın.
Bu politikanın hâlâ geçerli olduğunu Supabase panelinden doğrula, planlar değişiyor.

**Alan adını kontrol et.** QR kodları ve davetiye linkleri, paneli hangi adresten açtıysan
onu kullanıyor. Her zaman kendi alan adından gir.

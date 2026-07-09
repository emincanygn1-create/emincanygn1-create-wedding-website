# Adım 13 — Hikayemiz ve Sıkça Sorulan Sorular

## Kurulum

1. `supabase-step13.sql`'i çalıştır. İki yeni tablo kuruyor (`story_posts`, `faqs`),
   mevcut verilerine dokunmuyor.
2. Dosyaları reponun kök sayfasından yükle.

Yeni dosyalar: `components/Faq.tsx`, `components/StoryEntry.tsx`,
`components/StorySection.tsx`, `components/admin/ItemToolbar.tsx`,
`components/admin/StoryManager.tsx`, `components/admin/FaqManager.tsx`,
`app/[locale]/story/page.tsx`, `app/admin/(protected)/story/page.tsx`,
`app/admin/(protected)/faq/page.tsx`.

---

## Hikayemiz

Sol menüde yeni bir sayfa: **Hikayemiz**. "Yeni Bölüm Ekle" dediğin anda boş bir kart
açılıyor. Her kartta:

- **Fotoğraf** — seçtiğin anda yükleniyor, ayrıca kaydetmene gerek yok.
- **Türkçe / English / Italiano** sekmeleri — üç alan da (tarih, başlık, metin) her dilde
  ayrı yazılıyor. İngilizce veya İtalyanca boş bırakırsan site Türkçesini gösteriyor,
  her yerde olduğu gibi.
- **Tarih** yazı olarak, takvim değil: "Bahar 2019", "Bir Salı Akşamı" ne istersen.
- **Metin** uzun olabilir, satır aralarını koruyor.

Kartların sırasını ok tuşlarıyla değiştiriyorsun; sıra anında kaydediliyor. Gizle
düğmesiyle bir bölümü siteden kaldırıp veriyi tutabiliyorsun.

**Sitede nasıl görünüyor:** ana sayfada bir zaman çizgisi — ortada ince bir çizgi, her
durakta altın bir düğüm, fotoğraf bir sağda bir solda. Metinler beş satırda kesiliyor.
İlk üç bölüm gösteriliyor; daha fazlası varsa altta **"Hikayenin tamamını oku"** butonu
çıkıyor ve `/tr/story` sayfasına götürüyor. Orada bütün bölümler, metinler kesilmeden.

Fotoğraflar zaman çizgisinde de hafifçe kayıyor (parallax), sitenin geri kalanıyla aynı
dil.

---

## Sıkça Sorulan Sorular

Sol menüde **Sıkça Sorulan Sorular**. Aynı mantık: ekle, üç dilde yaz, sırala, gizle, sil.
Fotoğraf yok, sadece soru ve cevap.

Sitede bir akordeon: sorular alt alta, tıklayınca cevap yumuşakça açılıyor, sağdaki artı
işareti dönüp çarpıya dönüşüyor. Aynı anda tek soru açık kalıyor. Açık olan kartın
çerçevesi altına dönüyor.

Ne yazacağını bilemezsen misafirlerin en çok sorduğu şeyler şunlar: kıyafet kuralı
(nasıl giyinelim), ulaşım ve park yeri, çocuk getirebilir miyiz, tören kaçta başlıyor
ve ne zaman orada olmalıyız, konaklama önerisi, hediye konusu.

---

## Bölüm sırası

İki yeni bölüm **Site İçeriği → Bölüm Sırası ve Görünürlüğü** listesine kendiliğinden
eklendi. Daha önce sırayı elle ayarladıysan yeni bölümler listenin **sonuna** ekleniyor —
oradan yukarı taşımayı unutma. Doğal yerleri:

- **Hikayemiz** → Gelin & Damat'ın hemen ardında
- **Sıkça Sorulan Sorular** → Dilekler ile Hediye arasında

Hiç dokunmadıysan zaten bu sıraya geliyorlar.

İkisi de başta boş; bir şey eklemezsen sitede "yakında" tarzı kısa bir satır görünür.
Görmek istemiyorsan bölümü gizle.

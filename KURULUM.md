# Renk Sistemi — Bölüm Sırasına Göre

Sadece dosyaları yükle. SQL yok, silinecek dosya yok.

---

## Sorun neydi

Arka plan rengi bölümün içine gömülüydü. `CoupleInfo` her zaman krem, `Gallery` her
zaman açık yeşil, `GiftInfo` her zaman açık yeşil. Bu, bölümlerin benim yazdığım sırada
duracağı varsayımına dayanıyordu — krem, yeşil, krem, yeşil...

Sırayı panelden değiştirince varsayım çöküyor. İki krem bölüm yan yana geliyor, aradaki
sınır kayboluyor ve o bölge tek bir büyük beyazlık gibi duruyor. Bir bölümü gizleyince de
aynı şey.

## Ne yaptım

Rengi bileşenlerden söktüm. Artık **bölüm sıradaki yerinden rengini alıyor.**

Ana sayfa, görünen bölümleri sırayla geziyor ve renkleri dağıtıyor: krem, açık yeşil,
krem, açık yeşil... Sırayı nasıl değiştirirsen değiştir, iki aynı renk asla yan yana
gelmiyor. Bir bölümü gizlersen kalanlar renklerini kendiliğinden yeniden düzenliyor.

**Koyu bölümler sıraya karışmıyor.** Alıntı, Anı Duvarı bağlantısı ve Kapanış kendi
arka plan fotoğrafları ve açık renkli yazılarıyla geliyor; onlar nereye taşınırsa
taşınsın koyu kalıyor. Aradan geçiyorlar, sayacı bozmuyorlar.

Kartlar da düzeltildi. Etkinlik kartı, SSS kutuları, hediye kartı, dilek kartları,
sayaç rakamları — hepsi krem yerine beyaz oldu. Krem kart, krem zeminde görünmüyordu;
beyaz her iki zeminde de duruyor.

## Bir tuzak daha

Video, alıntı ve hediye bölümleri içerik boşsa hiç render edilmiyor (bileşen `null`
dönüyor). Ama sarmalayıcı yine de renkli bir şerit bırakıyor ve **renk sırasından bir
adım yiyordu**. Yani hediye IBAN'ını silsen, aşağıdaki bütün bölümlerin rengi kayardı.

Artık boş bölümler sıraya hiç girmiyor.

## Sonuç

Panelde bölümleri istediğin gibi taşı, gizle, geri aç — renkler kendini toparlıyor.
Zeytin yeşili, krem, altın, kiremit; palet aynı, sadece dağıtımı artık dinamik.

Yeni bir bölüm eklemek istersen `lib/sections.ts` içindeki `SECTION_KEYS` listesine
anahtarını ekle. Koyu olmasını istiyorsan `DARK_SECTIONS` kümesine de yaz, gerisini
sistem halleder.

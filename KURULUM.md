# Adım 7b — Düzeltmeler

Sadece dosyaları GitHub'a yükle. SQL yok, silinecek dosya yok.
`lib/gate.ts` yeni bir dosya, diğerleri mevcutların üzerine yazacak.

---

## 1. Geçişler neden görünmüyordu

İki ayrı hata vardı, ikisi de gerçek.

**Kapak yazıları perdenin arkasında oynayıp bitiyordu.** Animasyonlar "öğe ekranda mı"
diye bakan bir gözlemciyle tetikleniyor. Davetiye kapısı `fixed` bir katman olduğu için
arkasındaki kapak yazıları teknik olarak "ekranda" sayılıyordu — sen kapıyı açana kadar
animasyon çoktan bitmiş oluyordu, açınca duran bir yazı görüyordun.

Artık kapak yazıları kapı açılana kadar bekliyor. "Davetiyeyi Aç"a bastığın anda perde
kalkarken isimler kelime kelime yükseliyor. Kapıyı bir kez açtıysan (aynı sekmede geri
dönersen) bekleme olmuyor.

**Parallax, perde animasyonunu eziyordu.** Fotoğrafların açılış efekti `transform: scale()`
ile çalışıyor. Parallax kodu da aynı elemana `transform` yazıyordu. İkisi aynı özelliğe
yazınca sonuncusu kazanıyor — yani fotoğraf hiç büyüyüp küçülmüyor, sadece belirip
kalıyordu. Bazı durumlarda perde de hiç açılmıyordu.

Artık üç ayrı katman var: perde (kırpma), parallax (kaydırma), görsel (ölçek). Kimse
kimsenin üzerine yazmıyor.

**Bonus:** Sayfa açıldığında ekranda zaten görünen öğeler artık gözlemciyi beklemiyor,
doğrudan başlıyor. Geniş ekranlarda ilk bölümün donuk kalması bundandı.

---

## 2. Çerçeve

Eski çerçevede fotoğraf üstte, hatlar altta duruyordu — kaçınılmaz olarak iç içe
giriyorlardı. Ters kurdum: **fotoğraf artık çerçevenin içinde.**

Dıştan içe: 32 px yarıçaplı, ince altın hatlı bir çerçeve; 12 px iç boşluk; içeride
22 px yarıçaplı fotoğraf. Dört köşede çerçevenin dış kenarına oturan altın işaretler.
Hiçbir çizgi fotoğrafın üzerine binmiyor. Fotoğraf içeride hâlâ hafifçe kayıyor
(parallax), ama çerçeveden taşmıyor.

---

## 3. Video

"Harici bağlantı" kutusunu kaldırdım, panelde sadece dosya yükleme kaldı. 3 MB'lık
dosya zaten sınırların çok altında, sorunsuz yüklenir.

Kapak fotoğrafını yine de yüklü bırak — video hazır olana kadar poster olarak o
görünüyor, ayrıca veri tasarrufu açık olan telefonlarda video hiç indirilmiyor,
fotoğraf gösteriliyor.

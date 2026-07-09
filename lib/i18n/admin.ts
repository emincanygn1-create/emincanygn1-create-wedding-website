export const adminLocales = ["tr", "it"] as const;
export type AdminLocale = (typeof adminLocales)[number];
export const ADMIN_LOCALE_COOKIE = "ADMIN_LOCALE";

export const adminLocaleNames: Record<AdminLocale, string> = {
  tr: "Türkçe",
  it: "Italiano",
};

const tr = {
  nav: {
    title: "Yönetim Paneli",
    overview: "Genel Bakış",
    content: "Site İçeriği",
    gallery: "Galeri",
    invite: "Davetiye Linki",
    rsvps: "Katılımlar",
    wishes: "Dilekler",
    moments: "Misafir Fotoğrafları",
    logout: "Çıkış Yap",
    language: "Panel dili",
  },
  common: {
    save: "Kaydet",
    saving: "Kaydediliyor...",
    saved: "Kaydedildi ✓",
    error: "Bir hata oluştu, tekrar dene.",
    delete: "Sil",
    hide: "Gizle",
    show: "Göster",
    copy: "Kopyala",
    copied: "Kopyalandı ✓",
    confirmDelete: "Bunu kalıcı olarak silmek istediğine emin misin?",
    empty: "Henüz kayıt yok.",
    optional: "isteğe bağlı",
    clear: "Temizle",
  },
  dashboard: {
    welcome: "Hoş geldin 👋",
    intro:
      "Sol menüden site metinlerini (üç dilde), galeriyi, katılım cevaplarını, dilekleri ve misafirlerin yüklediği fotoğrafları yönetebilirsin.",
    responses: "Cevap",
    guests: "Gelecek Kişi",
    wishes: "Dilek",
    guestPhotos: "Misafir Fotoğrafı",
  },
  content: {
    title: "Site İçeriği",
    weddingDate: "Düğün Tarihi ve Saati",
    weddingDateHint:
      "Geri sayımda ve kapak sayfasında kullanılır. Tarih her dilde otomatik olarak doğru biçimde yazılır.",

    gate: "Davetiye Kapısı",
    gateEnabled: "Davetiye kapısı açık",
    gateHint:
      "Açıkken site tam ekran bir kapakla karşılar ve ziyaretçi \"Davetiyeyi Aç\" butonuna basana kadar sayfa kaydırılamaz; müzik de o an başlar. Kapalıyken site doğrudan açılır. Düğüne yaklaşınca açman yeterli.",

    event: "Etkinlik",
    singleEvent: "Nikah ve düğün aynı yerde",
    singleEventHint:
      "Açarsan iki ayrı kart yerine tek kart gösterilir. Mekân, tarih, adres ve harita bağlantısı nikah alanlarından alınır; iki saat de kartın içinde alt alta listelenir. Düğün mekânı alanlarını doldurmana gerek kalmaz.",

    rsvp: "Katılım Formu (RSVP)",
    rsvpEnabled: "Katılım formu açık",
    rsvpEnabledHint:
      "Kapatırsan sitede formun yerine aşağıda yazdığın mesaj görünür ve yeni cevap kabul edilmez.",
    rsvpDeadline: "Son katılım bildirim tarihi",
    rsvpDeadlineHint:
      "Bu tarih geçince form kendiliğinden kapanır. Boş bırakırsan sadece yukarıdaki anahtar geçerli olur.",
    rsvpClosedNote:
      "Formun kapalıyken göstereceği mesajı aşağıdaki Çevrilebilir Metinler bölümünden üç dilde yazabilirsin.",

    sections: "Bölüm Sırası ve Görünürlüğü",
    sectionsHint:
      "Ana sayfadaki bölümlerin sırasını değiştir, istemediklerini gizle. Kapak ve alt bilgi her zaman en başta ve en sonda kalır.",
    moveUp: "Yukarı taşı",
    moveDown: "Aşağı taşı",
    resetOrder: "Varsayılan sıraya dön",

    baseFields: "Dilden Bağımsız Bilgiler",
    translatedFields: "Çevrilebilir Metinler",
    trRequired:
      "Türkçe alanlar zorunludur. İngilizce ve İtalyanca boş bırakılırsa site otomatik olarak Türkçesini gösterir.",
    fallbackNote:
      "Boş bıraktığın alanlarda site otomatik olarak Türkçe metni gösterir.",
    media: "Fotoğraflar, Video ve Müzik",
    fileChosen: "Seçildi",
    fileChosenNote: "kaydedince yüklenecek.",
    fileExists: "Yüklü bir dosya var.",
  },
  fields: {
    bride_name: "Gelin Adı Soyadı",
    groom_name: "Damat Adı Soyadı",
    ceremony_map_url: "Nikah Google Maps Linki",
    reception_map_url: "Düğün Google Maps Linki",
    gift_account_name: "Hediye Hesap Sahibi Adı",
    gift_iban: "IBAN",
    bride_instagram: "Gelin Instagram kullanıcı adı (@ olmadan)",
    groom_instagram: "Damat Instagram kullanıcı adı (@ olmadan)",

    site_title: "Tarayıcı Sekmesi Başlığı",
    site_description: "Link Paylaşım Açıklaması",
    cover_eyebrow: "Kapakta İsimlerin Üstündeki Yazı",
    bride_parents: "Gelin Aile Bilgisi",
    groom_parents: "Damat Aile Bilgisi",
    wedding_city: "Düğün Şehri",
    ceremony_venue: "Nikah Salonu Adı",
    ceremony_date_text: "Nikah Tarihi (yazı olarak)",
    ceremony_time_text: "Nikah Saati",
    ceremony_address: "Nikah Adresi",
    reception_venue: "Düğün Salonu Adı",
    reception_date_text: "Düğün Tarihi (yazı olarak)",
    reception_time_text: "Düğün Saati",
    reception_address: "Düğün Adresi",
    quote_text: "Alıntı / Söz",
    closing_eyebrow: "Kapanış — Üst Yazı",
    closing_title: "Kapanış — Başlık",
    closing_text: "Kapanış — Metin",
    closing_seeyou: "Kapanış — İsimlerin Üstündeki Yazı",
    rsvp_closed_message: "Katılım Formu Kapalıyken Gösterilecek Mesaj",
  },
  hints: {
    site_title:
      "Boş bırakırsan isimler kullanılır. Örnek: Ayşe & Mehmet | Düğünümüz",
    cover_eyebrow:
      "Boş bırakırsan hiç görünmez. Örnek: Düğün Davetiyesi, Save the Date...",
    closing_eyebrow: "Boş bırakırsan hazır metin kullanılır.",
  },
  uploads: {
    cover_photo_url: "Kapak Fotoğrafı",
    cover_photo_hint:
      "Davetiye kapısında ve açılış ekranında tam sayfa görünür. Dikey (portre) fotoğraf en iyi sonucu verir. Link paylaşımında da bu görsel çıkar.",
    cover_video_url: "Kapak Videosu",
    cover_video_hint:
      "Kapak fotoğrafının üzerinde sessiz ve döngüsel oynar. Kapak fotoğrafını da yüklü bırak: video hazır olana kadar o görünür. 20 MB'ı geçmemesi önerilir.",
    bride_photo_url: "Gelin Fotoğrafı",
    groom_photo_url: "Damat Fotoğrafı",
    quote_bg_url: "Alıntı Bölümü Arka Planı",
    quote_bg_hint: "Boş bırakırsan düz zeytin yeşili kullanılır.",
    closing_bg_url: "Kapanış Bölümü Arka Planı",
    closing_bg_hint: "Boş bırakırsan düz zeytin yeşili kullanılır.",
    video_url: "Hikaye Videosu",
    video_hint:
      "Galerinin altındaki bölümde oynat butonuyla izlenir. Kapak videosuyla karıştırma.",
    music_url: "Arka Plan Müziği",
    music_hint:
      "Davetiye kapısı açıkken, misafir kapıyı açtığı anda çalmaya başlar. Sol alttaki butondan susturulabilir. MP3 önerilir.",
  },
  sectionNames: {
    couple: "Gelin & Damat",
    countdown: "Geri Sayım",
    event: "Etkinlik Detayları",
    gallery: "Fotoğraf Galerisi",
    video: "Hikaye Videosu",
    quote: "Alıntı",
    moments: "Anı Duvarı Bağlantısı",
    rsvp: "Katılım Formu",
    wishes: "Dilekler",
    gift: "Hediye",
    closing: "Kapanış",
  },
  gallery: {
    title: "Galeri",
    intro: "Fotoğraf ekle, sırala, sil. Misafirler bu fotoğrafları beğenebilir.",
    likes: "beğeni",
  },
  invite: {
    title: "Davetiye Linki",
    intro:
      "Her misafir için ismine özel bir link üret. Davetiyeyi açtığında kapakta ismi yazar.",
    guestName: "Misafirin adı veya unvanı",
    language: "Dil",
    link: "Bağlantı",
    copyLink: "Bağlantıyı kopyala",
    copyMessage: "Mesajla birlikte kopyala",
    whatsapp: "WhatsApp'ta gönder",
    preview: "Mesaj önizlemesi",
  },
  rsvps: {
    title: "Katılım Cevapları",
    intro:
      "Misafirlerinin gönderdiği katılım bildirimleri. Listeyi Excel'de açmak için CSV olarak indirebilirsin.",
    total: "Toplam Cevap",
    attending: "Katılıyor",
    declined: "Katılmıyor",
    totalGuests: "Toplam Kişi",
    all: "Hepsi",
    yes: "Katılanlar",
    no: "Katılmayanlar",
    downloadCsv: "CSV indir",
    name: "Ad Soyad",
    contact: "İletişim",
    status: "Durum",
    people: "Kişi",
    side: "Taraf",
    note: "Not",
    date: "Tarih",
    empty: "Henüz cevap yok.",
  },
  wishes: {
    title: "Dilekler",
    intro:
      "Uygunsuz bir mesaj gelirse gizleyebilir veya tamamen silebilirsin. Gizlenen mesajlar sitede görünmez.",
    hiddenLabel: "sitede gizli",
    empty: "Henüz dilek yok.",
  },
  moments: {
    title: "Misafir Fotoğrafları",
    intro:
      "Misafirlerin Anı Duvarı sayfasına yüklediği fotoğraflar. İstemediğin bir kareyi gizleyebilir veya silebilirsin.",
    hidden: "Gizli",
    anonymous: "İsimsiz",
    empty: "Misafirler henüz fotoğraf yüklemedi.",
  },
};

export type AdminDict = typeof tr;

const it: AdminDict = {
  nav: {
    title: "Pannello di Amministrazione",
    overview: "Panoramica",
    content: "Contenuti del Sito",
    gallery: "Galleria",
    invite: "Link dell'Invito",
    rsvps: "Conferme",
    wishes: "Auguri",
    moments: "Foto degli Ospiti",
    logout: "Esci",
    language: "Lingua del pannello",
  },
  common: {
    save: "Salva",
    saving: "Salvataggio...",
    saved: "Salvato ✓",
    error: "Si è verificato un errore, riprova.",
    delete: "Elimina",
    hide: "Nascondi",
    show: "Mostra",
    copy: "Copia",
    copied: "Copiato ✓",
    confirmDelete: "Vuoi eliminarlo definitivamente?",
    empty: "Ancora nessun dato.",
    optional: "facoltativo",
    clear: "Cancella",
  },
  dashboard: {
    welcome: "Benvenuto 👋",
    intro:
      "Dal menu a sinistra puoi gestire i testi del sito (in tre lingue), la galleria, le conferme di partecipazione, gli auguri e le foto caricate dagli ospiti.",
    responses: "Risposte",
    guests: "Ospiti Attesi",
    wishes: "Auguri",
    guestPhotos: "Foto degli Ospiti",
  },
  content: {
    title: "Contenuti del Sito",
    weddingDate: "Data e Ora del Matrimonio",
    weddingDateHint:
      "Usata nel conto alla rovescia e nella copertina. La data viene scritta automaticamente nel formato corretto per ogni lingua.",

    gate: "Porta dell'Invito",
    gateEnabled: "Porta dell'invito attiva",
    gateHint:
      "Quando è attiva, il sito accoglie con una copertina a schermo intero e la pagina non scorre finché non si preme \"Apri l'invito\"; in quel momento parte anche la musica. Quando è disattivata, il sito si apre direttamente. Attivala quando il matrimonio si avvicina.",

    event: "Evento",
    singleEvent: "Cerimonia e ricevimento nello stesso luogo",
    singleEventHint:
      "Se lo attivi viene mostrata una sola scheda invece di due. Luogo, data, indirizzo e link alla mappa vengono presi dai campi della cerimonia; i due orari sono elencati uno sotto l'altro nella scheda. Non serve compilare i campi del ricevimento.",

    rsvp: "Modulo di Conferma (RSVP)",
    rsvpEnabled: "Modulo di conferma attivo",
    rsvpEnabledHint:
      "Se lo disattivi, al posto del modulo il sito mostra il messaggio scritto qui sotto e non accetta nuove risposte.",
    rsvpDeadline: "Data limite per confermare",
    rsvpDeadlineHint:
      "Passata questa data il modulo si chiude da solo. Se la lasci vuota vale solo l'interruttore qui sopra.",
    rsvpClosedNote:
      "Il messaggio da mostrare a modulo chiuso si scrive nelle tre lingue nella sezione Testi Traducibili qui sotto.",

    sections: "Ordine e Visibilità delle Sezioni",
    sectionsHint:
      "Cambia l'ordine delle sezioni della home page e nascondi quelle che non vuoi. La copertina e il piè di pagina restano sempre all'inizio e alla fine.",
    moveUp: "Sposta su",
    moveDown: "Sposta giù",
    resetOrder: "Torna all'ordine predefinito",

    baseFields: "Informazioni Indipendenti dalla Lingua",
    translatedFields: "Testi Traducibili",
    trRequired:
      "I campi in turco sono obbligatori. Se lasci vuoti quelli in inglese o italiano, il sito mostrerà automaticamente il testo turco.",
    fallbackNote:
      "Nei campi lasciati vuoti il sito mostrerà automaticamente il testo turco.",
    media: "Foto, Video e Musica",
    fileChosen: "Selezionato",
    fileChosenNote: "verrà caricato al salvataggio.",
    fileExists: "È già presente un file.",
  },
  fields: {
    bride_name: "Nome e Cognome della Sposa",
    groom_name: "Nome e Cognome dello Sposo",
    ceremony_map_url: "Link Google Maps della Cerimonia",
    reception_map_url: "Link Google Maps del Ricevimento",
    gift_account_name: "Intestatario del Conto",
    gift_iban: "IBAN",
    bride_instagram: "Instagram della sposa (senza @)",
    groom_instagram: "Instagram dello sposo (senza @)",

    site_title: "Titolo della Scheda del Browser",
    site_description: "Descrizione per la Condivisione del Link",
    cover_eyebrow: "Scritta Sopra i Nomi in Copertina",
    bride_parents: "Famiglia della Sposa",
    groom_parents: "Famiglia dello Sposo",
    wedding_city: "Città del Matrimonio",
    ceremony_venue: "Nome della Sede della Cerimonia",
    ceremony_date_text: "Data della Cerimonia (in lettere)",
    ceremony_time_text: "Ora della Cerimonia",
    ceremony_address: "Indirizzo della Cerimonia",
    reception_venue: "Nome della Sede del Ricevimento",
    reception_date_text: "Data del Ricevimento (in lettere)",
    reception_time_text: "Ora del Ricevimento",
    reception_address: "Indirizzo del Ricevimento",
    quote_text: "Citazione",
    closing_eyebrow: "Chiusura — Sopratitolo",
    closing_title: "Chiusura — Titolo",
    closing_text: "Chiusura — Testo",
    closing_seeyou: "Chiusura — Scritta Sopra i Nomi",
    rsvp_closed_message: "Messaggio da Mostrare a Modulo Chiuso",
  },
  hints: {
    site_title:
      "Se lo lasci vuoto vengono usati i nomi. Esempio: Ayşe & Mehmet | Il Nostro Matrimonio",
    cover_eyebrow:
      "Se lo lasci vuoto non appare nulla. Esempio: Partecipazione di Nozze, Save the Date...",
    closing_eyebrow: "Se lo lasci vuoto viene usato un testo predefinito.",
  },
  uploads: {
    cover_photo_url: "Foto di Copertina",
    cover_photo_hint:
      "Appare a schermo intero nella porta dell'invito e nella copertina. Una foto verticale rende meglio. È anche l'immagine mostrata quando si condivide il link.",
    cover_video_url: "Video di Copertina",
    cover_video_hint:
      "Scorre muto e in loop sopra la foto di copertina. Lascia caricata anche la foto: viene mostrata finché il video non è pronto. Meglio non superare i 20 MB.",
    bride_photo_url: "Foto della Sposa",
    groom_photo_url: "Foto dello Sposo",
    quote_bg_url: "Sfondo della Sezione Citazione",
    quote_bg_hint: "Se lo lasci vuoto viene usato il verde oliva pieno.",
    closing_bg_url: "Sfondo della Sezione di Chiusura",
    closing_bg_hint: "Se lo lasci vuoto viene usato il verde oliva pieno.",
    video_url: "Video della Storia",
    video_hint:
      "Si guarda con il pulsante di riproduzione sotto la galleria. Da non confondere con il video di copertina.",
    music_url: "Musica di Sottofondo",
    music_hint:
      "Con la porta dell'invito attiva, parte nel momento in cui l'ospite apre l'invito. Si può silenziare dal pulsante in basso a sinistra. Consigliato MP3.",
  },
  sectionNames: {
    couple: "Gli Sposi",
    countdown: "Conto alla Rovescia",
    event: "Dettagli dell'Evento",
    gallery: "Galleria Fotografica",
    video: "Video della Storia",
    quote: "Citazione",
    moments: "Link al Muro dei Ricordi",
    rsvp: "Modulo di Conferma",
    wishes: "Auguri",
    gift: "Regalo",
    closing: "Chiusura",
  },
  gallery: {
    title: "Galleria",
    intro:
      "Aggiungi, riordina ed elimina le foto. Gli ospiti possono mettere \"mi piace\".",
    likes: "mi piace",
  },
  invite: {
    title: "Link dell'Invito",
    intro:
      "Crea un link personalizzato per ogni ospite. Aprendo l'invito, il suo nome appare in copertina.",
    guestName: "Nome o titolo dell'ospite",
    language: "Lingua",
    link: "Link",
    copyLink: "Copia il link",
    copyMessage: "Copia insieme al messaggio",
    whatsapp: "Invia su WhatsApp",
    preview: "Anteprima del messaggio",
  },
  rsvps: {
    title: "Conferme di Partecipazione",
    intro:
      "Le conferme inviate dai vostri ospiti. Puoi scaricare l'elenco in CSV per aprirlo in Excel.",
    total: "Risposte Totali",
    attending: "Partecipa",
    declined: "Non Partecipa",
    totalGuests: "Persone Totali",
    all: "Tutte",
    yes: "Chi partecipa",
    no: "Chi non partecipa",
    downloadCsv: "Scarica CSV",
    name: "Nome e Cognome",
    contact: "Contatti",
    status: "Stato",
    people: "Persone",
    side: "Parte",
    note: "Nota",
    date: "Data",
    empty: "Ancora nessuna risposta.",
  },
  wishes: {
    title: "Auguri",
    intro:
      "Se arriva un messaggio inopportuno puoi nasconderlo o eliminarlo del tutto. I messaggi nascosti non appaiono sul sito.",
    hiddenLabel: "nascosto sul sito",
    empty: "Ancora nessun augurio.",
  },
  moments: {
    title: "Foto degli Ospiti",
    intro:
      "Le foto caricate dagli ospiti nella pagina Muro dei Ricordi. Puoi nascondere o eliminare uno scatto che non desideri.",
    hidden: "Nascosta",
    anonymous: "Anonimo",
    empty: "Gli ospiti non hanno ancora caricato foto.",
  },
};

const adminDictionaries: Record<AdminLocale, AdminDict> = { tr, it };

export function isAdminLocale(value: unknown): value is AdminLocale {
  return typeof value === "string" && (adminLocales as readonly string[]).includes(value);
}

export function getAdminDictionary(locale: AdminLocale): AdminDict {
  return adminDictionaries[locale] ?? adminDictionaries.tr;
}

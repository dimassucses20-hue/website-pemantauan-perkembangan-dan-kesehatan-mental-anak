import { ChildProfile, ArtAnalysisResult, NutritionAnalysisResult } from '../types';

// Helper to create simple colorful kid-style SVG base64 drawings
function createKidSvgDataUri(title: string, moodType: 'happy' | 'storm' | 'family'): string {
  let svgContent = '';
  if (moodType === 'happy') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="500" height="400">
        <rect width="500" height="400" fill="#f0fdf4"/>
        <!-- Sun -->
        <circle cx="80" cy="80" r="45" fill="#facc15" stroke="#eab308" stroke-width="4"/>
        <line x1="80" y1="20" x2="80" y2="5" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
        <line x1="80" y1="140" x2="80" y2="155" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
        <line x1="20" y1="80" x2="5" y2="80" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
        <line x1="140" y1="80" x2="155" y2="80" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
        <line x1="38" y1="38" x2="26" y2="26" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
        <line x1="122" y1="122" x2="134" y2="134" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
        <line x1="122" y1="38" x2="134" y2="26" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
        <line x1="38" y1="122" x2="26" y2="134" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
        
        <!-- Grass -->
        <rect x="0" y="310" width="500" height="90" fill="#86efac"/>
        <path d="M0,310 Q50,290 100,310 T200,310 T300,310 T400,310 T500,310 L500,400 L0,400 Z" fill="#4ade80"/>

        <!-- House -->
        <rect x="240" y="190" width="160" height="130" fill="#fde047" stroke="#ca8a04" stroke-width="4"/>
        <polygon points="220,190 320,100 420,190" fill="#f87171" stroke="#dc2626" stroke-width="4"/>
        <rect x="295" y="240" width="45" height="80" fill="#b45309"/>
        <circle cx="330" cy="285" r="4" fill="#facc15"/>
        <rect x="255" y="210" width="30" height="30" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/>
        <rect x="355" y="210" width="30" height="30" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/>

        <!-- Child / Figure -->
        <circle cx="160" cy="240" r="22" fill="#fed7aa" stroke="#ea580c" stroke-width="3"/>
        <!-- Eyes & Smile -->
        <circle cx="153" cy="236" r="3" fill="#1e293b"/>
        <circle cx="167" cy="236" r="3" fill="#1e293b"/>
        <path d="M152,248 Q160,258 168,248" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
        <!-- Body Dress -->
        <polygon points="160,262 135,320 185,320" fill="#ec4899" stroke="#db2777" stroke-width="3"/>
        <!-- Arms -->
        <line x1="148" y1="275" x2="115" y2="250" stroke="#ea580c" stroke-width="4" stroke-linecap="round"/>
        <line x1="172" y1="275" x2="205" y2="250" stroke="#ea580c" stroke-width="4" stroke-linecap="round"/>
        <!-- Legs -->
        <line x1="150" y1="320" x2="150" y2="350" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
        <line x1="170" y1="320" x2="170" y2="350" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>

        <!-- Flowers -->
        <circle cx="70" cy="340" r="10" fill="#f43f5e"/>
        <circle cx="70" cy="340" r="4" fill="#facc15"/>
        <line x1="70" y1="350" x2="70" y2="375" stroke="#16a34a" stroke-width="3"/>

        <circle cx="430" cy="340" r="10" fill="#a855f7"/>
        <circle cx="430" cy="340" r="4" fill="#facc15"/>
        <line x1="430" y1="350" x2="430" y2="375" stroke="#16a34a" stroke-width="3"/>
      </svg>
    `;
  } else if (moodType === 'storm') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="500" height="400">
        <rect width="500" height="400" fill="#f1f5f9"/>
        <!-- Dark storm cloud -->
        <path d="M120,140 Q150,80 230,90 Q300,70 360,110 Q420,130 400,180 Q390,210 330,210 L150,210 Q90,200 120,140 Z" fill="#475569" stroke="#1e293b" stroke-width="5"/>
        
        <!-- Lightning bolt -->
        <polygon points="260,200 230,270 270,270 240,340 310,250 270,250 290,200" fill="#eab308" stroke="#ca8a04" stroke-width="3"/>

        <!-- Rain strokes -->
        <line x1="140" y1="230" x2="120" y2="290" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
        <line x1="180" y1="240" x2="160" y2="300" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
        <line x1="330" y1="230" x2="310" y2="290" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
        <line x1="370" y1="240" x2="350" y2="300" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>

        <!-- Little small person isolated on bottom right -->
        <circle cx="430" cy="330" r="14" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
        <circle cx="426" cy="328" r="2" fill="#0f172a"/>
        <circle cx="434" cy="328" r="2" fill="#0f172a"/>
        <path d="M426,336 Q430,332 434,336" fill="none" stroke="#334155" stroke-width="2"/>
        <line x1="430" y1="344" x2="430" y2="375" stroke="#334155" stroke-width="3"/>
        <line x1="430" y1="355" x2="415" y2="370" stroke="#334155" stroke-width="2"/>
        <line x1="430" y1="355" x2="445" y2="370" stroke="#334155" stroke-width="2"/>
        <line x1="430" y1="375" x2="420" y2="395" stroke="#334155" stroke-width="3"/>
        <line x1="430" y1="375" x2="440" y2="395" stroke="#334155" stroke-width="3"/>
      </svg>
    `;
  } else {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="500" height="400">
        <rect width="500" height="400" fill="#fdf4ff"/>
        <!-- Rainbow arch -->
        <path d="M50,330 A200,200 0 0,1 450,330" fill="none" stroke="#f43f5e" stroke-width="12"/>
        <path d="M65,330 A185,185 0 0,1 435,330" fill="none" stroke="#fb923c" stroke-width="12"/>
        <path d="M80,330 A170,170 0 0,1 420,330" fill="none" stroke="#facc15" stroke-width="12"/>
        <path d="M95,330 A155,155 0 0,1 405,330" fill="none" stroke="#4ade80" stroke-width="12"/>
        <path d="M110,330 A140,140 0 0,1 390,330" fill="none" stroke="#38bdf8" stroke-width="12"/>
        
        <!-- Ground -->
        <rect x="0" y="320" width="500" height="80" fill="#bbf7d0"/>

        <!-- Family: Dad, Mom, Child holding hands -->
        <!-- Dad -->
        <circle cx="190" cy="220" r="18" fill="#fed7aa" stroke="#ea580c" stroke-width="3"/>
        <line x1="190" y1="238" x2="190" y2="295" stroke="#2563eb" stroke-width="5"/>
        <line x1="190" y1="250" x2="160" y2="275" stroke="#2563eb" stroke-width="4"/>
        <line x1="190" y1="250" x2="225" y2="265" stroke="#2563eb" stroke-width="4"/>
        <line x1="190" y1="295" x2="175" y2="335" stroke="#1e293b" stroke-width="4"/>
        <line x1="190" y1="295" x2="205" y2="335" stroke="#1e293b" stroke-width="4"/>

        <!-- Child (Center) -->
        <circle cx="250" cy="250" r="15" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
        <!-- Smile -->
        <path d="M245,255 Q250,260 255,255" fill="none" stroke="#dc2626" stroke-width="2"/>
        <polygon points="250,265 235,305 265,305" fill="#ec4899"/>
        <line x1="242" y1="275" x2="225" y2="265" stroke="#ea580c" stroke-width="3"/>
        <line x1="258" y1="275" x2="275" y2="265" stroke="#ea580c" stroke-width="3"/>
        <line x1="244" y1="305" x2="244" y2="330" stroke="#1e293b" stroke-width="3"/>
        <line x1="256" y1="305" x2="256" y2="330" stroke="#1e293b" stroke-width="3"/>

        <!-- Mom -->
        <circle cx="310" cy="225" r="18" fill="#fed7aa" stroke="#ea580c" stroke-width="3"/>
        <polygon points="310,243 285,305 335,305" fill="#a855f7"/>
        <line x1="298" y1="255" x2="275" y2="265" stroke="#a855f7" stroke-width="4"/>
        <line x1="322" y1="255" x2="345" y2="275" stroke="#a855f7" stroke-width="4"/>
        <line x1="300" y1="305" x2="300" y2="335" stroke="#1e293b" stroke-width="4"/>
        <line x1="320" y1="305" x2="320" y2="335" stroke="#1e293b" stroke-width="4"/>

        <!-- Red heart in sky -->
        <path d="M250,150 C250,135 230,120 215,135 C200,150 200,165 250,200 C300,165 300,150 285,135 C270,120 250,135 250,150 Z" fill="#ef4444" opacity="0.85"/>
      </svg>
    `;
  }

  // Base64 encode
  const base64 = btoa(unescape(encodeURIComponent(svgContent.trim())));
  return `data:image/svg+xml;base64,${base64}`;
}

export const SAMPLE_CHILDREN: ChildProfile[] = [
  {
    id: 'child-1',
    name: 'Naura Azzahra',
    gender: 'female',
    ageYears: 4,
    ageMonths: 2,
    heightCm: 101.5,
    weightKg: 15.8,
    avatarColor: 'bg-rose-500',
  },
  {
    id: 'child-2',
    name: 'Kenzo Alvaro',
    gender: 'male',
    ageYears: 3,
    ageMonths: 6, // 42 months
    heightCm: 90.2, // Below -2SD (~96cm is median for 42mo) -> Stunted
    weightKg: 11.4, // Below -2SD (~14.8kg is median) -> Underweight
    avatarColor: 'bg-amber-500',
  },
  {
    id: 'child-3',
    name: 'Raffi Pratama',
    gender: 'male',
    ageYears: 5,
    ageMonths: 4,
    heightCm: 111.0,
    weightKg: 18.5,
    avatarColor: 'bg-emerald-500',
  },
];

export const SAMPLE_DRAWINGS = [
  {
    id: 'draw-1',
    title: 'Rumah Bahagia & Bunga Matahari',
    childName: 'Naura Azzahra',
    moodType: 'happy' as const,
    dataUri: createKidSvgDataUri('Rumah Bahagia', 'happy'),
    description: 'Warna cerah ceria, figur tersenyum, matahari kuning benderang',
    defaultStory: 'Ini Naura lagi main di kebun dekat rumah baru, bunganya wangi sekali dan mataharinya tersenyum!',
  },
  {
    id: 'draw-2',
    title: 'Awan Gelap & Petir (Kecemasan)',
    childName: 'Kenzo Alvaro',
    moodType: 'storm' as const,
    dataUri: createKidSvgDataUri('Awan Gelap', 'storm'),
    description: 'Dominasi abu-abu, petir tajam, figur terisolasi di sudut',
    defaultStory: 'Kemarin ada petir keras sekali pas mau tidur, Kenzo takut suara gluduk-gluduk di luar kamar.',
  },
  {
    id: 'draw-3',
    title: 'Keluarga di Bawah Pelangi Cinta',
    childName: 'Raffi Pratama',
    moodType: 'family' as const,
    dataUri: createKidSvgDataUri('Keluarga Pelangi', 'family'),
    description: 'Pelangi ceria, berpegangan tangan erat, simbol hati di atas',
    defaultStory: 'Ini Ayah, Raffi, dan Ibu lagi jalan-jalan di taman abis hujan, ada pelangi besar!',
  },
];

export const INITIAL_EMOTION_HISTORY: ArtAnalysisResult[] = [
  {
    id: 'hist-1',
    date: '2026-08-10',
    childId: 'child-2',
    summaryTitle: 'Adaptasi Lingkungan Baru & Rasa Ragu',
    overallEmotionSummary: 'Karya menunjukkan rasa ragu pada minggu-minggu pertama transisi sekolah/PAUD. Goresan halus dengan warna agak monoton menandakan anak sedang mengamati lingkungan sebelum merasa sepenuhnya nyaman.',
    developmentalStage: 'Preschematic Stage (Bentuk Geometris Awal)',
    dominantMood: 'Sensitif & Hati-hati',
    emotionalScores: {
      joyScore: 62,
      confidenceScore: 54,
      calmnessScore: 68,
      creativityScore: 75,
      affectionNeedScore: 82,
    },
    artAnalysis: {
      colorPsychology: 'Penggunaan warna netral dan pastel mendominasi, menunjukkan ketenangan namun masih menahan ekspresi emosional yang meluap-luap.',
      strokeAndPressure: 'Goresan garis tipis dengan tekanan ringan, mencerminkan sifat sensitif dan kehati-hatian dalam bertindak.',
      spatialComposition: 'Objek terkonsentrasi di bagian bawah kertas, menandakan kebutuhan akan pijakan rasa aman yang kokoh.',
      symbolism: 'Pagar kecil dan tanaman mengisyaratkan perlunya batas perlindungan diri saat berinteraksi.',
    },
    recommendations: {
      parentValidationPhrase: 'Bunda suka sekali cara Kenzo menggambar pagar yang rapi ini. Rumahnya terasa aman ya sayang?',
      conversationStarters: [
        'Apa yang paling Kenzo sukai saat berada di dalam rumah ini?',
        'Siapa yang ingin Kenzo ajak main di sini?',
        'Kalau pagarnya dibuka, kita mau jalan-jalan ke mana?',
      ],
      bondingActivities: [
        {
          title: 'Membaca Buku Cerita Tentang Sekolah Hewan',
          description: 'Membaca kisah hewan kecil yang awalnya malu lalu menemukan sahabat baru untuk memvalidasi perasaan anak.',
        },
        {
          title: 'Bermain Playdough Tekstur Hangat',
          description: 'Meremas playdough membantu merilekskan otot tangan dan menurunkan hormon stres kortisol.',
        },
      ],
      emotionalRedFlags: 'Tidak ditemukan red flag patologis. Ini respon wajar adaptasi lingkungan baru.',
      isRedFlagPresent: false,
    },
    artImagePreview: createKidSvgDataUri('Rumah Adaptasi', 'happy'),
    activityNotes: 'Digambar sepulang hari pertama sekolah PAUD',
  },
  {
    id: 'hist-2',
    date: '2026-09-02',
    childId: 'child-2',
    summaryTitle: 'Ekspresi Ketakutan Suara Petir & Butuh Pelukan',
    overallEmotionSummary: 'Gambar menunjukkan pelepasan emosi takut yang sehat melalui media seni. Kehadiran awan gelap dan kilat adalah cara anak memproses pengalaman sensorik suara keras malam sebelumnya.',
    developmentalStage: 'Preschematic Stage',
    dominantMood: 'Cemas Ringan',
    emotionalScores: {
      joyScore: 48,
      confidenceScore: 45,
      calmnessScore: 42,
      creativityScore: 80,
      affectionNeedScore: 94,
    },
    artAnalysis: {
      colorPsychology: 'Warna abu-abu arang dan hitam mendominasi langit, mengekspresikan intensitas emosi cemas anak.',
      strokeAndPressure: 'Garis zigzag tajam dan goresan tebal menggambarkan denyut kaget dan energi yang terpendam.',
      spatialComposition: 'Awan menutupi sebagian besar atas kertas, sementara figur anak tampak kecil di bagian tepi.',
      symbolism: 'Petir kuning adalah fokus perhatian anak yang sedang mencari penjelasan dari orang dewasa.',
    },
    recommendations: {
      parentValidationPhrase: 'Wajar sekali merasa kaget mendengar suara petir semalam. Terima kasih sudah menceritakannya lewat gambar ini ya, Ayah dan Bunda selalu ada melindungi Kenzo.',
      conversationStarters: [
        'Waktu dengar bunyi gluduknya, bagian tubuh mana yang terasa kaget?',
        'Kalau kita beri payung ajaib untuk orang kecil di gambar ini, warnanya apa ya?',
        'Pelukan hangat seperti apa yang bikin Kenzo merasa paling nyaman?',
      ],
      bondingActivities: [
        {
          title: 'Membuat Tenda Selimut Ajaib (Safe Fort)',
          description: 'Membangun tenda kecil di ruang tamu dengan lampu tidur temaram sebagai ruang aman relaksasi anak.',
        },
      ],
      emotionalRedFlags: 'Goresan ketakutan yang wajar setelah kejadian pemicu spesifik (suara petir keras). Perlu diperhatikan jika kecemasan bertahan lebih dari 4 minggu.',
      isRedFlagPresent: false,
    },
    artImagePreview: createKidSvgDataUri('Awan Petir', 'storm'),
    activityNotes: 'Pagi hari setelah malam hujan badai lebat',
  },
  {
    id: 'hist-3',
    date: '2026-09-24',
    childId: 'child-2',
    summaryTitle: 'Peningkatan Rasa Percaya Diri & Ceria',
    overallEmotionSummary: 'Terjadi pemulihan afektif yang sangat menggembirakan. Warna kuning dan merah muda kembali muncul dengan goresan yang lebih luwes dan garis melengkung yang menandakan rasa riang dan keterbukaan.',
    developmentalStage: 'Preschematic Stage Menuju Schematic',
    dominantMood: 'Ceria & Percaya Diri',
    emotionalScores: {
      joyScore: 84,
      confidenceScore: 78,
      calmnessScore: 80,
      creativityScore: 88,
      affectionNeedScore: 65,
    },
    artAnalysis: {
      colorPsychology: 'Kombinasi warna kuning matahari, hijau rumput, dan merah jambu memancarkan vitalitas dan keceriaan.',
      strokeAndPressure: 'Tekanan stabil, goresan berirama dan penuh rasa ingin tahu.',
      spatialComposition: 'Objek kini menempati bagian tengah kertas secara proporsional, tanda egosentrisme perkembangan yang sehat.',
      symbolism: 'Sosok tersenyum dan bunga-bunga bermekaran menandakan rasa diterima dan dicintai.',
    },
    recommendations: {
      parentValidationPhrase: 'Wah, lihat warna-warnanya bersinar sekali! Kenzo terlihat begitu gembira saat mewarnai ini.',
      conversationStarters: [
        'Apa yang membuat hari ini terasa menyenangkan untuk Kenzo?',
        'Siapa saja teman yang diajak main lari-lari tadi?',
      ],
      bondingActivities: [
        {
          title: 'Pameran Karya Seni Kulkas Mini',
          description: 'Menempelkan gambar anak di kulkas keluarga sebagai bentuk pengakuan atas ekspresi dirinya.',
        },
      ],
      emotionalRedFlags: 'Sangat sehat dan berkembang dengan baik.',
      isRedFlagPresent: false,
    },
    artImagePreview: createKidSvgDataUri('Taman Bahagia', 'happy'),
    activityNotes: 'Digambar sepulang bermain di taman bersama sepupu',
  },
];

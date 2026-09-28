import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser with 25mb limit for handling drawing canvas and photo uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Helper to get GoogleGenAI client
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Extract base64 payload & mimeType
function parseBase64Image(dataUri: string): { mimeType: string; data: string } {
  const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return {
      mimeType: matches[1],
      data: matches[2],
    };
  }
  return {
    mimeType: 'image/png',
    data: dataUri.replace(/^data:image\/[a-z]+;base64,/, ''),
  };
}

// -------------------------------------------------------------
// API 1: Analyze Child Art & Expression
// -------------------------------------------------------------
app.post('/api/analyze-child-art', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, expressionPhotoBase64, childInfo } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Image base64 data gambar anak diperlukan.' });
      return;
    }

    const ai = getAIClient();

    const parts: any[] = [];

    // Add child's artwork
    const artImage = parseBase64Image(imageBase64);
    parts.push({
      inlineData: {
        mimeType: artImage.mimeType,
        data: artImage.data,
      },
    });

    // If child facial expression photo is provided, add as second image part
    if (expressionPhotoBase64) {
      const faceImage = parseBase64Image(expressionPhotoBase64);
      parts.push({
        inlineData: {
          mimeType: faceImage.mimeType,
          data: faceImage.data,
        },
      });
    }

    const childAgeText = childInfo?.ageYears
      ? `${childInfo.ageYears} tahun ${childInfo.ageMonths || 0} bulan`
      : 'Sekitar 4-6 tahun';

    const promptText = `
Anda adalah seorang Pakar Psikologi Perkembangan Anak & Spesialis Terapi Seni Anak (Child Art Therapy Specialist) berstandar internasional dan ramah budaya Indonesia.

Tugas Anda:
Analisis karya seni (gambar/lukisan/coretan) anak berikut ini${expressionPhotoBase64 ? ' dan foto ekspresi wajah anak yang disertakan' : ''}.

Informasi Anak:
- Nama: ${childInfo?.name || 'Anak'}
- Usia: ${childAgeText}
- Jenis Kelamin: ${childInfo?.gender || 'Tidak disebutkan'}
- Konteks/Cerita Anak saat menggambar: ${childInfo?.activityContext || 'Tidak ada catatan tambahan'}

Instruksi Analisis Mendalam:
1. Psikologi Seni Anak:
   - Warna: dominasi warna, makna emosional (hangat, dingin, monokrom, kontras).
   - Goresan & Tekanan: garis tegas, ragu, tekanan kuat (tegang/agresif), lembut (tenang/sensitif), atau ritmis.
   - Spasial & Komposisi: posisi objek di kertas (tengah = egosentris sehat, sudut kecil = rasa malu/insecure, menyebar bebas = imajinasi eksploratif).
   - Objek & Simbolisme: figur keluarga, matahari, pohon, rumah, hewan, awan, dll.
2. ${expressionPhotoBase64 ? 'Analisis Ekspresi Wajah Anak: Evaluasi mimik wajah, binar mata, senyuman/ketegangan, dan keselarasan (congruence) dengan gambar.' : 'Evaluasi Ekspresi Emosional yang terpancar dari karya seni.'}
3. Tahap Perkembangan Seni (misal: Scribble Stage / Preschematic / Schematic / Gang Stage) sesuai usia anak.
4. Skor Emosional (0 - 100):
   - joyScore (Keceriaan & Kepuasan Diri)
   - confidenceScore (Keberanian & Rasa Percaya Diri)
   - calmnessScore (Ketenangan & Kestabilan Emosi)
   - creativityScore (Daya Imajinasi & Eksplorasi)
   - affectionNeedScore (Kebutuhan Perhatian, Pelukan & Validasi)
5. Rekomendasi Terapi & Pengasuhan:
   - Apresiasi positif untuk orang tua (kalimat tepat yang harus dikatakan ke anak agar mereka merasa didengar).
   - 3 Pertanyaan pemicu percakapan hangat (Conversation starters) agar anak mau bercerita lebih banyak.
   - 3 Aktivitas stimulasi emosional terarah untuk 1-2 minggu ke depan.
   - Tanda waspada / Red Flags emosional (jika gambar normal dan sehat, jelaskan bahwa tidak ada tanda kekhawatiran).

Kembalikan respon HANYA dalam format JSON valid tanpa tanda markdown tambahan (tanpa \`\`\`json ... \`\`\`), mengikuti struktur skema berikut:
{
  "summaryTitle": "string ringkas dan hangat",
  "overallEmotionSummary": "paragraf penjelasan emosi keseluruhan anak",
  "developmentalStage": "nama tahap perkembangan seni dan kesesuaiannya dengan usia",
  "dominantMood": "Bahagia | Ceria | Cemas Ringan | Tenang | Penuh Imajinasi | Butuh Perhatian | Sensitif",
  "emotionalScores": {
    "joyScore": number (0-100),
    "confidenceScore": number (0-100),
    "calmnessScore": number (0-100),
    "creativityScore": number (0-100),
    "affectionNeedScore": number (0-100)
  },
  "artAnalysis": {
    "colorPsychology": "penjelasan warna yang digunakan",
    "strokeAndPressure": "analisis garis dan tekanan kuas/krayon",
    "spatialComposition": "analisis penempatan ruang dan proporsi",
    "symbolism": "makna objek-objek penting dalam gambar"
  },
  "facialExpression": {
    "detectedExpression": "penjelasan mimik wajah atau ekspresi seni anak",
    "congruence": "keselarasan antara ekspresi wajah dan isi lukisan"
  },
  "recommendations": {
    "parentValidationPhrase": "kalimat afirmasi yang dianjurkan diucapkan orang tua kepada anak",
    "conversationStarters": ["pertanyaan 1", "pertanyaan 2", "pertanyaan 3"],
    "bondingActivities": [
      {
        "title": "nama aktivitas",
        "description": "cara melakukan bersama anak dan manfaat emosionalnya"
      }
    ],
    "emotionalRedFlags": "penjelasan apakah ada indikasi stres/tekanan atau gambar berkembang sehat",
    "isRedFlagPresent": boolean
  }
}
`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction:
          'Anda adalah asisten AI psikologi seni dan perkembangan emosional anak. Selalu berikan tanggapan yang empati, ilmiah, mengedukasi orang tua, dan format jawaban wajib JSON murni.',
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(outputText);
    } catch {
      // Fallback clean if wrapped in codeblocks
      const cleaned = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    res.json(parsedResult);
  } catch (error: any) {
    console.error('Error analyzing child art:', error);
    res.status(500).json({
      error: error.message || 'Gagal menganalisis gambar anak. Silakan coba kembali.',
    });
  }
});

// -------------------------------------------------------------
// API 2: Periodic Emotional Growth Insight
// -------------------------------------------------------------
app.post('/api/periodic-emotional-insight', async (req: Request, res: Response): Promise<void> => {
  try {
    const { childName, historyEntries } = req.body;

    if (!historyEntries || !Array.isArray(historyEntries) || historyEntries.length === 0) {
      res.status(400).json({ error: 'Riwayat analisis berkala diperlukan.' });
      return;
    }

    const ai = getAIClient();

    const historySummary = historyEntries.map((entry: any, index: number) => ({
      sessionIndex: index + 1,
      date: entry.date,
      title: entry.title,
      dominantMood: entry.dominantMood,
      scores: entry.emotionalScores,
      notes: entry.notes || '',
    }));

    const promptText = `
Anda adalah Konsultan Psikologi Tumbuh Kembang Anak.
Analisis data rekam jejak emosional berkala dari karya seni anak bernama ${childName || 'Anak'}.

Data Riwayat Analisis (${historyEntries.length} sesi):
${JSON.stringify(historySummary, null, 2)}

Instruksi:
1. Evaluasi tren perkembangan emosi (apakah terjadi peningkatan kestabilan, keceriaan, atau adaptasi rasa percaya diri).
2. Temukan pola atau pemicu fluktuasi suasana hati yang terlihat dari karya seni.
3. Berikan rekomendasi pengasuhan jangka menengah untuk orang tua dan guru dalam mendukung tahap emosi berikutnya.
4. Buat rangkuman capaian afektif (Milestone Emosional) yang berhasil diraih anak.

Format jawaban HANYA JSON murni dengan struktur:
{
  "periodSummary": "ringkasan perkembangan emosional selama periode ini",
  "trendClassification": "Meningkat Positif | Stabil Sehat | Berfluktuasi Dinamis | Membutuhkan Pendampingan Ekstra",
  "keyMilestonesAchieved": ["capaian 1", "capaian 2", "capaian 3"],
  "emotionalStrengths": ["kekuatan 1", "kekuatan 2"],
  "supportFocusAreas": ["area fokus 1", "area fokus 2"],
  "nextMonthActionPlan": [
    {
      "week": "Minggu 1-2",
      "focus": "fokus stimulasi",
      "parentingStrategy": "langkah konkret orang tua"
    },
    {
      "week": "Minggu 3-4",
      "focus": "fokus stimulasi",
      "parentingStrategy": "langkah konkret orang tua"
    }
  ],
  "encouragementMessage": "pesan apresiasi hangat untuk orang tua"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(outputText);
    } catch {
      const cleaned = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    res.json(parsedResult);
  } catch (error: any) {
    console.error('Error in periodic emotional insight:', error);
    res.status(500).json({
      error: error.message || 'Gagal memproses insight emosional berkala.',
    });
  }
});

// -------------------------------------------------------------
// API 3: Child Growth & Pediatric Nutrition Recommendation
// -------------------------------------------------------------
app.post('/api/analyze-nutrition-growth', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      childName,
      gender,
      ageMonths,
      heightCm,
      weightKg,
      currentDietNotes,
      pickyEaterTendency,
    } = req.body;

    if (!heightCm || !weightKg || !ageMonths) {
      res.status(400).json({ error: 'Tinggi badan, berat badan, dan usia bulan wajib diisi.' });
      return;
    }

    const ai = getAIClient();

    const promptText = `
Anda adalah Dokter Spesialis Anak Konsultan Nutrisi & Penyakit Metabolik serta Ahli Gizi Pediatrik (Pediatric Clinical Nutritionist) dengan keahlian Standar Antropometri Kemenkes RI & WHO Child Growth Standards.

Data Pasien Anak:
- Nama: ${childName || 'Anak'}
- Jenis Kelamin: ${gender === 'female' ? 'Perempuan' : 'Laki-laki'}
- Usia: ${ageMonths} bulan (${(ageMonths / 12).toFixed(1)} tahun)
- Tinggi / Panjang Badan: ${heightCm} cm
- Berat Badan: ${weightKg} kg
- Kebiasaan Makan & Keluhan: ${currentDietNotes || 'Makan biasa, belum ada catatan khusus'}
- Kondisi Pilih-pilih Makan (Picky Eater / GTM): ${pickyEaterTendency ? 'Ya, sering pilih-pilih makanan / GTM' : 'Tidak terlalu pemilih'}

Tugas Anda:
1. Evaluasi status antropometri berdasarkan acuan WHO & Kemenkes RI:
   - TB/U (Tinggi Badan menurut Umur): Identifikasi apakah Normal, Pendek (Stunted), Sangat Pendek (Severely Stunted), atau Tinggi.
   - BB/U (Berat Badan menurut Umur): Identifikasi apakah Berat Badan Normal, Kurang (Underweight), Sangat Kurang (Severely Underweight), atau Berisiko Berat Badan Lebih.
   - BB/TB atau IMT/U: Identifikasi Gizi Baik, Gizi Kurang (Wasted), Gizi Buruk (Severely Wasted), atau Berisiko Gizi Lebih / Obesitas.
2. Jika ada deviasi (Tinggi atau Berat tidak sesuai kurva normal pada umumnya):
   - Jelaskan penyebab potensial dan target kejar tumbuh (catch-up growth).
   - Berikan rekomendasi gizi terpersonalisasi yang fokus pada PROTEIN HEWANI bermutu tinggi (pencegah stunting: telur, ikan laut lokal seperti kembung/tongkol, hati ayam/sapi, daging ayam, susu) serta zat besi untuk cegah anemia defisiensi besi yang menghambat kognitif.
3. Susun jadwal makan harian (Isi Piringku) ramah anak, lezat, murah didapat di Indonesia, dan mudah diolah ibu/keluarga.
4. Tips praktis mengatasi Gerakan Tutup Mulut (GTM) dan picky eater.
5. Kaitan Gizi & Emosi (Gut-Brain Connection): jelaskan bagaimana nutrisi seimbang mendukung regulasi mood dan ekspresi kreatif anak.

Format jawaban HANYA JSON murni dengan format skema berikut:
{
  "childName": "${childName || 'Anak'}",
  "anthropometryEvaluation": {
    "heightStatus": "Normal | Pendek (Stunted) | Sangat Pendek (Severely Stunted) | Tinggi",
    "weightStatus": "Normal | Kurang (Underweight) | Sangat Kurang | Berisiko Lebih",
    "wastingStatus": "Gizi Baik | Gizi Kurang (Wasting) | Gizi Buruk | Berisiko Gizi Lebih",
    "overallStatusHeadline": "Ringkasan status pertumbuhan ramah orang tua",
    "statusExplanation": "Penjelasan detail yang mendidik tanpa memicu kepanikan",
    "isGrowthFaltering": boolean
  },
  "nutritionTargets": {
    "estimatedDailyCalories": "contoh: 1250 - 1350 kkal/hari",
    "proteinGoalGrams": "contoh: 25 - 30 gram protein hewani/hari",
    "waterRequirement": "contoh: 1100 - 1300 ml/hari",
    "keyNutrients": [
      {
        "name": "nama zat gizi (misal: Zat Besi Heme, Zinc, Vitamin D3, Omega-3 DHA, Kalsium)",
        "role": "manfaat spesifik untuk tumbuh kembang anak ini",
        "bestFoods": ["makanan 1", "makanan 2", "makanan 3"]
      }
    ]
  },
  "recommendedMealPlan": {
    "breakfast": {
      "menu": "nama menu sarapan bergizi",
      "ingredients": "bahan utama dan tips penyajian",
      "nutritionHighlight": "keunggulan gizinya"
    },
    "morningSnack": {
      "menu": "camilan pagi padat kalori dan nutrisi",
      "ingredients": "bahan utama"
    },
    "lunch": {
      "menu": "menu makan siang porsi Isi Piringku",
      "ingredients": "bahan utama dan tips penyajian",
      "nutritionHighlight": "keunggulan gizinya"
    },
    "afternoonSnack": {
      "menu": "camilan sore bernutrisi",
      "ingredients": "bahan utama"
    },
    "dinner": {
      "menu": "menu makan malam hangat & mudah dicerna",
      "ingredients": "bahan utama dan tips penyajian",
      "nutritionHighlight": "keunggulan gizinya"
    }
  },
  "catchUpStrategies": [
    "strategi kejar tumbuh 1",
    "strategi kejar tumbuh 2",
    "strategi kejar tumbuh 3"
  ],
  "pickyEaterSolutions": [
    "solusi GTM 1",
    "solusi GTM 2",
    "solusi GTM 3"
  ],
  "gutBrainConnection": "penjelasan singkat bagaimana gizi ini juga membantu fokus, ketenangan, dan ekspresi emosi anak saat berkarya",
  "pediatricReferralIndicators": [
    "indikasi 1 kapan perlu cek langsung ke dokter anak / faskes",
    "indikasi 2"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(outputText);
    } catch {
      const cleaned = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    res.json(parsedResult);
  } catch (error: any) {
    console.error('Error analyzing nutrition and growth:', error);
    res.status(500).json({
      error: error.message || 'Gagal memproses evaluasi nutrisi dan pertumbuhan anak.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server KiddiePulse AI berjalan di http://localhost:${PORT}`);
  });
}

startServer();

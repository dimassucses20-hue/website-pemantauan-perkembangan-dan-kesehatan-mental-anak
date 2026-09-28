import React, { useState } from 'react';
import { X, BookOpen, Palette, Utensils, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface ParentGuideModalProps {
  onClose: () => void;
}

export const ParentGuideModal: React.FC<ParentGuideModalProps> = ({ onClose }) => {
  const [activeTopic, setActiveTopic] = useState<'art' | 'nutrition' | 'gut-brain'>('art');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Panduan Edukasi: Psikologi Seni & Nutrisi Tumbuh Kembang Anak
              </h3>
              <p className="text-xs text-slate-500">
                Wawasan berbasis sains untuk orang tua, guru, dan pemerhati anak
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topic Selector Tabs */}
        <div className="px-6 pt-4 border-b border-slate-100 flex space-x-2">
          <button
            onClick={() => setActiveTopic('art')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTopic === 'art'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Tahap Menggambar & Terapi Seni</span>
          </button>

          <button
            onClick={() => setActiveTopic('nutrition')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTopic === 'nutrition'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Pencegahan Stunting & Protein Hewani</span>
          </button>

          <button
            onClick={() => setActiveTopic('gut-brain')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTopic === 'gut-brain'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Koneksi Gizi & Emosi (Gut-Brain)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {activeTopic === 'art' && (
            <div className="space-y-4">
              <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100">
                <h4 className="font-bold text-rose-950 mb-1">
                  Prinsip Utama: Seni adalah Jendela Dunia Batin Anak
                </h4>
                <p className="text-rose-900 text-xs leading-relaxed">
                  Anak usia dini seringkali belum memiliki kosakata verbal yang cukup untuk mengartikulasikan rasa takut, cemas, atau kebahagiaan mereka. Melalui krayon, kuas, dan warna, mereka memproyeksikan pengalaman bawah sadar mereka secara alami.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 text-sm">
                  Tahap Perkembangan Menggambar (Teori Viktor Lowenfeld):
                </h5>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <strong className="text-indigo-900 block font-bold">1. Scribbling Stage (Usia 1.5 - 3 Tahun)</strong>
                  <p className="text-slate-600 text-xs">
                    Coretan tak beraturan murni berupa eksplorasi kinestetik otot tangan. Mulai berkembang menjadi coretan melingkar dan penamaan coretan sederhana.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <strong className="text-indigo-900 block font-bold">2. Pre-schematic Stage (Usia 3 - 4 Tahun)</strong>
                  <p className="text-slate-600 text-xs">
                    Anak mulai menggambar bentuk geometris dan figur manusia sederhana (sering disebut figur "cebong" atau kepala langsung berkaki). Objek digambar berdasarkan apa yang paling penting bagi anak.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <strong className="text-indigo-900 block font-bold">3. Schematic Stage (Usia 5 - 7 Tahun)</strong>
                  <p className="text-slate-600 text-xs">
                    Sudah ada garis tanah (baseline) dan langit. Objek memiliki bentuk pasti yang diulang (rumah segitiga, matahari tersenyum, pohon). Ruang kertas mulai dimanfaatkan secara beraturan.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <strong className="text-indigo-900 block font-bold">4. Dawning Realism (Usia 8 - 11 Tahun)</strong>
                  <p className="text-slate-600 text-xs">
                    Anak mulai kritis terhadap proporsi realistik, perspektif bayangan, dan detail pakaian serta interaksi sosial.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <h5 className="font-bold text-amber-900 mb-1 text-xs uppercase tracking-wider">
                  💡 Tips Emas Menanggapi Gambar Anak:
                </h5>
                <p className="text-xs text-amber-950">
                  Hindari bertanya <em>"Kamu lagi gambar apa sih?"</em> karena bisa membuat anak merasa karyanya tidak berhasil dikenali. Gantilah dengan: <em>"Wah, ceritakan ke Bunda dong tentang gambar yang seru ini!"</em>
                </p>
              </div>
            </div>
          )}

          {activeTopic === 'nutrition' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-emerald-950 mb-1">
                  Mengapa Stunting & Underweight Perlu Dicegah Sejak Dini?
                </h4>
                <p className="text-emerald-900 text-xs leading-relaxed">
                  Stunting bukan hanya tentang tinggi badan yang pendek, melainkan tanda bahwa pertumbuhan sel otak anak terhambat akibat kekurangan gizi kronis. Dampaknya meliputi penurunan IQ, konsentrasi rendah, dan rentan terhadap penyakit metabolik di usia dewasa.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 text-sm">
                  Superfood Lokal Kaya Protein Hewani Pencegah Stunting:
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-emerald-800 block font-bold">🍳 Telur Ayam (1-2 butir/hari)</strong>
                    <p className="text-slate-600 mt-0.5">
                      Mengandung asam amino esensial lengkap dan kolin tinggi untuk perkembangan memori dan sel neuron otak.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-emerald-800 block font-bold">🐟 Ikan Kembung / Tongkol</strong>
                    <p className="text-slate-600 mt-0.5">
                      Kandungan Omega-3 dan DHA ikan kembung bahkan lebih tinggi dari ikan salmon impor, dengan harga yang sangat terjangkau.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-emerald-800 block font-bold">🥩 Hati Ayam / Sapi</strong>
                    <p className="text-slate-600 mt-0.5">
                      Juara zat besi heme yang paling mudah diserap tubuh untuk mencegah anemia defisiensi besi pada balita.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-emerald-800 block font-bold">🥛 Susu & Produk Olahan</strong>
                    <p className="text-slate-600 mt-0.5">
                      Sumber kalsium dan fosfor bermutu tinggi untuk pemadatan matriks tulang anak.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <strong className="text-slate-900 block font-bold">Strategi "Feeding Rules" Menghadapi GTM:</strong>
                <p className="text-slate-600">• Batasi waktu makan maksimal 30 menit agar anak tidak stres.</p>
                <p className="text-slate-600">• Jadwalkan jarak makan utama dan snack minimal 2 jam agar rasa lapar alami timbul.</p>
                <p className="text-slate-600">• Hindari memberi susu atau camilan berlebih sesaat sebelum jam makan utama.</p>
              </div>
            </div>
          )}

          {activeTopic === 'gut-brain' && (
            <div className="space-y-4">
              <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
                <h4 className="font-bold text-purple-950 mb-1">
                  Gut-Brain Axis: Saluran Cerna Sebagai "Otak Kedua" Anak
                </h4>
                <p className="text-purple-900 text-xs leading-relaxed">
                  Sekitar 90% hormon serotonin (hormon kebahagiaan dan ketenangan) diproduksi di saluran pencernaan oleh mikrobioma usus yang sehat. Anak yang kekurangan gizi atau mengalami disbiosis pencernaan seringkali lebih mudah rewel, tantrum, dan sulit fokus saat belajar.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-purple-200">
                  <strong className="text-purple-900 block font-bold">1. Gizi Buruk Menyebabkan Letargi & Emosi Labil</strong>
                  <p className="text-slate-600 mt-0.5">
                    Defisiensi zat besi membuat suplai oksigen ke otak berkurang, menyebabkan anak cepat lelah, mudah menangis, dan enggan mengeksplorasi aktivitas baru.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-purple-200">
                  <strong className="text-purple-900 block font-bold">2. Fluktuasi Gula Darah Akibat Camilan Manis</strong>
                  <p className="text-slate-600 mt-0.5">
                    Gula berlebih memicu lonjakan energi singkat (sugar rush) yang diikuti penurunan tajam (crash), membuat anak gelisah dan mudah marah saat berekspresi.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-purple-200">
                  <strong className="text-purple-900 block font-bold">3. Gizi Seimbang Melahirkan Daya Imajinasi Tinggi</strong>
                  <p className="text-slate-600 mt-0.5">
                    Anak yang kenyang dengan nutrisi padat protein dan lemak sehat memiliki stamina konsentrasi lebih lama, yang tercermin dalam lukisan yang lebih detail, penuh warna, dan tenang.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

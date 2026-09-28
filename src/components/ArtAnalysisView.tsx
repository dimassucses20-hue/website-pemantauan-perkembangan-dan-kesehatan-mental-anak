import React from 'react';
import {
  Sparkles,
  Heart,
  Smile,
  Shield,
  Lightbulb,
  MessageCircle,
  BookmarkCheck,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ArtAnalysisResult, ChildProfile } from '../types';

interface ArtAnalysisViewProps {
  result: ArtAnalysisResult;
  currentChild: ChildProfile;
  onSaveToHistory: (result: ArtAnalysisResult) => void;
  isSaved: boolean;
  onGoToNutrition: () => void;
  onGoToTracker: () => void;
}

export const ArtAnalysisView: React.FC<ArtAnalysisViewProps> = ({
  result,
  currentChild,
  onSaveToHistory,
  isSaved,
  onGoToNutrition,
  onGoToTracker,
}) => {
  const { emotionalScores, artAnalysis, recommendations, facialExpression } = result;

  const scoreItems = [
    { label: 'Keceriaan Diri', value: emotionalScores.joyScore, color: 'bg-amber-500', bar: 'from-amber-400 to-amber-500', icon: '☀️' },
    { label: 'Percaya Diri', value: emotionalScores.confidenceScore, color: 'bg-emerald-500', bar: 'from-emerald-400 to-emerald-500', icon: '🦁' },
    { label: 'Kestabilan & Ketenangan', value: emotionalScores.calmnessScore, color: 'bg-sky-500', bar: 'from-sky-400 to-sky-500', icon: '🌊' },
    { label: 'Daya Imajinasi', value: emotionalScores.creativityScore, color: 'bg-purple-500', bar: 'from-purple-400 to-purple-500', icon: '🎨' },
    { label: 'Kebutuhan Afeksi / Pelukan', value: emotionalScores.affectionNeedScore, color: 'bg-rose-500', bar: 'from-rose-400 to-rose-500', icon: '💖' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-100/60 via-amber-100/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-6 items-start justify-between relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Hasil Analisis Psikologi Seni AI
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                Suasana Utama: {result.dominantMood}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {result.date}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {result.summaryTitle}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {result.overallEmotionSummary}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-700">
                Tahap Perkembangan Artistik: <strong className="text-indigo-600">{result.developmentalStage}</strong>
              </span>
            </div>
          </div>

          {/* Artwork Preview Thumbnail & Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 w-full md:w-auto">
            <div className="w-40 h-32 sm:w-48 sm:h-36 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm bg-slate-50 shrink-0">
              <img
                src={result.artImagePreview}
                alt="Artwork Preview"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col w-full gap-2">
              <button
                onClick={() => onSaveToHistory(result)}
                disabled={isSaved}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  isSaved
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>{isSaved ? 'Tersimpan di Jurnal Emosi' : 'Simpan ke Rekam Jejak Berkala'}</span>
              </button>

              <button
                onClick={onGoToTracker}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                <span>Lihat Tren Emosi Berkala</span>
              </button>
            </div>
          </div>
        </div>

        {/* Emotional Score Bars */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-amber-500" /> Skor Indikator Afektif & Kebutuhan Emosi Anak (0 - 100)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {scoreItems.map((item) => (
              <div
                key={item.label}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <span>{item.icon}</span> {item.label}
                  </span>
                  <span className="font-extrabold text-slate-900">{item.value}/100</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.bar} transition-all duration-700`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Breakdown: 4 Art Psychological Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1: Color Psychology */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              🎨
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Psikologi Warna & Getaran Emosi</h4>
              <p className="text-[11px] text-slate-500">Pilihan nuansa & kontras warna</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {artAnalysis.colorPsychology}
          </p>
        </div>

        {/* Pillar 2: Stroke & Pressure */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-rose-300 transition-colors">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-sm">
              ✏️
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Goresan & Tekanan Kuas</h4>
              <p className="text-[11px] text-slate-500">Indikator ketegangan otot & energi motorik</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {artAnalysis.strokeAndPressure}
          </p>
        </div>

        {/* Pillar 3: Spatial Composition */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm">
              📐
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Tata Letak & Pemanfaatan Ruang</h4>
              <p className="text-[11px] text-slate-500">Keberadaan di tengah, sudut, atau menyebar</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {artAnalysis.spatialComposition}
          </p>
        </div>

        {/* Pillar 4: Symbolism */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              🔍
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Makna Objek & Simbolisme</h4>
              <p className="text-[11px] text-slate-500">Interpretasi figur manusia, rumah, awan, dll.</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {artAnalysis.symbolism}
          </p>
        </div>
      </div>

      {/* Facial Expression Congruence (if provided) */}
      {facialExpression && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl border border-indigo-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Smile className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-bold text-indigo-950">Analisis Multimodal Ekspresi Wajah & Keselarasan</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-white/80 p-3.5 rounded-2xl border border-indigo-100">
              <span className="font-bold text-slate-700 block mb-1">Mimik yang Terdeteksi:</span>
              <p className="text-slate-600">{facialExpression.detectedExpression}</p>
            </div>
            <div className="bg-white/80 p-3.5 rounded-2xl border border-indigo-100">
              <span className="font-bold text-slate-700 block mb-1">Keselarasan dengan Gambar:</span>
              <p className="text-slate-600">{facialExpression.congruence}</p>
            </div>
          </div>
        </div>
      )}

      {/* Golden Parenting Section: Affirmations & Practical Dialogue */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 sm:p-7 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-amber-950">
              Panduan Praktis Orang Tua: Cara Merespon Karya Ini
            </h4>
            <p className="text-xs text-amber-700">
              Membangun keterikatan emosi (bonding) tanpa memberi penilaian kaku
            </p>
          </div>
        </div>

        {/* Validation Quote */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs relative">
          <span className="text-2xl text-amber-400 font-serif absolute top-2 left-3">“</span>
          <div className="pl-5">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Kalimat Emas untuk Diucapkan kepada Anak:
            </span>
            <p className="text-sm sm:text-base font-semibold text-slate-800 italic">
              {recommendations.parentValidationPhrase}
            </p>
          </div>
        </div>

        {/* Conversation Starters */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-amber-600" /> 3 Pertanyaan Pembuka Obrolan Hangat:
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {recommendations.conversationStarters.map((q, i) => (
              <div
                key={i}
                className="bg-white p-3.5 rounded-2xl border border-amber-100 text-xs sm:text-sm text-slate-700 font-medium flex items-start gap-2 shadow-2xs"
              >
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Bonding Activities */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600" /> Rekomendasi Aktivitas Kreatif Pendampingan Emosi:
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.bondingActivities.map((act, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-2xl border border-amber-100 shadow-2xs space-y-1"
              >
                <h6 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="text-rose-500">✨</span> {act.title}
                </h6>
                <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags / Safety Notice */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            recommendations.isRedFlagPresent
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          }`}
        >
          {recommendations.isRedFlagPresent ? (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs sm:text-sm">
            <strong className="block font-bold mb-0.5">
              {recommendations.isRedFlagPresent
                ? 'Catatan Perhatian Khusus Orang Tua & Konselor:'
                : 'Status Keamanan Afektif:'}
            </strong>
            <p>{recommendations.emotionalRedFlags}</p>
          </div>
        </div>
      </div>

      {/* Holistic Growth Connection Prompt */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md shadow-emerald-200">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
            Tumbuh Kembang Menyeluruh
          </span>
          <h4 className="text-base sm:text-lg font-black">
            Periksa Apakah Berat & Tinggi Badan {currentChild.name} Sudah Ideal?
          </h4>
          <p className="text-xs text-emerald-100 max-w-xl">
            Kesehatan emosi sangat dipengaruhi asupan gizi seimbang (Gut-Brain Connection). Evaluasi risiko stunting & dapatkan menu kejar tumbuh sekarang.
          </p>
        </div>

        <button
          onClick={onGoToNutrition}
          className="px-5 py-3 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all shrink-0 flex items-center gap-2 active:scale-95"
        >
          <span>Evaluasi Status Gizi Anak</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

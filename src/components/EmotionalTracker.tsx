import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  Heart,
  Award,
  Compass,
  Smile,
  RefreshCw,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { ArtAnalysisResult, ChildProfile, PeriodicInsightResult } from '../types';

interface EmotionalTrackerProps {
  currentChild: ChildProfile;
  historyEntries: ArtAnalysisResult[];
  onSelectEntry: (entry: ArtAnalysisResult) => void;
  onGoToArtStudio: () => void;
}

export const EmotionalTracker: React.FC<EmotionalTrackerProps> = ({
  currentChild,
  historyEntries,
  onSelectEntry,
  onGoToArtStudio,
}) => {
  const [insightResult, setInsightResult] = useState<PeriodicInsightResult | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const childHistory = historyEntries.filter((h) => h.childId === currentChild.id);

  // Generate Periodic AI Insight
  const handleGeneratePeriodicInsight = async () => {
    if (childHistory.length === 0) {
      alert('Belum ada riwayat analisis untuk anak ini. Silakan analisis karya anak di Studio Seni terlebih dahulu.');
      return;
    }

    setIsLoadingInsight(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/periodic-emotional-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: currentChild.name,
          historyEntries: childHistory.map((h) => ({
            date: h.date,
            title: h.summaryTitle,
            dominantMood: h.dominantMood,
            emotionalScores: h.emotionalScores,
            notes: h.activityNotes,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server untuk memproses insight berkala.');
      }

      const data = await response.json();
      setInsightResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat membuat insight berkala.');
    } finally {
      setIsLoadingInsight(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-rose-600 rounded-3xl p-5 sm:p-7 text-white shadow-md shadow-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-indigo-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Pemantauan Perkembangan Afektif Berkala
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Jurnal & Tren Emosi: {currentChild.name}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl">
            Lacak perubahan suasana hati, kematangan regulasi emosi, dan daya imajinasi anak dari waktu ke waktu melalui karya gambarnya.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGeneratePeriodicInsight}
            disabled={isLoadingInsight || childHistory.length === 0}
            className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-extrabold text-xs sm:text-sm shadow-md hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoadingInsight ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Menganalisis Tren Berkala...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Buat Insight Berkala AI</span>
              </>
            )}
          </button>

          <button
            onClick={onGoToArtStudio}
            className="px-4 py-2.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-800 text-white font-semibold text-xs transition-colors"
          >
            + Analisis Baru
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
          {errorMsg}
        </div>
      )}

      {/* AI Periodic Growth Insight Card (When Available) */}
      {insightResult && (
        <div className="bg-white rounded-3xl border-2 border-indigo-300 shadow-md p-5 sm:p-7 space-y-6 animate-fade-in relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Rekomendasi Perkembangan Emosional Berkala AI
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Evaluasi Trajektori Emosional & Afeksi Anak
                </h3>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <span>Klasifikasi Tren:</span>
              <strong>{insightResult.trendClassification}</strong>
            </div>
          </div>

          {/* Period Summary */}
          <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1">
              Rangkuman Perjalanan Emosional:
            </h4>
            <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed">
              {insightResult.periodSummary}
            </p>
          </div>

          {/* Milestones & Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Milestones Achieved */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" /> Capaian Milestone Emosional yang Diraih:
              </h5>
              <ul className="space-y-1.5">
                {insightResult.keyMilestonesAchieved.map((m, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strengths & Focus */}
            <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-purple-600" /> Area Fokus Pendampingan Berikutnya:
              </h5>
              <ul className="space-y-1.5">
                {insightResult.supportFocusAreas.map((f, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step by step action plan for next month */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" /> Rencana Aksi Pengasuhan Berkala (Bulan Depan):
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insightResult.nextMonthActionPlan.map((plan, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {plan.week}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{plan.focus}</span>
                  </div>
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">{plan.parentingStrategy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Encouragement Quote for Parents */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3">
            <Heart className="w-5 h-5 text-rose-500 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-rose-900 italic">
              {insightResult.encouragementMessage}
            </p>
          </div>
        </div>
      )}

      {/* Visual Timeline & Progression Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Riwayat Sesi Seni & Catatan Emosi Anak
            </h3>
            <p className="text-xs text-slate-500">
              Total {childHistory.length} sesi analisis tersimpan untuk {currentChild.name}
            </p>
          </div>

          {childHistory.length > 0 && !insightResult && (
            <button
              onClick={handleGeneratePeriodicInsight}
              disabled={isLoadingInsight}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Analisis Tren Berkala AI</span>
            </button>
          )}
        </div>

        {childHistory.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
            <Smile className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Belum Ada Sesi Tersimpan</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Mulai dengan menggambar di kanvas digital atau unggah lukisan anak untuk melihat perkembangan emosinya secara berkala.
            </p>
            <button
              onClick={onGoToArtStudio}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
            >
              Buka Studio Seni Anak
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {childHistory.map((item, index) => (
              <div
                key={item.id}
                onClick={() => onSelectEntry(item)}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-sm bg-white transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                    <img
                      src={item.artImagePreview}
                      alt={item.summaryTitle}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {item.date}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {item.dominantMood}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                      {item.summaryTitle}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 max-w-xl">
                      {item.overallEmotionSummary}
                    </p>
                  </div>
                </div>

                {/* Score Meters Mini */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                    <span title="Keceriaan">☀️ {item.emotionalScores.joyScore}</span>
                    <span className="text-slate-300">|</span>
                    <span title="Ketenangan">🌊 {item.emotionalScores.calmnessScore}</span>
                    <span className="text-slate-300">|</span>
                    <span title="Percaya Diri">🦁 {item.emotionalScores.confidenceScore}</span>
                  </div>

                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5">
                    Detail <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

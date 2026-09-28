import React from 'react';
import {
  Printer,
  X,
  FileCheck,
  Heart,
  Utensils,
  Palette,
  Shield,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';
import { ChildProfile, ArtAnalysisResult, NutritionAnalysisResult } from '../types';
import { calculateWHOGrowth } from '../utils/whoGrowthStandards';

interface HolisticReportModalProps {
  currentChild: ChildProfile;
  latestArtResult?: ArtAnalysisResult | null;
  nutritionResult?: NutritionAnalysisResult | null;
  onClose: () => void;
}

export const HolisticReportModal: React.FC<HolisticReportModalProps> = ({
  currentChild,
  latestArtResult,
  nutritionResult,
  onClose,
}) => {
  const totalAgeMonths = currentChild.ageYears * 12 + currentChild.ageMonths;
  const whoMetrics = calculateWHOGrowth(
    totalAgeMonths,
    currentChild.gender,
    currentChild.heightCm || 95,
    currentChild.weightKg || 14
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Laporan Terpadu Perkembangan Anak (Psikologi Seni & Gizi)
              </h3>
              <p className="text-xs text-slate-500">
                Siap cetak atau simpan sebagai dokumen PDF untuk konsultasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Cetak PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 space-y-6 print:p-4 text-slate-800">
          {/* Document Letterhead */}
          <div className="border-b-2 border-slate-900 pb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white font-black text-xl shadow-xs">
                KP
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  KiddiePulse AI
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Comprehensive Child Developmental Art & Clinical Pediatric Nutrition Report
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              <p className="font-bold text-slate-800">Tanggal Cetak:</p>
              <p>{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
            </div>
          </div>

          {/* Child Profile Information */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Nama Anak:</span>
              <strong className="text-slate-900 text-sm">{currentChild.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Usia / Jenis Kelamin:</span>
              <span className="text-slate-900 font-bold">
                {currentChild.ageYears} thn {currentChild.ageMonths} bln ({currentChild.gender === 'male' ? 'Laki-laki' : 'Perempuan'})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Tinggi / Berat Badan:</span>
              <span className="text-slate-900 font-bold">
                {currentChild.heightCm || whoMetrics.idealHeightRange.min} cm / {currentChild.weightKg || whoMetrics.idealWeightRange.min} kg
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Status Stunting WHO:</span>
              <span className="text-slate-900 font-bold">{whoMetrics.heightStatus}</span>
            </div>
          </div>

          {/* Module 1: Physical Growth & Nutrition Summary */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 pb-2 border-b border-slate-100">
              <Utensils className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider">
                1. Status Pertumbuhan Antropometri & Rekomendasi Gizi
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block mb-0.5">Tinggi Menurut Umur (TB/U):</span>
                <strong className="text-slate-900">{whoMetrics.heightStatus}</strong>
                <span className="text-[10px] text-slate-400 block">Z-Score: {whoMetrics.heightZScore} SD</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block mb-0.5">Berat Menurut Umur (BB/U):</span>
                <strong className="text-slate-900">{whoMetrics.weightStatus}</strong>
                <span className="text-[10px] text-slate-400 block">Z-Score: {whoMetrics.weightZScore} SD</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block mb-0.5">Proporsi Tubuh (IMT):</span>
                <strong className="text-slate-900">{whoMetrics.bmiStatus}</strong>
                <span className="text-[10px] text-slate-400 block">{whoMetrics.bmi} kg/m²</span>
              </div>
            </div>

            {nutritionResult ? (
              <div className="space-y-2 text-xs text-slate-700 pt-2">
                <p>
                  <strong>Target Energi & Protein:</strong> {nutritionResult.nutritionTargets.estimatedDailyCalories} | {nutritionResult.nutritionTargets.proteinGoalGrams}
                </p>
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                  <strong className="text-emerald-900 block mb-0.5">Panduan Menu Kejar Tumbuh:</strong>
                  <p className="text-emerald-950">
                    Sarapan: {nutritionResult.recommendedMealPlan.breakfast.menu} | Makan Siang: {nutritionResult.recommendedMealPlan.lunch.menu} | Makan Malam: {nutritionResult.recommendedMealPlan.dinner.menu}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Evaluasi antropometri standar WHO terhitung. Jalankan modul gizi AI untuk menu terperinci.
              </p>
            )}
          </div>

          {/* Module 2: Child Art & Emotional Psychology Profile */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 pb-2 border-b border-slate-100">
              <Palette className="w-5 h-5 text-rose-600" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider">
                2. Profil Psikologi Seni & Kesehatan Emosional Anak
              </h3>
            </div>

            {latestArtResult ? (
              <div className="space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-28 h-24 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                    <img
                      src={latestArtResult.artImagePreview}
                      alt="Art"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{latestArtResult.summaryTitle}</h4>
                    <p className="text-slate-600">{latestArtResult.overallEmotionSummary}</p>
                    <p className="text-[11px] text-indigo-700 font-semibold">
                      Tahap Perkembangan: {latestArtResult.developmentalStage} | Suasana: {latestArtResult.dominantMood}
                    </p>
                  </div>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-5 gap-2 text-center pt-2">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Keceriaan</span>
                    <strong className="text-slate-900">{latestArtResult.emotionalScores.joyScore}/100</strong>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Percaya Diri</span>
                    <strong className="text-slate-900">{latestArtResult.emotionalScores.confidenceScore}/100</strong>
                  </div>
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Ketenangan</span>
                    <strong className="text-slate-900">{latestArtResult.emotionalScores.calmnessScore}/100</strong>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Kreativitas</span>
                    <strong className="text-slate-900">{latestArtResult.emotionalScores.creativityScore}/100</strong>
                  </div>
                  <div className="p-2 bg-rose-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Kebutuhan Afeksi</span>
                    <strong className="text-slate-900">{latestArtResult.emotionalScores.affectionNeedScore}/100</strong>
                  </div>
                </div>

                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                  <strong className="text-amber-900 block mb-0.5">Saran Komunikasi Orang Tua:</strong>
                  <p className="italic text-slate-700">"{latestArtResult.recommendations.parentValidationPhrase}"</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Belum ada analisis karya seni terkini yang tercatat. Lakukan analisis gambar di Studio Seni untuk mengisi bagian ini.
              </p>
            )}
          </div>

          {/* Module 3: Holistic Recommendation & Action Plan */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-2 bg-slate-50/70">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Kesimpulan & Integrasi Gut-Brain Anak
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Tumbuh kembang anak adalah sinergi antara kesehatan fisik dan kehangatan emosional. Kecukupan protein hewani dan zat besi memastikan sel saraf otak berkembang optimal, yang secara nyata meningkatkan rentang konsentrasi, stabilitas mood, dan daya kreasi anak saat mengekspresikan diri lewat seni.
            </p>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-0.5">
            <p>
              Dokumen ini dihasilkan oleh sistem AI KiddiePulse berbasis Standar WHO & Pendekatan Terapi Seni Anak sebagai alat bantu edukatif.
            </p>
            <p>
              Untuk diagnosis medis resmi atau keluhan klinis berkepanjangan, konsultasikan dengan Dokter Spesialis Anak (Sp.A) atau Psikolog Anak.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

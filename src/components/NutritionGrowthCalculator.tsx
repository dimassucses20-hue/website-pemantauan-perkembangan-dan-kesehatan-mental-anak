import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Scale,
  Ruler,
  Info,
  Apple,
  RefreshCw,
  Heart,
  Baby,
  ChefHat,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ChildProfile, NutritionAnalysisResult, WHOGrowthStandardCalculation } from '../types';
import { calculateWHOGrowth } from '../utils/whoGrowthStandards';

interface NutritionGrowthCalculatorProps {
  currentChild: ChildProfile;
  onUpdateChildMeasurements: (childId: string, heightCm: number, weightKg: number) => void;
  cachedNutritionResult?: NutritionAnalysisResult | null;
  onSaveNutritionResult: (result: NutritionAnalysisResult) => void;
}

export const NutritionGrowthCalculator: React.FC<NutritionGrowthCalculatorProps> = ({
  currentChild,
  onUpdateChildMeasurements,
  cachedNutritionResult,
  onSaveNutritionResult,
}) => {
  const [heightCm, setHeightCm] = useState<number>(currentChild.heightCm || 95);
  const [weightKg, setWeightKg] = useState<number>(currentChild.weightKg || 13.5);
  const [ageYears, setAgeYears] = useState<number>(currentChild.ageYears || 3);
  const [ageMonths, setAgeMonths] = useState<number>(currentChild.ageMonths || 6);
  const [gender, setGender] = useState<'male' | 'female'>(currentChild.gender || 'male');
  const [dietaryNotes, setDietaryNotes] = useState<string>(
    'Sering menolak makan daging/ikan, lebih menyukai nasi kuah sop dan camilan manis.'
  );
  const [isPickyEater, setIsPickyEater] = useState<boolean>(true);

  const [aiNutritionResult, setAiNutritionResult] = useState<NutritionAnalysisResult | null>(
    cachedNutritionResult || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalAgeMonths = ageYears * 12 + ageMonths;
  const whoMetrics: WHOGrowthStandardCalculation = calculateWHOGrowth(
    totalAgeMonths,
    gender,
    heightCm,
    weightKg
  );

  // Sync when child selector changes
  useEffect(() => {
    if (currentChild) {
      setAgeYears(currentChild.ageYears);
      setAgeMonths(currentChild.ageMonths);
      setGender(currentChild.gender);
      if (currentChild.heightCm) setHeightCm(currentChild.heightCm);
      if (currentChild.weightKg) setWeightKg(currentChild.weightKg);
    }
  }, [currentChild]);

  // Request AI Pediatric Nutrition Plan
  const handleAnalyzeNutrition = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    // Save updated measurements to child profile
    onUpdateChildMeasurements(currentChild.id, heightCm, weightKg);

    try {
      const response = await fetch('/api/analyze-nutrition-growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: currentChild.name,
          gender,
          ageMonths: totalAgeMonths,
          heightCm,
          weightKg,
          currentDietNotes: dietaryNotes,
          pickyEaterTendency: isPickyEater,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server untuk evaluasi gizi anak.');
      }

      const data = await response.json();
      const enrichedResult: NutritionAnalysisResult = {
        ...data,
        calculatedAt: new Date().toISOString().slice(0, 10),
        inputs: {
          ageMonths: totalAgeMonths,
          heightCm,
          weightKg,
          gender,
        },
      };

      setAiNutritionResult(enrichedResult);
      onSaveNutritionResult(enrichedResult);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses rekomendasi nutrisi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper badge color
  const getStatusBadgeClass = (status: string) => {
    if (status.includes('Sangat Pendek') || status.includes('Sangat Kurang') || status.includes('Gizi Buruk')) {
      return 'bg-rose-100 text-rose-800 border-rose-300';
    }
    if (status.includes('Pendek') || status.includes('Kurang') || status.includes('Wasted')) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    if (status.includes('Lebih') || status.includes('Obesitas')) {
      return 'bg-purple-100 text-purple-800 border-purple-300';
    }
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-5 sm:p-7 text-white shadow-md shadow-emerald-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Utensils className="w-5 h-5 text-emerald-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                Standar WHO & Kemenkes RI
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Evaluasi Pertumbuhan & Rekomendasi Gizi Anak
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl">
              Cegah dan atasi perawakan pendek (stunting), berat badan kurang (underweight), serta dapatkan rekomendasi menu protein hewani terpersonalisasi untuk kejar tumbuh.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-white/30 text-xs font-bold flex items-center gap-2">
            <Baby className="w-4 h-4 text-emerald-200" />
            <span>Pasien: {currentChild.name}</span>
          </div>
        </div>
      </div>

      {/* Main Anthropometry Input & WHO Standard Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Parameter Antropometri & Pertumbuhan Anak
            </h3>
            <p className="text-xs text-slate-500">
              Masukkan hasil pengukuran posyandu atau timbangan di rumah
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Usia: {ageYears} Thn {ageMonths} Bln ({totalAgeMonths} bln)
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Gender */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Jenis Kelamin</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  gender === 'male'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                👦 Laki-laki
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  gender === 'female'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                👧 Perempuan
              </button>
            </div>
          </div>

          {/* Age (Years & Months) */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Usia Anak</label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={ageYears}
                  onChange={(e) => setAgeYears(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-xs sm:text-sm p-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800"
                />
                <span className="text-[10px] text-slate-400 block text-center mt-0.5">Tahun</span>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  min={0}
                  max={11}
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))}
                  className="w-full text-xs sm:text-sm p-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800"
                />
                <span className="text-[10px] text-slate-400 block text-center mt-0.5">Bulan</span>
              </div>
            </div>
          </div>

          {/* Height (cm) */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-emerald-600" /> Tinggi Badan (cm)
              </label>
              <span className="text-[11px] text-slate-400">
                Ideal: {whoMetrics.idealHeightRange.min} - {whoMetrics.idealHeightRange.max} cm
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min={40}
              max={180}
              value={heightCm}
              onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
              className="w-full text-xs sm:text-sm p-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-200 focus:outline-hidden"
            />
          </div>

          {/* Weight (kg) */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-emerald-600" /> Berat Badan (kg)
              </label>
              <span className="text-[11px] text-slate-400">
                Ideal: {whoMetrics.idealWeightRange.min} - {whoMetrics.idealWeightRange.max} kg
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min={2}
              max={80}
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
              className="w-full text-xs sm:text-sm p-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-200 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Instant WHO Status Evaluation Display */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-600" /> Hasil Kalkulasi Kurva WHO Antropometri:
            </span>
            {whoMetrics.isAbnormal ? (
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Memerlukan Intervensi Gizi Khusus
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Pertumbuhan Sesuai Standar Normal
              </span>
            )}
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Height-for-Age (TB/U) */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Tinggi Menurut Umur (TB/U):
              </span>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${getStatusBadgeClass(whoMetrics.heightStatus)}`}>
                  {whoMetrics.heightStatus}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  Z-Score: <strong>{whoMetrics.heightZScore} SD</strong>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Persentil: ke-{whoMetrics.heightPercentile}% dari anak seusianya
              </p>
            </div>

            {/* Weight-for-Age (BB/U) */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Berat Menurut Umur (BB/U):
              </span>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${getStatusBadgeClass(whoMetrics.weightStatus)}`}>
                  {whoMetrics.weightStatus}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  Z-Score: <strong>{whoMetrics.weightZScore} SD</strong>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Persentil: ke-{whoMetrics.weightPercentile}% dari anak seusianya
              </p>
            </div>

            {/* BMI / Wasting (IMT/U) */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Proporsi Tubuh (IMT / BB-TB):
              </span>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${getStatusBadgeClass(whoMetrics.bmiStatus)}`}>
                  {whoMetrics.bmiStatus}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  IMT: <strong>{whoMetrics.bmi} kg/m²</strong>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Rasio keselarasan berat terhadap tinggi badan
              </p>
            </div>
          </div>

          {/* Deviation note */}
          <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
            📌 <strong>Catatan Evaluasi:</strong> {whoMetrics.deviationDescription}
          </p>
        </div>

        {/* Dietary Context & Picky Eater Option */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Catatan Pola Makan & Makanan Favorit / Ditolak Anak:
            </label>
            <textarea
              rows={2}
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              placeholder="Contoh: Susah makan nasi, hanya suka kuah dan gorengan, alergi susu sapi..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden text-slate-800"
            />
          </div>

          <div className="flex flex-col justify-center bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  Kondisi Picky Eater / Gerakan Tutup Mulut (GTM):
                </span>
                <span className="text-[11px] text-amber-700">
                  Apakah anak sering pilih-pilih makan atau menolak makanan padat?
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPickyEater(!isPickyEater)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  isPickyEater ? 'bg-amber-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    isPickyEater ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Trigger Button */}
        <button
          onClick={handleAnalyzeNutrition}
          disabled={isLoading}
          className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
            isLoading
              ? 'bg-slate-300 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:via-teal-700 hover:to-indigo-700 shadow-emerald-200 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Menyusun Rencana Gizi & Kejar Tumbuh Klinis dengan Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>Dapatkan Rekomendasi Menu & Strategi Kejar Tumbuh AI</span>
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
          {errorMessage}
        </div>
      )}

      {/* AI Clinical Nutrition Results Dashboard */}
      {aiNutritionResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Section 1: Clinical Diagnosis Explanation & Targets */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Apple className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    Rekomendasi Gizi Klinis Pediatrik
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {aiNutritionResult.anthropometryEvaluation.overallStatusHeadline}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  Dihitung: {aiNutritionResult.calculatedAt}
                </span>
              </div>
            </div>

            {/* Empathetic explanation */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed">
              <p>{aiNutritionResult.anthropometryEvaluation.statusExplanation}</p>
            </div>

            {/* Daily Nutrition Targets */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Target Asupan Harian Kejar Tumbuh:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-xs text-amber-800 font-semibold block">Target Kalori Harian:</span>
                  <span className="text-lg font-black text-amber-950 mt-1 block">
                    {aiNutritionResult.nutritionTargets.estimatedDailyCalories}
                  </span>
                  <span className="text-[10px] text-amber-700">Padat energi untuk pertumbuhan</span>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                  <span className="text-xs text-rose-800 font-semibold block">Target Protein Hewani:</span>
                  <span className="text-lg font-black text-rose-950 mt-1 block">
                    {aiNutritionResult.nutritionTargets.proteinGoalGrams}
                  </span>
                  <span className="text-[10px] text-rose-700">Kunci asam amino esensial pencegah stunting</span>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center">
                  <span className="text-xs text-sky-800 font-semibold block">Kebutuhan Hidrasi Cairan:</span>
                  <span className="text-lg font-black text-sky-950 mt-1 block">
                    {aiNutritionResult.nutritionTargets.waterRequirement}
                  </span>
                  <span className="text-[10px] text-sky-700">Air putih, susu & kuah sup</span>
                </div>
              </div>
            </div>

            {/* Key Micronutrients */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Mikronutrien Penunjang Utama Pertumbuhan Tulang & Sel:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {aiNutritionResult.nutritionTargets.keyNutrients.map((nut, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                    <strong className="text-indigo-900 font-bold block">{nut.name}</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{nut.role}</p>
                    <div className="pt-1 border-t border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block">Sumber Alami:</span>
                      <span className="text-[11px] text-slate-800 font-medium">{nut.bestFoods.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Complete Meal Plan (Isi Piringku Ramah Anak) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Rekomendasi Menu Sehari "Isi Piringku" Kaya Protein Hewani
                </h3>
                <p className="text-xs text-slate-500">
                  Bahan lokal terjangkau, lezat, dan mudah dibuat di rumah
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Breakfast */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md inline-block mb-1">
                    🌅 Sarapan (07:00)
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                    {aiNutritionResult.recommendedMealPlan.breakfast.menu}
                  </h5>
                  <p className="text-xs text-slate-600 mt-1">
                    {aiNutritionResult.recommendedMealPlan.breakfast.ingredients}
                  </p>
                </div>
                {aiNutritionResult.recommendedMealPlan.breakfast.nutritionHighlight && (
                  <span className="text-[10px] text-amber-800 font-semibold pt-1 border-t border-amber-200 block">
                    ✨ {aiNutritionResult.recommendedMealPlan.breakfast.nutritionHighlight}
                  </span>
                )}
              </div>

              {/* Morning Snack */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md inline-block mb-1">
                    🥛 Snack Pagi (10:00)
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                    {aiNutritionResult.recommendedMealPlan.morningSnack.menu}
                  </h5>
                  <p className="text-xs text-slate-600 mt-1">
                    {aiNutritionResult.recommendedMealPlan.morningSnack.ingredients}
                  </p>
                </div>
              </div>

              {/* Lunch */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mb-1">
                    ☀️ Makan Siang (12:30)
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                    {aiNutritionResult.recommendedMealPlan.lunch.menu}
                  </h5>
                  <p className="text-xs text-slate-600 mt-1">
                    {aiNutritionResult.recommendedMealPlan.lunch.ingredients}
                  </p>
                </div>
                {aiNutritionResult.recommendedMealPlan.lunch.nutritionHighlight && (
                  <span className="text-[10px] text-emerald-800 font-semibold pt-1 border-t border-emerald-200 block">
                    ✨ {aiNutritionResult.recommendedMealPlan.lunch.nutritionHighlight}
                  </span>
                )}
              </div>

              {/* Afternoon Snack */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md inline-block mb-1">
                    🍎 Snack Sore (16:00)
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                    {aiNutritionResult.recommendedMealPlan.afternoonSnack.menu}
                  </h5>
                  <p className="text-xs text-slate-600 mt-1">
                    {aiNutritionResult.recommendedMealPlan.afternoonSnack.ingredients}
                  </p>
                </div>
              </div>

              {/* Dinner */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md inline-block mb-1">
                    🌙 Makan Malam (18:30)
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                    {aiNutritionResult.recommendedMealPlan.dinner.menu}
                  </h5>
                  <p className="text-xs text-slate-600 mt-1">
                    {aiNutritionResult.recommendedMealPlan.dinner.ingredients}
                  </p>
                </div>
                {aiNutritionResult.recommendedMealPlan.dinner.nutritionHighlight && (
                  <span className="text-[10px] text-rose-800 font-semibold pt-1 border-t border-rose-200 block">
                    ✨ {aiNutritionResult.recommendedMealPlan.dinner.nutritionHighlight}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Picky Eater & Catch-up Strategies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Catch-Up Strategies */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="text-emerald-600">📈</span> Strategi Kejar Tumbuh (Catch-up Growth)
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {aiNutritionResult.catchUpStrategies.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Picky Eater Solutions */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="text-amber-500">🥣</span> Trik Mengatasi Anak GTM & Picky Eater
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {aiNutritionResult.pickyEaterSolutions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 4: Gut-Brain Connection (Nutrition & Emotion) */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl border border-purple-200 p-5 sm:p-6 space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <h4 className="text-sm sm:text-base font-bold text-purple-950">
                Hubungan Gizi & Kestabilan Emosi Anak (Gut-Brain Connection)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
              {aiNutritionResult.gutBrainConnection}
            </p>
          </div>

          {/* Section 5: Pediatrician Referral Indicators */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-5 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Indikator Kapan Harus Konsultasi Langsung ke Dokter Spesialis Anak (Sp.A):
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-rose-900">
              {aiNutritionResult.pediatricReferralIndicators.map((ind, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

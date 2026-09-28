import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ArtUploadSection } from './components/ArtUploadSection';
import { ArtAnalysisView } from './components/ArtAnalysisView';
import { EmotionalTracker } from './components/EmotionalTracker';
import { NutritionGrowthCalculator } from './components/NutritionGrowthCalculator';
import { HolisticReportModal } from './components/HolisticReportModal';
import { AddChildModal } from './components/AddChildModal';
import { ParentGuideModal } from './components/ParentGuideModal';
import { ChildProfile, ArtAnalysisResult, NutritionAnalysisResult } from './types';
import { SAMPLE_CHILDREN, INITIAL_EMOTION_HISTORY } from './utils/sampleData';
import {
  Palette,
  TrendingUp,
  Utensils,
  FileText,
  Heart,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export default function App() {
  // Load children from localStorage or fallback to SAMPLE_CHILDREN
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(() => {
    const saved = localStorage.getItem('kiddie_pulse_children');
    return saved ? JSON.parse(saved) : SAMPLE_CHILDREN;
  });

  const [selectedChildId, setSelectedChildId] = useState<string>(() => {
    return childrenList[1]?.id || childrenList[0]?.id || 'child-2'; // Default Kenzo (shows both emotional & stunting cases)
  });

  // History of analyzed artworks
  const [historyEntries, setHistoryEntries] = useState<ArtAnalysisResult[]>(() => {
    const saved = localStorage.getItem('kiddie_pulse_art_history');
    return saved ? JSON.parse(saved) : INITIAL_EMOTION_HISTORY;
  });

  // Current active art analysis result
  const [activeArtResult, setActiveArtResult] = useState<ArtAnalysisResult | null>(() => {
    return historyEntries[historyEntries.length - 1] || null;
  });

  // Cached nutrition result
  const [cachedNutritionResults, setCachedNutritionResults] = useState<Record<string, NutritionAnalysisResult>>(() => {
    const saved = localStorage.getItem('kiddie_pulse_nutrition');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeTab, setActiveTab] = useState<'art-studio' | 'emotional-tracker' | 'nutrition-growth' | 'holistic-report'>(
    'art-studio'
  );

  const [isAnalyzingArt, setIsAnalyzingArt] = useState(false);
  const [artAnalysisError, setArtAnalysisError] = useState<string | null>(null);

  // Modals
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isHolisticReportOpen, setIsHolisticReportOpen] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('kiddie_pulse_children', JSON.stringify(childrenList));
  }, [childrenList]);

  useEffect(() => {
    localStorage.setItem('kiddie_pulse_art_history', JSON.stringify(historyEntries));
  }, [historyEntries]);

  useEffect(() => {
    localStorage.setItem('kiddie_pulse_nutrition', JSON.stringify(cachedNutritionResults));
  }, [cachedNutritionResults]);

  const currentChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0];

  // Handle new art analysis
  const handleAnalyzeArt = async (payload: {
    imageBase64: string;
    expressionPhotoBase64?: string;
    activityNotes: string;
  }) => {
    setIsAnalyzingArt(true);
    setArtAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-child-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: payload.imageBase64,
          expressionPhotoBase64: payload.expressionPhotoBase64,
          childInfo: {
            name: currentChild.name,
            ageYears: currentChild.ageYears,
            ageMonths: currentChild.ageMonths,
            gender: currentChild.gender,
            activityContext: payload.activityNotes,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server untuk menganalisis gambar anak.');
      }

      const data = await response.json();

      const newResult: ArtAnalysisResult = {
        ...data,
        id: `analysis-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        childId: currentChild.id,
        artImagePreview: payload.imageBase64,
        expressionPhotoPreview: payload.expressionPhotoBase64,
        activityNotes: payload.activityNotes,
      };

      setActiveArtResult(newResult);
      // Auto save to history
      setHistoryEntries((prev) => [newResult, ...prev]);
    } catch (err: any) {
      console.error(err);
      setArtAnalysisError(err.message || 'Terjadi kesalahan saat memproses analisis gambar.');
    } finally {
      setIsAnalyzingArt(false);
    }
  };

  // Update measurements for child
  const handleUpdateChildMeasurements = (childId: string, heightCm: number, weightKg: number) => {
    setChildrenList((prev) =>
      prev.map((c) => (c.id === childId ? { ...c, heightCm, weightKg } : c))
    );
  };

  // Save Nutrition Result
  const handleSaveNutritionResult = (result: NutritionAnalysisResult) => {
    setCachedNutritionResults((prev) => ({
      ...prev,
      [currentChild.id]: result,
    }));
  };

  // Add new child
  const handleAddChild = (newChild: ChildProfile) => {
    setChildrenList((prev) => [...prev, newChild]);
    setSelectedChildId(newChild.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-rose-50/30 to-indigo-50/30 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        childrenList={childrenList}
        selectedChildId={selectedChildId}
        onSelectChild={setSelectedChildId}
        onOpenAddChildModal={() => setIsAddChildOpen(true)}
        onOpenGuideModal={() => setIsGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Child Header Card Status */}
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl ${
                currentChild.gender === 'male' ? 'bg-indigo-500' : 'bg-rose-500'
              } text-white flex items-center justify-center font-bold text-sm shadow-xs`}
            >
              {currentChild.gender === 'male' ? '👦' : '👧'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {currentChild.name}
                </h2>
                <span className="text-[11px] font-semibold text-slate-500">
                  ({currentChild.ageYears} thn {currentChild.ageMonths} bln)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                TB: {currentChild.heightCm || '-'} cm • BB: {currentChild.weightKg || '-'} kg
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">Status Terkini:</span>
            {currentChild.heightCm && currentChild.heightCm < 92 ? (
              <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 font-bold border border-amber-300 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Perlu Intervensi Tinggi Badan (Stunting)</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Tumbuh Kembang Sehat</span>
              </span>
            )}
          </div>
        </div>

        {/* Tab 1: Studio Analisis Seni & Ekspresi */}
        {activeTab === 'art-studio' && (
          <div className="space-y-6">
            <ArtUploadSection
              currentChild={currentChild}
              onAnalyze={handleAnalyzeArt}
              isLoading={isAnalyzingArt}
            />

            {artAnalysisError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
                {artAnalysisError}
              </div>
            )}

            {activeArtResult && (
              <ArtAnalysisView
                result={activeArtResult}
                currentChild={currentChild}
                onSaveToHistory={(res) => {
                  if (!historyEntries.some((h) => h.id === res.id)) {
                    setHistoryEntries((prev) => [res, ...prev]);
                  }
                  alert('Karya berhasil disimpan ke Jurnal & Rekam Jejak Emosi Berkala!');
                }}
                isSaved={historyEntries.some((h) => h.id === activeArtResult.id)}
                onGoToNutrition={() => setActiveTab('nutrition-growth')}
                onGoToTracker={() => setActiveTab('emotional-tracker')}
              />
            )}
          </div>
        )}

        {/* Tab 2: Jurnal & Tren Emosi Berkala */}
        {activeTab === 'emotional-tracker' && (
          <EmotionalTracker
            currentChild={currentChild}
            historyEntries={historyEntries}
            onSelectEntry={(entry) => {
              setActiveArtResult(entry);
              setActiveTab('art-studio');
            }}
            onGoToArtStudio={() => setActiveTab('art-studio')}
          />
        )}

        {/* Tab 3: Evaluasi Gizi & Stunting */}
        {activeTab === 'nutrition-growth' && (
          <NutritionGrowthCalculator
            currentChild={currentChild}
            onUpdateChildMeasurements={handleUpdateChildMeasurements}
            cachedNutritionResult={cachedNutritionResults[currentChild.id]}
            onSaveNutritionResult={handleSaveNutritionResult}
          />
        )}

        {/* Tab 4: Laporan Terpadu Anak */}
        {activeTab === 'holistic-report' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center shadow-xs">
              <FileText className="w-12 h-12 text-amber-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-slate-900">
                Laporan Terpadu Perkembangan Anak: {currentChild.name}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Dokumen komprehensif yang mengintegrasikan profil psikologi seni emosional dengan status antropometri gizi (Stunting & Underweight).
              </p>
              <button
                onClick={() => setIsHolisticReportOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-xs transition-colors"
              >
                Buka / Cetak Laporan Terpadu (Print View)
              </button>
            </div>

            {/* Direct embedded preview of holistic report */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6">
              <HolisticReportModal
                currentChild={currentChild}
                latestArtResult={activeArtResult}
                nutritionResult={cachedNutritionResults[currentChild.id]}
                onClose={() => setActiveTab('art-studio')}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">KiddiePulse AI</span>
            <span>•</span>
            <span>Seni, Emosi & Gizi Tumbuh Kembang Anak</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Diberdayakan oleh Google Gemini Multimodal AI • Berbasis Standar WHO & Pendekatan Terapi Seni Anak
          </p>
        </div>
      </footer>

      {/* Modals */}
      {isAddChildOpen && (
        <AddChildModal
          onClose={() => setIsAddChildOpen(false)}
          onAddChild={handleAddChild}
        />
      )}

      {isGuideOpen && <ParentGuideModal onClose={() => setIsGuideOpen(false)} />}

      {isHolisticReportOpen && (
        <HolisticReportModal
          currentChild={currentChild}
          latestArtResult={activeArtResult}
          nutritionResult={cachedNutritionResults[currentChild.id]}
          onClose={() => setIsHolisticReportOpen(false)}
        />
      )}
    </div>
  );
}

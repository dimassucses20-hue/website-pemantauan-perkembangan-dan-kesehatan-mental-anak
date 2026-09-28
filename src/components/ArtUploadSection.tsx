import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Camera,
  Sparkles,
  Smile,
  FileQuestion,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { DrawingCanvas } from './DrawingCanvas';
import { SAMPLE_DRAWINGS } from '../utils/sampleData';
import { ChildProfile } from '../types';

interface ArtUploadSectionProps {
  currentChild: ChildProfile;
  onAnalyze: (payload: {
    imageBase64: string;
    expressionPhotoBase64?: string;
    activityNotes: string;
  }) => void;
  isLoading: boolean;
}

export const ArtUploadSection: React.FC<ArtUploadSectionProps> = ({
  currentChild,
  onAnalyze,
  isLoading,
}) => {
  const [activeInputMode, setActiveInputMode] = useState<'canvas' | 'upload' | 'samples'>('samples');
  const [artImageBase64, setArtImageBase64] = useState<string>(SAMPLE_DRAWINGS[0].dataUri);
  const [expressionPhotoBase64, setExpressionPhotoBase64] = useState<string | undefined>(undefined);
  const [activityNotes, setActivityNotes] = useState<string>(SAMPLE_DRAWINGS[0].defaultStory);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_DRAWINGS[0].id);

  // File to base64 helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isExpression = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (PNG, JPG, JPEG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (isExpression) {
        setExpressionPhotoBase64(result);
      } else {
        setArtImageBase64(result);
        setSelectedSampleId('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_DRAWINGS[0]) => {
    setSelectedSampleId(sample.id);
    setArtImageBase64(sample.dataUri);
    setActivityNotes(sample.defaultStory);
  };

  const handleSubmit = () => {
    if (!artImageBase64) {
      alert('Silakan gambar di kanvas atau unggah foto gambar anak terlebih dahulu.');
      return;
    }

    onAnalyze({
      imageBase64: artImageBase64,
      expressionPhotoBase64,
      activityNotes,
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 p-4 sm:p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎨</span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight">
                Studio Analisis Seni & Ekspresi Anak
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-2xl">
              Model AI mendeteksi getaran emosional, simbol psikologis, dan keselarasan ekspresi
              pada karya seni <strong className="underline text-white">{currentChild.name}</strong> ({currentChild.ageYears} th {currentChild.ageMonths} bln).
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-2xl border border-white/30 text-xs font-semibold flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-amber-200" />
            <span>Usia {currentChild.ageYears}th {currentChild.ageMonths}bln</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Step 1: Input Mode Navigation */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>Langkah 1:</span> Pilih Sumber Karya Gambar
            </label>
            <span className="text-[11px] text-slate-400">Pilih salah satu cara di bawah</span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveInputMode('samples')}
              className={`py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeInputMode === 'samples'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Contoh Cepat</span>
            </button>

            <button
              onClick={() => setActiveInputMode('canvas')}
              className={`py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeInputMode === 'canvas'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="text-sm">✏️</span>
              <span>Kanvas Digital</span>
            </button>

            <button
              onClick={() => setActiveInputMode('upload')}
              className={`py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeInputMode === 'upload'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4 text-emerald-500" />
              <span>Unggah Foto Kertas</span>
            </button>
          </div>
        </div>

        {/* Content based on Active Mode */}
        {activeInputMode === 'samples' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 font-medium">
              Pilih salah satu contoh studi kasus karya gambar anak untuk langsung menguji analisis AI:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_DRAWINGS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedSampleId === sample.id
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center mb-2.5">
                    <img
                      src={sample.dataUri}
                      alt={sample.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{sample.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sample.moodType === 'happy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sample.moodType === 'storm'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {sample.moodType === 'happy' ? 'Ceria' : sample.moodType === 'storm' ? 'Cemas/Takut' : 'Hangat'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{sample.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeInputMode === 'canvas' && (
          <div>
            <DrawingCanvas
              onCanvasExport={(dataUri) => {
                setArtImageBase64(dataUri);
                setSelectedSampleId('');
                alert('Gambar dari kanvas berhasil disimpan untuk dianalisis!');
              }}
              initialImage={artImageBase64.startsWith('data:') ? artImageBase64 : undefined}
            />
          </div>
        )}

        {activeInputMode === 'upload' && (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-slate-300 hover:border-rose-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                id="art-upload-input"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, false)}
                className="hidden"
              />
              <label
                htmlFor="art-upload-input"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3 shadow-xs">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-800">
                  Klik untuk Foto atau Pilih Gambar Lukisan Anak
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Format PNG, JPG, JPEG dari kamera ponsel atau galeri foto
                </span>
              </label>
            </div>

            {artImageBase64 && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                  <img src={artImageBase64} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-800">Gambar Berhasil Dipilih</p>
                  <p className="text-slate-500">Siap untuk dianalisis oleh AI psikologi seni.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Dual Multimodal (Optional Facial Expression / Selfie) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <span>Langkah 2 (Opsional):</span> Foto Ekspresi / Wajah Anak
            </label>
            <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
              Analisis Multimodal Wajah + Seni
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Sertakan foto mimik wajah anak saat memegang gambarnya untuk menganalisis keselarasan (congruence) antara ekspresi wajah dan perasaan yang dituangkan dalam gambar.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 text-xs font-semibold text-indigo-700 transition-colors">
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>{expressionPhotoBase64 ? 'Ganti Foto Ekspresi' : '+ Unggah Foto Ekspresi Wajah Anak'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true)}
                className="hidden"
              />
            </label>

            {expressionPhotoBase64 && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <img
                  src={expressionPhotoBase64}
                  alt="Ekspresi"
                  className="w-8 h-8 rounded-lg object-cover border border-emerald-300"
                />
                <span className="text-xs text-emerald-800 font-medium">Foto ekspresi terpasang</span>
                <button
                  onClick={() => setExpressionPhotoBase64(undefined)}
                  className="text-xs text-slate-400 hover:text-rose-600 ml-1 font-bold"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Child's Context / Story told by Child */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Langkah 3: Cerita / Celoteh Anak Saat Menggambar
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Apa yang dikatakan anak tentang gambarnya? (Misal: "Ini rumah kelinci yang lagi hujan", "Ini monster yang lapar tapi baik hati")
          </p>
          <textarea
            rows={2}
            value={activityNotes}
            onChange={(e) => setActivityNotes(e.target.value)}
            placeholder="Tuliskan cerita singkat yang disampaikan si kecil..."
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-hidden transition-all text-slate-800"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !artImageBase64}
            className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
              isLoading || !artImageBase64
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600 hover:from-amber-600 hover:via-rose-700 hover:to-indigo-700 shadow-rose-200 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Menganalisis Psikologi Seni & Emosi Anak dengan Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>Mulai Analisis Seni & Ekspresi Emosional AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

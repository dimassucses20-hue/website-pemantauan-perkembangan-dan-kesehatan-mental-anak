import React from 'react';
import { Palette, TrendingUp, Utensils, FileText, BookOpen, PlusCircle, Sparkles } from 'lucide-react';
import { ChildProfile } from '../types';

interface NavbarProps {
  activeTab: 'art-studio' | 'emotional-tracker' | 'nutrition-growth' | 'holistic-report';
  setActiveTab: (tab: 'art-studio' | 'emotional-tracker' | 'nutrition-growth' | 'holistic-report') => void;
  childrenList: ChildProfile[];
  selectedChildId: string;
  onSelectChild: (id: string) => void;
  onOpenAddChildModal: () => void;
  onOpenGuideModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  childrenList,
  selectedChildId,
  onSelectChild,
  onOpenAddChildModal,
  onOpenGuideModal,
}) => {
  const currentChild = childrenList.find((c) => c.id === selectedChildId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('art-studio')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 bg-clip-text text-transparent">
                  KiddiePulse AI
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  <Sparkles className="w-3 h-3" /> Art & Gizi Anak
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 hidden md:block">
                Analisis Seni, Emosi Berkala & Evaluasi Tumbuh Kembang Anak
              </p>
            </div>
          </div>

          {/* Child Selector & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Child Profile Picker */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
              <span className="text-xs text-slate-400 mr-2 font-medium hidden sm:inline">Anak:</span>
              <select
                aria-label="Pilih profil anak"
                value={selectedChildId}
                onChange={(e) => onSelectChild(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {childrenList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.ageYears}th {c.ageMonths}bln)
                  </option>
                ))}
              </select>
              <button
                onClick={onOpenAddChildModal}
                title="Tambah Profil Anak"
                aria-label="Tambah Profil Anak"
                className="ml-2 text-rose-600 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Guide Button */}
            <button
              onClick={onOpenGuideModal}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-indigo-50 border border-slate-200 transition-colors"
              title="Panduan Interpretasi Seni & Gizi"
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span className="hidden lg:inline">Panduan</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm font-medium border-t border-slate-100 pt-2">
          <button
            onClick={() => setActiveTab('art-studio')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'art-studio'
                ? 'bg-rose-600 text-white font-semibold shadow-sm shadow-rose-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Studio Analisis Seni & Ekspresi</span>
          </button>

          <button
            onClick={() => setActiveTab('emotional-tracker')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'emotional-tracker'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Jurnal & Tren Emosi Berkala</span>
          </button>

          <button
            onClick={() => setActiveTab('nutrition-growth')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'nutrition-growth'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Evaluasi Gizi & Stunting</span>
            {currentChild && (currentChild.heightCm && currentChild.heightCm < 92) && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('holistic-report')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'holistic-report'
                ? 'bg-amber-600 text-white font-semibold shadow-sm shadow-amber-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Laporan Terpadu Anak</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

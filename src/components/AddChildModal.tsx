import React, { useState } from 'react';
import { X, UserPlus, Baby, Heart } from 'lucide-react';
import { ChildProfile } from '../types';

interface AddChildModalProps {
  onClose: () => void;
  onAddChild: (child: ChildProfile) => void;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({ onClose, onAddChild }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [ageYears, setAgeYears] = useState(4);
  const [ageMonths, setAgeMonths] = useState(0);
  const [heightCm, setHeightCm] = useState(100);
  const [weightKg, setWeightKg] = useState(15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama anak wajib diisi.');
      return;
    }

    const newChild: ChildProfile = {
      id: `child-${Date.now()}`,
      name: name.trim(),
      gender,
      ageYears,
      ageMonths,
      heightCm,
      weightKg,
      avatarColor: gender === 'male' ? 'bg-indigo-500' : 'bg-rose-500',
    };

    onAddChild(newChild);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scale-up">
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-white" />
            <h3 className="font-bold text-base">Tambah Profil Anak Baru</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Nama Panggilan Anak</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Arka, Kirana..."
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-rose-400 focus:outline-hidden font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Jenis Kelamin</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  gender === 'male'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                👦 Laki-laki
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  gender === 'female'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                👧 Perempuan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Usia (Tahun)</label>
              <input
                type="number"
                min={0}
                max={12}
                value={ageYears}
                onChange={(e) => setAgeYears(parseInt(e.target.value) || 0)}
                className="w-full text-sm p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Lebih (Bulan)</label>
              <input
                type="number"
                min={0}
                max={11}
                value={ageMonths}
                onChange={(e) => setAgeMonths(parseInt(e.target.value) || 0)}
                className="w-full text-sm p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tinggi Badan (cm)</label>
              <input
                type="number"
                step="0.1"
                value={heightCm}
                onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                className="w-full text-sm p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Berat Badan (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full text-sm p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-md shadow-rose-200 transition-all mt-2"
          >
            Simpan Profil Anak
          </button>
        </form>
      </div>
    </div>
  );
};

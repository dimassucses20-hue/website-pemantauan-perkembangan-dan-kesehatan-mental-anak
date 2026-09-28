import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Paintbrush,
  Eraser,
  RotateCcw,
  Trash2,
  CheckCircle,
  Sun,
  Star,
  Heart,
  Smile,
  Flower2,
  Sparkles,
  Download,
} from 'lucide-react';

interface DrawingCanvasProps {
  onCanvasExport: (dataUri: string) => void;
  initialImage?: string;
}

const BRUSH_COLORS = [
  { name: 'Kuning Mentari', hex: '#facc15' },
  { name: 'Oranye Ceria', hex: '#fb923c' },
  { name: 'Merah Api', hex: '#ef4444' },
  { name: 'Pink Permen', hex: '#ec4899' },
  { name: 'Ungu Impian', hex: '#a855f7' },
  { name: 'Biru Langit', hex: '#38bdf8' },
  { name: 'Biru Laut', hex: '#2563eb' },
  { name: 'Hijau Daun', hex: '#22c55e' },
  { name: 'Hijau Rumput', hex: '#16a34a' },
  { name: 'Cokelat Kayu', hex: '#854d0e' },
  { name: 'Abu-Abu Mendung', hex: '#64748b' },
  { name: 'Hitam Pekat', hex: '#0f172a' },
];

const BRUSH_SIZES = [
  { label: 'Halus', size: 4 },
  { label: 'Sedang', size: 10 },
  { label: 'Tebal', size: 18 },
  { label: 'Jumbo', size: 30 },
];

const STAMPS = [
  { id: 'sun', label: 'Matahari', icon: Sun, char: '☀️' },
  { id: 'star', label: 'Bintang', icon: Star, char: '⭐' },
  { id: 'heart', label: 'Hati', icon: Heart, char: '❤️' },
  { id: 'smile', label: 'Senyum', icon: Smile, char: '😊' },
  { id: 'flower', label: 'Bunga', icon: Flower2, char: '🌸' },
];

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onCanvasExport, initialImage }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#2563eb');
  const [brushSize, setBrushSize] = useState(10);
  const [isEraser, setIsEraser] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas background to clean white
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (initialImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveState();
      };
      img.src = initialImage;
    } else {
      saveState();
    }
  }, [initialImage]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setHistory((prev) => [...prev.slice(-15), dataUrl]);
    setHasDrawn(true);
  };

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    // If stamp mode is active, place stamp
    if (selectedStamp) {
      const stamp = STAMPS.find((s) => s.id === selectedStamp);
      if (stamp) {
        ctx.font = `${brushSize * 3}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stamp.char, x, y);
        saveState();
        return;
      }
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : selectedColor;
    ctx.lineWidth = isEraser ? brushSize * 1.8 : brushSize;
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || selectedStamp) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveState();
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const previous = newHistory[newHistory.length - 1];
    setHistory(newHistory);

    const canvas = canvasRef.current;
    if (!canvas || !previous) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = previous;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
    setHasDrawn(false);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUri = canvas.toDataURL('image/png');
    onCanvasExport(dataUri);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `karya-anak-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 p-3 sm:p-5 shadow-sm">
      {/* Canvas Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
            <Paintbrush className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Kanvas Menggambar Digital Anak</h3>
            <p className="text-[11px] text-slate-500">Biarkan si kecil bebas berekspresi di sini</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <button
            onClick={handleClear}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center gap-1"
            title="Bersihkan Kanvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hapus Semua</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium flex items-center gap-1"
            title="Download Gambar"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Gunakan untuk Analisis</span>
          </button>
        </div>
      </div>

      {/* Drawing Board */}
      <div className="relative w-full rounded-xl overflow-hidden border-2 border-dashed border-amber-300 bg-white shadow-inner flex justify-center items-center touch-none">
        <canvas
          ref={canvasRef}
          width={700}
          height={480}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full max-h-[460px] object-contain cursor-crosshair bg-white"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 bg-white/40">
            <Sparkles className="w-8 h-8 text-amber-400 mb-1 animate-bounce" />
            <p className="text-xs font-medium text-slate-600">Klik / Sentuh di sini untuk mulai menggambar</p>
            <p className="text-[11px] text-slate-400">Pilih warna ceria atau stiker lucu di bawah</p>
          </div>
        )}
      </div>

      {/* Tool Controls: Palettes, Brush Sizes, Stamps */}
      <div className="mt-3.5 space-y-3">
        {/* Colors */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
            Warna:
          </span>
          {BRUSH_COLORS.map((color) => (
            <button
              key={color.hex}
              onClick={() => {
                setSelectedColor(color.hex);
                setIsEraser(false);
                setSelectedStamp(null);
              }}
              title={color.name}
              aria-label={color.name}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform border-2 ${
                !isEraser && !selectedStamp && selectedColor === color.hex
                  ? 'scale-115 border-slate-900 shadow-md ring-2 ring-amber-400'
                  : 'border-white hover:scale-105 shadow-xs'
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}

          {/* Eraser */}
          <button
            onClick={() => {
              setIsEraser(true);
              setSelectedStamp(null);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold ml-auto border transition-colors ${
              isEraser
                ? 'bg-rose-100 border-rose-300 text-rose-800'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Eraser className="w-3.5 h-3.5 text-rose-500" />
            <span>Penghapus</span>
          </button>
        </div>

        {/* Brush Sizes & Stickers */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Size picker */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs font-bold text-slate-600 mr-1">Ukuran:</span>
            {BRUSH_SIZES.map((b) => (
              <button
                key={b.size}
                onClick={() => {
                  setBrushSize(b.size);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  brushSize === b.size && !selectedStamp
                    ? 'bg-amber-500 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Fun Kid Stickers/Stamps */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-600 mr-1 hidden sm:inline">Stempel:</span>
            {STAMPS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedStamp(selectedStamp === s.id ? null : s.id);
                  setIsEraser(false);
                }}
                title={`Tempel ${s.label}`}
                className={`p-1.5 rounded-lg text-sm border transition-all ${
                  selectedStamp === s.id
                    ? 'bg-amber-100 border-amber-400 scale-110 shadow-xs ring-1 ring-amber-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{s.char}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

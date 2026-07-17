interface LotMiniMapProps {
  lotId: string;
}

export function LotMiniMap({ lotId }: LotMiniMapProps) {
  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden bg-surface-container shadow-ambient border border-outline-variant/10">
      <div
        className="absolute inset-0 opacity-40 bg-cover bg-center grayscale"
        style={{ backgroundImage: "url('https://res.cloudinary.com/j5a9xyaq/image/upload/v1784303341/laholanda/lots/masterplan-render.jpg')" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 border-2 border-heritage-gold bg-heritage-gold/20 flex items-center justify-center rounded-sm">
          <span className="text-label-caps font-label-caps text-primary font-bold bg-surface/80 px-2 py-1 rounded">
            LOTE {lotId}
          </span>
        </div>
      </div>
      <div className="absolute bottom-4 left-4">
        <span className="text-label-caps font-label-caps text-primary bg-surface/90 px-3 py-1 rounded-sm">
          Plano General
        </span>
      </div>
    </div>
  );
}

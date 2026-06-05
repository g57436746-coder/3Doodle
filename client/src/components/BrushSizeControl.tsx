import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type BrushSizeControlProps = {
  brushSize: number;
  setBrushSize: (size: number) => void;
  className?: string;
};

const BrushSizeControl = ({ brushSize, setBrushSize, className }: BrushSizeControlProps) => {
  const [displaySize, setDisplaySize] = useState(`${brushSize}px`);

  useEffect(() => {
    setDisplaySize(`${brushSize}px`);
  }, [brushSize]);

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBrushSize(Number.parseInt(event.target.value, 10));
  };
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-nunito text-xs font-black uppercase tracking-normal text-[#52607e]">
          Brush size
        </h3>
        <span className="rounded-full bg-[#fff3b0] px-2.5 py-0.5 font-nunito text-xs font-black text-[#23244d]">
          {displaySize}
        </span>
      </div>
      <input
        type="range"
        min="2"
        max="26"
        value={brushSize}
        className="h-3 w-full cursor-pointer accent-[#ff477e]"
        onChange={handleSizeChange}
        aria-label="Brush size"
      />
      <div className="flex justify-between font-nunito text-[10px] font-bold text-[#52607e] leading-none">
        <span>Small</span>
        <span>Jumbo</span>
      </div>
    </div>
  );
};

export default BrushSizeControl;

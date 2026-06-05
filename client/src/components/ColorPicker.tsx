import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ColorPickerProps = {
  currentColor: string;
  setCurrentColor: (color: string) => void;
  className?: string;
};

export const COLORS = [
  { name: "Ink", value: "#23244D" },
  { name: "Bubblegum", value: "#FF477E" },
  { name: "Sky", value: "#1E9FFB" },
  { name: "Mint", value: "#44D17A" },
  { name: "Tangerine", value: "#FF8A00" },
  { name: "Grape", value: "#8D5CF6" },
  { name: "Tomato", value: "#FF4D4D" },
  { name: "Pebble", value: "#64748B" },
];

const ColorPicker = ({ currentColor, setCurrentColor, className }: ColorPickerProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="font-nunito text-xs font-black uppercase tracking-normal text-[#52607e]">
        Colors
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {COLORS.map((color) => {
          const isSelected = currentColor.toLowerCase() === color.value.toLowerCase();

          return (
            <motion.button
              key={color.value}
              type="button"
              className="h-10 w-10 rounded-xl border-2 border-white shadow-[0_4px_0_rgba(35,36,77,0.13)] outline-none transition focus-visible:ring-4 focus-visible:ring-[#ffd166]"
              style={{
                backgroundColor: color.value,
                boxShadow: isSelected
                  ? `0 0 0 2px #fffdf7, 0 0 0 5px ${color.value}, 0 6px 0 rgba(35,36,77,0.14)`
                  : undefined,
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setCurrentColor(color.value)}
              aria-label={`Use ${color.name}`}
              aria-pressed={isSelected}
              title={color.name}
            >
              <span className="sr-only">{color.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPicker;

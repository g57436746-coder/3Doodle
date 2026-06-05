import { motion } from "framer-motion";
import { Brush, Eraser, PaintBucket, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolSelectorProps = {
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  className?: string;
};

export type DrawingToolOption = {
  id: "brush" | "eraser" | "fill";
  icon: LucideIcon;
  label: string;
  color: string;
};

export const TOOLS: DrawingToolOption[] = [
  { id: "brush", icon: Brush, label: "Brush", color: "bg-[#14b8c4]" },
  { id: "eraser", icon: Eraser, label: "Eraser", color: "bg-[#ff8a00]" },
  { id: "fill", icon: PaintBucket, label: "Fill", color: "bg-[#8d5cf6]" },
];

const ToolSelector = ({ currentTool, setCurrentTool, className }: ToolSelectorProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-nunito text-sm font-black uppercase tracking-normal text-[#52607e]">
        Tools
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isSelected = currentTool === tool.id;

          return (
            <motion.button
              key={tool.id}
              type="button"
              className={cn(
                "flex min-h-20 flex-col items-center justify-center gap-2 rounded-[1.25rem] border-4 border-white bg-[#f1f6ff] px-2 py-3 font-nunito font-black text-[#23244d] shadow-[0_8px_0_rgba(35,36,77,0.13)] outline-none transition focus-visible:ring-4 focus-visible:ring-[#ffd166]",
                isSelected && "bg-[#fff3b0] shadow-[0_8px_0_rgba(255,71,126,0.25)]",
              )}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setCurrentTool(tool.id)}
              aria-pressed={isSelected}
              title={tool.label}
            >
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl text-white", tool.color)}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-xs sm:text-sm">{tool.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ToolSelector;

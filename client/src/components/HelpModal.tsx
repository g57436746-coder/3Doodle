import { motion } from "framer-motion";
import { Brush, Sparkles, Volume2, X } from "lucide-react";

type HelpModalProps = {
  onClose: () => void;
};

const helpSteps = [
  {
    icon: Brush,
    title: "Draw a Simple Thing",
    text: "Use big colors and tools to sketch an object like an apple, dog, rocket, or flower.",
    color: "bg-[#14b8c4]",
  },
  {
    icon: Sparkles,
    title: "Generate 3D",
    text: "Tap Generate 3D and 3Doodle will turn the canvas into a playful image.",
    color: "bg-[#ff477e]",
  },
  {
    icon: Volume2,
    title: "Play in the Gallery",
    text: "Tap a finished doodle in the gallery to hear a fun matching sound.",
    color: "bg-[#8ac926]",
  },
];

const HelpModal = ({ onClose }: HelpModalProps) => {
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#23244d]/65 px-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 18 }}
        className="toy-panel w-full max-w-lg rounded-[2rem] bg-[#fffdf7] p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="font-nunito text-2xl font-black text-[#23244d]">How 3Doodle Works</h3>
          <button
            type="button"
            className="toy-icon-button bg-[#ffe3eb] text-[#b91c4d] hover:bg-[#ffc6d6]"
            onClick={onClose}
            aria-label="Close help"
            title="Close help"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="space-y-4">
          {helpSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex gap-3 rounded-[1.25rem] bg-[#f1f6ff] p-3">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] text-white ${step.color}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-nunito text-lg font-black text-[#23244d]">{step.title}</h4>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-[#52607e]">{step.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HelpModal;

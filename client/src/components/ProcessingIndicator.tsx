import { motion } from "framer-motion";
import { Loader2, Sparkles, WandSparkles } from "lucide-react";

const ProcessingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#23244d]/65 px-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="toy-panel relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-[#fffdf7] p-6 text-center"
      >
        <div className="absolute left-5 top-5 text-[#ffd166]" aria-hidden="true">
          <Sparkles className="h-6 w-6" />
        </div>
        <motion.div
          className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-[#ff477e] text-white shadow-[0_10px_0_rgba(35,36,77,0.14)]"
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        >
          <WandSparkles className="h-11 w-11" aria-hidden="true" />
        </motion.div>
        <h3 className="font-nunito text-2xl font-black text-[#23244d]">Making your 3D doodle</h3>
        <p className="mx-auto mt-2 max-w-xs font-quicksand text-sm font-bold leading-relaxed text-[#52607e]">
          Hang tight while your sketch gets a bright new shape.
        </p>
        <Loader2 className="mx-auto mt-5 h-7 w-7 animate-spin text-[#14b8c4]" aria-hidden="true" />
      </motion.div>
    </motion.div>
  );
};

export default ProcessingIndicator;

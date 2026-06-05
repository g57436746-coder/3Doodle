import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brush,
  Images,
  Palette,
  Sparkles,
  Volume2,
  WandSparkles,
} from "lucide-react";
import doodleHero from "../../../attached_assets/doodling.png";

const featureTiles = [
  {
    icon: Brush,
    title: "Draw",
    text: "Big tools, bold colors, and a canvas that feels ready for little hands.",
    color: "bg-[#14b8c4]",
  },
  {
    icon: WandSparkles,
    title: "Transform",
    text: "Turn simple sketches into playful 3D-style creations.",
    color: "bg-[#ff477e]",
  },
  {
    icon: Volume2,
    title: "Play",
    text: "Save creations in the gallery and tap them for fun sounds.",
    color: "bg-[#8ac926]",
  },
];

const LandingPage = () => {
  const [, navigate] = useLocation();

  return (
    <main className="min-h-screen bg-[#bdf4ff] text-[#23244d] studio-pattern flex flex-col">
      
      <section className="relative w-full max-w-[1400px] mx-auto px-4 py-10 sm:px-6 lg:px-10 lg:py-14 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center w-full z-10">
          
          {/* Left Column: Hero Text & Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-6 flex flex-col justify-center"
          >
            <div className="w-fit inline-flex items-center gap-2 rounded-full border-4 border-white bg-[#fffdf7] px-4 py-2 font-nunito text-sm font-extrabold text-[#23244d] shadow-[0_8px_0_rgba(35,36,77,0.1)]">
              <Sparkles className="h-4 w-4 text-[#ff477e]" aria-hidden="true" />
              Toy studio for big ideas
            </div>
            
            <div className="space-y-4">
              <h1 className="font-nunito text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[0.9] tracking-normal text-[#23244d] drop-shadow-[0_4px_0_rgba(255,255,255,0.9)]">
                3Doodle
              </h1>
              <p className="max-w-xl font-quicksand text-lg font-bold leading-relaxed text-[#33406f] sm:text-xl">
                A colorful drawing studio where kids sketch, chat for ideas, and make a 3D-style gallery from their doodles.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row pt-2">
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/draw")}
                className="toy-button bg-[#ff477e] text-lg text-white"
              >
                Start doodling
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </motion.button>
              <button
                type="button"
                onClick={() => navigate("/draw")}
                className="toy-button bg-[#fffdf7] text-[#23244d]"
              >
                <Palette className="h-5 w-5 text-[#14b8c4]" aria-hidden="true" />
                Open studio
              </button>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid gap-3 pt-4 grid-cols-1 sm:grid-cols-3">
              {featureTiles.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
                    className="rounded-[1.25rem] border-4 border-white bg-[#fffdf7] p-4 shadow-[0_8px_0_rgba(35,36,77,0.08)]"
                  >
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${feature.color} text-white shadow-[0_4px_0_rgba(35,36,77,0.12)]`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h2 className="font-nunito text-lg font-black text-[#23244d]">{feature.title}</h2>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-[#52607e]">{feature.text}</p>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
          
          {/* Right Column: Hero Illustration in a toy whiteboard frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center relative"
          >
            {/* Whiteboard/Canvas Toy Frame */}
            <div className="w-full max-w-[520px] mx-auto rounded-[2rem] border-[10px] border-white bg-white shadow-[0_20px_40px_rgba(24,31,76,0.14)] overflow-hidden relative rotate-[2deg] hover:rotate-0 transition-transform duration-300">
              <img
                src={doodleHero}
                alt="Children drawing colorful 3Doodle art"
                className="w-full h-auto block select-none pointer-events-none"
              />
              {/* Toy label/badge inside the whiteboard frame */}
              <div className="absolute top-3 right-3 bg-[#fff3b0] text-[#ff477e] border-2 border-white px-3 py-1.5 rounded-full font-nunito text-xs font-black rotate-[6deg] shadow-md flex items-center gap-1">
                <Images className="h-3.5 w-3.5" />
                Gallery ready!
              </div>
            </div>
            
            {/* Sparkle decoration */}
            <div className="absolute -top-4 left-8 text-[#ff477e] animate-bounce select-none pointer-events-none hidden lg:block">
              <Sparkles className="h-7 w-7" />
            </div>
          </motion.div>

        </div>
      </section>
      
      {/* Playful color stripe footer */}
      <footer className="w-full shrink-0 overflow-hidden">
        <div className="h-3 bg-[#15b8c6]" />
        <div className="h-3 bg-[#ffcf33]" />
        <div className="h-5 bg-[#fff7d7]" />
      </footer>
    </main>
  );
};

export default LandingPage;

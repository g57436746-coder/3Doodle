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
    <main className="min-h-screen bg-[#bdf4ff] text-[#23244d] studio-pattern flex flex-col justify-between">
      
      <section className="relative w-full max-w-[1400px] mx-auto px-4 py-8 sm:px-6 lg:px-10 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full z-10">
          
          {/* Left Column: Hero Text & Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 xl:col-span-6 space-y-6 flex flex-col justify-center"
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
            <div className="grid gap-3 pt-6 grid-cols-1 sm:grid-cols-3">
              {featureTiles.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
                    className="rounded-[1.25rem] border-4 border-white bg-[#fffdf7] p-4 shadow-[0_8px_0_rgba(35,36,77,0.08)] flex flex-col justify-between"
                  >
                    <div>
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${feature.color} text-white shadow-[0_4px_0_rgba(35,36,77,0.12)]`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h2 className="font-nunito text-lg font-black text-[#23244d]">{feature.title}</h2>
                      <p className="mt-1 text-xs font-semibold leading-relaxed text-[#52607e]">{feature.text}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
          
          {/* Right Column: Hero Illustration framed like a Toy drawing board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 xl:col-span-6 flex items-center justify-center relative min-h-[320px] sm:min-h-[400px] lg:min-h-[460px] overflow-visible"
          >
            {/* Contained Hero Illustration with original crop and style */}
            <div className="w-full max-w-[500px] xl:max-w-[550px] aspect-square relative select-none pointer-events-none">
              <img
                src={doodleHero}
                alt="Children drawing colorful 3Doodle art"
                className="w-full h-full object-cover object-[50%_62%] opacity-[0.92] scale-105"
                style={{ clipPath: "inset(23% 0 16% 0)" }}
              />
            </div>

            {/* Playful badge aligned to the bottom right of the hero container */}
            <div
              className="absolute bottom-6 right-0 z-10 hidden rotate-[-7deg] items-center gap-2 rounded-[1.25rem] border-4 border-white bg-[#fffdf7] px-4 py-3 font-nunito font-black text-[#23244d] shadow-[0_8px_0_rgba(35,36,77,0.12)] md:flex"
              aria-hidden="true"
            >
              <Images className="h-5 w-5 text-[#ff477e]" />
              Gallery ready
            </div>
            
            {/* Small hand-drawn decoration accents */}
            <div className="absolute -top-6 left-12 text-[#ff477e] animate-bounce select-none pointer-events-none hidden lg:block">
              <Sparkles className="h-8 w-8" />
            </div>
          </motion.div>

        </div>
      </section>
      
      {/* Playful color stripe footer */}
      <footer className="w-full relative h-12 shrink-0 overflow-hidden flex flex-col justify-end">
        <div className="h-3 bg-[#15b8c6]" />
        <div className="h-3 bg-[#ffcf33]" />
        <div className="h-6 bg-[#fff7d7]" />
      </footer>
    </main>
  );
};

export default LandingPage;

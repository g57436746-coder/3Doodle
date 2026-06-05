import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brush,
  Images,
  Palette,
  Sparkles,
  Star,
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

      <section className="relative w-full max-w-[1400px] mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full z-10">

          {/* Left Column: Hero Text & Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-5 flex flex-col justify-center"
          >
            <div className="w-fit inline-flex items-center gap-2 rounded-full border-4 border-white bg-[#fffdf7] px-4 py-2 font-nunito text-sm font-extrabold text-[#23244d] shadow-[0_8px_0_rgba(35,36,77,0.1)]">
              <Sparkles className="h-4 w-4 text-[#ff477e]" aria-hidden="true" />
              Toy studio for big ideas
            </div>

            <div className="space-y-3">
              <h1 className="font-nunito text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[0.9] tracking-normal text-[#23244d] drop-shadow-[0_4px_0_rgba(255,255,255,0.9)]">
                3Doodle
              </h1>
              <p className="max-w-xl font-quicksand text-lg font-bold leading-relaxed text-[#33406f] sm:text-xl">
                A colorful drawing studio where kids sketch, chat for ideas, and make a 3D-style gallery from their doodles.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
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
            <div className="grid gap-3 pt-2 grid-cols-1 sm:grid-cols-3">
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

          {/* Right Column: Hero Illustration with toy whiteboard frame & effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center relative p-6 lg:p-8"
          >
            {/* Colorful glow behind the frame */}
            <div className="absolute inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#ff477e]/25 via-[#ffd166]/20 to-[#14b8c4]/25 blur-2xl" aria-hidden="true" />

            {/* Main whiteboard frame */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-[500px] mx-auto"
            >
              {/* Outer colored border ring */}
              <div className="rounded-[2.2rem] bg-gradient-to-br from-[#ff477e] via-[#ffd166] to-[#14b8c4] p-[5px] shadow-[0_16px_48px_rgba(255,71,126,0.22),0_8px_24px_rgba(20,184,196,0.18)]">
                {/* White frame */}
                <div className="rounded-[2rem] border-[8px] border-white bg-white overflow-hidden shadow-[inset_0_2px_8px_rgba(35,36,77,0.08)]">
                  <img
                    src={doodleHero}
                    alt="Children drawing colorful 3Doodle art"
                    className="w-full h-auto block select-none pointer-events-none"
                  />
                </div>
              </div>

              {/* Gallery ready badge — anchored top-right of frame */}
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 3, -2, 3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -right-3 bg-[#fff3b0] text-[#ff477e] border-[3px] border-white px-3.5 py-2 rounded-2xl font-nunito text-xs font-black shadow-[0_6px_0_rgba(35,36,77,0.1)] flex items-center gap-1.5 z-10"
              >
                <Images className="h-4 w-4" />
                Gallery ready!
              </motion.div>

              {/* Sparkle decorations */}
              <div className="absolute -top-5 -left-3 text-[#ff477e] animate-bounce select-none pointer-events-none">
                <Sparkles className="h-7 w-7 drop-shadow-[0_2px_4px_rgba(255,71,126,0.4)]" />
              </div>
              <div className="absolute -bottom-4 -right-5 text-[#ffd166] animate-pulse select-none pointer-events-none">
                <Star className="h-6 w-6 fill-[#ffd166] drop-shadow-[0_2px_4px_rgba(255,209,102,0.5)]" />
              </div>
              <div className="absolute top-1/2 -left-5 text-[#14b8c4] animate-ping select-none pointer-events-none opacity-60">
                <Sparkles className="h-4 w-4" />
              </div>
            </motion.div>
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


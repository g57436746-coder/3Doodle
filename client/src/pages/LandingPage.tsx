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
    <main className="min-h-screen overflow-hidden bg-[#bdf4ff] text-[#23244d] studio-pattern">
      <section className="relative flex min-h-[92svh] items-center px-4 py-6 sm:px-6 lg:px-10">
        <img
          src={doodleHero}
          alt="Children drawing colorful 3Doodle art"
          className="pointer-events-none absolute bottom-[-7rem] right-[-14rem] h-[70svh] min-h-[520px] max-w-none select-none object-cover object-[50%_62%] opacity-80 sm:right-[-9rem] sm:h-[78svh] lg:right-[-3rem] lg:h-[86svh] xl:right-8"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[#fff7d7]" aria-hidden="true" />
        <div className="absolute bottom-10 left-0 right-0 h-8 bg-[#15b8c6]" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#ffcf33]" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl pt-8 sm:pt-0"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border-4 border-white bg-[#fffdf7] px-4 py-2 font-nunito text-sm font-extrabold text-[#23244d] shadow-[0_8px_0_rgba(35,36,77,0.14)]">
              <Sparkles className="h-4 w-4 text-[#ff477e]" aria-hidden="true" />
              Toy studio for big ideas
            </div>
            <h1 className="font-nunito text-[clamp(3.4rem,10vw,8.5rem)] font-black leading-[0.85] tracking-normal text-[#23244d] drop-shadow-[0_6px_0_rgba(255,255,255,0.9)]">
              3Doodle
            </h1>
            <p className="mt-5 max-w-xl font-quicksand text-xl font-bold leading-relaxed text-[#33406f] sm:text-2xl">
              A colorful drawing studio where kids sketch, chat for ideas, and make a 3D-style gallery from their doodles.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                onClick={() => navigate("/draw")}
                className="toy-button bg-[#fffdf7] text-[#23244d]"
              >
                <Palette className="h-5 w-5 text-[#14b8c4]" aria-hidden="true" />
                Open studio
              </button>
            </div>
          </motion.div>

          <div className="relative z-10 grid max-w-4xl gap-3 pb-20 sm:grid-cols-3 lg:pb-2">
            {featureTiles.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
                  className="rounded-[1.5rem] border-4 border-white bg-[#fffdf7] p-4 shadow-[0_10px_0_rgba(35,36,77,0.12)]"
                >
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${feature.color} text-white shadow-[0_5px_0_rgba(35,36,77,0.16)]`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h2 className="font-nunito text-xl font-black text-[#23244d]">{feature.title}</h2>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-[#52607e]">{feature.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>

        <div
          className="absolute bottom-14 right-3 z-10 hidden rotate-[-7deg] items-center gap-2 rounded-[1.25rem] border-4 border-white bg-[#fffdf7] px-4 py-3 font-nunito font-black text-[#23244d] shadow-[0_8px_0_rgba(35,36,77,0.12)] md:flex"
          aria-hidden="true"
        >
          <Images className="h-5 w-5 text-[#ff477e]" />
          Gallery ready
        </div>
      </section>
    </main>
  );
};

export default LandingPage;

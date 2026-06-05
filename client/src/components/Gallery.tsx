import { motion, AnimatePresence } from "framer-motion";
import { Download, Images, Trash2, Volume2 } from "lucide-react";
import { useState } from "react";
import type { GalleryItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { playSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type GalleryProps = {
  items: GalleryItem[];
  onDelete: (id: string) => void;
};

const Gallery = ({ items, onDelete }: GalleryProps) => {
  const { toast } = useToast();
  const [activeSound, setActiveSound] = useState<string | null>(null);

  const handlePlaySound = (item: GalleryItem, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveSound(item.id);

    playSound(item.objectType)
      .then(() => {
        setTimeout(() => setActiveSound(null), 1000);
      })
      .catch((error) => {
        console.error("Error playing sound:", error);
        setActiveSound(null);
        toast({
          title: "Sound Error",
          description: "Could not play the sound for this object.",
          variant: "destructive",
        });
      });
  };

  const handleDownload = (item: GalleryItem, event: React.MouseEvent) => {
    event.stopPropagation();

    const link = document.createElement("a");
    link.href = item.imageUrl;
    link.download = `3doodle-${item.objectType}-${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: `Your ${item.objectType} 3D image is downloading.`,
    });
  };

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete(id);
  };

  return (
    <div>
      <AnimatePresence>
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.5rem] border-4 border-dashed border-[#ffd166] bg-[#fffdf7] px-6 py-12 text-center text-[#52607e]"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-[1.4rem] bg-[#14b8c4] text-white shadow-[0_8px_0_rgba(35,36,77,0.14)]">
              <Images className="h-9 w-9" aria-hidden="true" />
            </div>
            <p className="font-nunito text-2xl font-black text-[#23244d]">No 3D doodles yet</p>
            <p className="mt-2 max-w-sm font-quicksand text-sm font-bold leading-relaxed">
              Draw something on the canvas, tap Generate 3D, and your creation will land here.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {items.map((item) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                whileHover={{ y: -4 }}
                className="overflow-hidden rounded-[1.5rem] border-4 border-white bg-[#fffdf7] shadow-[0_10px_0_rgba(35,36,77,0.11)]"
              >
                <button
                  type="button"
                  className="block w-full text-left"
                  onClick={(event) => handlePlaySound(item, event)}
                  title={`Play ${item.objectType} sound`}
                >
                  <div className="relative aspect-square bg-[#e7f7ff]">
                    <img
                      src={item.imageUrl}
                      alt={`Generated 3D ${item.objectType}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </button>
                <div className="flex items-center justify-between gap-3 p-3">
                  <span className="min-w-0 truncate font-nunito text-lg font-black capitalize text-[#23244d]">
                    {item.objectType}
                  </span>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      className={cn(
                        "toy-icon-button h-11 w-11 bg-[#fff3b0] text-[#23244d] hover:bg-[#ffe775]",
                        activeSound === item.id && "bg-[#14b8c4] text-white",
                      )}
                      title="Play sound"
                      aria-label="Play sound"
                      onClick={(event) => handlePlaySound(item, event)}
                    >
                      <Volume2 className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="toy-icon-button h-11 w-11 bg-[#dff7ff] text-[#23244d] hover:bg-[#b9f0ff]"
                      title="Download"
                      aria-label="Download"
                      onClick={(event) => handleDownload(item, event)}
                    >
                      <Download className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="toy-icon-button h-11 w-11 bg-[#ffe3eb] text-[#b91c4d] hover:bg-[#ffc6d6]"
                      title="Delete"
                      aria-label="Delete"
                      onClick={(event) => handleDelete(item.id, event)}
                    >
                      <Trash2 className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

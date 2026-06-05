import { useEffect, useState } from "react";
import {
  CircleHelp,
  FilePlus2,
  Images,
  Lightbulb,
  Loader2,
  Palette,
  RotateCcw,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DrawingCanvas from "@/components/DrawingCanvas";
import ColorPicker, { COLORS } from "@/components/ColorPicker";
import BrushSizeControl from "@/components/BrushSizeControl";
import ToolSelector, { TOOLS } from "@/components/ToolSelector";
import Gallery from "@/components/Gallery";
import HelpModal from "@/components/HelpModal";
import ProcessingIndicator from "@/components/ProcessingIndicator";
import ChatPanel from "@/components/ChatPanel";
import { useDrawing } from "@/hooks/useDrawing";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { compressImage } from "@/lib/imageUtils";
import type { GalleryItem } from "@shared/schema";

const drawingIdeas = ["Apple", "Cat", "Rocket", "Flower", "House", "Dog", "Sun", "Tree"];

const DrawingApp = () => {
  const { toast } = useToast();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"tools" | "chat">("tools");

  const {
    canvasRef,
    currentTool,
    currentColor,
    brushSize,
    clearCanvas,
    setCurrentTool,
    setCurrentColor,
    setBrushSize,
    isDrawn,
    setIsDrawn,
    getCanvasImage,
  } = useDrawing();

  const handleNewDoodle = () => {
    clearCanvas();
  };

  const handleGenerateImage = async () => {
    if (!isDrawn) {
      toast({
        title: "Canvas is empty",
        description: "Draw something first, then make it 3D!",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      const imageData = await compressImage(getCanvasImage(), 1024, 1024, 0.9);
      const response = await apiRequest("POST", "/api/generate", {
        imageData,
      });

      const result = await response.json();
      setGalleryItems((prev) => [result, ...prev]);

      toast({
        title: "3D image generated!",
        description: `Your ${result.objectType} has been created!`,
      });

      window.setTimeout(() => {
        document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error
          ? error.message
          : "Could not transform your drawing. Please try again!",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearGallery = () => {
    setGalleryItems([]);
  };

  const handleGalleryJump = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChatGeneratedItem = (item: GalleryItem) => {
    setGalleryItems((prev) => [item, ...prev]);

    toast({
      title: "3D image generated!",
      description: `Your ${item.objectType} has been created from chat!`,
    });

    window.setTimeout(() => {
      document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch("/api/gallery");
        if (response.ok) {
          const items = await response.json();
          setGalleryItems(items);
        }
      } catch (error) {
        console.error("Error fetching gallery items:", error);
      }
    };

    fetchGalleryItems();
  }, []);

  const generateLabel = isProcessing ? "Making..." : "Generate 3D";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#bdf4ff] text-[#23244d] studio-pattern">
      <header className="sticky top-0 z-30 border-b-4 border-white bg-[#bdf4ff]/92 px-3 py-3 backdrop-blur sm:px-5 lg:px-8">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.1rem] bg-[#ff477e] text-white shadow-[0_6px_0_rgba(35,36,77,0.14)]">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-nunito text-2xl font-black leading-none text-[#23244d] sm:text-3xl">
                3Doodle
              </h1>
              <p className="hidden text-xs font-bold text-[#52607e] sm:block">Toy studio</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNewDoodle}
              className="toy-icon-button bg-[#fffdf7] text-[#23244d] sm:w-auto sm:px-4"
              aria-label="New doodle"
              title="New doodle"
            >
              <FilePlus2 className="h-5 w-5" aria-hidden="true" />
              <span className="hidden font-nunito font-black sm:inline">New</span>
            </button>
            <button
              type="button"
              onClick={handleGalleryJump}
              className="toy-icon-button bg-[#fffdf7] text-[#23244d] sm:w-auto sm:px-4"
              aria-label="Go to gallery"
              title="Go to gallery"
            >
              <Images className="h-5 w-5" aria-hidden="true" />
              <span className="hidden font-nunito font-black sm:inline">Gallery</span>
            </button>
            <button
              type="button"
              onClick={() => setIsHelpModalOpen(true)}
              className="toy-icon-button bg-[#fffdf7] text-[#23244d] sm:w-auto sm:px-4"
              aria-label="Open help"
              title="Open help"
            >
              <CircleHelp className="h-5 w-5" aria-hidden="true" />
              <span className="hidden font-nunito font-black sm:inline">Help</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-3 pb-[calc(14rem+env(safe-area-inset-bottom))] pt-4 sm:px-5 sm:pb-[calc(13rem+env(safe-area-inset-bottom))] lg:px-8 lg:pb-8">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="toy-panel rounded-[2rem] p-3 sm:p-4 lg:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-nunito text-sm font-black uppercase tracking-normal text-[#ff477e]">
                  Canvas first
                </p>
                <h2 className="font-nunito text-2xl font-black leading-tight text-[#23244d] sm:text-3xl">
                  Draw your next 3D doodle
                </h2>
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fff3b0] px-4 py-2 font-nunito text-sm font-black text-[#23244d]">
                <Lightbulb className="h-4 w-4 text-[#ff8a00]" aria-hidden="true" />
                Simple outlines work best
              </div>
            </div>

            <DrawingCanvas
              canvasRef={canvasRef}
              currentTool={currentTool}
              currentColor={currentColor}
              brushSize={brushSize}
              isDrawn={isDrawn}
              setIsDrawn={setIsDrawn}
            />

            <div className="mt-5 hidden items-center justify-between gap-4 lg:flex">
              <button
                type="button"
                onClick={clearCanvas}
                className="toy-button bg-[#fffdf7] text-[#23244d]"
              >
                <RotateCcw className="h-5 w-5 text-[#14b8c4]" aria-hidden="true" />
                Clear canvas
              </button>

              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={isProcessing}
                className="toy-button bg-[#ff477e] px-7 text-lg text-white hover:bg-[#e63b70] disabled:cursor-not-allowed disabled:bg-[#cbd5e1]"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <WandSparkles className="h-5 w-5" aria-hidden="true" />
                )}
                {generateLabel}
              </button>
            </div>
          </section>

          <aside className="hidden flex-col gap-4 lg:flex">
            {/* Tab switcher for desktop sidebar */}
            <div className="flex gap-2 p-1.5 bg-[#bdf4ff] rounded-[1.3rem] border-4 border-white shadow-[0_8px_0_rgba(35,36,77,0.06)]">
              <button
                type="button"
                onClick={() => setActiveTab("tools")}
                className={cn(
                  "flex-1 py-2 px-3 rounded-[0.95rem] font-nunito font-black text-sm flex items-center justify-center gap-2 transition-all active:translate-y-[1px]",
                  activeTab === "tools"
                    ? "bg-[#fff3b0] text-[#ff477e] shadow-[0_4px_0_rgba(35,36,77,0.12)] border-2 border-white"
                    : "text-[#52607e] hover:text-[#23244d]"
                )}
              >
                <Palette className="h-4 w-4" />
                Tools
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={cn(
                  "flex-1 py-2 px-3 rounded-[0.95rem] font-nunito font-black text-sm flex items-center justify-center gap-2 transition-all active:translate-y-[1px]",
                  activeTab === "chat"
                    ? "bg-[#fff3b0] text-[#ff477e] shadow-[0_4px_0_rgba(35,36,77,0.12)] border-2 border-white"
                    : "text-[#52607e] hover:text-[#23244d]"
                )}
              >
                <Sparkles className="h-4 w-4" />
                Chat Buddy
              </button>
            </div>

            {activeTab === "tools" ? (
              <section className="toy-panel rounded-[1.75rem] p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] bg-[#14b8c4] text-white shadow-[0_4px_0_rgba(35,36,77,0.15)]">
                    <Palette className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-nunito text-lg font-black leading-none text-[#23244d]">Drawing Tools</h2>
                    <p className="text-[10px] font-bold text-[#52607e] mt-1">Color, brush, fill</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <ColorPicker currentColor={currentColor} setCurrentColor={setCurrentColor} />
                  <BrushSizeControl brushSize={brushSize} setBrushSize={setBrushSize} />
                  <ToolSelector currentTool={currentTool} setCurrentTool={setCurrentTool} />

                  <div className="rounded-[1.2rem] bg-[#f1f6ff] p-3.5">
                    <h3 className="mb-2 font-nunito text-xs font-black uppercase tracking-normal text-[#52607e]">
                      Try drawing
                    </h3>
                    <div className="grid grid-cols-2 gap-1.5">
                      {drawingIdeas.map((idea) => (
                        <span
                          key={idea}
                          className="rounded-full bg-[#fffdf7] py-1 text-center font-nunito text-xs font-black text-[#23244d] border border-gray-100"
                        >
                          {idea}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <ChatPanel className="min-h-[360px]" onGalleryItemCreated={handleChatGeneratedItem} />
            )}
          </aside>
        </section>

        <section className="grid gap-5 lg:hidden">
          <ChatPanel onGalleryItemCreated={handleChatGeneratedItem} />
        </section>

        <section id="gallery" className="toy-panel scroll-mt-24 rounded-[2rem] p-4 sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-nunito text-sm font-black uppercase tracking-normal text-[#14b8c4]">
                Your collection
              </p>
              <h2 className="font-nunito text-2xl font-black text-[#23244d]">3D Gallery</h2>
            </div>
            <button
              type="button"
              onClick={handleClearGallery}
              className="toy-button min-h-11 w-fit bg-[#ffe3eb] px-4 py-2 text-sm text-[#b91c4d] disabled:cursor-not-allowed disabled:bg-[#f1f6ff] disabled:text-[#94a3b8]"
              disabled={galleryItems.length === 0}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Clear all
            </button>
          </div>

          <Gallery items={galleryItems} onDelete={handleDeleteGalleryItem} />
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-white bg-[#fffdf7]/96 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-18px_42px_rgba(35,36,77,0.18)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <div className="flex items-center gap-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isSelected = currentTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setCurrentTool(tool.id)}
                  className={cn(
                    "toy-icon-button h-12 w-12 bg-[#f1f6ff] text-[#23244d]",
                    isSelected && "bg-[#fff3b0] text-[#ff477e]",
                  )}
                  aria-label={tool.label}
                  aria-pressed={isSelected}
                  title={tool.label}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </button>
              );
            })}
            <button
              type="button"
              onClick={clearCanvas}
              className="toy-icon-button h-12 w-12 bg-[#dff7ff] text-[#23244d]"
              aria-label="Clear canvas"
              title="Clear canvas"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isProcessing}
              className="toy-button min-h-12 flex-1 bg-[#ff477e] px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-[#cbd5e1] sm:text-base"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <WandSparkles className="h-5 w-5" aria-hidden="true" />
              )}
              {generateLabel}
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {COLORS.map((color) => {
              const isSelected = currentColor.toLowerCase() === color.value.toLowerCase();
              return (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setCurrentColor(color.value)}
                  className="h-11 w-11 shrink-0 rounded-2xl border-4 border-white shadow-[0_5px_0_rgba(35,36,77,0.12)]"
                  style={{
                    backgroundColor: color.value,
                    boxShadow: isSelected
                      ? `0 0 0 3px #fffdf7, 0 0 0 6px ${color.value}, 0 7px 0 rgba(35,36,77,0.14)`
                      : undefined,
                  }}
                  aria-label={`Use ${color.name}`}
                  aria-pressed={isSelected}
                  title={color.name}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="shrink-0 font-nunito text-xs font-black uppercase tracking-normal text-[#52607e]">
              Size
            </span>
            <input
              type="range"
              min="2"
              max="26"
              value={brushSize}
              onChange={(event) => setBrushSize(Number.parseInt(event.target.value, 10))}
              className="h-4 flex-1 accent-[#ff477e]"
              aria-label="Brush size"
            />
            <span className="w-10 text-right font-nunito text-xs font-black text-[#23244d]">{brushSize}px</span>
          </div>
        </div>
      </div>

      {isHelpModalOpen && <HelpModal onClose={() => setIsHelpModalOpen(false)} />}
      {isProcessing && <ProcessingIndicator />}
    </div>
  );
};

export default DrawingApp;

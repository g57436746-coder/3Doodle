import { RefObject, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Pencil, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type DrawingCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement>;
  currentTool: string;
  currentColor: string;
  brushSize: number;
  isDrawn: boolean;
  setIsDrawn?: (isDrawn: boolean) => void;
  className?: string;
};

export const CANVAS_BACKGROUND = "#FFFDF7";

const DrawingCanvas = ({
  canvasRef,
  currentTool,
  currentColor,
  brushSize,
  isDrawn,
  setIsDrawn,
  className,
}: DrawingCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const isDrawnRef = useRef(isDrawn);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    isDrawnRef.current = isDrawn;
  }, [isDrawn]);

  useEffect(() => {
    const resizeCanvas = () => {
      if (!canvasRef.current || !containerRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = Math.max(1, Math.round(containerRef.current.clientWidth * pixelRatio));
      const nextHeight = Math.max(1, Math.round(containerRef.current.clientHeight * pixelRatio));

      if (canvas.width === nextWidth && canvas.height === nextHeight) {
        return;
      }

      const tempCanvas = document.createElement("canvas");
      const tempContext = tempCanvas.getContext("2d");
      const hadContent = canvas.width > 0 && canvas.height > 0;

      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      if (tempContext && hadContent) {
        tempContext.drawImage(canvas, 0, 0);
      }

      canvas.width = nextWidth;
      canvas.height = nextHeight;

      context.fillStyle = CANVAS_BACKGROUND;
      context.fillRect(0, 0, canvas.width, canvas.height);

      if (tempContext && hadContent && isDrawnRef.current) {
        context.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [canvasRef]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const getCoordinates = (event: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const point = "touches" in event
        ? event.touches[0] ?? event.changedTouches[0]
        : event;

      return {
        x: (point.clientX - rect.left) * (canvas.width / rect.width),
        y: (point.clientY - rect.top) * (canvas.height / rect.height),
      };
    };

    const getCanvasScale = () => {
      const rect = canvas.getBoundingClientRect();
      return rect.width > 0 ? canvas.width / rect.width : 1;
    };

    const fillCanvas = () => {
      context.fillStyle = currentColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
      isDrawnRef.current = true;
      setIsDrawn?.(true);
    };

    const startDrawing = (event: MouseEvent | TouchEvent) => {
      const { x, y } = getCoordinates(event);

      if (currentTool === "fill") {
        fillCanvas();
        return;
      }

      drawingRef.current = true;
      lastPositionRef.current = { x, y };
    };

    const draw = (event: MouseEvent | TouchEvent) => {
      if (!drawingRef.current) return;

      const { x, y } = getCoordinates(event);

      context.lineJoin = "round";
      context.lineCap = "round";
      context.lineWidth = brushSize * getCanvasScale();
      context.strokeStyle = currentTool === "eraser" ? CANVAS_BACKGROUND : currentColor;

      context.beginPath();
      context.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
      context.lineTo(x, y);
      context.stroke();

      lastPositionRef.current = { x, y };
      isDrawnRef.current = true;
      setIsDrawn?.(true);
    };

    const stopDrawing = () => {
      drawingRef.current = false;
    };

    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      startDrawing(event);
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      draw(event);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchcancel", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", stopDrawing);
      canvas.removeEventListener("touchcancel", stopDrawing);
    };
  }, [canvasRef, currentTool, currentColor, brushSize, setIsDrawn]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative min-h-[260px] overflow-hidden rounded-[1.15rem] border-[3px] border-[#23244d] bg-[#fffdf7] shadow-[inset_0_0_0_4px_rgba(255,209,102,0.38),0_10px_0_rgba(35,36,77,0.10)] touch-none sm:aspect-[4/3] sm:h-auto sm:min-h-[360px] sm:rounded-[1.6rem] sm:border-4 sm:shadow-[inset_0_0_0_6px_rgba(255,209,102,0.45),0_14px_0_rgba(35,36,77,0.10)] lg:h-[360px] lg:aspect-auto",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-crosshair"
        aria-label="Drawing canvas"
      />

      {!isDrawn && (
        <motion.div
          initial={{ opacity: 0.76, scale: 0.98 }}
          animate={{ opacity: [0.78, 1, 0.78], scale: [0.98, 1, 0.98] }}
          transition={{ repeat: Infinity, duration: 3.2 }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-[#52607e]"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border-4 border-white bg-[#fff3b0] shadow-[0_8px_0_rgba(35,36,77,0.12)]">
            <Pencil className="h-9 w-9 text-[#ff477e]" aria-hidden="true" />
          </div>
          <p className="font-nunito text-2xl font-black text-[#23244d]">Draw your idea here</p>
          <p className="mt-2 max-w-xs font-quicksand text-sm font-bold leading-relaxed">
            Try an apple, cat, rocket, flower, house, or anything you imagine.
          </p>
          <Sparkles className="mt-4 h-6 w-6 text-[#14b8c4]" aria-hidden="true" />
        </motion.div>
      )}
    </div>
  );
};

export default DrawingCanvas;

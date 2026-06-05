import { FormEvent, KeyboardEvent, useMemo, useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import type { ChatMessage, ChatResponse, GalleryItem } from "@shared/schema";

type ChatPanelProps = {
  className?: string;
  onGalleryItemCreated?: (item: GalleryItem) => void;
};

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content: "Hi! Tell me what you like, and I can suggest a fun doodle to draw.",
  },
];

const ChatPanel = ({ className, onGalleryItemCreated }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const requestMessages = useMemo(
    () => messages.filter((message) => message.content.trim().length > 0),
    [messages],
  );

  const sendMessage = async () => {
    const content = draft.trim();

    if (!content || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content,
    };
    const nextMessages = [...requestMessages, userMessage];

    setMessages(nextMessages);
    setDraft("");
    setIsSending(true);

    try {
      const response = await apiRequest("POST", "/api/chat", {
        messages: nextMessages,
      });
      const result = (await response.json()) as ChatResponse;
      const assistantMessage = result.message;

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);

      if (result.galleryItem) {
        onGalleryItemCreated?.(result.galleryItem);
      }
    } catch (error) {
      console.error("Error sending chat message:", error);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: "I could not answer that one. Try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <section className={cn("toy-panel flex min-h-[340px] flex-col rounded-[1.75rem] p-4", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-[#8d5cf6] text-white shadow-[0_6px_0_rgba(35,36,77,0.15)]">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-nunito text-xl font-black text-[#23244d]">Doodle Chat</h2>
            <p className="text-xs font-bold text-[#52607e]">Friendly ideas</p>
          </div>
        </div>
        {isSending && <Loader2 className="h-5 w-5 animate-spin text-[#ff477e]" aria-hidden="true" />}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={cn(
                "max-w-[88%] rounded-[1.2rem] px-4 py-3 text-sm font-semibold leading-relaxed shadow-[0_4px_0_rgba(35,36,77,0.08)]",
                message.role === "user"
                  ? "bg-[#14b8c4] text-white"
                  : "bg-[#fff3b0] text-[#23244d]",
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="min-h-[52px] flex-1 resize-none rounded-[1.2rem] border-4 border-[#d9e3f5] bg-[#fffdf7] px-4 py-3 text-sm font-bold text-[#23244d] outline-none transition placeholder:text-[#7a859f] focus:border-[#14b8c4]"
          placeholder="Ask for an idea..."
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !draft.trim()}
          className="toy-icon-button h-[52px] w-[52px] bg-[#ff477e] text-white hover:bg-[#e63b70] disabled:cursor-not-allowed disabled:bg-[#cbd5e1]"
          aria-label="Send message"
          title="Send message"
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </form>
    </section>
  );
};

export default ChatPanel;

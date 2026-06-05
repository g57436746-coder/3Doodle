import { FormEvent, KeyboardEvent, useMemo, useRef, useState } from 'react';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { ChatMessage } from '../../../shared/schema';

const initialMessages: ChatMessage[] = [
  {
    role: 'assistant',
    content: 'Hi! I can help you pick a fun doodle and make it easier to draw.',
  },
];

const ChatPanel = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');
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
      role: 'user',
      content,
    };
    const nextMessages = [...requestMessages, userMessage];

    setMessages(nextMessages);
    setDraft('');
    setIsSending(true);

    try {
      const response = await apiRequest('POST', '/api/chat', {
        messages: nextMessages,
      });
      const result = await response.json();
      const assistantMessage = result.message as ChatMessage;

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: 'assistant',
          content: "I couldn't answer that one. Try again in a moment.",
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
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-4 flex min-h-[360px] flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-nunito font-bold text-lg text-primary-600">Doodle Chat</h2>
            <p className="text-xs text-gray-500">Ready for ideas</p>
          </div>
        </div>
        {isSending && <Loader2 className="h-4 w-4 animate-spin text-primary-500" aria-hidden="true" />}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
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
          className="min-h-[44px] flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-primary-300 focus:bg-white"
          placeholder="Ask for an idea..."
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !draft.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 text-white shadow-md transition-colors hover:bg-primary-500 disabled:cursor-not-allowed disabled:bg-gray-300"
          aria-label="Send message"
          title="Send message"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </form>
    </section>
  );
};

export default ChatPanel;

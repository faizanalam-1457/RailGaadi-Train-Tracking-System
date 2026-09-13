'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const PROMPT_SUGGESTIONS = [
  'Is Train 12951 running on time?',
  'What food is best at Surat station?',
  'Tell me about Vande Bharat 22436',
  'How do I check PNR status?',
];

function FormattedMarkdownMessage({
  content,
  onLinkClick,
}: {
  content: string;
  onLinkClick?: () => void;
}) {
  const lines = content.split('\n');

  const renderInline = (text: string) => {
    const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          const [, label, url] = match;
          return (
            <Link
              key={idx}
              href={url}
              onClick={onLinkClick}
              className="inline-flex items-center gap-0.5 font-bold text-sky-600 dark:text-sky-300 underline hover:text-sky-500 transition-colors"
            >
              {label}
            </Link>
          );
        }
      } else if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="rounded bg-slate-200 dark:bg-slate-700/80 px-1 py-0.5 font-mono text-[10px] text-amber-700 dark:text-amber-300"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} className="h-1" />;
        if (trimmed.startsWith('- ')) {
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-1">
              <span className="text-rail-blue dark:text-sky-400 font-bold">•</span>
              <div>{renderInline(trimmed.slice(2))}</div>
            </div>
          );
        }
        return <p key={lineIdx}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

export function TrainAIChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-detect train context from route e.g. /train/12951
  const trainMatch = pathname?.match(/\/train\/(\d+)/);
  const activeTrainNumber = trainMatch ? trainMatch[1] : null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: activeTrainNumber
        ? `👋 **Namaste!** I am your RailGaadi AI Assistant. Loaded live telemetry context for **Train #${activeTrainNumber}**. Ask me about delay forecasts, ETAs, platform info, or pantry food!`
        : `👋 **Namaste!** I am your RailGaadi AI Assistant. Ask me anything about Indian Railways, live train delays, station schedules, or food delivery!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const query = (customText || inputMsg).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          trainContext: activeTrainNumber ? { number: activeTrainNumber } : undefined,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.reply) {
        const botMsg: Message = {
          id: 'bot-' + Date.now(),
          role: 'assistant',
          content: json.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('AI response error');
      }
    } catch {
      const errorMsg: Message = {
        id: 'bot-err-' + Date.now(),
        role: 'assistant',
        content: '⚠️ RailGaadi AI Assistant is currently recalibrating signals. Please ask your question again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ─── Floating Trigger Button ─── */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open RailGaadi AI Assistant Chat"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-rail-blue px-4 py-3.5 text-white shadow-glow hover:bg-sky-600 transition-all font-bold text-xs"
      >
        <div className="relative flex items-center justify-center">
          <Bot className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <span className="hidden sm:inline">Ask RailGaadi AI</span>
      </motion.button>

      {/* ─── AI Chat Drawer Modal ─── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm pointer-events-auto"
            />

            {/* Chat Window Container */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full sm:w-[420px] h-[580px] max-h-[85vh] rounded-t-3xl sm:rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 bg-background shadow-2xl flex flex-col overflow-hidden pointer-events-auto z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rail-blue text-white shadow-glow">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-1.5">
                      RailGaadi AI Assistant
                      <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono text-emerald-400">
                        ONLINE
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {activeTrainNumber ? `Active Context: Train #${activeTrainNumber}` : 'Indian Railways Telemetry AI'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 transition-colors"
                  aria-label="Close Chat Window"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      'flex flex-col space-y-1 max-w-[85%]',
                      m.role === 'user' ? 'ml-auto items-end' : 'items-start'
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3 shadow-sm leading-relaxed',
                        m.role === 'user'
                          ? 'bg-rail-blue text-white rounded-br-none'
                          : 'glass-panel bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-bl-none'
                      )}
                    >
                      {m.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      ) : (
                        <FormattedMarkdownMessage
                          content={m.content}
                          onLinkClick={() => setIsOpen(false)}
                        />
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 px-1">{m.timestamp}</span>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-rail-blue" />
                    <span>RailGaadi AI is analyzing train signals...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestion Chips */}
              {messages.length < 4 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {PROMPT_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-850 hover:bg-rail-blue hover:text-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-background flex items-center gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask RailGaadi AI about trains, delays, food..."
                  className="w-full bg-slate-100 dark:bg-slate-900 rounded-xl px-3.5 py-2 text-xs outline-none text-slate-900 dark:text-white placeholder-slate-400 font-semibold border border-transparent focus:border-rail-blue/40 transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputMsg.trim() || loading}
                  aria-label="Send message"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-rail-blue text-white shadow-glow hover:bg-sky-600 disabled:opacity-50 transition-all flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

